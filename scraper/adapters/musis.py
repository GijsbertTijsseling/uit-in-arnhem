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
    "cabaret": "comedy",
    "comedy": "comedy",
    "stand-up": "comedy",
    "musical": "theater-dans",
    "jeugd": "kinderen-familie",
    "familie": "kinderen-familie",
    "film": "film",
    "festival": "festival",
}

import re
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from urllib.parse import urljoin
from bs4 import BeautifulSoup
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
    "cabaret": "comedy",
    "comedy": "comedy",
    "stand-up": "comedy",
    "musical": "theater-dans",
    "jeugd": "kinderen-familie",
    "familie": "kinderen-familie",
    "film": "film",
    "festival": "festival",
}

class MusisAdapter(BaseAdapter):
    """
    Adapter for Musis & Stadstheater Arnhem.
    Fetches base events from their Hydra REST API, then enriches each production
    from its public web page (/nl/agenda/{slug}/{id}) with accurate ticket prices,
    direct Tixly buyingflow links, and rich full story text.
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
                
                # The public event detail page URL on musisenstadstheater.nl requires /{item_id}
                event_url = f"{self.BASE_URL}/nl/agenda/{prod_slug}/{item_id}"
                
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
                    ticket_url=event_url,
                    is_sold_out=is_sold_out,
                )

                prod_key = f"musis-{prod_slug}"
                if prod_key in events_by_production:
                    # Append performance to existing production group
                    existing = events_by_production[prod_key]
                    existing.performances.append(performance)
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
                        ticket_url=event_url,
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

        production_events = list(events_by_production.values())
        logger.info(f"Musis API fetch complete: found {len(production_events)} productions. Starting detail page enrichment...")

        # Concurrently enrich productions from their web detail pages
        enriched_events: List[ScrapedEvent] = []
        with ThreadPoolExecutor(max_workers=8) as executor:
            future_to_event = {
                executor.submit(self._enrich_musis_event, ev): ev for ev in production_events
            }
            for future in as_completed(future_to_event):
                orig_ev = future_to_event[future]
                try:
                    enriched = future.result()
                    enriched_events.append(enriched)
                except Exception as e:
                    logger.warning(f"Error enriching Musis event {orig_ev.title}: {e}")
                    enriched_events.append(orig_ev)

        logger.info(f"Musis scrape and enrichment complete: {len(enriched_events)} events ready")
        return enriched_events

    def _enrich_musis_event(self, event: ScrapedEvent) -> ScrapedEvent:
        """
        Fetches the public event page to extract:
        1. Direct Tixly buyingflow ticket link
        2. Accurate regular ticket price
        3. Full rich description text & intro
        4. Sublocation (e.g. Musis, Muzenzaal or Stadstheater, Grote Zaal)
        """
        detail_url = event.source_url
        try:
            resp = self.fetch_url(detail_url, timeout=12.0)
            soup = BeautifulSoup(resp.text, "lxml")

            # 1. Parse Schema.org Event JSON-LD if present
            event_ld: Optional[Dict[str, Any]] = None
            for s in soup.find_all("script", type="application/ld+json"):
                try:
                    d = json.loads(s.string)
                    if d.get("@type") == "Event" or "Event" in d.get("@type", []):
                        event_ld = d
                        break
                except Exception:
                    pass

            # 2. Extract Offers / Price
            price_val: Optional[float] = None
            price_type = "paid"
            direct_ticket_url: Optional[str] = None

            if event_ld:
                offers = event_ld.get("offers", [])
                if offers:
                    # Prefer regular admission offer, or fall back to first offer
                    reg_offer = next((o for o in offers if "regulier" in o.get("name", "").lower()), offers[0])
                    if "price" in reg_offer and reg_offer["price"] is not None:
                        price_val = float(reg_offer["price"])
                        price_type = "free" if price_val == 0 else "paid"
                    if "url" in reg_offer and reg_offer["url"]:
                        direct_ticket_url = reg_offer["url"].strip()

            # 3. Direct Ticket Button in sidebar
            sidebar_btn = soup.select_one("a.btn-orange[href*='tix.'], a.btn-orange[href*='buyingflow'], a[href*='buyingflow/tickets/']")
            if sidebar_btn and sidebar_btn.get("href"):
                direct_ticket_url = sidebar_btn["href"].strip()

            # 4. Fallback price from sidebar text if JSON-LD missing
            if price_val is None:
                sidebar = soup.select_one(".col-12.col-lg-5, .info-box.event")
                if sidebar:
                    text = sidebar.text
                    m = re.search(r"€\s*(\d+[.,]\d{2})", text)
                    if m:
                        price_val = float(m.group(1).replace(",", "."))
                        price_type = "free" if price_val == 0 else "paid"

            # 5. Extract Full Description & Intro from .event-content
            content_el = soup.select_one(".event-content")
            short_desc = event.short_description
            full_desc = event.description

            if content_el:
                # Remove duplicate hero image inside body text
                for img in content_el.select("img.event-img, img"):
                    img.decompose()
                # Remove any social sharing icons or clutter
                for el in content_el.select(".share, .social-share, .socials, a[href*='facebook.com/sharer'], a[href*='twitter.com/share']"):
                    el.decompose()

                intro_el = content_el.select_one(".fw-bold p, .fw-bold, p.intro")
                if intro_el and intro_el.text.strip():
                    short_desc = self.clean_text(intro_el.text)
                
                full_desc = str(content_el)
            elif event_ld and event_ld.get("description"):
                short_desc = self.clean_text(event_ld["description"])
                full_desc = f"<p>{short_desc}</p>"

            # 6. Extract Sublocation (e.g. Musis, Muzenzaal)
            sublocation = None
            info_box = soup.select_one(".info-box.event")
            if info_box:
                for d in info_box.find_all("div"):
                    t = d.text.strip()
                    if any(k in t.lower() for k in ["zaal", "muzenzaal", "parkzaal", "balkonzaal", "stadsbalkon"]):
                        sublocation = t
                        break

            # Apply enriched fields
            event.price = price_val
            event.price_type = price_type
            event.ticket_url = direct_ticket_url or detail_url
            if short_desc:
                event.short_description = short_desc
            if full_desc:
                event.description = full_desc

            # Also update performance ticket_url and sublocation
            if event.performances:
                for p in event.performances:
                    if direct_ticket_url:
                        p.ticket_url = direct_ticket_url
                    if sublocation:
                        p.venue_sublocation = sublocation

        except Exception as e:
            logger.warning(f"Could not enrich Musis detail page {detail_url}: {e}")

        return event


