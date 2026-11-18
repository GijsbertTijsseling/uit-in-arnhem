from datetime import datetime
from typing import List, Optional
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

from scraper.adapters.base import BaseAdapter
from scraper.models import ScrapedEvent, ScrapedPerformance
from scraper.config import logger

class LuxorAdapter(BaseAdapter):
    """
    Adapter for Luxor Live Arnhem.
    Parses Schema.org Microdata from the agenda list page.
    """
    def scrape(self, limit: Optional[int] = None) -> List[ScrapedEvent]:
        url = self.config.url or "https://www.luxorlive.nl/agenda/"
        logger.info(f"Starting Luxor Live scrape from {url}")

        resp = self.fetch_url(url)
        soup = BeautifulSoup(resp.text, "lxml")

        # Find all event cards
        items = soup.select(".item.horizontal, [itemtype*='schema.org/Event']")
        logger.info(f"Found {len(items)} event cards on Luxor agenda page")

        events: List[ScrapedEvent] = []
        for item in items:
            # 1. URL and External ID
            url_tag = item.select_one("a[itemprop='url']") or item.select_one("a.center")
            if not url_tag or not url_tag.get("href"):
                continue
            event_url = url_tag["href"].strip()
            slug = event_url.rstrip("/").split("/")[-1]

            # 2. Title & Subtitle
            name_el = item.select_one("[itemprop='name']")
            title = self.clean_text(name_el.text if name_el else "")
            subtitle_el = item.select_one(".subtitle")
            subtitle = self.clean_text(subtitle_el.text if subtitle_el else "")
            if subtitle and subtitle.lower() not in title.lower():
                display_title = f"{title} - {subtitle}"
            else:
                display_title = title or "Concert"

            # 3. Start Date
            start_date_el = item.select_one("meta[itemprop='startDate']")
            if start_date_el and start_date_el.get("content"):
                try:
                    start_date = date_parser.parse(start_date_el["content"])
                except Exception:
                    continue
            else:
                # Fallback to date container
                date_el = item.select_one(".date")
                start_date = self.parse_dutch_date(date_el.text if date_el else "")
                if not start_date:
                    continue

            # 4. Image
            img_tag = item.select_one("img[data-src], img[src]")
            hero_img = None
            if img_tag:
                hero_img = img_tag.get("data-src") or img_tag.get("src")
                if hero_img and hero_img.startswith("//"):
                    hero_img = "https:" + hero_img

            # 5. Tickets & Sold Out
            ticket_btn = item.select_one(".button.tickets[data-href]")
            ticket_url = ticket_btn.get("data-href") if ticket_btn else event_url
            
            is_sold_out = False
            sold_out_badge = item.select_one(".soldout, label.soldout")
            if sold_out_badge or (ticket_btn and "uitverkocht" in ticket_btn.text.lower()):
                is_sold_out = True

            # Room / Venue Details
            room_el = item.select_one(".icon-location")
            room_name = self.clean_text(room_el.find_parent("li").text) if room_el and room_el.find_parent("li") else "Luxor Live"

            performance = ScrapedPerformance(
                start_date=start_date,
                ticket_url=ticket_url,
                is_sold_out=is_sold_out,
                venue_sublocation=room_name,
            )

            event = ScrapedEvent(
                source=self.config.slug,
                source_id=slug,
                source_url=event_url,
                title=display_title,
                short_description=subtitle or f"Live bij {self.config.default_venue_name}",
                description=f"{display_title} live in Luxor Live Arnhem ({room_name}).".strip(),
                hero_image_url=hero_img,
                start_date=start_date,
                venue_name=self.config.default_venue_name,
                venue_address=self.config.default_venue_address,
                venue_city=self.config.default_venue_city,
                price_type="paid",
                ticket_url=ticket_url,
                category_slug="muziek",
                production_id=f"luxor-{slug}",
                performances=[performance],
            )
            events.append(event)

            if limit and len(events) >= limit:
                break

        logger.info(f"Luxor Live scrape complete: {len(events)} events parsed")
        return events

