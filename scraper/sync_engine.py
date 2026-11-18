import json
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any, Set
from slugify import slugify
from supabase import create_client, Client

from scraper.config import SUPABASE_URL, SUPABASE_KEY, logger
from scraper.models import ScrapedEvent, SourceConfig, SyncReport
from scraper.adapters import get_adapter

class SyncEngine:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.client: Optional[Client] = None
        self.categories_map: Dict[str, str] = {}  # slug -> uuid

        if not self.dry_run:
            if not SUPABASE_URL or not SUPABASE_KEY:
                raise ValueError("SUPABASE_URL and SUPABASE_KEY must be configured for live sync")
            self.client = create_client(SUPABASE_URL, SUPABASE_KEY)
            self._load_categories()

    def _load_categories(self):
        try:
            res = self.client.table("event_categories").select("id, slug").execute()
            for cat in res.data:
                self.categories_map[cat["slug"]] = cat["id"]
        except Exception as e:
            logger.warning(f"Failed to prefetch event categories from Supabase: {e}")

    def get_active_sources(self) -> List[SourceConfig]:
        if self.dry_run or not self.client:
            # Fallback to local default test sources
            return [
                SourceConfig(
                    name="Musis & Stadstheater Arnhem",
                    slug="musis",
                    url="https://www.musisenstadstheater.nl/api/events",
                    adapter_type="musis",
                    default_venue_name="Musis & Stadstheater",
                    default_venue_address="Velperbinnensingel 15",
                    default_category_slug="theater-dans",
                ),
                SourceConfig(
                    name="Luxor Live",
                    slug="luxor",
                    url="https://www.luxorlive.nl/agenda/",
                    adapter_type="luxor",
                    default_venue_name="Luxor Live",
                    default_venue_address="Willemsplein 10",
                    default_category_slug="muziek",
                ),
                SourceConfig(
                    name="Posttheater",
                    slug="posttheater",
                    url="https://www.posttheater.nl/agenda",
                    adapter_type="posttheater",
                    default_venue_name="Posttheater",
                    default_venue_address="Rosendaalsestraat 27",
                    default_category_slug="theater-dans",
                ),
            ]

        res = self.client.table("agenda_sources").select("*").eq("is_active", True).execute()
        sources = []
        for row in res.data:
            sources.append(
                SourceConfig(
                    id=row.get("id"),
                    name=row.get("name"),
                    slug=row.get("slug"),
                    url=row.get("url"),
                    adapter_type=row.get("adapter_type"),
                    default_venue_name=row.get("default_venue_name") or row.get("name"),
                    default_venue_address=row.get("default_venue_address") or "Arnhem",
                    default_venue_city=row.get("default_venue_city") or "Arnhem",
                    default_category_slug=row.get("default_category_slug") or "cultuur",
                    is_active=row.get("is_active", True),
                    sync_frequency=row.get("sync_frequency") or "bi-weekly",
                    total_events_count=row.get("total_events_count") or 0,
                )
            )
        return sources

    def sync_source(self, source: SourceConfig, limit: Optional[int] = None) -> SyncReport:
        started_at = datetime.now(timezone.utc)
        report = SyncReport(source_slug=source.slug, started_at=started_at)
        logger.info(f"=== Starting synchronization for: {source.name} ({source.slug}) ===")

        # 1. Run Lock / Idempotency Check
        if not self.dry_run and self.client and source.id:
            try:
                # Check lock
                res = self.client.table("agenda_sources").select("is_running, locked_at").eq("id", source.id).single().execute()
                if res.data and res.data.get("is_running"):
                    locked_at_str = res.data.get("locked_at")
                    if locked_at_str:
                        locked_time = datetime.fromisoformat(locked_at_str.replace("Z", "+00:00"))
                        if datetime.now(timezone.utc) - locked_time < timedelta(minutes=15):
                            logger.warning(f"Source {source.slug} is already running (locked at {locked_time}). Skipping run.")
                            report.status = "warning"
                            report.error_message = "Source is currently locked by another running process."
                            return report
                # Set lock
                self.client.table("agenda_sources").update({
                    "is_running": True,
                    "locked_at": started_at.isoformat(),
                }).eq("id", source.id).execute()
            except Exception as e:
                logger.warning(f"Could not verify or set source lock for {source.slug}: {e}")

        # 2. Execute Adapter
        try:
            adapter = get_adapter(source)
            scraped_events = adapter.scrape(limit=limit)
            report.items_scraped = len(scraped_events)
        except Exception as e:
            logger.error(f"Scraper adapter failed for {source.slug}: {e}", exc_info=True)
            report.status = "error"
            report.error_message = f"Adapter failure: {str(e)}"
            self._finalize_run(source, report)
            return report

        if not scraped_events:
            logger.warning(f"No events returned by adapter for {source.slug}")
            report.status = "warning"
            report.error_message = "No events extracted by scraper."
            self._finalize_run(source, report)
            return report

        # Date Range Boundaries
        min_date = min(e.start_date for e in scraped_events)
        max_date = max(e.start_date for e in scraped_events)
        report.min_scraped_date = min_date
        report.max_scraped_date = max_date
        logger.info(f"Scraped date range: {min_date.date()} to {max_date.date()} ({len(scraped_events)} items)")

        if self.dry_run or not self.client:
            logger.info(f"[DRY-RUN] Scraped {len(scraped_events)} events for {source.slug}. Database writes skipped.")
            report.status = "success"
            report.items_inserted = len(scraped_events)
            report.completed_at = datetime.now(timezone.utc)
            return report

        # 3. Anomaly Drop Guard (Circuit Breaker)
        previous_count = source.total_events_count
        skip_reconciliation = False
        if previous_count >= 20 and len(scraped_events) < (previous_count * 0.4):
            skip_reconciliation = True
            logger.warning(
                f"ANOMALY GUARD TRIGGERED for {source.slug}: expected ~{previous_count} events, but found only {len(scraped_events)}. "
                "Skipping missing/cancellation reconciliation to protect existing records."
            )
            report.status = "warning"
            report.error_message = f"Anomaly: only {len(scraped_events)} events found (previous: {previous_count}). Deactivations skipped."

        # 4. Fetch existing events from Supabase for this source
        existing_res = (
            self.client.table("events")
            .select("id, slug, source, source_id, content_hash, is_manually_edited, manual_override_fields, status, missing_count, title, description, start_date")
            .eq("source", source.slug)
            .execute()
        )
        existing_map: Dict[str, Dict[str, Any]] = {
            row["source_id"]: row for row in existing_res.data if row.get("source_id")
        }

        scraped_ids: Set[str] = set()

        # 5. Process Scraped Events (Inserts & Updates)
        for event in scraped_events:
            scraped_ids.add(event.source_id)
            content_hash = event.compute_content_hash()
            existing = existing_map.get(event.source_id)

            # Category ID resolution
            cat_id = self.categories_map.get(event.category_slug) or self.categories_map.get(source.default_category_slug)

            performances_data = [
                {
                    "start_date": p.start_date.isoformat(),
                    "end_date": p.end_date.isoformat() if p.end_date else None,
                    "ticket_url": p.ticket_url,
                    "is_sold_out": p.is_sold_out,
                    "venue_sublocation": p.venue_sublocation,
                }
                for p in event.performances
            ]

            if not existing:
                # INSERT NEW EVENT
                base_slug = slugify(f"{event.title}-{event.start_date.strftime('%Y%m%d')}")
                insert_payload = {
                    "slug": base_slug,
                    "title": event.title,
                    "short_description": event.short_description or event.title,
                    "description": event.description or "",
                    "featured_image": event.hero_image_url,
                    "start_date": event.start_date.isoformat(),
                    "end_date": event.end_date.isoformat() if event.end_date else None,
                    "venue_name": event.venue_name,
                    "venue_address": event.venue_address,
                    "venue_city": event.venue_city,
                    "price_type": event.price_type,
                    "price": event.price,
                    "ticket_url": event.ticket_url,
                    "category_id": cat_id,
                    "status": "published",
                    "source": event.source,
                    "source_id": event.source_id,
                    "source_url": event.source_url,
                    "production_id": event.production_id,
                    "performances": performances_data,
                    "content_hash": content_hash,
                    "is_manually_edited": False,
                    "manual_override_fields": [],
                    "missing_count": 0,
                    "last_synced_at": started_at.isoformat(),
                }
                try:
                    self.client.table("events").insert(insert_payload).execute()
                    report.items_inserted += 1
                except Exception as e:
                    # Retry with unique slug suffix if duplicate slug collision
                    logger.warning(f"Insert failed for {event.title} (slug: {base_slug}), retrying with unique suffix: {e}")
                    insert_payload["slug"] = f"{base_slug}-{event.source_id[:6]}"
                    try:
                        self.client.table("events").insert(insert_payload).execute()
                        report.items_inserted += 1
                    except Exception as e2:
                        logger.error(f"Permanent insert error for {event.title}: {e2}")
            else:
                # EXISTING EVENT
                existing_hash = existing.get("content_hash")
                is_manually_edited = existing.get("is_manually_edited", False)
                overrides = set(existing.get("manual_override_fields") or [])

                # Did the content change or was it previously marked missing/cancelled?
                needs_update = False
                update_payload = {
                    "last_synced_at": started_at.isoformat(),
                    "performances": performances_data,
                    "ticket_url": event.ticket_url,
                }

                # Auto-recover if previously missing or cancelled
                if existing.get("status") in ["missing", "cancelled"]:
                    update_payload["status"] = "published"
                    update_payload["missing_count"] = 0
                    update_payload["missing_since"] = None
                    needs_update = True

                if existing_hash != content_hash:
                    needs_update = True
                    update_payload["content_hash"] = content_hash

                    # Respect manual overrides on editorial fields
                    if "title" not in overrides and not (is_manually_edited and overrides):
                        update_payload["title"] = event.title
                    if "description" not in overrides and not (is_manually_edited and overrides):
                        update_payload["description"] = event.description
                        update_payload["short_description"] = event.short_description
                    if "featured_image" not in overrides and event.hero_image_url:
                        update_payload["featured_image"] = event.hero_image_url
                    if "category_id" not in overrides and cat_id:
                        update_payload["category_id"] = cat_id

                    update_payload["start_date"] = event.start_date.isoformat()
                    update_payload["end_date"] = event.end_date.isoformat() if event.end_date else None
                    update_payload["venue_name"] = event.venue_name
                    update_payload["venue_address"] = event.venue_address
                    update_payload["price"] = event.price
                    update_payload["price_type"] = event.price_type

                if needs_update:
                    try:
                        self.client.table("events").update(update_payload).eq("id", existing["id"]).execute()
                        report.items_updated += 1
                    except Exception as e:
                        logger.error(f"Update failed for event ID {existing.get('id')}: {e}")
                else:
                    report.items_skipped += 1

        # 6. Missing & Cancelled Reconciliation
        now_iso = datetime.now(timezone.utc).isoformat()
        if not skip_reconciliation:
            for source_id, existing in existing_map.items():
                if source_id not in scraped_ids:
                    # Check if event is in future and within the scraped range
                    ev_date_str = existing.get("start_date")
                    if not ev_date_str:
                        continue
                    try:
                        ev_date = datetime.fromisoformat(ev_date_str.replace("Z", "+00:00"))
                    except Exception:
                        continue

                    # Only evaluate events that are strictly within the scraped date range and in the future
                    if ev_date >= datetime.now(timezone.utc) and min_date <= ev_date <= max_date:
                        curr_missing_count = existing.get("missing_count", 0)
                        curr_status = existing.get("status", "published")

                        if curr_status == "published":
                            # Step 1: Mark as missing (1st confirmation)
                            try:
                                self.client.table("events").update({
                                    "status": "missing",
                                    "missing_count": 1,
                                    "missing_since": started_at.isoformat(),
                                    "last_synced_at": started_at.isoformat(),
                                }).eq("id", existing["id"]).execute()
                                report.items_missing += 1
                                logger.info(f"Event marked as MISSING: {existing.get('title')} ({source_id})")
                            except Exception as e:
                                logger.error(f"Failed to set missing for {existing.get('id')}: {e}")

                        elif curr_status == "missing" and curr_missing_count >= 1:
                            # Step 2: Mark as cancelled (2nd consecutive confirmation)
                            try:
                                self.client.table("events").update({
                                    "status": "cancelled",
                                    "missing_count": curr_missing_count + 1,
                                    "last_synced_at": started_at.isoformat(),
                                }).eq("id", existing["id"]).execute()
                                report.items_cancelled += 1
                                logger.info(f"Event marked as CANCELLED (confirmed absent): {existing.get('title')} ({source_id})")
                            except Exception as e:
                                logger.error(f"Failed to set cancelled for {existing.get('id')}: {e}")

        if report.status != "warning":
            report.status = "success"

        self._finalize_run(source, report)
        return report

    def _finalize_run(self, source: SourceConfig, report: SyncReport):
        report.completed_at = datetime.now(timezone.utc)
        duration = (report.completed_at - report.started_at).total_seconds()
        logger.info(
            f"=== Completed sync for {source.slug} in {duration:.1f}s: "
            f"Inserted={report.items_inserted}, Updated={report.items_updated}, "
            f"Missing={report.items_missing}, Cancelled={report.items_cancelled}, "
            f"Skipped={report.items_skipped} (Status: {report.status}) ==="
        )

        if not self.dry_run and self.client and source.id:
            # Update agenda_sources table
            try:
                self.client.table("agenda_sources").update({
                    "is_running": False,
                    "locked_at": None,
                    "last_run_at": report.completed_at.isoformat(),
                    "last_run_status": report.status,
                    "last_run_message": report.error_message or f"{report.items_scraped} gescraped, {report.items_inserted} nieuw, {report.items_updated} bijgewerkt.",
                    "total_events_count": report.items_scraped,
                }).eq("id", source.id).execute()
            except Exception as e:
                logger.error(f"Failed to update source stats for {source.slug}: {e}")

            # Write to agenda_sync_logs table
            try:
                self.client.table("agenda_sync_logs").insert({
                    "source_id": source.id,
                    "source_slug": source.slug,
                    "started_at": report.started_at.isoformat(),
                    "completed_at": report.completed_at.isoformat(),
                    "status": report.status,
                    "items_scraped": report.items_scraped,
                    "items_inserted": report.items_inserted,
                    "items_updated": report.items_updated,
                    "items_missing": report.items_missing,
                    "items_cancelled": report.items_cancelled,
                    "items_skipped": report.items_skipped,
                    "error_message": report.error_message,
                    "log_details": {
                        "duration_seconds": duration,
                        "min_date": report.min_scraped_date.isoformat() if report.min_scraped_date else None,
                        "max_date": report.max_scraped_date.isoformat() if report.max_scraped_date else None,
                    }
                }).execute()
            except Exception as e:
                logger.error(f"Failed to write sync log for {source.slug}: {e}")

