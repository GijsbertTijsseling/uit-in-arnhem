#!/usr/bin/env python3
"""
Seed script for Uit in Arnhem locations table in Supabase.
Imports data from data/venues.json, links to data/events.json images,
seeds public.locations in Postgres, updates public.events.location_id,
and exports src/data/locationsData.ts for fast fallback and autocompletion.
"""

import json
import os
import re
import html
import subprocess
import sys

DB_HOST = "db.ldvclkymaiopytbkjulp.supabase.co"
DB_USER = "postgres"
DB_PASSWORD = os.environ.get("PGPASSWORD", "ZZzr336rEG4T04Su")
DB_NAME = "postgres"
DB_PORT = "5432"

KNOWN_COORDINATES = {
    "koepelgevangenis": {"lat": 51.9854, "lng": 5.8792},
    "luxor-live": {"lat": 51.9850, "lng": 5.9015},
    "luxor-live-2": {"lat": 51.9850, "lng": 5.9015},
    "musis": {"lat": 51.9839, "lng": 5.9142},
    "focus-filmtheater": {"lat": 51.9798, "lng": 5.9095},
    "focus-filmtheater-2": {"lat": 51.9798, "lng": 5.9095},
    "museum-arnhem": {"lat": 51.9855, "lng": 5.8856},
    "museum-arnhem-2": {"lat": 51.9855, "lng": 5.8856},
    "rozet": {"lat": 51.9788, "lng": 5.9056},
    "willemeen": {"lat": 51.9852, "lng": 5.9010},
    "stadsvilla-sonsbeek": {"lat": 51.9902, "lng": 5.9037},
    "ketelhuis-sonsbeek": {"lat": 51.9920, "lng": 5.9048},
    "posttheater": {"lat": 51.9822, "lng": 5.9221},
    "huis-van-puck": {"lat": 51.9875, "lng": 5.9205},
    "eusebiuskerk": {"lat": 51.9790, "lng": 5.9096},
    "burgers-zoo": {"lat": 52.0105, "lng": 5.9010},
    "koepelkerk-arnhem": {"lat": 51.9833, "lng": 5.9068},
    "jacobiberg": {"lat": 51.9950, "lng": 5.8890},
}

KNOWN_DESCRIPTIONS = {
    "koepelgevangenis": "De monumentale Koepelgevangenis in Arnhem (1886) is een iconisch rijksmonument met een cirkelvormig panopticumontwerp en een imposante centrale hal van meer dan 2000 m². Tegenwoordig dé unieke culturele evenementenlocatie van Arnhem voor festivals, exclusieve proeverijen, masterclasses en historische rondleidingen door de cellencomplexen.",
    "luxor-live": "Luxor Live is hét poppodium van Arnhem aan het Willemsplein. Gevestigd in een prachtig historisch pand biedt het podium een toonaangevend programma vol live concerten, clubnachten en dance-evenementen.",
    "musis": "Musis & Stadstheater Arnhem is het culturele kloppend hart voor symfonische muziek, theater, dans en cabaret. Thuisbasis van Phion (Orkest van Gelderland & Overijssel) en Introdans.",
    "focus-filmtheater": "Focus Filmtheater op het Audrey Hepburnplein is het film- en cultuurhuis van Arnhem, met meerdere comfortabele filmzalen, een rooftop bioscoop en een sfeervol filmcafé.",
    "museum-arnhem": "Museum Arnhem toont moderne en hedendaagse kunst en vormgeving, hoog gelegen op de stuwwal met een adembenemend uitzicht over de Rijn.",
    "rozet": "Rozet aan de Kortestraat is het bekroonde kennis- en cultuurcentrum van Arnhem, met bibliotheek, erfgoedcentrum, kunstexposities en educatieve voorzieningen.",
    "willemeen": "Willemeen is hét jongerencultuur- en undergroundpodium van Arnhem, bekend om alternatieve muziek, metal, punk, hiphop en creatieve workshops.",
    "stadsvilla-sonsbeek": "De historische Witte Villa bovenop de heuvel in Park Sonsbeek biedt panoramisch uitzicht over de stad, jazzmiddagen, proeverijen en stijlvolle bijeenkomsten.",
}

def clean_text(s):
    if not s:
        return ""
    text = html.unescape(str(s))
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

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

