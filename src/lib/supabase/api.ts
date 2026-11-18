import { createClient } from './client';
import { Article, AgendaItem, UserProfile, Location } from '@/types';
import { LOCATIONS_CATALOG, getLocationFromCatalog } from '@/data/locationsData';

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
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id || `art-${item.slug}`,
      slug: item.slug,
      title: item.title,
      excerpt: cleanHtml(item.excerpt) || cleanHtml(item.content).slice(0, 160) + '...',
      content: item.content || '',
      featured_image_url:
        item.featured_image ||
        item.featured_image_url ||
        '/logo.png',
      gallery_image_urls: item.gallery_image_urls || [],
      author_id: item.author_id,
      author_name: item.author_name || 'Redactie Uit in Arnhem',
      category: item.categories?.slug || item.category_slug || item.category || 'nieuws',
      tags: item.tags || [],
      status: item.status || 'published',
      is_featured: !!item.is_featured,
      layout_template: item.layout_template || 'standard',
      cta_block: item.cta_block,
      published_at: item.published_at || item.created_at || new Date().toISOString(),
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at,
    }));
  } catch (err) {
    console.error('Failed to get articles:', err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  const lower = slug.toLowerCase();
  const match = articles.find((a) =>
    a.slug === slug ||
    a.id === slug ||
    a.slug.toLowerCase() === lower
  );
  return match || null;
}

export async function getEvents(options: { includePast?: boolean } = {}): Promise<AgendaItem[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('events')
      .select('*, event_categories(name, slug), locations(id, slug, name, address, postal_code, city, website, coordinates, featured_image)')
      .eq('status', 'published')
      .order('start_date', { ascending: true });

    if (!options.includePast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString();
      query = query.or(`end_date.gte.${todayIso},and(end_date.is.null,start_date.gte.${todayIso})`);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error('Error fetching events:', error);
      return [];
    }

    return data.map((item: any) => {
      const loc = item.locations || (item.venue_name ? getLocationFromCatalog(item.venue_name) : null);
      return {
        id: item.id || `evt-${item.slug}`,
        slug: item.slug,
        title: item.title,
        short_description: cleanHtml(item.short_description) || cleanHtml(item.description).slice(0, 140) + '...',
        full_description: item.description || '',
        hero_image_url:
          item.featured_image ||
          item.hero_image ||
          item.hero_image_url ||
          loc?.featured_image ||
          '/logo.png',
        category: item.event_categories?.slug || item.category_slug || item.category || 'cultuur',
        start_date: item.start_date,
        end_date: item.end_date,
        is_all_day: !!item.is_all_day,
        is_recurring: !!item.is_recurring,
        recurrence_rule: item.recurrence_rule,
        venue_name: item.venue_name || loc?.name || 'Arnhem',
        venue_address: item.venue_address || loc?.address || 'Arnhem',
        venue_city: item.venue_city || loc?.city || 'Arnhem',
        location_id: item.location_id || loc?.id || null,
        location_slug: loc?.slug || null,
        location: loc || null,
        coordinates: item.coordinates || loc?.coordinates,
        price_type: item.price_type || (item.price === 0 ? 'free' : 'paid'),
        price_from: item.price_from ?? item.price ?? 0,
        price_to: item.price_to,
        ticket_url: item.ticket_url,
        organizer_name: item.organizer_name || undefined,
        status: item.status || 'published',
        is_highlight: !!item.is_highlight,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });
  } catch (err) {
    console.error('Failed to get events:', err);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<AgendaItem | null> {
  const events = await getEvents({ includePast: true });
  const lower = slug.toLowerCase();
  const match = events.find((e) =>
    e.slug === slug ||
    e.id === slug ||
    e.slug.toLowerCase() === lower
  );
  return match || null;
}

export async function getLocations(): Promise<Location[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Fallback to local locations catalog');
      return LOCATIONS_CATALOG;
    }

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      address: item.address || '',
      postal_code: item.postal_code || '',
      city: item.city || 'Arnhem',
      country: item.country || 'Nederland',
      phone: item.phone || '',
      website: item.website || '',
      email: item.email || '',
      description: item.description || '',
      featured_image: item.featured_image || '/logo.png',
      coordinates: item.coordinates,
      is_verified: !!item.is_verified,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  } catch (err) {
    console.error('Failed to get locations from supabase:', err);
    return LOCATIONS_CATALOG;
  }
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        address: data.address || '',
        postal_code: data.postal_code || '',
        city: data.city || 'Arnhem',
        country: data.country || 'Nederland',
        phone: data.phone || '',
        website: data.website || '',
        email: data.email || '',
        description: data.description || '',
        featured_image: data.featured_image || '/logo.png',
        coordinates: data.coordinates,
        is_verified: !!data.is_verified,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    }
  } catch (err) {
    console.error('Error fetching location by slug:', err);
  }

  // Fallback to catalog
  const fallback = getLocationFromCatalog(slug);
  return fallback || null;
}

export async function getEventsByLocation(
  locationIdOrSlug: string,
  options: { includePast?: boolean } = {}
): Promise<AgendaItem[]> {
  const events = await getEvents(options);
  const lower = locationIdOrSlug.toLowerCase();

  return events.filter((e) => {
    if (e.location_id && e.location_id === locationIdOrSlug) return true;
    if (e.location_slug && e.location_slug.toLowerCase() === lower) return true;
    if (e.location?.slug && e.location.slug.toLowerCase() === lower) return true;
    if (e.venue_name && e.venue_name.toLowerCase().includes(lower)) return true;
    return false;
  });
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
  const payload: any = {
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
    location_id: event.location_id || null,
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

export async function saveLocationToSupabase(location: Partial<Location>): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  const payload: any = {
    name: location.name,
    slug: location.slug,
    address: location.address,
    postal_code: location.postal_code,
    city: location.city || 'Arnhem',
    country: location.country || 'Nederland',
    phone: location.phone,
    website: location.website,
    email: location.email,
    description: location.description,
    featured_image: location.featured_image,
    coordinates: location.coordinates,
    is_verified: location.is_verified ?? true,
  };

  if (location.id && !location.id.startsWith('loc-') && isNaN(Number(location.id))) {
    const { data, error } = await supabase
      .from('locations')
      .update(payload)
      .eq('id', location.id)
      .select();
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('locations')
      .insert([payload])
      .select();
    return { data, error };
  }
}
