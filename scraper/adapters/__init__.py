from typing import Type, Dict
from scraper.adapters.base import BaseAdapter
from scraper.adapters.musis import MusisAdapter
from scraper.adapters.luxor import LuxorAdapter
from scraper.adapters.posttheater import PosttheaterAdapter
from scraper.adapters.generic_jsonld import GenericJsonLdAdapter
from scraper.models import SourceConfig

ADAPTER_MAP: Dict[str, Type[BaseAdapter]] = {
    "musis": MusisAdapter,
    "luxor": LuxorAdapter,
    "posttheater": PosttheaterAdapter,
    "generic_jsonld": GenericJsonLdAdapter,
    "schema_org": GenericJsonLdAdapter,
}

def get_adapter(source_config: SourceConfig) -> BaseAdapter:
    adapter_cls = ADAPTER_MAP.get(source_config.adapter_type.lower())
    if not adapter_cls:
        # Fallback to generic JSON-LD
        adapter_cls = GenericJsonLdAdapter
    return adapter_cls(source_config)

