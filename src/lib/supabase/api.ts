import { createClient } from './client';
import { Article, AgendaItem, UserProfile, Location, AgendaSource, AgendaSyncLog } from '@/types';
import { LOCATIONS_CATALOG, getLocationFromCatalog } from '@/data/locationsData';

// Helper to sanitize html string to plain text for excerpts
function cleanHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\[[^\]]*\]/g, '').trim();
}

function mapArticleItem(item: any): Article {
  const resolvedAuthorName =
    item.author_name?.trim() ||
    item.profiles?.full_name?.trim() ||
    'Redactie Uit in Arnhem';

  return {
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
    author_name: resolvedAuthorName,
    category: item.categories?.slug || item.category_slug || item.category || 'nieuws',
    tags: item.tags || [],
    status: item.status || 'published',
    is_featured: !!item.is_featured,
    layout_template: item.layout_template || 'standard',
    cta_block: item.cta_block,
    published_at: item.published_at || item.created_at || new Date().toISOString(),
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at,
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(name, slug), profiles(id, full_name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return data.map(mapArticleItem);
  } catch (err) {
    console.error('Failed to get articles:', err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(name, slug), profiles(id, full_name)')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (data) {
      return mapArticleItem(data);
    }

    // Try case-insensitive lookup
    const { data: ciData } = await supabase
      .from('articles')
      .select('*, categories(name, slug), profiles(id, full_name)')
      .ilike('slug', slug)
      .maybeSingle();

    if (ciData) {
      return mapArticleItem(ciData);
    }

    return null;
  } catch (err) {
    console.error('Failed to get article by slug:', err);
    return null;
  }
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
        source: item.source || 'manual',
        source_id: item.source_id,
        source_url: item.source_url,
        production_id: item.production_id,
        performances: item.performances || [],
        is_manually_edited: !!item.is_manually_edited,
        manual_override_fields: item.manual_override_fields || [],
        missing_count: item.missing_count || 0,
        missing_since: item.missing_since,
        last_synced_at: item.last_synced_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });
  } catch (err) {
    console.error('Failed to get events:', err);
    return [];
  }
}

export async function getAllEventsForAdmin(options: { status?: string } = {}): Promise<AgendaItem[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('events')
      .select('*, event_categories(name, slug), locations(id, slug, name, address, postal_code, city, website, coordinates, featured_image)')
      .order('created_at', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error('Error fetching admin events:', error);
      return [];
    }

    return data.map((item: any) => {
      const loc = item.locations || (item.venue_name ? getLocationFromCatalog(item.venue_name) : null);
      let contactInfo: any = {};
      if (Array.isArray(item.performances)) {
        const sub = item.performances.find((p: any) => p && p.type === 'submission_contact');
        if (sub) {
          contactInfo = sub;
        }
      }

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
        organizer_name: contactInfo.contact_name || item.organizer_name || undefined,
        contact_name: contactInfo.contact_name || undefined,
        contact_email: contactInfo.contact_email || (item.source === 'external_submission' ? item.source_url : undefined),
        contact_phone: contactInfo.contact_phone || undefined,
        submission_notes: contactInfo.submission_notes || undefined,
        status: item.status || 'published',
        is_highlight: !!item.is_highlight,
        source: item.source || 'manual',
        source_id: item.source_id,
        source_url: item.source_url,
        production_id: item.production_id,
        performances: item.performances || [],
        is_manually_edited: !!item.is_manually_edited,
        manual_override_fields: item.manual_override_fields || [],
        missing_count: item.missing_count || 0,
        missing_since: item.missing_since,
        last_synced_at: item.last_synced_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });
  } catch (err) {
    console.error('Failed to get admin events:', err);
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

    // Deduplicate by name/slug to safeguard against duplicates
    const seen = new Set<string>();
    const result: Location[] = [];

    for (const item of data) {
      const key = (item.name || item.slug || '').trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      result.push({
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
      });
    }

    return result;
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
  const payload: Record<string, any> = {
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
    author_name: article.author_name?.trim() || null,
  };

  if (article.author_id) {
    payload.author_id = article.author_id;
  }

  const isUpdate = Boolean(article.id && !article.id.startsWith('art-') && isNaN(Number(article.id)));

  // Zorg dat er altijd maximaal 1 artikel tegelijk als uitgelicht gemarkeerd staat
  if (payload.is_featured) {
    let clearQuery = supabase
      .from('articles')
      .update({ is_featured: false })
      .eq('is_featured', true);
    if (isUpdate && article.id) {
      clearQuery = clearQuery.neq('id', article.id);
    }
    await clearQuery;
  }

  const execute = async (body: Record<string, any>) => {
    if (isUpdate) {
      return supabase.from('articles').update(body).eq('id', article.id).select();
    }
    return supabase.from('articles').insert([body]).select();
  };

  const result = await execute(payload);

  // Graceful fallback if the author_name column migration hasn't been applied in Supabase yet
  if (result.error && /author_name/i.test(result.error.message || '')) {
    const { author_name: _ignored, ...fallbackPayload } = payload;
    const retryResult = await execute(fallbackPayload);
    return { data: retryResult.data, error: retryResult.error };
  }

  return { data: result.data, error: result.error };
}

