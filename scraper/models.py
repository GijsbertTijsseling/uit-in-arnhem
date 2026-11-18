from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl, field_validator
import hashlib
import json

class ScrapedPerformance(BaseModel):
    start_date: datetime
    end_date: Optional[datetime] = None
    ticket_url: Optional[str] = None
    is_sold_out: bool = False
    venue_sublocation: Optional[str] = None
    price_from: Optional[float] = None

class ScrapedEvent(BaseModel):
    source: str
    source_id: str
    source_url: str
    title: str
    short_description: Optional[str] = ""
    description: Optional[str] = ""
    hero_image_url: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    venue_name: str
    venue_address: str
    venue_city: str = "Arnhem"
    price_type: str = "unknown"  # 'free', 'paid', 'donation', 'unknown'
    price: Optional[float] = None
    ticket_url: Optional[str] = None
    category_slug: str = "cultuur"
    production_id: Optional[str] = None
    performances: List[ScrapedPerformance] = Field(default_factory=list)
    raw_data: Optional[Dict[str, Any]] = None

    @field_validator("title")
    @classmethod
    def clean_title(cls, v: str) -> str:
        return v.strip()

    def compute_content_hash(self) -> str:
        """
        Computes a SHA-256 hash of core content fields to detect actual changes.
        """
        payload = {
            "title": self.title,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "venue_name": self.venue_name,
            "venue_address": self.venue_address,
            "price": self.price,
            "ticket_url": self.ticket_url,
            "description": (self.description or "").strip(),
            "hero_image_url": self.hero_image_url,
            "performances": [
                {
                    "start": p.start_date.isoformat(),
                    "sold_out": p.is_sold_out,
                    "ticket_url": p.ticket_url,
                }
                for p in self.performances
            ],
        }
        encoded = json.dumps(payload, sort_keys=True).encode("utf-8")
        return hashlib.sha256(encoded).hexdigest()

class SourceConfig(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    url: str
    adapter_type: str
    default_venue_name: str
    default_venue_address: str
    default_venue_city: str = "Arnhem"
    default_category_slug: str = "cultuur"
    is_active: bool = True
    sync_frequency: str = "bi-weekly"
    total_events_count: int = 0

class SyncReport(BaseModel):
    source_slug: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str = "running"  # 'success', 'warning', 'error'
    items_scraped: int = 0
    items_inserted: int = 0
    items_updated: int = 0
    items_missing: int = 0
    items_cancelled: int = 0
    items_skipped: int = 0
    error_message: Optional[str] = None
    min_scraped_date: Optional[datetime] = None
    max_scraped_date: Optional[datetime] = None

