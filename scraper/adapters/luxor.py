import re
from datetime import datetime
from typing import List, Optional, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

from scraper.adapters.base import BaseAdapter
from scraper.models import ScrapedEvent, ScrapedPerformance
from scraper.config import logger

class LuxorAdapter(BaseAdapter):
    """
    Adapter for Luxor Live Arnhem.
    Extracts events from the main agenda list page, then enriches them
    with high-resolution images, full descriptions, and ticket prices from detail pages.
    """
    def scrape(self, limit: Optional[int] = None) -> List[ScrapedEvent]:
        url = self.config.url or "https://www.luxorlive.nl/agenda/"
        logger.info(f"Starting Luxor Live scrape from {url}")

        resp = self.fetch_url(url)
        soup = BeautifulSoup(resp.text, "lxml")

        # Find all event cards
        items = soup.select(".item.horizontal, [itemtype*='schema.org/Event']")
        logger.info(f"Found {len(items)} event cards on Luxor agenda page")

        card_data_list = []
        for item in items:
            # 1. URL and External ID
            url_tag = item.select_one("a[itemprop='url']") or item.select_one("a.center")
            if not url_tag or not url_tag.get("href"):
                continue
            event_url = url_tag["href"].strip()
            slug = event_url.rstrip("/").split("/")[-1]

            # 2. Extract Artist Name from .title h3 or h3.big (avoid picking up <meta itemprop="name"> in location)
            title_el = item.select_one(".title h3, h3.big")
            base_title = self.clean_text(title_el.text if title_el else "")
            
            subtitle_el = item.select_one(".title .subtitle, .subtitle")
            subtitle = self.clean_text(subtitle_el.text if subtitle_el else "")

            # 3. Start Date from list card
            start_date = None
            start_date_el = item.select_one("meta[itemprop='startDate']")
            if start_date_el and start_date_el.get("content"):
                try:
                    start_date = date_parser.parse(start_date_el["content"])
                except Exception:
                    pass
            if not start_date:
                date_el = item.select_one(".date")
                start_date = self.parse_dutch_date(date_el.text if date_el else "")

            if not start_date:
                continue

            # 4. Thumbnail fallback (upgrade by stripping WordPress thumbnail size suffix)
            img_tag = item.select_one("img[data-src], img[src]")
            raw_img = img_tag.get("data-src") or img_tag.get("src") if img_tag else None
            high_res_fallback = None
            if raw_img:
                if raw_img.startswith("//"):
                    raw_img = "https:" + raw_img
                # Remove -320x200 suffix to get the uncropped original
                high_res_fallback = re.sub(r"-\d+x\d+(\.[a-zA-Z]+)$", r"\1", raw_img)

            # 5. Tickets from list card
            ticket_btn = item.select_one(".button.tickets[data-href]")
            ticket_url = ticket_btn.get("data-href") if ticket_btn else event_url
            
            is_sold_out = False
            sold_out_badge = item.select_one(".soldout, label.soldout")
            if sold_out_badge or (ticket_btn and "uitverkocht" in ticket_btn.text.lower()):
                is_sold_out = True

            room_el = item.select_one(".icon-location")
            room_name = self.clean_text(room_el.find_parent("li").text) if room_el and room_el.find_parent("li") else "Luxor Live"

            card_data_list.append({
                "slug": slug,
                "event_url": event_url,
                "base_title": base_title,
                "subtitle": subtitle,
                "start_date": start_date,
                "high_res_fallback": high_res_fallback,
                "ticket_url": ticket_url,
                "is_sold_out": is_sold_out,
                "room_name": room_name,
            })

            if limit and len(card_data_list) >= limit:
                break

        logger.info(f"Enriching {len(card_data_list)} Luxor Live events with detail page information...")

        # Function to fetch and enrich from detail page
        def enrich_event(card_info: dict) -> ScrapedEvent:
            detail_url = card_info["event_url"]
            title = card_info["base_title"]
            subtitle = card_info["subtitle"]
            hero_img = card_info["high_res_fallback"]
            short_desc = subtitle or f"Live bij {self.config.default_venue_name}"
            full_desc = f"{title} live in Luxor Live Arnhem.".strip()
            ticket_url = card_info["ticket_url"]
            is_sold_out = card_info["is_sold_out"]
            price_val: Optional[float] = None
            price_type = "paid"

            try:
                d_resp = self.fetch_url(detail_url, timeout=12.0)
                d_soup = BeautifulSoup(d_resp.text, "lxml")

                # 1. Refined Title & Subtitle from detail page
                h1 = d_soup.select_one("h1")
                if h1 and h1.text.strip():
                    title = self.clean_text(h1.text)

                sub_el = d_soup.select_one(".info .subtitle, .subtitle")
                if sub_el and sub_el.text.strip():
                    subtitle = self.clean_text(sub_el.text)

                # 2. High Resolution Image from detail page
                img_el = d_soup.select_one(".img-inner img[data-src], .img img[data-src], img[data-src]")
                if img_el and img_el.get("data-src"):
                    detail_img = img_el["data-src"].strip()
                    if detail_img.startswith("//"):
                        detail_img = "https:" + detail_img
                    # Strip -1920x630 or other size suffixes to get original full quality image
                    hero_img = re.sub(r"-\d+x\d+(\.[a-zA-Z]+)$", r"\1", detail_img)

                # 3. Content and Descriptions
                content_el = d_soup.select_one(".content")
                if content_el:
                    # Strip social share widgets and like/tweet/share links
                    for el in content_el.select(".share, .social-share, .socials, .fb-like-button, .tw-like-button, a.wa, a.fb, a.tw, [class*='share'], [class*='like-button'], a[href*='facebook.com/sharer'], a[href*='twitter.com/share'], a[href*='whatsapp://send']"):
                        el.decompose()

                    intro_p = content_el.select_one("p.intro") or content_el.select_one("p")
                    if intro_p and intro_p.text.strip():
                        short_desc = self.clean_text(intro_p.text)
                    full_desc = str(content_el)

                # 4. Ticket Price from detail sidebar
                price_label = d_soup.select_one(".icon-price + div label, .icon-price ~ div label, .ticket-info label")
                if price_label and price_label.text.strip():
                    p_text = price_label.text.strip()
                    m_p = re.search(r"(\d+[\.,]\d{2})", p_text)
                    if m_p:
                        price_val = float(m_p.group(1).replace(",", "."))
                        price_type = "free" if price_val == 0 else "paid"

                # 5. Direct Ticket Link from detail page
                buy_link = d_soup.select_one("a.buy-tickets[href]")
                if buy_link and buy_link.get("href"):
                    ticket_url = buy_link["href"].strip()

            except Exception as e:
                logger.warning(f"Could not enrich Luxor event {detail_url}: {e}")

            # Construct clean full display title (prevent leading "- ")
            if title and subtitle and subtitle.lower() not in title.lower():
                display_title = f"{title} - {subtitle}"
            else:
                display_title = title or subtitle or "Concert"

            performance = ScrapedPerformance(
                start_date=card_info["start_date"],
                ticket_url=ticket_url,
                is_sold_out=is_sold_out,
                venue_sublocation=card_info["room_name"],
                price_from=price_val,
            )

            return ScrapedEvent(
                source=self.config.slug,
                source_id=card_info["slug"],
                source_url=detail_url,
                title=display_title,
                short_description=short_desc,
                description=full_desc,
                hero_image_url=hero_img,
                start_date=card_info["start_date"],
                venue_name=self.config.default_venue_name,
                venue_address=self.config.default_venue_address,
                venue_city=self.config.default_venue_city,
                price_type=price_type,
                price=price_val,
                ticket_url=ticket_url,
                category_slug="muziek",
                production_id=f"luxor-{card_info['slug']}",
                performances=[performance],
            )

        events: List[ScrapedEvent] = []
        with ThreadPoolExecutor(max_workers=8) as executor:
            future_to_card = {executor.submit(enrich_event, card): card for card in card_data_list}
            for future in as_completed(future_to_card):
                try:
                    ev = future.result()
                    events.append(ev)
                except Exception as e:
                    logger.error(f"Error enriching card: {e}")

        # Sort by start_date ascending
        events.sort(key=lambda x: x.start_date)

        logger.info(f"Luxor Live scrape complete: {len(events)} events enriched with high-res images and descriptions")
        return events
