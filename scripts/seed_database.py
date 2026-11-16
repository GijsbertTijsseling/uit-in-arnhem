#!/usr/bin/env python3
"""
Seed script for Uit in Arnhem Supabase database.
Imports:
- data/categories.json -> public.categories
- data/event_categories.json -> public.event_categories
- data/articles.json -> public.articles
- data/events.json -> public.events
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime

DB_HOST = "db.ldvclkymaiopytbkjulp.supabase.co"
DB_USER = "postgres"
DB_PASSWORD = os.environ.get("PGPASSWORD", "ZZzr336rEG4T04Su")
DB_NAME = "postgres"
DB_PORT = "5432"

def run_sql(sql_content):
    env = os.environ.copy()
    env["PGPASSWORD"] = DB_PASSWORD
    cmd = [
        "/opt/homebrew/opt/libpq/bin/psql",
        "-h", DB_HOST,
        "-U", DB_USER,
        "-d", DB_NAME,
        "-p", DB_PORT,
        "-v", "ON_ERROR_STOP=1"
    ]
    proc = subprocess.run(cmd, input=sql_content, text=True, capture_output=True, env=env)
    if proc.returncode != 0:
        print(f"SQL Error:\n{proc.stderr}")
        raise RuntimeError(f"Failed to execute SQL: {proc.stderr[:400]}")
    return proc.stdout

def escape_sql(val):
    if val is None:
        return "NULL"
    s = str(val).replace("\x00", "")
    s = s.replace("'", "''")
    return f"'{s}'"

def slugify(text):
    if not text:
        return "item"
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

def parse_iso_date(dt_str):
    if not dt_str:
        return None
    try:
        s = str(dt_str).strip()
        s = s.replace("Z", "+00:00")
        if " " in s and "T" not in s:
            s = s.replace(" ", "T")
        if "+" not in s and "-" not in s[10:]:
            s += "+01:00"
        return s
    except Exception:
        return None

def main():
    print("=== Starting Full Uit in Arnhem Database Seed ===")

    # 1. Fetch admin user id
    admin_res = run_sql("SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1;")
    admin_id = "00000000-0000-0000-0000-000000000001"
    for line in admin_res.strip().split("\n"):
        line = line.strip()
        if len(line) == 36 and "-" in line:
            admin_id = line
            break
    print(f"Using Admin ID: {admin_id}")

    # 2. Seed Categories
    if os.path.exists("data/categories.json"):
        with open("data/categories.json", "r", encoding="utf-8") as f:
            cats = json.load(f)
        print(f"Seeding {len(cats)} categories...")
        cat_stmts = []
        for c in cats:
            name = c.get("name") or ""
            slug = c.get("slug") or slugify(name)
            desc = c.get("description") or ""
            if not slug or not name:
                continue
            cat_stmts.append(f"""
            INSERT INTO public.categories (name, slug, description)
            VALUES ({escape_sql(name)}, {escape_sql(slug)}, {escape_sql(desc)})
            ON CONFLICT (slug) DO UPDATE SET
                name = EXCLUDED.name,
                description = COALESCE(NULLIF(EXCLUDED.description, ''), public.categories.description);
            """)
        if cat_stmts:
            run_sql("\n".join(cat_stmts))
            print(f"Successfully seeded {len(cat_stmts)} categories.")

    # 3. Seed Event Categories
    if os.path.exists("data/event_categories.json"):
        with open("data/event_categories.json", "r", encoding="utf-8") as f:
            ecats = json.load(f)
        print(f"Seeding {len(ecats)} event categories...")
        ecat_stmts = []
        for ec in ecats:
            name = ec.get("name") or ""
            slug = ec.get("slug") or slugify(name)
            desc = ec.get("description") or ""
            if not slug or not name:
                continue
            ecat_stmts.append(f"""
            INSERT INTO public.event_categories (name, slug, description)
            VALUES ({escape_sql(name)}, {escape_sql(slug)}, {escape_sql(desc)})
            ON CONFLICT (slug) DO UPDATE SET
                name = EXCLUDED.name,
                description = COALESCE(NULLIF(EXCLUDED.description, ''), public.event_categories.description);
            """)
        if ecat_stmts:
            run_sql("\n".join(ecat_stmts))
            print(f"Successfully seeded {len(ecat_stmts)} event categories.")

    # Build category lookup maps
    cat_res = run_sql("SELECT id, slug, lower(name) FROM public.categories;")
    cat_map = {}
    for line in cat_res.strip().split("\n"):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 3 and parts[0] != "id":
            cid = parts[0]
            cat_map[parts[1]] = cid
            cat_map[parts[2]] = cid

    ecat_res = run_sql("SELECT id, slug, lower(name) FROM public.event_categories;")
    ecat_map = {}
    for line in ecat_res.strip().split("\n"):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 3 and parts[0] != "id":
            ecid = parts[0]
            ecat_map[parts[1]] = ecid
            ecat_map[parts[2]] = ecid

    # 4. Seed Articles
    if os.path.exists("data/articles.json"):
        with open("data/articles.json", "r", encoding="utf-8") as f:
            articles = json.load(f)
        print(f"Seeding {len(articles)} articles...")
        batch_size = 50
        batch = []
        count = 0
        for a in articles:
            title = a.get("title", "").strip()
            if not title:
                continue
            slug = a.get("slug") or slugify(title)
            excerpt = a.get("excerpt") or ""
            content = a.get("content") or a.get("content_raw") or ""
            featured_image = a.get("featured_image_url") or a.get("featured_image") or ""
            status = "published" if a.get("status") in ["publish", "published"] else "draft"
            is_featured = bool(a.get("is_featured", False))
            layout_template = a.get("layout_template", "standard")
            
            # Find category
            category_id = "NULL"
            cat_candidates = []
            if a.get("category"):
                if isinstance(a["category"], dict):
                    cat_candidates.append(a["category"].get("slug"))
                    cat_candidates.append(a["category"].get("name"))
                else:
                    cat_candidates.append(str(a["category"]))
            if a.get("categories") and isinstance(a["categories"], list):
                for c in a["categories"]:
                    if isinstance(c, dict):
                        cat_candidates.append(c.get("slug"))
                        cat_candidates.append(c.get("name"))
                    else:
                        cat_candidates.append(str(c))
            for cand in cat_candidates:
                if not cand:
                    continue
                cand_str = str(cand).strip().lower()
                cand_slug = slugify(cand_str)
                if cand_slug in cat_map:
                    category_id = f"'{cat_map[cand_slug]}'"
                    break
                if cand_str in cat_map:
                    category_id = f"'{cat_map[cand_str]}'"
                    break

            pub_date = parse_iso_date(a.get("published_at") or a.get("date"))
            pub_date_sql = f"'{pub_date}'::timestamptz" if pub_date else "now()"

            # Tags
            tags_list = a.get("tags") or []
            if isinstance(tags_list, list):
                clean_tags = []
                for t in tags_list:
                    if isinstance(t, dict):
                        clean_tags.append(t.get("name", ""))
                    elif isinstance(t, str):
                        clean_tags.append(t)
                clean_tags = [t.replace("'", "''") for t in clean_tags if t.strip()]
                tags_sql = "ARRAY[" + ", ".join([f"'{t}'" for t in clean_tags]) + "]::text[]" if clean_tags else "'{}'::text[]"
            else:
                tags_sql = "'{}'::text[]"

            stmt = f"""
            INSERT INTO public.articles (
                slug, title, excerpt, content, featured_image, author_id, category_id,
                status, is_featured, layout_template, tags, published_at
            ) VALUES (
                {escape_sql(slug)},
                {escape_sql(title)},
                {escape_sql(excerpt)},
                {escape_sql(content)},
                {escape_sql(featured_image)},
                '{admin_id}'::uuid,
                {category_id},
                {escape_sql(status)},
                {str(is_featured).lower()},
                {escape_sql(layout_template)},
                {tags_sql},
                {pub_date_sql}
            )
            ON CONFLICT (slug) DO UPDATE SET
                title = EXCLUDED.title,
                excerpt = EXCLUDED.excerpt,
                content = EXCLUDED.content,
                featured_image = COALESCE(NULLIF(EXCLUDED.featured_image, ''), public.articles.featured_image),
                category_id = COALESCE(EXCLUDED.category_id, public.articles.category_id),
                status = EXCLUDED.status,
                published_at = EXCLUDED.published_at;
            """
            batch.append(stmt)
            count += 1
            if len(batch) >= batch_size:
                run_sql("\n".join(batch))
                batch = []
                print(f"  Inserted {count}/{len(articles)} articles...")
        if batch:
            run_sql("\n".join(batch))
        print(f"Total articles seeded: {count}")

    # 5. Seed Events
    if os.path.exists("data/events.json"):
        with open("data/events.json", "r", encoding="utf-8") as f:
            events = json.load(f)
        print(f"Seeding {len(events)} events...")
        batch_size = 50
        batch = []
        count = 0
        for e in events:
            title = e.get("title", "").strip()
            if not title:
                continue
            slug = e.get("slug") or slugify(title)
            desc = e.get("full_description") or e.get("short_description") or e.get("description_raw") or ""
            start_date = parse_iso_date(e.get("start_date") or e.get("utc_start_date"))
            if not start_date:
                start_date = datetime.utcnow().isoformat() + "+00:00"
            end_date = parse_iso_date(e.get("end_date") or e.get("utc_end_date"))
            end_date_sql = f"'{end_date}'::timestamptz" if end_date else "NULL"

            venue_name = e.get("venue_name") or ""
            venue_addr = e.get("venue_address") or ""
            venue_city = e.get("venue_city") or "Arnhem"
            if not venue_name and isinstance(e.get("venue"), dict):
                venue_name = e["venue"].get("name", "")
                venue_addr = e["venue"].get("address", "")
                venue_city = e["venue"].get("city", "Arnhem")
            if not venue_name:
                venue_name = "Arnhem"

            price_type = e.get("price_type", "unknown")
            if price_type not in ["free", "paid", "donation", "unknown"]:
                price_type = "unknown"
            price = e.get("price_from")
            price_sql = "NULL"
            if price is not None:
                try:
                    price_val = float(price)
                    price_sql = str(price_val)
                except Exception:
                    price_sql = "NULL"

            ticket_url = e.get("ticket_url") or e.get("website") or ""
            is_highlight = bool(e.get("is_highlight", False))
            status = "published"
            if e.get("status") in ["draft", "submitted", "cancelled"]:
                status = e.get("status")
            featured_image = e.get("hero_image_url") or ""

            # Event Category
            category_id = "NULL"
            ecat_candidates = []
            if e.get("category"):
                if isinstance(e["category"], dict):
                    ecat_candidates.append(e["category"].get("slug"))
                    ecat_candidates.append(e["category"].get("name"))
                else:
                    ecat_candidates.append(str(e["category"]))
            if e.get("categories") and isinstance(e["categories"], list):
                for c in e["categories"]:
                    if isinstance(c, dict):
                        ecat_candidates.append(c.get("slug"))
                        ecat_candidates.append(c.get("name"))
                    else:
                        ecat_candidates.append(str(c))
            for cand in ecat_candidates:
                if not cand:
                    continue
                cand_str = str(cand).strip().lower()
                cand_slug = slugify(cand_str)
                if cand_slug in ecat_map:
                    category_id = f"'{ecat_map[cand_slug]}'"
                    break
                if cand_str in ecat_map:
                    category_id = f"'{ecat_map[cand_str]}'"
                    break

            stmt = f"""
            INSERT INTO public.events (
                slug, title, description, start_date, end_date, venue_name, venue_address,
                venue_city, price_type, price, ticket_url, category_id, organizer_id,
                is_highlight, status, featured_image
            ) VALUES (
                {escape_sql(slug)},
                {escape_sql(title)},
                {escape_sql(desc)},
                '{start_date}'::timestamptz,
                {end_date_sql},
                {escape_sql(venue_name)},
                {escape_sql(venue_addr)},
                {escape_sql(venue_city)},
                {escape_sql(price_type)},
                {price_sql},
                {escape_sql(ticket_url)},
                {category_id},
                '{admin_id}'::uuid,
                {str(is_highlight).lower()},
                {escape_sql(status)},
                {escape_sql(featured_image)}
            )
            ON CONFLICT (slug) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                start_date = EXCLUDED.start_date,
                end_date = EXCLUDED.end_date,
                venue_name = EXCLUDED.venue_name,
                venue_address = EXCLUDED.venue_address,
                venue_city = EXCLUDED.venue_city,
                price_type = EXCLUDED.price_type,
                price = EXCLUDED.price,
                ticket_url = EXCLUDED.ticket_url,
                category_id = COALESCE(EXCLUDED.category_id, public.events.category_id),
                is_highlight = EXCLUDED.is_highlight,
                status = EXCLUDED.status,
                featured_image = COALESCE(NULLIF(EXCLUDED.featured_image, ''), public.events.featured_image);
            """
            batch.append(stmt)
            count += 1
            if len(batch) >= batch_size:
                run_sql("\n".join(batch))
                batch = []
                print(f"  Inserted {count}/{len(events)} events...")
        if batch:
            run_sql("\n".join(batch))
        print(f"Total events seeded: {count}")

    print("=== Database Seeding Complete! ===")

if __name__ == "__main__":
    main()
