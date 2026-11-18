import re
from datetime import datetime, timezone
from typing import List, Optional, Dict
from urllib.parse import urljoin
from dateutil import parser as date_parser

from scraper.adapters.base import BaseAdapter
from scraper.models import ScrapedEvent, ScrapedPerformance
from scraper.config import logger

CATEGORY_MAPPING = {
    "klassiek": "muziek",
    "pop": "muziek",
    "jazz": "muziek",
    "wereldmuziek": "muziek",
    "theater": "theater-dans",
    "toneel": "theater-dans",
    "dans": "theater-dans",
    "cabaret": "theater-dans",
    "musical": "theater-dans",
    "jeugd": "kinderen-familie",
    "familie": "kinderen-familie",
    "film": "film",
    "festival": "festival",
}

class MusisAdapter(BaseAdapter):
    """
    Adapter for Musis & Stadstheater Arnhem.
    Uses their public Hydra / JSON-LD REST API.
    """
    BASE_URL = "https://www.musisenstadstheater.nl"

    def scrape(self, limit: Optional[int] = None) -> List[ScrapedEvent]:
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        next_page = f"/api/events?startsAt%5Bafter%5D={now_iso}&page=1"
        
        events_by_production: Dict[str, ScrapedEvent] = {}
        total_scraped = 0
        page_num = 1
        max_pages = 25  # Safety boundary (up to 250 upcoming events)

        logger.info(f"Starting Musis scrape from {self.BASE_URL}")

        while next_page and page_num <= max_pages:
            full_url = urljoin(self.BASE_URL, next_page)
            try:
                resp = self.fetch_url(full_url)
                data = resp.json()
            except Exception as e:
                logger.error(f"Error fetching Musis page {page_num} ({full_url}): {e}")
                break

            members = data.get("member", [])
            if not members:
                break

            for item in members:
                prod = item.get("production") or {}
                prod_slug = prod.get("slug") or f"event-{item.get('id')}"
                prod_title = self.clean_text(prod.get("title") or "Voorstelling")
                performer = self.clean_text(prod.get("performer") or "")
                
                # Full display title
                if performer and performer.lower() not in prod_title.lower():
                    title = f"{prod_title} - {performer}"
                else:
                    title = prod_title

                starts_at_str = item.get("startsAt")
                if not starts_at_str:
                    continue
                start_date = date_parser.parse(starts_at_str)

                end_date = None
                if item.get("endTime"):
                    try:
                        end_date = date_parser.parse(item["endTime"])
                    except Exception:
                        pass

                is_sold_out = bool(item.get("soldOut"))
                item_id = str(item.get("id"))
                event_url = f"{self.BASE_URL}/nl/agenda/{prod_slug}"
                ticket_url = f"https://tix.musisenstadstheater.nl/nl/buyingflow/tickets/{item_id}/"

                # Images
                img_path = prod.get("headerImage") or prod.get("image")
                hero_img = urljoin(self.BASE_URL, img_path) if img_path else None

                # Category mapping from tags
                cat_slug = self.config.default_category_slug
                tags = prod.get("tags") or []
                for t in tags:
                    tag_name = (t.get("name") or "").lower()
                    if tag_name in CATEGORY_MAPPING:
                        cat_slug = CATEGORY_MAPPING[tag_name]
                        break

                performance = ScrapedPerformance(
                    start_date=start_date,
                    end_date=end_date,
                    ticket_url=ticket_url,
                    is_sold_out=is_sold_out,
                )

                prod_key = f"musis-{prod_slug}"
                if prod_key in events_by_production:
                    # Append performance to existing production group
                    existing = events_by_production[prod_key]
                    existing.performances.append(performance)
                    # Keep earliest start date
                    if start_date < existing.start_date:
                        existing.start_date = start_date
                        existing.end_date = end_date
                else:
                    event = ScrapedEvent(
                        source=self.config.slug,
                        source_id=item_id,
                        source_url=event_url,
                        title=title,
                        short_description=performer or prod_title,
                        description=f"{prod_title} in Musis & Stadstheater Arnhem. {performer}".strip(),
                        hero_image_url=hero_img,
                        start_date=start_date,
                        end_date=end_date,
                        venue_name=self.config.default_venue_name,
                        venue_address=self.config.default_venue_address,
                        venue_city=self.config.default_venue_city,
                        price_type="paid",
                        ticket_url=ticket_url,
                        category_slug=cat_slug,
                        production_id=prod_key,
                        performances=[performance],
                        raw_data={"production": prod, "event_id": item_id},
                    )
                    events_by_production[prod_key] = event
                    total_scraped += 1

                if limit and total_scraped >= limit:
                    break

            if limit and total_scraped >= limit:
                break

            # Check next page in Hydra view
            view = data.get("view") or {}
            next_page = view.get("next")
            page_num += 1

        results = list(events_by_production.values())
        logger.info(f"Musis scrape complete: found {len(results)} productions ({total_scraped} performances)")
        return results