def main():
    print("=== Loading Venues & Events Data ===")
    with open("data/venues.json", "r", encoding="utf-8") as f:
        venues_raw = json.load(f)
    
    with open("data/events.json", "r", encoding="utf-8") as f:
        events_raw = json.load(f)

    # Collect images & descriptions from events for venues
    venue_images = {}
    venue_descriptions = {}
    for e in events_raw:
        v = e.get("venue") or {}
        slug = v.get("slug")
        img = e.get("hero_image_url")
        if slug and img and slug not in venue_images:
            venue_images[slug] = img
        
        # If venue matches koepelgevangenis specifically
        if slug == "koepelgevangenis" and "Koepelgevangenis.jpg" in str(img):
            venue_images[slug] = img

    locations_list = []
    seen_slugs = set()
    seen_names = set()

    for v in venues_raw:
        raw_slug = v.get("slug")
        if not raw_slug:
            continue
        # Normalize trailing WordPress duplicate suffixes (-2, -3)
        slug = re.sub(r'-\d+$', '', raw_slug)

        name = clean_text(v.get("venue") or v.get("name") or slug)
        norm_name = name.lower()
        if slug in seen_slugs or norm_name in seen_names:
            continue
        seen_slugs.add(slug)
        seen_names.add(norm_name)
        address = clean_text(v.get("address"))
        postal_code = clean_text(v.get("zip"))
        city = clean_text(v.get("city") or "Arnhem")
        country = clean_text(v.get("country") or "Nederland")
        phone = clean_text(v.get("phone"))
        website = clean_text(v.get("website"))
        if website and not website.startswith("http"):
            website = f"https://{website}"

        # Image
        featured_image = venue_images.get(slug) or "/logo.png"

        # Description
        description = KNOWN_DESCRIPTIONS.get(slug) or clean_text(v.get("description"))
        if not description:
            description = f"{name} is een vaste culturele en ontmoetingslocatie in {city}."

        coords = KNOWN_COORDINATES.get(slug) or {"lat": 51.9851, "lng": 5.8987}

        locations_list.append({
            "slug": slug,
            "name": name,
            "address": address,
            "postal_code": postal_code,
            "city": city,
            "country": country,
            "phone": phone,
            "website": website,
            "description": description,
            "featured_image": featured_image,
            "coordinates": coords,
            "is_verified": True
        })

    print(f"Prepared {len(locations_list)} locations.")

    # 1. Insert or update into public.locations in Supabase Postgres
    sql_lines = ["BEGIN;"]
    for loc in locations_list:
        coords_json = json.dumps(loc["coordinates"])
        sql_lines.append(f"""
INSERT INTO public.locations (slug, name, address, postal_code, city, country, phone, website, description, featured_image, coordinates, is_verified)
VALUES (
    {escape_sql(loc['slug'])},
    {escape_sql(loc['name'])},
    {escape_sql(loc['address'])},
    {escape_sql(loc['postal_code'])},
    {escape_sql(loc['city'])},
    {escape_sql(loc['country'])},
    {escape_sql(loc['phone'])},
    {escape_sql(loc['website'])},
    {escape_sql(loc['description'])},
    {escape_sql(loc['featured_image'])},
    {escape_sql(coords_json)}::jsonb,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    postal_code = EXCLUDED.postal_code,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    phone = EXCLUDED.phone,
    website = EXCLUDED.website,
    description = EXCLUDED.description,
    featured_image = EXCLUDED.featured_image,
    coordinates = EXCLUDED.coordinates,
    updated_at = timezone('utc'::text, now());
""")

    # 2. Update public.events.location_id by joining with public.locations
    # by matching either event's venue_name = location.name or event slug in events_raw
    sql_lines.append("""
-- Update location_id for events based on exact or lower case venue name match
UPDATE public.events e
SET location_id = l.id
FROM public.locations l
WHERE lower(trim(e.venue_name)) = lower(trim(l.name))
   OR lower(trim(e.venue_name)) = lower(trim(l.slug));

-- Specific update for Koepelgevangenis
UPDATE public.events
SET location_id = (SELECT id FROM public.locations WHERE slug = 'koepelgevangenis')
WHERE slug = 'whisky-in-de-bajes' OR lower(venue_name) LIKE '%koepelgevangenis%';

COMMIT;
""")

    full_sql = "\n".join(sql_lines)
    print("Executing SQL in Supabase Postgres...")
    run_sql(full_sql)
    print("Successfully seeded public.locations and updated public.events!")

    # Verify how many events got location_id
    verify_res = run_sql("SELECT count(*) as total, count(location_id) as with_loc FROM public.events;")
    print("Events verification:\n", verify_res.strip())

    # Write TypeScript export to src/data/locationsData.ts
    ts_content = f"""// Auto-generated locations data catalog for Uit in Arnhem
import {{ Location }} from '@/types';

export const LOCATIONS_CATALOG: Location[] = {json.dumps(locations_list, indent=2)};

export function getLocationFromCatalog(slug: string): Location | undefined {{
  const lower = slug.toLowerCase();
  return LOCATIONS_CATALOG.find(
    (l) => l.slug.toLowerCase() === lower || l.name.toLowerCase() === lower
  );
}}
"""
    with open("src/data/locationsData.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("Saved src/data/locationsData.ts successfully.")

if __name__ == "__main__":
    main()

