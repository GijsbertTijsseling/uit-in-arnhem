import re
from datetime import datetime
from typing import List, Optional, Set
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

from scraper.adapters.base import BaseAdapter
from scraper.models import ScrapedEvent, ScrapedPerformance
from scraper.config import logger

class PosttheaterAdapter(BaseAdapter):
    """
    Adapter for Posttheater Arnhem (Cabaret, Theater & Kleinkunst).
    Iterates through upcoming month tabs and parses Ticketmatic event cards.
    """
    BASE_URL = "https://www.posttheater.nl"

    def scrape(self, limit: Optional[int] = None) -> List[ScrapedEvent]:
        main_url = urljoin(self.BASE_URL, "/agenda")
        logger.info(f"Starting Posttheater scrape from {main_url}")

        resp = self.fetch_url(main_url)
        soup = BeautifulSoup(resp.text, "lxml")

        # Discover upcoming month URLs (e.g. /agenda/2026/11, /agenda/2026/12)
        month_urls: Set[str] = {main_url}
        for a in soup.select("a[href*='agenda/']"):
            href = a.get("href")
            if href and re.search(r"agenda/\d{4}/\d{2}", href):
                month_urls.add(urljoin(self.BASE_URL, href))

        logger.info(f"Discovered {len(month_urls)} month pages for Posttheater")

        events_by_id: dict[str, ScrapedEvent] = {}
        total_scraped = 0

        # Sort month urls so they process chronologically
        sorted_month_urls = sorted(list(month_urls))

        for month_url in sorted_month_urls:
            try:
                m_resp = self.fetch_url(month_url)
                m_soup = BeautifulSoup(m_resp.text, "lxml")
            except Exception as e:
                logger.warning(f"Failed to fetch Posttheater month {month_url}: {e}")
                continue

            cards = m_soup.select(".card.card--event")
            for card in cards:
                # 1. Links & IDs
                link_tag = card.select_one("a[href*='activiteit/']")
                if not link_tag or not link_tag.get("href"):
                    continue

                rel_url = link_tag["href"]
                event_url = urljoin(self.BASE_URL, rel_url)

                # Parse ID from link: activiteit/<id>/<date>/<slug>
                m_id = re.search(r"activiteit/(\d+)/([^/]+)/([^/]+)", rel_url)
                if m_id:
                    prod_id = m_id.group(1)
                    date_part = m_id.group(2)
                    slug_part = m_id.group(3)
                    unique_id = f"{prod_id}-{date_part}"
                else:
                    unique_id = rel_url.replace("/", "-")
                    prod_id = unique_id

                # 2. Performer & Title
                artist_el = card.select_one("h2")
                title_el = card.select_one("h3")
                artist = self.clean_text(artist_el.text if artist_el else "")
                show_title = self.clean_text(title_el.text if title_el else "")

                if artist and show_title and artist.lower() not in show_title.lower():
                    full_title = f"{artist} - {show_title}"
                else:
                    full_title = artist or show_title or "Voorstelling"

                # 3. Date & Time (e.g. "Woensdag 18.11.2026 - 20:30 uur")
                header_el = card.select_one(".card-header")
                raw_date = header_el.text if header_el else ""
                start_date = None

                # Extract "18.11.2026" and "20:30"
                d_match = re.search(r"(\d{1,2})\.(\d{1,2})\.(\d{4})", raw_date)
                t_match = re.search(r"(\d{1,2}):(\d{2})", raw_date)
                if d_match:
                    day, month, year = int(d_match.group(1)), int(d_match.group(2)), int(d_match.group(3))
                    hour = int(t_match.group(1)) if t_match else 20
                    minute = int(t_match.group(2)) if t_match else 30
                    try:
                        start_date = datetime(year, month, day, hour, minute)
                    except ValueError:
                        pass

                if not start_date:
                    # Fallback to date_part in URL if available (YYYY-MM-DD)
                    try:
                        start_date = date_parser.parse(date_part)
                    except Exception:
                        continue

                # 4. Image from style attribute
                img_div = card.select_one(".card-image div[style]")
                hero_img = None
                if img_div and "url(" in img_div.get("style", ""):
                    bg_match = re.search(r"url\(['\"]?([^'\"]+)['\"]?\)", img_div["style"])
                    if bg_match:
                        hero_img = bg_match.group(1)

                # 5. Price from .card-label (e.g. "€ 24,-", "€ 23,50", "Gratis")
                price_val: Optional[float] = None
                price_type = "paid"
                for label_el in card.select(".card-label"):
                    label_text = self.clean_text(label_el.get_text(" "))
                    label_lower = label_text.lower()
                    if "gratis" in label_lower or "vrij" in label_lower:
                        price_val = 0.0
                        price_type = "free"
                        break
                    p_match = re.search(r"€\s*(\d+)(?:[.,](\d{1,2}|-))?", label_text)
                    if p_match:
                        euros = int(p_match.group(1))
                        cents_str = p_match.group(2)
                        cents = int(cents_str.ljust(2, "0")) if (cents_str and cents_str != "-") else 0
                        price_val = round(euros + cents / 100.0, 2)
                        price_type = "free" if price_val == 0 else "paid"
                        break

                # 6. Tickets
                ticket_link = urljoin(event_url + "/", "ticket")
                btn_orange = card.select_one(".button--orange, .card-buttons a")
                is_sold_out = False
                if btn_orange:
                    btn_text = btn_orange.text.lower()
                    if "uitverkocht" in btn_text:
                        is_sold_out = True
                    if btn_orange.get("href"):
                        ticket_link = urljoin(self.BASE_URL, btn_orange["href"])

                performance = ScrapedPerformance(
                    start_date=start_date,
                    ticket_url=ticket_link,
                    is_sold_out=is_sold_out,
                    price_from=price_val,
                )

                prod_key = f"posttheater-{prod_id}"
                if unique_id in events_by_id:
                    # Already seen
                    continue

                # Smart category assignment for Posttheater: primarily Comedy & Cabaret
                title_lower = full_title.lower()
                desc_lower = (show_title or "").lower()
                text_corpus = f"{title_lower} {desc_lower}"

                if any(k in text_corpus for k in ["sprookjesfestival", "jeugd", "kinderen", "familie", "(8+)", "(5+)"]):
                    cat_slug = "kinderen-familie"
                elif any(k in text_corpus for k in ["the wieners", "abbey road", "soul & the city", "weather the storm", "parelvissers", "concert"]):
                    cat_slug = "muziek"
                elif any(k in text_corpus for k in ["podiumpoëzie", "poëzie"]):
                    cat_slug = "theater-dans"
                else:
                    cat_slug = "comedy"

                event = ScrapedEvent(
                    source=self.config.slug,
                    source_id=unique_id,
                    source_url=event_url,
                    title=full_title,
                    short_description=show_title or f"Voorstelling van {artist}",
                    description=f"{full_title} in het Posttheater Arnhem.".strip(),
                    hero_image_url=hero_img,
                    start_date=start_date,
                    venue_name=self.config.default_venue_name,
                    venue_address=self.config.default_venue_address,
                    venue_city=self.config.default_venue_city,
                    price_type=price_type,
                    price=price_val,
                    ticket_url=ticket_link,
                    category_slug=cat_slug,
                    production_id=prod_key,
                    performances=[performance],
                )
                events_by_id[unique_id] = event
                total_scraped += 1

                if limit and total_scraped >= limit:
                    break

            if limit and total_scraped >= limit:
                break

        results = list(events_by_id.values())
        logger.info(f"Posttheater scrape complete: {len(results)} events found across {len(month_urls)} months")
        return results

