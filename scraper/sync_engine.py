import json
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any, Set
from slugify import slugify

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_PSYCOPG2 = True
except ImportError:
    HAS_PSYCOPG2 = False

from supabase import create_client, Client

from scraper.config import SUPABASE_URL, SUPABASE_KEY, DATABASE_URL, logger
from scraper.models import ScrapedEvent, SourceConfig, SyncReport
from scraper.adapters import get_adapter

class SyncEngine:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.client: Optional[Client] = None
        self.use_postgres = bool(DATABASE_URL and HAS_PSYCOPG2)
        self.categories_map: Dict[str, str] = {}  # slug -> uuid

        if not self.dry_run:
            if self.use_postgres:
                logger.info("SyncEngine using direct PostgreSQL connection (psycopg2)")
                self._load_categories_postgres()
            elif SUPABASE_URL and SUPABASE_KEY:
                logger.info("SyncEngine using Supabase PostgREST client")
                self.client = create_client(SUPABASE_URL, SUPABASE_KEY)
                self._load_categories_supabase()
            else:
                raise ValueError("DATABASE_URL or SUPABASE_URL + SUPABASE_KEY must be configured for live sync")

    def _get_pg_conn(self):
        return psycopg2.connect(DATABASE_URL)

    def _load_categories_postgres(self):
        try:
            with self._get_pg_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT id, slug FROM public.event_categories;")
                    rows = cur.fetchall()
                    for cat in rows:
                        self.categories_map[cat["slug"]] = str(cat["id"])
        except Exception as e:
            logger.warning(f"Failed to prefetch event categories via PostgreSQL: {e}")

    def _load_categories_supabase(self):
        try:
            res = self.client.table("event_categories").select("id, slug").execute()
            for cat in res.data:
                self.categories_map[cat["slug"]] = str(cat["id"])
        except Exception as e:
            logger.warning(f"Failed to prefetch event categories from Supabase: {e}")

    def get_active_sources(self) -> List[SourceConfig]:
        if self.dry_run:
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
                    default_category_slug="comedy",
                ),
            ]

        if self.use_postgres:
            with self._get_pg_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM public.agenda_sources WHERE is_active = true ORDER BY name ASC;")
                    rows = cur.fetchall()
                    return [
                        SourceConfig(
                            id=str(r.get("id")),
                            name=r.get("name"),
                            slug=r.get("slug"),
                            url=r.get("url"),
                            adapter_type=r.get("adapter_type"),
                            default_venue_name=r.get("default_venue_name") or r.get("name"),
                            default_venue_address=r.get("default_venue_address") or "Arnhem",
                            default_venue_city=r.get("default_venue_city") or "Arnhem",
                            default_category_slug=r.get("default_category_slug") or "cultuur",
                            is_active=r.get("is_active", True),
                            sync_frequency=r.get("sync_frequency") or "bi-weekly",
                            total_events_count=r.get("total_events_count") or 0,
                        )
                        for r in rows
                    ]
        else:
            res = self.client.table("agenda_sources").select("*").eq("is_active", True).execute()
            return [
                SourceConfig(
                    id=str(r.get("id")),
                    name=r.get("name"),
                    slug=r.get("slug"),
                    url=r.get("url"),
                    adapter_type=r.get("adapter_type"),
                    default_venue_name=r.get("default_venue_name") or r.get("name"),
                    default_venue_address=r.get("default_venue_address") or "Arnhem",
                    default_venue_city=r.get("default_venue_city") or "Arnhem",
                    default_category_slug=r.get("default_category_slug") or "cultuur",
                    is_active=r.get("is_active", True),
                    sync_frequency=r.get("sync_frequency") or "bi-weekly",
                    total_events_count=r.get("total_events_count") or 0,
                )
                for r in res.data
            ]

    def sync_source(self, source: SourceConfig, limit: Optional[int] = None) -> SyncReport:
        started_at = datetime.now(timezone.utc)
        report = SyncReport(source_slug=source.slug, started_at=started_at)
        logger.info(f"=== Starting synchronization for: {source.name} ({source.slug}) ===")

        # 1. Idempotency Run Lock Check
        if not self.dry_run and source.id:
            try:
                if self.use_postgres:
                    with self._get_pg_conn() as conn:
                        with conn.cursor(cursor_factory=RealDictCursor) as cur:
                            cur.execute("SELECT is_running, locked_at FROM public.agenda_sources WHERE id = %s;", (source.id,))
                            row = cur.fetchone()
                            if row and row.get("is_running") and row.get("locked_at"):
                                locked_time = row["locked_at"]
                                if datetime.now(timezone.utc) - locked_time < timedelta(minutes=15):
                                    logger.warning(f"Source {source.slug} is already running (locked at {locked_time}). Skipping run.")
                                    report.status = "warning"
                                    report.error_message = "Source is currently locked by another running process."
                                    return report
                            cur.execute("UPDATE public.agenda_sources SET is_running = true, locked_at = %s WHERE id = %s;", (started_at, source.id))
                            conn.commit()
                elif self.client:
                    res = self.client.table("agenda_sources").select("is_running, locked_at").eq("id", source.id).single().execute()
                    if res.data and res.data.get("is_running"):
                        locked_str = res.data.get("locked_at")
                        if locked_str:
                            locked_time = datetime.fromisoformat(locked_str.replace("Z", "+00:00"))
                            if datetime.now(timezone.utc) - locked_time < timedelta(minutes=15):
                                logger.warning(f"Source {source.slug} is already running. Skipping run.")
                                report.status = "warning"
                                report.error_message = "Source is currently locked by another running process."
                                return report
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

        if self.dry_run:
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

        # 4. Fetch existing events from database for this source
        existing_map: Dict[str, Dict[str, Any]] = {}
        if self.use_postgres:
            with self._get_pg_conn() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "SELECT id, slug, source, source_id, content_hash, is_manually_edited, "
                        "manual_override_fields, status, missing_count, title, description, start_date "
                        "FROM public.events WHERE source = %s;",
                        (source.slug,)
                    )
                    rows = cur.fetchall()
                    for r in rows:
                        if r.get("source_id"):
                            existing_map[r["source_id"]] = dict(r)
        else:
            existing_res = (
                self.client.table("events")
                .select("id, slug, source, source_id, content_hash, is_manually_edited, manual_override_fields, status, missing_count, title, description, start_date")
                .eq("source", source.slug)
                .execute()
            )
            existing_map = {row["source_id"]: row for row in existing_res.data if row.get("source_id")}

        scraped_ids: Set[str] = set()

        # 5. Process Scraped Events (Inserts & Updates)
        for event in scraped_events:
            scraped_ids.add(event.source_id)
            content_hash = event.compute_content_hash()
            existing = existing_map.get(event.source_id)

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
                if self.use_postgres:
                    with self._get_pg_conn() as conn:
                        with conn.cursor() as cur:
                            try:
                                cur.execute(
                                    """
                                    INSERT INTO public.events (
                                        slug, title, short_description, description, featured_image,
                                        start_date, end_date, venue_name, venue_address, venue_city,
                                        price_type, price, ticket_url, category_id, status, source,
                                        source_id, source_url, production_id, performances, content_hash,
                                        is_manually_edited, manual_override_fields, missing_count, last_synced_at
                                    ) VALUES (
                                        %s, %s, %s, %s, %s,
                                        %s, %s, %s, %s, %s,
                                        %s, %s, %s, %s, %s, %s,
                                        %s, %s, %s, %s, %s,
                                        %s, %s, %s, %s
                                    );
                                    """,
                                    (
                                        base_slug, event.title, event.short_description or event.title, event.description or "", event.hero_image_url,
                                        event.start_date, event.end_date, event.venue_name, event.venue_address, event.venue_city,
                                        event.price_type, event.price, event.ticket_url, cat_id, "published", event.source,
                                        event.source_id, event.source_url, event.production_id, json.dumps(performances_data), content_hash,
                                        False, [], 0, started_at
                                    )
                                )
                                conn.commit()
                                report.items_inserted += 1
                            except Exception as e:
                                conn.rollback()
                                # Retry with unique slug suffix
                                unique_slug = f"{base_slug}-{event.source_id[:6]}"
                                try:
                                    cur.execute(
                                        """
                                        INSERT INTO public.events (
                                            slug, title, short_description, description, featured_image,
                                            start_date, end_date, venue_name, venue_address, venue_city,
                                            price_type, price, ticket_url, category_id, status, source,
                                            source_id, source_url, production_id, performances, content_hash,
                                            is_manually_edited, manual_override_fields, missing_count, last_synced_at
                                        ) VALUES (
                                            %s, %s, %s, %s, %s,
                                            %s, %s, %s, %s, %s,
                                            %s, %s, %s, %s, %s, %s,
                                            %s, %s, %s, %s, %s,
                                            %s, %s, %s, %s
                                        );
                                        """,
                                        (
                                            unique_slug, event.title, event.short_description or event.title, event.description or "", event.hero_image_url,
                                            event.start_date, event.end_date, event.venue_name, event.venue_address, event.venue_city,
                                            event.price_type, event.price, event.ticket_url, cat_id, "published", event.source,
                                            event.source_id, event.source_url, event.production_id, json.dumps(performances_data), content_hash,
                                            False, [], 0, started_at
                                        )
                                    )
                                    conn.commit()
                                    report.items_inserted += 1
                                except Exception as e2:
                                    logger.error(f"Permanent insert error for {event.title}: {e2}")
                elif self.client:
                    # Supabase PostgREST insert
                    payload = {
                        "slug": base_slug, "title": event.title, "short_description": event.short_description,
                        "description": event.description, "featured_image": event.hero_image_url,
                        "start_date": event.start_date.isoformat(), "end_date": event.end_date.isoformat() if event.end_date else None,
                        "venue_name": event.venue_name, "venue_address": event.venue_address, "venue_city": event.venue_city,
                        "price_type": event.price_type, "price": event.price, "ticket_url": event.ticket_url,
                        "category_id": cat_id, "status": "published", "source": event.source, "source_id": event.source_id,
                        "source_url": event.source_url, "production_id": event.production_id, "performances": performances_data,
                        "content_hash": content_hash, "is_manually_edited": False, "manual_override_fields": [], "missing_count": 0,
                        "last_synced_at": started_at.isoformat()
                    }
                    try:
                        self.client.table("events").insert(payload).execute()
                        report.items_inserted += 1
                    except Exception as e:
                        payload["slug"] = f"{base_slug}-{event.source_id[:6]}"
                        try:
                            self.client.table("events").insert(payload).execute()
                            report.items_inserted += 1
                        except Exception as e2:
                            logger.error(f"Insert failed for {event.title}: {e2}")
            else:
                # EXISTING EVENT
                existing_hash = existing.get("content_hash")
                is_manually_edited = existing.get("is_manually_edited", False)
                overrides = set(existing.get("manual_override_fields") or [])

                needs_update = False
                new_status = "published" if existing.get("status") in ["missing", "cancelled"] else existing.get("status", "published")
                if new_status != existing.get("status"):
                    needs_update = True

                title_to_set = existing.get("title") if (is_manually_edited and "title" in overrides) else event.title
                desc_to_set = existing.get("description") if (is_manually_edited and "description" in overrides) else event.description
                img_to_set = existing.get("featured_image") if (is_manually_edited and "featured_image" in overrides) else event.hero_image_url

                if existing_hash != content_hash or needs_update:
                    if self.use_postgres:
                        with self._get_pg_conn() as conn:
                            with conn.cursor() as cur:
                                cur.execute(
                                    """
                                    UPDATE public.events SET
                                        title = %s, short_description = %s, description = %s, featured_image = %s,
                                        start_date = %s, end_date = %s, venue_name = %s, venue_address = %s,
                                        price = %s, price_type = %s, ticket_url = %s, source_url = %s, performances = %s,
                                        content_hash = %s, status = %s, missing_count = 0, missing_since = NULL,
                                        last_synced_at = %s, updated_at = NOW()
                                    WHERE id = %s;
                                    """,
                                    (
                                        title_to_set, event.short_description or event.title, desc_to_set, img_to_set,
                                        event.start_date, event.end_date, event.venue_name, event.venue_address,
                                        event.price, event.price_type, event.ticket_url, event.source_url, json.dumps(performances_data),
                                        content_hash, new_status, started_at, existing["id"]
                                    )
                                )
                                conn.commit()
                                report.items_updated += 1
                    elif self.client:
                        self.client.table("events").update({
                            "title": title_to_set, "short_description": event.short_description or event.title, "description": desc_to_set, "featured_image": img_to_set,
                            "start_date": event.start_date.isoformat(), "end_date": event.end_date.isoformat() if event.end_date else None,
                            "venue_name": event.venue_name, "venue_address": event.venue_address, "price": event.price,
                            "price_type": event.price_type, "ticket_url": event.ticket_url, "source_url": event.source_url, "performances": performances_data,
                            "content_hash": content_hash, "status": new_status, "missing_count": 0, "missing_since": None,
                            "last_synced_at": started_at.isoformat()
                        }).eq("id", existing["id"]).execute()
                        report.items_updated += 1
                else:
                    report.items_skipped += 1

        # 6. Missing & Cancelled Reconciliation
        if not skip_reconciliation:
            now_dt = datetime.now(timezone.utc)
            for source_id, existing in existing_map.items():
                if source_id not in scraped_ids:
                    ev_date = existing.get("start_date")
                    if not ev_date:
                        continue
                    if isinstance(ev_date, str):
                        try:
                            ev_date = datetime.fromisoformat(ev_date.replace("Z", "+00:00"))
                        except Exception:
                            continue

                    if ev_date.tzinfo is None:
                        ev_date = ev_date.replace(tzinfo=timezone.utc)

                    if ev_date >= now_dt and min_date <= ev_date <= max_date:
                        curr_missing = existing.get("missing_count", 0)
                        curr_status = existing.get("status", "published")

                        if curr_status == "published":
                            if self.use_postgres:
                                with self._get_pg_conn() as conn:
                                    with conn.cursor() as cur:
                                        cur.execute("UPDATE public.events SET status = 'missing', missing_count = 1, missing_since = %s, last_synced_at = %s WHERE id = %s;", (started_at, started_at, existing["id"]))
                                        conn.commit()
                            elif self.client:
                                self.client.table("events").update({"status": "missing", "missing_count": 1, "missing_since": started_at.isoformat(), "last_synced_at": started_at.isoformat()}).eq("id", existing["id"]).execute()
                            report.items_missing += 1
                            logger.info(f"Event marked as MISSING: {existing.get('title')} ({source_id})")

                        elif curr_status == "missing" and curr_missing >= 1:
                            if self.use_postgres:
                                with self._get_pg_conn() as conn:
                                    with conn.cursor() as cur:
                                        cur.execute("UPDATE public.events SET status = 'cancelled', missing_count = %s, last_synced_at = %s WHERE id = %s;", (curr_missing + 1, started_at, existing["id"]))
                                        conn.commit()
                            elif self.client:
                                self.client.table("events").update({"status": "cancelled", "missing_count": curr_missing + 1, "last_synced_at": started_at.isoformat()}).eq("id", existing["id"]).execute()
                            report.items_cancelled += 1
                            logger.info(f"Event marked as CANCELLED (confirmed absent): {existing.get('title')} ({source_id})")

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

        msg = report.error_message or f"{report.items_scraped} gescraped, {report.items_inserted} nieuw, {report.items_updated} bijgewerkt."
        if not self.dry_run and source.id:
            if self.use_postgres:
                try:
                    with self._get_pg_conn() as conn:
                        with conn.cursor() as cur:
                            cur.execute(
                                """
                                UPDATE public.agenda_sources SET
                                    is_running = false, locked_at = NULL, last_run_at = %s,
                                    last_run_status = %s, last_run_message = %s, total_events_count = %s
                                WHERE id = %s;
                                """,
                                (report.completed_at, report.status, msg, report.items_scraped, source.id)
                            )
                            cur.execute(
                                """
                                INSERT INTO public.agenda_sync_logs (
                                    source_id, source_slug, started_at, completed_at, status,
                                    items_scraped, items_inserted, items_updated, items_missing,
                                    items_cancelled, items_skipped, error_message, log_details
                                ) VALUES (
                                    %s, %s, %s, %s, %s,
                                    %s, %s, %s, %s,
                                    %s, %s, %s, %s
                                );
                                """,
                                (
                                    source.id, source.slug, report.started_at, report.completed_at, report.status,
                                    report.items_scraped, report.items_inserted, report.items_updated, report.items_missing,
                                    report.items_cancelled, report.items_skipped, report.error_message,
                                    json.dumps({"duration_seconds": duration})
                                )
                            )
                            conn.commit()
                except Exception as e:
                    logger.error(f"Failed to record run stats via PostgreSQL: {e}")
            elif self.client:
                try:
                    self.client.table("agenda_sources").update({
                        "is_running": False, "locked_at": None, "last_run_at": report.completed_at.isoformat(),
                        "last_run_status": report.status, "last_run_message": msg, "total_events_count": report.items_scraped
                    }).eq("id", source.id).execute()
                    self.client.table("agenda_sync_logs").insert({
                        "source_id": source.id, "source_slug": source.slug, "started_at": report.started_at.isoformat(),
                        "completed_at": report.completed_at.isoformat(), "status": report.status,
                        "items_scraped": report.items_scraped, "items_inserted": report.items_inserted,
                        "items_updated": report.items_updated, "items_missing": report.items_missing,
                        "items_cancelled": report.items_cancelled, "items_skipped": report.items_skipped,
                        "error_message": report.error_message, "log_details": {"duration_seconds": duration}
                    }).execute()
                except Exception as e:
                    logger.error(f"Failed to record run stats via Supabase client: {e}")
