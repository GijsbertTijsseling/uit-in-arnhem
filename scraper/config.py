import os
import logging
from pathlib import Path

# Setup logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("agenda_scraper")

# Try loading from .env or .env.local if not already in environment
BASE_DIR = Path(__file__).resolve().parent.parent
for env_file in [BASE_DIR / ".env.local", BASE_DIR / ".env"]:
    if env_file.exists():
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key not in os.environ:
                        os.environ[key] = val

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_SERVICE_KEY")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)
DATABASE_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("SUPABASE_DB_URL")
    or "postgresql://postgres:ZZzr336rEG4T04Su@db.ldvclkymaiopytbkjulp.supabase.co:5432/postgres"
)

USER_AGENT = os.getenv(
    "SCRAPER_USER_AGENT",
    "UitInArnhemAgendaBot/1.0 (+https://uitinarnhem.nl/contact; info@uitinarnhem.nl)",
)

