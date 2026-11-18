import json
from datetime import datetime
from typing import List, Optional, Any, Dict
from bs4 import BeautifulSoup
from dateutil import parser as date_parser
from slugify import slugify

from scraper.adapters.base import BaseAdapter
from scraper.models import ScrapedEvent, ScrapedPerformance
from scraper.config import logger

class GenericJsonLdAdapter(BaseAdapter):
    """
    Universal adapter for cultural venues that provide Schema.org Event JSON-LD
    in <script type="application/ld+json"> tags.
    """
    def scrape(self, limit: Optional[int] = None) -> List[ScrapedEvent]:
        url = self.config.url
        logger.info(f"Starting Generic JSON-LD scrape from {url}")

        resp = self.fetch_url(url)
        soup = BeautifulSoup(resp.text, "lxml")

        scripts = soup.select("script[type='application/ld+json']")
        events: List[ScrapedEvent] = []

        for script in scripts:
            try:
                data = json.loads(script.string or "{}")
            except Exception:
                continue

            # Can be a single object, an array, or @graph
            items = []
            if isinstance(data, list):
                items = data
            elif isinstance(data, dict):
                if "@graph" in data and isinstance(data["@graph"], list):
                    items = data["@graph"]
                else:
                    items = [data]

            for item in items:
                item_type = item.get("@type")
                if not item_type:
                    continue
                if isinstance(item_type, list):
                    is_event = any("Event" in t for t in item_type)
                else:
                    is_event = "Event" in str(item_type)

                if not is_event:
                    continue

                title = self.clean_text(item.get("name") or "")
                if not title:
                    continue

                start_date_str = item.get("startDate")
                if not start_date_str:
                    continue
                try:
                    start_date = date_parser.parse(start_date_str)
                except Exception:
                    continue

                end_date = None
                if item.get("endDate"):
                    try:
                        end_date = date_parser.parse(item["endDate"])
                    except Exception:
                        pass

                event_url = item.get("url") or url
                event_id = str(item.get("@id") or item.get("identifier") or slugify(f"{title}-{start_date.strftime('%Y%m%d')}"))

                # Image
                img = item.get("image")
                hero_img = None
                if isinstance(img, str):
                    hero_img = img
                elif isinstance(img, dict) and "url" in img:
                    hero_img = img["url"]
                elif isinstance(img, list) and img:
                    hero_img = img[0] if isinstance(img[0], str) else img[0].get("url")

                # Location / Venue
                location = item.get("location") or {}
                venue_name = location.get("name") or self.config.default_venue_name
                address_data = location.get("address") or {}
                if isinstance(address_data, dict):
                    venue_address = address_data.get("streetAddress") or self.config.default_venue_address
                else:
                    venue_address = str(address_data) or self.config.default_venue_address

                # Offers / Tickets
                offers = item.get("offers") or {}
                if isinstance(offers, list) and offers:
                    offers = offers[0]
                ticket_url = offers.get("url") if isinstance(offers, dict) else event_url
                price = offers.get("price") if isinstance(offers, dict) else None

                performance = ScrapedPerformance(
                    start_date=start_date,
                    end_date=end_date,
                    ticket_url=ticket_url,
                )

                event = ScrapedEvent(
                    source=self.config.slug,
                    source_id=event_id,
                    source_url=event_url,
                    title=title,
                    description=self.clean_text(item.get("description") or ""),
                    hero_image_url=hero_img,
                    start_date=start_date,
                    end_date=end_date,
                    venue_name=venue_name,
                    venue_address=venue_address,
                    venue_city=self.config.default_venue_city,
                    price_type="paid" if price else "unknown",
                    price=float(price) if price else None,
                    ticket_url=ticket_url,
                    category_slug=self.config.default_category_slug,
                    production_id=f"{self.config.slug}-{event_id}",
                    performances=[performance],
                )
                events.append(event)

                if limit and len(events) >= limit:
                    break

            if limit and len(events) >= limit:
                break

        logger.info(f"Generic JSON-LD scrape complete for {self.config.slug}: {len(events)} events found")
        return events