export async function setFeaturedArticle(
  articleId: string,
  featured = true
): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createClient();

    if (featured) {
      const { error: clearError } = await supabase
        .from('articles')
        .update({ is_featured: false })
        .eq('is_featured', true)
        .neq('id', articleId);

      if (clearError) {
        console.error('Failed to clear previous featured article:', clearError);
        return { success: false, error: clearError };
      }
    }

    const { error } = await supabase
      .from('articles')
      .update({ is_featured: featured })
      .eq('id', articleId);

    if (error) {
      console.error('Failed to update featured article:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || err };
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
    // Mark as manually edited so automated scraping preserves editorial customizations
    is_manually_edited: true,
    manual_override_fields: ['title', 'description', 'short_description', 'featured_image'],
  };

  if (event.id && !event.id.startsWith('evt-') && isNaN(Number(event.id))) {
    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', event.id)
      .select();
    return { data, error };
  } else {
    payload.source = 'manual';
    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select();
    return { data, error };
  }
}

export async function submitPublicEvent(event: {
  title: string;
  category: string;
  start_date: string;
  end_date?: string | null;
  venue_name: string;
  venue_address?: string;
  venue_city?: string;
  location_id?: string | null;
  price_type: 'free' | 'paid' | 'donation';
  price_from?: number | null;
  ticket_url?: string;
  hero_image_url?: string;
  short_description: string;
  full_description: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  submission_notes?: string;
}): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  
  // Safe unique slug
  const baseSlug = (event.title || 'evenement')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const timestamp = Date.now().toString().slice(-5);
  const slug = `${baseSlug}-${timestamp}`;

  const performances = [
    {
      type: 'submission_contact',
      contact_name: event.contact_name,
      contact_email: event.contact_email,
      contact_phone: event.contact_phone || '',
      submission_notes: event.submission_notes || '',
      submitted_at: new Date().toISOString(),
    }
  ];

  const payload: any = {
    title: event.title,
    slug,
    description: event.full_description,
    short_description: event.short_description,
    featured_image: event.hero_image_url || '/logo.png',
    start_date: event.start_date,
    end_date: event.end_date || null,
    venue_name: event.venue_name,
    venue_address: event.venue_address || 'Arnhem',
    venue_city: event.venue_city || 'Arnhem',
    location_id: event.location_id || null,
    price_type: event.price_type,
    price: event.price_from || 0,
    ticket_url: event.ticket_url || null,
    status: 'submitted', // ALWAYS submitted for external submissions
    source: 'external_submission',
    source_url: event.contact_email,
    performances,
    is_highlight: false,
    is_manually_edited: true,
  };

  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select();

  return { data, error };
}

export async function updateEventStatus(
  eventId: string,
  newStatus: 'published' | 'rejected' | 'draft' | 'submitted'
): Promise<{ success: boolean; error?: any }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('events')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId);

    if (error) {
      console.error('Failed to update event status in supabase:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || err };
  }
}

// Agenda Sources Management APIs
export async function getAgendaSources(): Promise<AgendaSource[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('agenda_sources')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data) {
      console.warn('Failed to load agenda sources from database:', error?.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error('getAgendaSources failed:', err);
    return [];
  }
}

export async function saveAgendaSource(source: Partial<AgendaSource>): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  const payload: any = {
    name: source.name,
    slug: source.slug,
    url: source.url,
    adapter_type: source.adapter_type || 'generic_jsonld',
    default_venue_name: source.default_venue_name,
    default_venue_address: source.default_venue_address,
    default_venue_city: source.default_venue_city || 'Arnhem',
    default_category_slug: source.default_category_slug || 'cultuur',
    sync_frequency: source.sync_frequency || 'bi-weekly',
    is_active: source.is_active ?? true,
  };

  if (source.id && !source.id.endsWith('-source')) {
    const { data, error } = await supabase
      .from('agenda_sources')
      .update(payload)
      .eq('id', source.id)
      .select();
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('agenda_sources')
      .insert([payload])
      .select();
    return { data, error };
  }
}

export async function toggleAgendaSource(id: string, is_active: boolean): Promise<{ data: any; error: any }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('agenda_sources')
    .update({ is_active })
    .eq('id', id)
    .select();
  return { data, error };
}

export async function getAgendaSyncLogs(sourceSlug?: string): Promise<AgendaSyncLog[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('agenda_sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);

    if (sourceSlug) {
      query = query.eq('source_slug', sourceSlug);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }
    return data;
  } catch (err) {
    console.error('getAgendaSyncLogs error:', err);
    return [];
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
