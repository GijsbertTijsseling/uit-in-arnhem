import argparse
import sys
from pathlib import Path

# Ensure project root is in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from scraper.config import logger
from scraper.sync_engine import SyncEngine

def main():
    parser = argparse.ArgumentParser(description="Uit in Arnhem Agenda Scraper & Sync Engine")
    parser.add_argument("--source", type=str, help="Specific source slug to scrape (e.g. luxor, musis, posttheater)")
    parser.add_argument("--dry-run", action="store_true", help="Run without performing database writes")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of items to scrape per source")

    args = parser.parse_args()

    engine = SyncEngine(dry_run=args.dry_run)
    active_sources = engine.get_active_sources()

    if args.source:
        filtered = [s for s in active_sources if s.slug.lower() == args.source.lower()]
        if not filtered:
            logger.error(f"Source with slug '{args.source}' not found among active sources.")
            sys.exit(1)
        active_sources = filtered

    logger.info(f"Starting scraper orchestrator for {len(active_sources)} source(s)... (dry_run={args.dry_run})")

    results = []
    overall_success = True

    for source in active_sources:
        try:
            report = engine.sync_source(source, limit=args.limit)
            results.append(report)
            if report.status == "error":
                overall_success = False
        except Exception as e:
            logger.error(f"Unhandled crash while processing source {source.slug}: {e}", exc_info=True)
            overall_success = False

    logger.info("=========================================")
    logger.info("         SYNC SUMMARY REPORT             ")
    logger.info("=========================================")
    for r in results:
        logger.info(
            f"[{r.source_slug.upper()}] Status: {r.status.upper()} | "
            f"Scraped: {r.items_scraped} | Inserted: {r.items_inserted} | "
            f"Updated: {r.items_updated} | Missing: {r.items_missing} | "
            f"Cancelled: {r.items_cancelled}"
        )
    logger.info("=========================================")

    if not overall_success:
        logger.warning("One or more sources encountered errors during synchronization.")
        sys.exit(0)  # We exit with 0 so Cloud Run Job logs the error but does not fail entire batch if partially successful

if __name__ == "__main__":
    main()
