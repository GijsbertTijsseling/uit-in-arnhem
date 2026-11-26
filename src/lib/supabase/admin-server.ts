import { createServerSupabaseClient } from './server';
import { mapAdminEventItem, mapArticleItem } from './api';
import { AgendaItem, Article } from '@/types';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAllEventsForAdminServer(
  options: { status?: string } = {}
): Promise<AgendaItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('events')
      .select(
        '*, event_categories(name, slug), locations(id, slug, name, address, postal_code, city, website, coordinates, featured_image)'
      )
      .order('created_at', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error('Error fetching admin events (server):', error);
      return [];
    }

    return data.map(mapAdminEventItem);
  } catch (err) {
    console.error('Failed to get admin events (server):', err);
    return [];
  }
}

export async function getEventByIdOrSlugForAdminServer(
  idOrSlug: string
): Promise<AgendaItem | null> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('events')
      .select(
        '*, event_categories(name, slug), locations(id, slug, name, address, postal_code, city, website, coordinates, featured_image)'
      );

    if (UUID_REGEX.test(idOrSlug)) {
      query = query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) {
      if (error) {
        console.error('Error fetching admin event by id/slug (server):', error);
      }
      return null;
    }

    return mapAdminEventItem(data);
  } catch (err) {
    console.error('Failed to get admin event by id/slug (server):', err);
    return null;
  }
}

export async function getAllArticlesForAdminServer(): Promise<Article[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(name, slug), profiles(id, full_name)')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching admin articles (server):', error);
      return [];
    }

    return data.map(mapArticleItem);
  } catch (err) {
    console.error('Failed to get admin articles (server):', err);
    return [];
  }
}

export async function getArticleByIdOrSlugForAdminServer(
  idOrSlug: string
): Promise<Article | null> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('articles')
      .select('*, categories(name, slug), profiles(id, full_name)');

    if (UUID_REGEX.test(idOrSlug)) {
      query = query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.maybeSingle();
    if (data) {
      return mapArticleItem(data);
    }
    if (error) {
      console.error('Error fetching admin article by id/slug (server):', error);
    }
    return null;
  } catch (err) {
    console.error('Failed to get admin article by id/slug (server):', err);
    return null;
  }
}
