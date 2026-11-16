#!/usr/bin/env python3
import os
import re
import html
import subprocess
import json

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
        print(f"SQL Error: {proc.stderr[:300]}")
        raise RuntimeError(proc.stderr)
    return proc.stdout

def clean_wp_content(content, title=""):
    if not content:
        return ""

    # 1. Cut off related posts block / MEER NIEUWS block injected by theme
    split_patterns = [
        r'\[vc_text_separator[^\]]*MEER NIEUWS[^\]]*\]',
        r'<div[^>]*class=[\'"][^\'"]*(?:posts post-grid|style10-posts|post-carousel)[^\'"]*[\'"]',
        r'<strong>LEES OOK:<\/strong>',
    ]
    for pat in split_patterns:
        parts = re.split(pat, content, flags=re.IGNORECASE)
        if len(parts) > 1:
            content = parts[0]

    # 2. Transform [vc_video link="..."] to responsive YouTube / Vimeo embed
    def replace_vc_video(m):
        match_str = m.group(0)
        link_m = re.search(r'link=[\'\"”](https?:\/\/[^\'\"”\s]+)[\'\"”]', match_str)
        if link_m:
            url = link_m.group(1)
            yt_m = re.search(r'(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)', url)
            if yt_m:
                vid = yt_m.group(1)
                return f'<div class="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200"><iframe class="w-full h-full" src="https://www.youtube.com/embed/{vid}" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
            vim_m = re.search(r'vimeo\.com\/(?:video\/)?([0-9]+)', url)
            if vim_m:
                vid = vim_m.group(1)
                return f'<div class="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200"><iframe class="w-full h-full" src="https://player.vimeo.com/video/{vid}" title="Video" frameborder="0" allowfullscreen></iframe></div>'
        return ''
    content = re.sub(r'\[vc_video[^\]]*\]', replace_vc_video, content)

    # 3. Transform [caption ...]...[/caption]
    content = re.sub(r'\[caption[^\]]*\]([\s\S]*?)\[\/caption\]', r'<figure class="my-6 rounded-2xl overflow-hidden shadow-md bg-zinc-50 border border-zinc-100">\1</figure>', content)

    # 4. Strip all other vc_* and thb_* shortcodes
    content = re.sub(r'\[\/?(?:vc_|thb_)[^\]]*\]', '', content)

    # 5. Clean redundant h1 if it matches title
    if title:
        safe_title = re.escape(title.strip())
        content = re.sub(rf'^\s*<h1[^>]*>\s*{safe_title}\s*<\/h1>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'^\s*<h1[^>]*>([\s\S]*?)<\/h1>\s*', r'<h2 class="text-2xl font-bold text-zinc-900 mt-6 mb-3">\1</h2>\n', content, flags=re.IGNORECASE)

    # 6. HTML entity unescape
    content = html.unescape(content)
    content = (content
        .replace('&#8211;', '–')
        .replace('&#8212;', '—')
        .replace('&#8216;', '‘')
        .replace('&#8217;', '’')
        .replace('&#8220;', '“')
        .replace('&#8221;', '”')
        .replace('&#038;', '&')
    )

    # 7. If text has no paragraphs, wrap double newlines into <p>
    if '<p>' not in content and '<div>' not in content and '<br' not in content:
        paras = [p.strip() for p in content.split('\n\n') if p.strip()]
        content = '\n'.join([f'<p>{p}</p>' for p in paras])

    # 8. Clean excessive whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    return content.strip()

def escape_sql(val):
    if val is None:
        return "NULL"
    s = str(val).replace("\x00", "")
    s = s.replace("'", "''")
    return f"'{s}'"

def main():
    print("=== Cleaning all articles in Supabase ===")
    
    # Export all articles as JSON
    env = os.environ.copy()
    env["PGPASSWORD"] = DB_PASSWORD
    export_cmd = [
        "/opt/homebrew/opt/libpq/bin/psql",
        "-h", DB_HOST, "-U", DB_USER, "-d", DB_NAME, "-p", DB_PORT,
        "-t", "-A",
        "-c", "SELECT json_agg(json_build_object('id', id, 'title', title, 'content', content)) FROM public.articles;"
    ]
    res = subprocess.run(export_cmd, capture_output=True, text=True, env=env)
    if res.returncode != 0:
        print("Error fetching articles:", res.stderr)
        return

    articles = json.loads(res.stdout.strip())
    print(f"Fetched {len(articles)} articles from Supabase.")

    updates = []
    cleaned_count = 0
    for a in articles:
        aid = a["id"]
        title = a.get("title") or ""
        raw_content = a.get("content") or ""
        cleaned = clean_wp_content(raw_content, title)
        if cleaned != raw_content:
            cleaned_count += 1
            updates.append(f"UPDATE public.articles SET content = {escape_sql(cleaned)} WHERE id = '{aid}';")

    print(f"Articles needing cleanup: {cleaned_count}")
    if updates:
        # Run in batches of 50
        batch_size = 50
        for i in range(0, len(updates), batch_size):
            batch = updates[i:i+batch_size]
            run_sql("\n".join(batch))
            print(f"  Updated batch {i//batch_size + 1}/{(len(updates) + batch_size - 1)//batch_size}")
        print(f"Successfully cleaned and updated {cleaned_count} articles in Supabase!")

    # Also clean event descriptions
    print("=== Checking events in Supabase ===")
    export_events = [
        "/opt/homebrew/opt/libpq/bin/psql",
        "-h", DB_HOST, "-U", DB_USER, "-d", DB_NAME, "-p", DB_PORT,
        "-t", "-A",
        "-c", "SELECT json_agg(json_build_object('id', id, 'title', title, 'description', description)) FROM public.events;"
    ]
    res_e = subprocess.run(export_events, capture_output=True, text=True, env=env)
    if res_e.returncode == 0 and res_e.stdout.strip():
        events = json.loads(res_e.stdout.strip())
        print(f"Fetched {len(events)} events from Supabase.")
        e_updates = []
        for e in events:
            eid = e["id"]
            title = e.get("title") or ""
            raw_desc = e.get("description") or ""
            cleaned_desc = clean_wp_content(raw_desc, title)
            if cleaned_desc != raw_desc:
                e_updates.append(f"UPDATE public.events SET description = {escape_sql(cleaned_desc)} WHERE id = '{eid}';")
        
        print(f"Events needing cleanup: {len(e_updates)}")
        if e_updates:
            for i in range(0, len(e_updates), 50):
                batch = e_updates[i:i+50]
                run_sql("\n".join(batch))
            print(f"Successfully cleaned and updated {len(e_updates)} events in Supabase!")

if __name__ == "__main__":
    main()
