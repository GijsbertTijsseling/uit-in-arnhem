import { createClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ldvclkymaiopytbkjulp.supabase.co';
const DB_CONN = 'postgresql://postgres:ZZzr336rEG4T04Su@db.ldvclkymaiopytbkjulp.supabase.co:5432/postgres';

// Using child_process with psql for direct administrative updates
import { execSync } from 'child_process';

function runQuery(sql) {
  return execSync(
    `/opt/homebrew/opt/libpq/bin/psql "${DB_CONN}" -t -A -c "${sql.replace(/"/g, '\\"')}"`,
    { encoding: 'utf-8' }
  );
}

export function cleanWordPressContent(html, title = '') {
  if (!html) return '';

  let content = html;

  // 1. Cut off related posts block / MEER NIEUWS block injected by theme
  const splitPatterns = [
    /\[vc_text_separator[^\]]*MEER NIEUWS[^\]]*\]/i,
    /<div[^>]*class=["'][^"']*(?:posts post-grid|style10-posts|post-carousel)[^"']*["']/i,
    /<strong>LEES OOK:<\/strong>/i,
  ];

  for (const pat of splitPatterns) {
    const parts = content.split(pat);
    if (parts.length > 1) {
      content = parts[0];
    }
  }

  // 2. Transform [vc_video link="..."] to responsive iframe
  content = content.replace(/\[vc_video[^\]]*link=["'”]([^"'”\s]+)["'”][^\]]*\]/gi, (match, url) => {
    let videoId = '';
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      videoId = ytMatch[1];
      return `<div class="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch) {
      return `<div class="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200"><iframe class="w-full h-full" src="https://player.vimeo.com/video/${vimeoMatch[1]}" title="Video" frameborder="0" allowfullscreen></iframe></div>`;
    }
    return '';
  });

  // 3. Transform [caption id=... align=... width=...]...[/caption]
  content = content.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, (match, inner) => {
    return `<figure class="my-6 rounded-2xl overflow-hidden shadow-md bg-zinc-50 border border-zinc-100">${inner}</figure>`;
  });

  // 4. Strip all other vc_* and thb_* shortcodes
  content = content.replace(/\[\/?(?:vc_|thb_)[^\]]*\]/gi, '');

  // 5. Remove redundant h1 if it duplicates the title
  if (title) {
    const titleRegex = new RegExp(`^\\s*<h1[^>]*>\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<\\/h1>\\s*`, 'i');
    content = content.replace(titleRegex, '');
  }
  // Generic h1 at very beginning -> convert to h2 to preserve semantic hierarchy
  content = content.replace(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>\s*/i, '<h2 class="text-2xl font-bold text-zinc-900 mt-6 mb-3">$1</h2>\n');

  // 6. Fix paragraph structure: replace naked newlines with paragraphs if no html tags
  if (!content.includes('<p>') && !content.includes('<div>') && !content.includes('<br')) {
    content = content
      .split('\n\n')
      .filter((p) => p.trim())
      .map((p) => `<p>${p.trim()}</p>`)
      .join('\n');
  }

  // 7. Decode HTML entities in text
  content = content
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');

  // 8. Trim excessive blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  return content.trim();
}

console.log('cleanWordPressContent helper created.');

