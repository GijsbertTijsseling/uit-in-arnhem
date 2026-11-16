#!/usr/bin/env python3
"""
Data extraction script for Uit in Arnhem (https://uitinarnhem.nl/).
Extracts:
1. Posts (Articles) -> data/articles.json
2. Tribe Events (Agenda) -> data/events.json
3. Pages -> data/pages.json
4. Categories -> data/categories.json
5. Event Categories -> data/event_categories.json
6. Tags -> data/tags.json
7. Venues -> data/venues.json
8. Organizers -> data/organizers.json
"""

import os
import sys
import json
import time
import re
import html
import urllib.request
import urllib.error
from datetime import datetime

BASE_URL = "https://uitinarnhem.nl"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

OUTPUT_DIR = os.path.abspath("data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_json(url, retries=3, delay=1.5):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read().decode("utf-8")
                total = resp.headers.get("X-WP-Total")
                total_pages = resp.headers.get("X-WP-TotalPages")
                return json.loads(data), total, total_pages
        except Exception as e:
            print(f"  [Attempt {attempt+1}/{retries}] Error fetching {url}: {e}")
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
            else:
                raise e

def clean_text(text):
    if not text:
        return ""
    # Remove VC shortcodes
    text = re.sub(r'\[\/?vc_[^\]]*\]', '', text)
    # Remove other common shortcodes
    text = re.sub(r'\[\/?thb_[^\]]*\]', '', text)
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Unescape HTML entities
    text = html.unescape(text)
    # Normalize whitespaces
    return " ".join(text.split())

def clean_html(content):
    if not content:
        return ""
    # Strip VC wrapper shortcodes while preserving inner HTML
    content = re.sub(r'\[\/?vc_(row|column|column_text|row_inner|column_inner|tta_section|tta_accordion)[^\]]*\]', '', content)
    content = re.sub(r'\[vc_empty_space[^\]]*\]', '', content)
    content = re.sub(r'\[vc_separator[^\]]*\]', '<hr />', content)
    content = re.sub(r'\[vc_single_image[^\]]*\]', '', content)
    content = re.sub(r'<aside class="gap cf"[^>]*><\/aside>', '', content)
    # Unescape HTML entities in text portions
    content = html.unescape(content)
    # Clean excessive whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    return content.strip()

def map_article_category(wp_cats):
    """
    Map legacy WP category slugs to modern schema:
    'eten-drinken' | 'cultuur' | 'winkelen' | 'ontdekken' | 'nieuws-tips' | 'nachtleven'
    """
    slugs = [c.get("slug", "").lower() for c in wp_cats]
    if any(s in ['eten', 'drinken', 'hotspots'] for s in slugs):
        return 'eten-drinken'
    if any(s in ['cultuur', 'filmtips'] for s in slugs):
        return 'cultuur'
    if any(s in ['7-straatjes', 'winkelen'] for s in slugs):
        return 'winkelen'
    if any(s in ['buiten', 'wijken-2', 'sonsbeek', 'klarendal', 'korenkwartier', 'binnenstad'] for s in slugs):
        return 'ontdekken'
    if any(s in ['nieuws', 'uittips', 'uitgelicht', 'lijstjes', 'blog', 'de-eerste-keer', 'interview'] for s in slugs):
        return 'nieuws-tips'
    return 'nieuws-tips'

def map_event_category(tribe_cats):
    """
    Map legacy event category slugs to modern schema:
    'muziek' | 'theater-dans' | 'film' | 'festival' | 'kunst-expo' |
    'kinderen-familie' | 'sport-outdoor' | 'eten-drinken-markten'
    """
    slugs = [c.get("slug", "").lower() for c in tribe_cats]
    if any(s in ['muziek', 'opera'] for s in slugs):
        return 'muziek'
    if any(s in ['theater', 'cabaret'] for s in slugs):
        return 'theater-dans'
    if any(s in ['film'] for s in slugs):
        return 'film'
    if any(s in ['festival'] for s in slugs):
        return 'festival'
    if any(s in ['tentoonstelling'] for s in slugs):
        return 'kunst-expo'
    if any(s in ['kindvriendelijk'] for s in slugs):
        return 'kinderen-familie'
    if any(s in ['sport', 'actief'] for s in slugs):
        return 'sport-outdoor'
    if any(s in ['culinair', 'markt', 'koopzondag'] for s in slugs):
        return 'eten-drinken-markten'
    return 'cultuur'

def parse_price(cost_str, cost_details):
    if not cost_str:
        return 'free', 0.0
    cost_clean = cost_str.lower().strip()
    if 'gratis' in cost_clean or 'free' in cost_clean or cost_clean == '€ 0' or cost_clean == '0':
        return 'free', 0.0
    # Try to extract numbers
    nums = re.findall(r'\d+(?:[.,]\d+)?', cost_str)
    if nums:
        val = float(nums[0].replace(',', '.'))
        return 'paid', val
    return 'paid', None

def fetch_all_posts():
    print("--- Fetching all WordPress Posts ---")
    page = 1
    per_page = 100
    all_posts = []
    
    while True:
        url = f"{BASE_URL}/wp-json/wp/v2/posts?per_page={per_page}&page={page}&_embed=1"
        print(f"Fetching posts page {page}...")
        try:
            data, total, total_pages = fetch_json(url)
            if not data:
                break
            all_posts.extend(data)
            print(f"  Retrieved {len(data)} posts (Total so far: {len(all_posts)} / {total})")
            if total_pages and page >= int(total_pages):
                break
            page += 1
            time.sleep(0.5)
        except urllib.error.HTTPError as e:
            if e.code == 400: # Beyond max pages
                break
            raise e

    print(f"Total raw posts fetched: {len(all_posts)}")
    
    transformed = []
    for p in all_posts:
        emb = p.get("_embedded", {})
        
        # Author extraction
        author_info = {"id": p.get("author"), "name": "Redactie", "slug": "redactie"}
        if "author" in emb and emb["author"]:
            a = emb["author"][0]
            author_info = {
                "id": a.get("id"),
                "name": a.get("name"),
                "slug": a.get("slug"),
                "avatar_url": a.get("avatar_urls", {}).get("96")
            }
            
        # Featured image extraction
        feat_img_url = ""
        feat_img_details = None
        if "wp:featuredmedia" in emb and emb["wp:featuredmedia"]:
            fm = emb["wp:featuredmedia"][0]
            feat_img_url = fm.get("source_url", "")
            feat_img_details = {
                "id": fm.get("id"),
                "title": fm.get("title", {}).get("rendered", ""),
                "alt_text": fm.get("alt_text", ""),
                "width": fm.get("media_details", {}).get("width"),
                "height": fm.get("media_details", {}).get("height"),
                "sizes": fm.get("media_details", {}).get("sizes", {})
            }
            
        # Taxonomies
        categories = []
        tags = []
        if "wp:term" in emb and emb["wp:term"]:
            for term_group in emb["wp:term"]:
                for term in term_group:
                    tax = term.get("taxonomy")
                    t_item = {"id": term.get("id"), "name": term.get("name"), "slug": term.get("slug")}
                    if tax == "category":
                        categories.append(t_item)
                    elif tax == "post_tag":
                        tags.append(t_item)
                        
        mapped_cat = map_article_category(categories)
        clean_exp = clean_text(p.get("excerpt", {}).get("rendered", ""))
        clean_cnt = clean_html(p.get("content", {}).get("rendered", ""))
        
        transformed.append({
            "id": p.get("id"),
            "slug": p.get("slug"),
            "title": html.unescape(p.get("title", {}).get("rendered", "")),
            "excerpt": clean_exp,
            "content": clean_cnt,
            "content_raw": p.get("content", {}).get("rendered", ""),
            "featured_image_url": feat_img_url,
            "featured_image_details": feat_img_details,
            "author": author_info,
            "category": mapped_cat,
            "categories": categories,
            "tags": [t["name"] for t in tags],
            "tags_detailed": tags,
            "status": p.get("status", "published"),
            "is_featured": p.get("sticky", False),
            "published_at": p.get("date_gmt", p.get("date")),
            "modified_at": p.get("modified_gmt", p.get("modified")),
            "original_url": p.get("link", f"{BASE_URL}/?p={p.get('id')}")
        })
        
    return transformed

def fetch_all_events():
    print("\n--- Fetching all Tribe Events ---")
    page = 1
    per_page = 50
    all_events = []
    
    while True:
        url = f"{BASE_URL}/wp-json/tribe/events/v1/events?start_date=2000-01-01&per_page={per_page}&page={page}"
        print(f"Fetching events page {page}...")
        try:
            data, _, _ = fetch_json(url)
            events = data.get("events", [])
            if not events:
                break
            all_events.extend(events)
            total = data.get("total")
            total_pages = data.get("total_pages")
            print(f"  Retrieved {len(events)} events (Total so far: {len(all_events)} / {total})")
            if total_pages and page >= int(total_pages):
                break
            page += 1
            time.sleep(0.5)
        except urllib.error.HTTPError as e:
            if e.code == 400:
                break
            raise e

    print(f"Total raw events fetched: {len(all_events)}")
    
    transformed = []
    for e in all_events:
        # Venue extraction
        venue_obj = e.get("venue") or {}
        venue_data = {
            "id": venue_obj.get("id"),
            "name": venue_obj.get("venue", ""),
            "slug": venue_obj.get("slug", ""),
            "address": venue_obj.get("address", ""),
            "city": venue_obj.get("city", "Arnhem"),
            "zip": venue_obj.get("zip", ""),
            "country": venue_obj.get("country", "Nederland"),
            "province": venue_obj.get("province", "Gelderland"),
            "phone": venue_obj.get("phone", ""),
            "website": venue_obj.get("website", ""),
            "url": venue_obj.get("url", "")
        }
        
        # Organizer extraction
        organizers = e.get("organizer", [])
        organizer_data = {}
        if organizers:
            org = organizers[0]
            organizer_data = {
                "id": org.get("id"),
                "name": org.get("organizer", ""),
                "slug": org.get("slug", ""),
                "phone": org.get("phone", ""),
                "website": org.get("website", ""),
                "email": org.get("email", "")
            }
            
        # Image extraction
        img_obj = e.get("image") or {}
        img_url = ""
        if isinstance(img_obj, dict):
            img_url = img_obj.get("url", "")
        elif isinstance(img_obj, str):
            img_url = img_obj
            
        # Categories extraction
        cats = e.get("categories", [])
        mapped_cat = map_event_category(cats)
        
        # Cost extraction
        cost_str = e.get("cost", "")
        cost_details = e.get("cost_details", {})
        price_type, price_val = parse_price(cost_str, cost_details)
        
        clean_exp = clean_text(e.get("excerpt", ""))
        if not clean_exp and e.get("description"):
            clean_exp = clean_text(e.get("description"))[:200]
            
        clean_desc = clean_html(e.get("description", ""))
        
        transformed.append({
            "id": e.get("id"),
            "slug": e.get("slug"),
            "title": html.unescape(e.get("title", "")),
            "short_description": clean_exp,
            "full_description": clean_desc,
            "description_raw": e.get("description", ""),
            "hero_image_url": img_url,
            "image_details": img_obj if isinstance(img_obj, dict) else {},
            "category": mapped_cat,
            "categories": [{"id": c.get("id"), "name": c.get("name"), "slug": c.get("slug")} for c in cats],
            "tags": [{"id": t.get("id"), "name": t.get("name"), "slug": t.get("slug")} for t in e.get("tags", [])],
            "start_date": e.get("start_date"),
            "end_date": e.get("end_date"),
            "utc_start_date": e.get("utc_start_date"),
            "utc_end_date": e.get("utc_end_date"),
            "is_all_day": e.get("all_day", False),
            "is_recurring": bool(e.get("recurrence")),
            "venue_name": venue_data.get("name"),
            "venue_address": venue_data.get("address"),
            "venue_city": venue_data.get("city"),
            "venue": venue_data,
            "organizer_name": organizer_data.get("name"),
            "organizer": organizer_data,
            "price_type": price_type,
            "price_from": price_val,
            "cost_string": cost_str,
            "cost_details": cost_details,
            "ticket_url": e.get("website") or "",
            "website": e.get("website") or "",
            "status": e.get("status", "published"),
            "is_highlight": e.get("featured", False),
            "created_at": e.get("date_utc", e.get("date")),
            "updated_at": e.get("modified_utc", e.get("modified")),
            "original_url": e.get("url", "")
        })
        
    return transformed

def fetch_all_pages():
    print("\n--- Fetching WordPress Pages ---")
    data, _, _ = fetch_json(f"{BASE_URL}/wp-json/wp/v2/pages?per_page=100&_embed=1")
    transformed = []
    for p in data:
        emb = p.get("_embedded", {})
        feat_img_url = ""
        if "wp:featuredmedia" in emb and emb["wp:featuredmedia"]:
            feat_img_url = emb["wp:featuredmedia"][0].get("source_url", "")
            
        transformed.append({
            "id": p.get("id"),
            "slug": p.get("slug"),
            "title": html.unescape(p.get("title", {}).get("rendered", "")),
            "excerpt": clean_text(p.get("excerpt", {}).get("rendered", "")),
            "content": clean_html(p.get("content", {}).get("rendered", "")),
            "content_raw": p.get("content", {}).get("rendered", ""),
            "featured_image_url": feat_img_url,
            "status": p.get("status"),
            "published_at": p.get("date_gmt", p.get("date")),
            "modified_at": p.get("modified_gmt", p.get("modified")),
            "original_url": p.get("link")
        })
    print(f"Total pages fetched: {len(transformed)}")
    return transformed

def fetch_categories():
    print("\n--- Fetching Categories ---")
    data, _, _ = fetch_json(f"{BASE_URL}/wp-json/wp/v2/categories?per_page=100")
    print(f"Total categories fetched: {len(data)}")
    return data

def fetch_event_categories():
    print("\n--- Fetching Event Categories ---")
    data, _, _ = fetch_json(f"{BASE_URL}/wp-json/tribe/events/v1/categories?per_page=100")
    cats = data.get("categories", [])
    print(f"Total event categories fetched: {len(cats)}")
    return cats

def fetch_tags():
    print("\n--- Fetching Tags ---")
    page = 1
    all_tags = []
    while True:
        try:
            data, _, total_pages = fetch_json(f"{BASE_URL}/wp-json/wp/v2/tags?per_page=100&page={page}")
            if not data:
                break
            all_tags.extend(data)
            if total_pages and page >= int(total_pages):
                break
            page += 1
            time.sleep(0.5)
        except urllib.error.HTTPError as e:
            if e.code == 400:
                break
            raise e
    print(f"Total tags fetched: {len(all_tags)}")
    return all_tags

def fetch_venues():
    print("\n--- Fetching Venues ---")
    page = 1
    all_venues = []
    while True:
        try:
            data, _, _ = fetch_json(f"{BASE_URL}/wp-json/tribe/events/v1/venues?per_page=100&page={page}")
            venues = data.get("venues", [])
            if not venues:
                break
            all_venues.extend(venues)
            total_pages = data.get("total_pages")
            if total_pages and page >= int(total_pages):
                break
            page += 1
            time.sleep(0.5)
        except urllib.error.HTTPError as e:
            if e.code == 400:
                break
            raise e
    print(f"Total venues fetched: {len(all_venues)}")
    return all_venues

def fetch_organizers():
    print("\n--- Fetching Organizers ---")
    page = 1
    all_orgs = []
    while True:
        try:
            data, _, _ = fetch_json(f"{BASE_URL}/wp-json/tribe/events/v1/organizers?per_page=50&page={page}")
            orgs = data.get("organizers", [])
            if not orgs:
                break
            all_orgs.extend(orgs)
            total_pages = data.get("total_pages")
            if total_pages and page >= int(total_pages):
                break
            page += 1
            time.sleep(0.5)
        except urllib.error.HTTPError as e:
            if e.code == 400:
                break
            raise e
    print(f"Total organizers fetched: {len(all_orgs)}")
    return all_orgs

def main():
    start_time = time.time()
    
    # 1. Articles
    articles = fetch_all_posts()
    with open(os.path.join(OUTPUT_DIR, "articles.json"), "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(articles)} articles to data/articles.json")
    
    # 2. Events
    events = fetch_all_events()
    with open(os.path.join(OUTPUT_DIR, "events.json"), "w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(events)} events to data/events.json")
    
    # 3. Pages
    pages = fetch_all_pages()
    with open(os.path.join(OUTPUT_DIR, "pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)
        
    # 4. Taxonomies & supporting entities
    categories = fetch_categories()
    with open(os.path.join(OUTPUT_DIR, "categories.json"), "w", encoding="utf-8") as f:
        json.dump(categories, f, ensure_ascii=False, indent=2)
        
    event_cats = fetch_event_categories()
    with open(os.path.join(OUTPUT_DIR, "event_categories.json"), "w", encoding="utf-8") as f:
        json.dump(event_cats, f, ensure_ascii=False, indent=2)
        
    tags = fetch_tags()
    with open(os.path.join(OUTPUT_DIR, "tags.json"), "w", encoding="utf-8") as f:
        json.dump(tags, f, ensure_ascii=False, indent=2)
        
    venues = fetch_venues()
    with open(os.path.join(OUTPUT_DIR, "venues.json"), "w", encoding="utf-8") as f:
        json.dump(venues, f, ensure_ascii=False, indent=2)
        
    organizers = fetch_organizers()
    with open(os.path.join(OUTPUT_DIR, "organizers.json"), "w", encoding="utf-8") as f:
        json.dump(organizers, f, ensure_ascii=False, indent=2)
        
    duration = time.time() - start_time
    print(f"\n==========================================")
    print(f"All data successfully extracted in {duration:.1f}s!")
    print(f"Articles: {len(articles)}")
    print(f"Events: {len(events)}")
    print(f"Pages: {len(pages)}")
    print(f"Categories: {len(categories)}")
    print(f"Event Categories: {len(event_cats)}")
    print(f"Tags: {len(tags)}")
    print(f"Venues: {len(venues)}")
    print(f"Organizers: {len(organizers)}")
    print(f"==========================================")

if __name__ == "__main__":
    main()
