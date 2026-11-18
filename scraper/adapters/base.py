import abc
import re
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
import httpx
from dateutil import parser as date_parser
from slugify import slugify

from scraper.config import USER_AGENT, logger
from scraper.models import ScrapedEvent, SourceConfig

DUTCH_MONTHS = {
    "jan": 1, "januari": 1,
    "feb": 2, "februari": 2,
    "mrt": 3, "maart": 3,
    "apr": 4, "april": 4,
    "mei": 5,
    "jun": 6, "juni": 6,
    "jul": 7, "juli": 7,
    "aug": 8, "augustus": 8,
    "sep": 9, "sept": 9, "september": 9,
    "okt": 10, "oktober": 10,
    "nov": 11, "november": 11,
    "dec": 12, "december": 12,
}

class BaseAdapter(abc.ABC):
    def __init__(self, source_config: SourceConfig):
        self.config = source_config
        self.headers = {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8",
            "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
        }

    @abc.abstractmethod
    def scrape(self, limit: Optional[int] = None) -> List[ScrapedEvent]:
        """
        Executes the scraping process and returns a list of validated ScrapedEvent instances.
        """
        pass

    def fetch_url(self, url: str, timeout: float = 20.0) -> httpx.Response:
        """
        HTTP GET with standard retry logic and headers.
        """
        with httpx.Client(timeout=timeout, headers=self.headers, follow_redirects=True) as client:
            resp = client.get(url)
            resp.raise_for_status()
            return resp

    def clean_text(self, text: Optional[str]) -> str:
        if not text:
            return ""
        # Remove excess whitespace and newlines
        return re.sub(r"\s+", " ", text).strip()

    def parse_dutch_date(self, text: str, default_year: Optional[int] = None) -> Optional[datetime]:
        """
        Parses common Dutch date strings like:
        - "18.11.2026 - 20:30 uur"
        - "wo 18 nov 2026 20:00"
        - "2026-11-18T20:30:00+01:00"
        """
        if not text:
            return None
        text = text.lower().strip()
        # Remove Dutch weekday names
        text = re.sub(r"^(ma|di|wo|do|vr|za|zo|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\.?", "", text).strip()

        # Try standard ISO/dateutil parser first
        try:
            return date_parser.parse(text)
        except Exception:
            pass

        # Try matching "18 nov" or "18 november 2026"
        m = re.search(r"(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?(?:.*?(\d{1,2}):(\d{2}))?", text)
        if m:
            day = int(m.group(1))
            month_str = m.group(2)
            year = int(m.group(3)) if m.group(3) else (default_year or datetime.now().year)
            hour = int(m.group(4)) if m.group(4) else 20
            minute = int(m.group(5)) if m.group(5) else 0

            month = DUTCH_MONTHS.get(month_str)
            if month:
                return datetime(year, month, day, hour, minute)

        return None

