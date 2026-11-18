/**
 * Helper function to safely strip a <div> and all its nested children
 * matching any class name pattern.
 */
function stripDivWithClass(html: string, classPattern: string): string {
  let output = html;
  let match;
  const regex = new RegExp(`<div[^>]*class=["'][^"']*\\b(?:${classPattern})\\b[^"']*["'][^>]*>`, 'i');
  while ((match = output.match(regex)) !== null) {
    const startIndex = match.index!;
    let depth = 1;
    let curr = startIndex + match[0].length;
    while (depth > 0 && curr < output.length) {
      const nextOpen = output.indexOf('<div', curr);
      const nextClose = output.indexOf('</div>', curr);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        curr = nextOpen + 4;
      } else {
        depth--;
        curr = nextClose + 6;
      }
    }
    output = output.substring(0, startIndex) + output.substring(curr);
  }
  return output;
}

/**
 * Helper to clean and format legacy WordPress article and event content
 * into clean, responsive HTML with embedded videos and figures.
 */
export function formatRichContent(rawContent: string, title: string = ''): string {
  if (!rawContent) return '';

  let content = rawContent;

  // 1. Cut off related posts block / MEER NIEUWS block injected by legacy theme
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

  // 2. Strip social share / like / tweet widgets (e.g. Luxor Live share buttons)
  content = stripDivWithClass(content, 'share|social-share|socials|fb-like-button|tw-like-button');
  content = content.replace(/<a[^>]*href=["'][^"']*(?:facebook\.com\/sharer|twitter\.com\/share|whatsapp:\/\/send)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');
  content = content.replace(/<a[^>]*class=["'][^"']*\b(?:wa|fb|tw)\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');

  // 3. Transform [vc_video link="..."] to responsive YouTube / Vimeo embed
  content = content.replace(/\[vc_video[^\]]*link=["'”]([^"'”\s]+)["'”][^\]]*\]/gi, (match, url) => {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      return `<div class="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${ytMatch[1]}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch) {
      return `<div class="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200"><iframe class="w-full h-full" src="https://player.vimeo.com/video/${vimeoMatch[1]}" title="Vimeo video" frameborder="0" allowfullscreen></iframe></div>`;
    }
    return '';
  });

  // Transform owl-video carousel links (e.g. Luxor video carousels) into responsive YouTube embeds
  content = content.replace(/<a[^>]*class=["'][^"']*\bowl-video\b[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi, (match, url) => {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      return `<div class="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${ytMatch[1]}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }
    return '';
  });

  // 4. Transform [caption ...]...[/caption]
  content = content.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, '<figure class="my-6 rounded-2xl overflow-hidden shadow-md bg-zinc-50 border border-zinc-100">$1</figure>');

  // 5. Strip all other vc_* and thb_* shortcodes
  content = content.replace(/\[\/?(?:vc_|thb_)[^\]]*\]/gi, '');

  // 6. Strip redundant initial <h1> or <h2> if it matches the title or is at the very beginning
  if (title) {
    const escapedTitle = title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titleRegex = new RegExp(`^\\s*<h[12][^>]*>\\s*${escapedTitle}\\s*<\\/h[12]>\\s*`, 'i');
    content = content.replace(titleRegex, '');
  }
  // Convert any remaining <h1> tags inside the article body into <h2> for semantic hierarchy
  content = content.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, '<h2 class="font-heading font-black text-2xl text-zinc-900 mt-8 mb-4"$1>$2</h2>');

  // Convert markdown ### headings into <h3>
  content = content.replace(/^###\s*(.+)$/gm, '<h3 class="font-heading font-bold text-xl text-zinc-900 mt-8 mb-3">$1</h3>');

  // Convert *Adres: ...* blocks
  content = content.replace(/\*Adres:\s*([^\*]+)\*/gi, '<div class="my-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-sm text-zinc-600 font-mono">📍 Adres: $1</div>');

  // 6. Decode HTML entities in text
  content = content
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#038;/g, '&');

  // 7. If plain text without paragraph tags, wrap double newlines into <p>
  if (!content.includes('<p>') && !content.includes('<div>') && !content.includes('<br')) {
    content = content
      .split('\n\n')
      .filter((p) => p.trim())
      .map((p) => `<p>${p.trim()}</p>`)
      .join('\n');
  }

  return content.trim();
}
