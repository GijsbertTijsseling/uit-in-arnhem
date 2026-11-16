import { createClient } from './client';
import { Article, AgendaItem, UserProfile } from '@/types';
import { MOCK_ARTICLES, MOCK_EVENTS } from '@/data/mockData';

// Helper to sanitize html string to plain text for excerpts
function cleanHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\[[^\]]*\]/g, '').trim();
}

export async function getArticles(): Promise<Article[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(name, slug)')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_ARTICLES;
    }

    const mapped = data.map((item: any) => ({
      id: item.id || `art-${item.slug}`,
      slug: item.slug,
      title: item.title,
      excerpt: cleanHtml(item.excerpt) || cleanHtml(item.content).slice(0, 160) + '...',
      content: item.content || '',
      featured_image_url:
        item.featured_image ||
        item.featured_image_url ||
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      gallery_image_urls: item.gallery_image_urls || [],
      author_id: item.author_id,
      author_name: item.author_name || 'Redactie Uit in Arnhem',
      category: item.categories?.slug || item.category_slug || item.category || 'ontdekken',
      tags: item.tags || [],
      status: item.status || 'published',
      is_featured: !!item.is_featured,
      layout_template: item.layout_template || 'standard',
      cta_block: item.cta_block,
      published_at: item.published_at || item.created_at || new Date().toISOString(),
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at,
    }));

    // If our editorial mock articles aren't in Supabase yet, keep the top mock ones for curated hero layout
    const unique = [
      ...MOCK_ARTICLES.filter((m) => !mapped.some((item) => item.slug === m.slug)),
      ...mapped,
    ];
    return unique;
  } catch (err) {
    return MOCK_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  const match = articles.find((a) => a.slug === slug || a.id === slug);
  return match || null;
}

export async function getEvents(): Promise<AgendaItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*, event_categories(name, slug)')
      .order('start_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_EVENTS;
    }

    const mapped = data.map((item: any) => ({
      id: item.id || `evt-${item.slug}`,
      slug: item.slug,
      title: item.title,
      short_description: cleanHtml(item.short_description) || cleanHtml(item.description).slice(0, 140) + '...',
      full_description: cleanHtml(item.description) || item.description || '',
      hero_image_url:
        item.featured_image ||
        item.hero_image ||
        item.hero_image_url ||
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
      category: item.event_categories?.slug || item.category_slug || item.category || 'muziek',
      start_date: item.start_date,
      end_date: item.end_date,
      is_all_day: !!item.is_all_day,
      is_recurring: !!item.is_recurring,
      recurrence_rule: item.recurrence_rule,
      venue_name: item.venue_name || 'Arnhem',
      venue_address: item.venue_address || 'Arnhem Centrum',
      venue_city: item.venue_city || 'Arnhem',
      coordinates: item.coordinates,
      price_type: item.price_type || (item.price === 0 ? 'free' : 'paid'),
      price_from: item.price_from ?? item.price ?? 0,
      price_to: item.price_to,
      ticket_url: item.ticket_url,
      organizer_name: item.organizer_name || 'Organisatie Arnhem',
      status: item.status || 'published',
      is_highlight: !!item.is_highlight,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    const unique = [
      ...MOCK_EVENTS.filter((m) => !mapped.some((item) => item.slug === m.slug)),
      ...mapped,
    ];
    return unique;
  } catch (err) {
    return MOCK_EVENTS;
  }
}

export async function getEventBySlug(slug: string): Promise<AgendaItem | null> {
  const events = await getEvents();
  const match = events.find((e) => e.slug === slug || e.id === slug);
  return match || null;
}

export async function uploadImageToSupabase(file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('media').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function saveArticleToSupabase(article: Partial<Article>): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  const payload = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    featured_image: article.featured_image_url,
    status: article.status || 'published',
    layout_template: article.layout_template || 'standard',
    cta_block: article.cta_block,
    is_featured: article.is_featured ?? false,
    published_at: article.published_at || new Date().toISOString(),
  };

  if (article.id && !article.id.startsWith('art-') && isNaN(Number(article.id))) {
    const { data, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', article.id)
      .select();
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('articles')
      .insert([payload])
      .select();
    return { data, error };
  }
}

export async function saveEventToSupabase(event: Partial<AgendaItem>): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  const payload = {
    title: event.title,
    slug: event.slug,
    description: event.full_description,
    short_description: event.short_description,
    featured_image: event.hero_image_url,
    start_date: event.start_date,
    end_date: event.end_date,
    venue_name: event.venue_name,
    venue_address: event.venue_address,
    venue_city: event.venue_city || 'Arnhem',
    price_type: event.price_type || 'free',
    price: event.price_from || 0,
    ticket_url: event.ticket_url,
    status: event.status || 'published',
    is_highlight: event.is_highlight ?? false,
  };

  if (event.id && !event.id.startsWith('evt-') && isNaN(Number(event.id))) {
    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', event.id)
      .select();
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select();
    return { data, error };
  }
}
