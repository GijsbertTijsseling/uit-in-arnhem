import type { LayoutTemplate } from '@/types';

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

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isSafeMediaUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^(?:https?:\/\/|\/|blob:)/i.test(trimmed);
}

function renderListicleHeading(rawText: string, index: number): string {
  const cleaned = rawText.trim();
  const explicitMatch = cleaned.match(/^(\d{1,2})\s*[.)\-:]\s+(.+)$/);
  const num = explicitMatch ? parseInt(explicitMatch[1], 10) : index;
  const label = explicitMatch ? explicitMatch[2].trim() : cleaned;
  const formattedNum = String(num).padStart(2, '0');
  const topSpacing = index === 1 ? 'mt-8 pt-2' : 'mt-12 pt-7 border-t border-border-warm';

  return `<h3 class="flex items-center gap-3.5 font-heading font-extrabold text-xl sm:text-2xl text-ink ${topSpacing} mb-4"><span class="inline-flex items-center justify-center shrink-0 w-9 h-9 rounded-xl bg-[#FF4F00] text-white font-heading font-black text-sm tracking-tight shadow-xs">${formattedNum}</span><span>${label}</span></h3>`;
}

export interface FormatRichContentOptions {
  layoutTemplate?: LayoutTemplate;
}

/**
 * Helper to clean and format legacy WordPress article and event content
 * as well as Markdown editor content into clean, responsive HTML.
 */
export function formatRichContent(
  rawContent: string,
  title: string = '',
  options: FormatRichContentOptions = {}
): string {
  if (!rawContent) return '';

  const isLegacyHtml = /<(?:p|div|br|h[1-6]|ul|ol|blockquote|figure)\b/i.test(rawContent);
  const isListicle = options.layoutTemplate === 'listicle';

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
  content = content.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, '<h2 class="font-heading font-extrabold text-2xl text-zinc-900 mt-8 mb-4"$1>$2</h2>');

  // Convert markdown ### headings into <h3> (with numbered badges for listicle template)
  let listicleIndex = 0;
  content = content.replace(/^###\s*(.+)$/gm, (_match, headingText: string) => {
    if (isListicle) {
      listicleIndex += 1;
      return renderListicleHeading(headingText, listicleIndex);
    }
    return `<h3 class="font-heading font-bold text-xl text-zinc-900 mt-8 mb-3">${headingText.trim()}</h3>`;
  });

  // Also style legacy HTML <h3> headings as numbered items when listicle template is active
  if (isListicle && isLegacyHtml && listicleIndex === 0) {
    content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_match, innerHtml: string) => {
      const plainText = innerHtml.replace(/<[^>]+>/g, '').trim();
      if (!plainText) return _match;
      listicleIndex += 1;
      return renderListicleHeading(plainText, listicleIndex);
    });
  }

  // Convert markdown images: ![caption](url) -> responsive <figure>
  content = content.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_match, rawAlt: string, rawUrl: string) => {
    if (!isSafeMediaUrl(rawUrl)) return '';
    const safeUrl = escapeHtmlAttr(rawUrl.trim());
    const caption = rawAlt.trim();
    const safeAlt = escapeHtmlAttr(caption || title || 'Artikelafbeelding');
    const figcaptionHtml = caption
      ? `<figcaption class="text-xs text-ink-muted mt-2.5 text-center leading-relaxed">${escapeHtmlAttr(caption)}</figcaption>`
      : '';
    return `\n\n<figure class="my-8 flex flex-col items-center"><img src="${safeUrl}" alt="${safeAlt}" loading="lazy" class="max-w-full w-auto max-h-[560px] rounded-2xl object-contain shadow-card border border-border-warm/60" />${figcaptionHtml}</figure>\n\n`;
  });

  // Convert *Adres: ...* blocks
  content = content.replace(
    /\*Adres:\s*([^\*]+)\*/gi,
    '\n\n<div class="my-4 p-3.5 bg-surface-subtle rounded-xl border border-border-warm text-sm text-ink-body"><span class="font-semibold text-ink">Adres:</span> $1</div>\n\n'
  );

  // Convert markdown links: [label](url) -> <a href="url">label</a>
  content = content.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, rawUrl: string) => {
    if (!isSafeMediaUrl(rawUrl)) return label;
    return `<a href="${escapeHtmlAttr(rawUrl.trim())}">${label}</a>`;
  });

  // Convert markdown blockquotes (> ...) and unordered lists (- ...) for markdown content
  if (!isLegacyHtml) {
    content = content.replace(/(?:^|\n)((?:> .+(?:\n|$))+)/g, (_match, block: string) => {
      const quoteText = block
        .trim()
        .split('\n')
        .map((line) => line.replace(/^>\s?/, '').trim())
        .join('<br />');
      return `\n\n<blockquote>${quoteText}</blockquote>\n\n`;
    });

    content = content.replace(/(?:^|\n)((?:- .+(?:\n|$))+)/g, (_match, block: string) => {
      const items = block
        .trim()
        .split('\n')
        .map((line) => `<li>${line.replace(/^-\s+/, '').trim()}</li>`)
        .join('');
      return `\n\n<ul>${items}</ul>\n\n`;
    });

    // Inline bold & italic markdown
    content = content.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/(?<![*\w])\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  }

  // 6. Decode HTML entities in text
  content = content
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#038;/g, '&');

  // 7. If markdown / plain text without legacy HTML tags, wrap non-block paragraphs into <p>
  if (!isLegacyHtml) {
    const blockStartRegex = /^<(?:h[1-6]|figure|div|blockquote|ul|ol|p)\b/i;
    content = content
      .replace(/\r\n/g, '\n')
      .split(/\n{2,}/)
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        if (blockStartRegex.test(chunk)) {
          return chunk;
        }
        return `<p>${chunk.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');
  }

  // 8. Add external link attributes and style plain editorial links (skip button-styled links)
  content = content.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    if (/href=["']https?:\/\//i.test(newAttrs) && !newAttrs.includes('target=')) {
      newAttrs += ' target="_blank" rel="noopener noreferrer"';
    }
    const isButtonLike = /\b(?:bg-|btn|rounded-full|rounded-xl)\b/i.test(newAttrs);
    if (!isButtonLike) {
      if (/class=["']/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(
          /class=["']([^"']*)["']/i,
          (m: string, cls: string) =>
            `class="${cls} text-[#FF4F00] underline decoration-[#FF4F00]/45 hover:decoration-[#E04500] hover:text-[#E04500] transition-colors"`
        );
      } else {
        newAttrs +=
          ' class="text-[#FF4F00] underline decoration-[#FF4F00]/45 hover:decoration-[#E04500] hover:text-[#E04500] transition-colors"';
      }
    }
    return `<a${newAttrs}>`;
  });

  return content.trim();
}
