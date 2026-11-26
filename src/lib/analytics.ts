import { createServerSupabaseClient } from '@/lib/supabase/server';

export type AnalyticsEntityType = 'site' | 'page' | 'event' | 'article' | 'location' | 'wijk';
export type AnalyticsPeriod = 'today' | '7d' | '30d' | '90d' | 'all';

export interface AnalyticsDailyPoint {
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
}

export interface AnalyticsItemStat {
  path: string;
  entityType: AnalyticsEntityType;
  entitySlug: string | null;
  title: string;
  views: number;
  uniqueVisitors: number;
}

export interface AnalyticsOverview {
  period: AnalyticsPeriod;
  totalViews: number;
  uniqueVisitorsToday: number;
  uniqueVisitorsPeriod: number;
  dailySeries: AnalyticsDailyPoint[];
  topPages: AnalyticsItemStat[];
  topEvents: AnalyticsItemStat[];
  topArticles: AnalyticsItemStat[];
  topLocations: AnalyticsItemStat[];
  migrationPending?: boolean;
}

interface DailyStatRow {
  stat_date: string;
  path: string;
  entity_type: AnalyticsEntityType;
  entity_slug: string | null;
  views: number;
  unique_visitors: number;
}

export interface ParsedTrackedPath {
  path: string;
  entityType: Exclude<AnalyticsEntityType, 'site'>;
  entitySlug: string | null;
}

const EXCLUDED_PREFIXES = [
  '/admin',
  '/api',
  '/login',
  '/register',
  '/auth',
  '/wachtwoord-',
  '/_next',
];

const STATIC_PAGE_TITLES: Record<string, string> = {
  '/': 'Homepage',
  '/agenda': 'Uitagenda',
  '/agenda/aanmelden': 'Evenement aanmelden',
  '/artikelen': 'Artikelen & Verhalen',
  '/locaties': 'Vaste Locaties',
  '/wijken': 'Wijken van Arnhem',
  '/zien-en-doen': 'Zien & Doen',
  '/plan-je-bezoek': 'Plan je bezoek',
  '/over-ons': 'Over ons',
  '/contact': 'Contact',
  '/evenement-aanmelden': 'Evenement aanmelden',
};

const BOT_USER_AGENT_REGEX =
  /bot|crawl|spider|slurp|mediapartners|googlebot|bingbot|yandex|baiduspider|duckduckbot|applebot|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slackbot|pinterest|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|anthropic-ai|ccbot|headlesschrome|phantomjs|playwright|puppeteer|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|statuscake|curl\/|wget\/|python-requests|python-urllib|axios\/|node-fetch|go-http-client|httpie|postmanruntime/i;

export function getAmsterdamDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

function addDaysToDateString(dateStr: string, deltaDays: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + deltaDays));
  return utc.toISOString().slice(0, 10);
}

export function isExcludedPath(pathname: string): boolean {
  if (!pathname || !pathname.startsWith('/')) {
    return true;
  }

  const lower = pathname.toLowerCase();
  if (EXCLUDED_PREFIXES.some((prefix) => lower === prefix || lower.startsWith(`${prefix}/`) || (prefix.endsWith('-') && lower.startsWith(prefix)))) {
    return true;
  }

  // Sluit bestanden met extensies uit (bijv. /favicon.ico, /robots.txt, /logo.png)
  if (/\.[a-z0-9]{2,6}$/i.test(lower)) {
    return true;
  }

  return false;
}

export function parseTrackedPath(rawPathname: string): ParsedTrackedPath | null {
  if (!rawPathname || typeof rawPathname !== 'string') {
    return null;
  }

  // Strip query string en hash
  let normalized = rawPathname.split('?')[0].split('#')[0].trim();
  if (!normalized.startsWith('/')) {
    return null;
  }

  // Normaliseer dubbele slashes en trailing slash (behalve root '/')
  normalized = normalized.replace(/\/{2,}/g, '/');
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  if (normalized.length > 255 || isExcludedPath(normalized)) {
    return null;
  }

  const segments = normalized.split('/').filter(Boolean);

  if (segments[0] === 'agenda' && segments.length === 2 && segments[1] !== 'aanmelden') {
    return {
      path: normalized,
      entityType: 'event',
      entitySlug: segments[1],
    };
  }

  if (segments[0] === 'artikelen' && segments.length === 2) {
    return {
      path: normalized,
      entityType: 'article',
      entitySlug: segments[1],
    };
  }

  if ((segments[0] === 'locatie' || segments[0] === 'locaties') && segments.length === 2) {
    return {
      path: `/locatie/${segments[1]}`,
      entityType: 'location',
      entitySlug: segments[1],
    };
  }

  if (segments[0] === 'wijken' && segments.length === 2) {
    return {
      path: normalized,
      entityType: 'wijk',
      entitySlug: segments[1],
    };
  }

  return {
    path: normalized,
    entityType: 'page',
    entitySlug: null,
  };
}

export function isBotOrPrefetch(headers: Headers): boolean {
  // Filter Next.js router prefetches en browser prefetches
  if (
    headers.get('next-router-prefetch') !== null ||
    headers.get('x-middleware-prefetch') !== null
  ) {
    return true;
  }

  const purpose = (headers.get('purpose') || headers.get('x-purpose') || '').toLowerCase();
  const secPurpose = (headers.get('sec-purpose') || '').toLowerCase();
  if (purpose.includes('prefetch') || secPurpose.includes('prefetch') || secPurpose.includes('prerender')) {
    return true;
  }

  const userAgent = headers.get('user-agent')?.trim() || '';
  if (!userAgent) {
    return true;
  }

  return BOT_USER_AGENT_REGEX.test(userAgent);
}

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === '42P01' || error.code === 'PGRST205') {
    return true;
  }
  const msg = (error.message || '').toLowerCase();
  return (
    msg.includes('analytics_daily_stats') &&
    (msg.includes('does not exist') || msg.includes('schema cache') || msg.includes('could not find'))
  );
}

function getPeriodDays(period: AnalyticsPeriod): number | null {
  switch (period) {
    case 'today':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case 'all':
      return null;
  }
}

function formatSlugFallback(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFallbackTitle(path: string, entityType: AnalyticsEntityType, entitySlug: string | null): string {
  if (STATIC_PAGE_TITLES[path]) {
    return STATIC_PAGE_TITLES[path];
  }
  if (entityType === 'wijk' && entitySlug) {
    return `Wijk: ${formatSlugFallback(entitySlug)}`;
  }
  if (entitySlug) {
    return formatSlugFallback(entitySlug);
  }
  return path;
}

function createEmptyOverview(period: AnalyticsPeriod, migrationPending = false): AnalyticsOverview {
  return {
    period,
    totalViews: 0,
    uniqueVisitorsToday: 0,
    uniqueVisitorsPeriod: 0,
    dailySeries: [],
    topPages: [],
    topEvents: [],
    topArticles: [],
    topLocations: [],
    migrationPending,
  };
}

export async function getAnalyticsOverview(
  period: AnalyticsPeriod = '30d'
): Promise<AnalyticsOverview> {
  const validPeriod: AnalyticsPeriod = ['today', '7d', '30d', '90d', 'all'].includes(period)
    ? period
    : '30d';

  try {
    const supabase = await createServerSupabaseClient();
    const today = getAmsterdamDateString();
    const days = getPeriodDays(validPeriod);
    const startDate = days !== null ? addDaysToDateString(today, -(days - 1)) : null;

    let query = supabase
      .from('analytics_daily_stats')
      .select('stat_date, path, entity_type, entity_slug, views, unique_visitors')
      .order('stat_date', { ascending: true });

    if (startDate) {
      query = query.gte('stat_date', startDate);
    }

    const { data, error } = await query;

    if (error) {
      if (isMissingTableError(error)) {
        return createEmptyOverview(validPeriod, true);
      }
      console.error('Error fetching analytics overview:', error.message);
      return createEmptyOverview(validPeriod, false);
    }

    const rows = (data || []) as DailyStatRow[];

    // Dagelijkse site-reeks opbouwen
    const siteByDate = new Map<string, { views: number; uniqueVisitors: number }>();
    const aggregatedByPath = new Map<
      string,
      {
        path: string;
        entityType: AnalyticsEntityType;
        entitySlug: string | null;
        views: number;
        uniqueVisitors: number;
      }
    >();

    for (const row of rows) {
      if (row.path === '__site__' || row.entity_type === 'site') {
        const existing = siteByDate.get(row.stat_date);
        siteByDate.set(row.stat_date, {
          views: (existing?.views || 0) + (row.views || 0),
          uniqueVisitors: (existing?.uniqueVisitors || 0) + (row.unique_visitors || 0),
        });
        continue;
      }

      const existing = aggregatedByPath.get(row.path);
      if (existing) {
        existing.views += row.views || 0;
        existing.uniqueVisitors += row.unique_visitors || 0;
      } else {
        aggregatedByPath.set(row.path, {
          path: row.path,
          entityType: row.entity_type,
          entitySlug: row.entity_slug,
          views: row.views || 0,
          uniqueVisitors: row.unique_visitors || 0,
        });
      }
    }

    // Vul aaneengesloten dagen in voor de trendgrafiek
    const dailySeries: AnalyticsDailyPoint[] = [];
    if (days !== null && startDate) {
      for (let i = 0; i < days; i++) {
        const date = addDaysToDateString(startDate, i);
        const point = siteByDate.get(date);
        dailySeries.push({
          date,
          views: point?.views || 0,
          uniqueVisitors: point?.uniqueVisitors || 0,
        });
      }
    } else {
      const sortedDates = Array.from(siteByDate.keys()).sort();
      for (const date of sortedDates) {
        const point = siteByDate.get(date)!;
        dailySeries.push({
          date,
          views: point.views,
          uniqueVisitors: point.uniqueVisitors,
        });
      }
    }

    let totalViews = 0;
    let uniqueVisitorsPeriod = 0;
    for (const point of siteByDate.values()) {
      totalViews += point.views;
      uniqueVisitorsPeriod += point.uniqueVisitors;
    }

    const uniqueVisitorsToday = siteByDate.get(today)?.uniqueVisitors || 0;

    // Verzamel slugs om titels op te halen uit Supabase
    const eventSlugs = new Set<string>();
    const articleSlugs = new Set<string>();
    const locationSlugs = new Set<string>();

    for (const item of aggregatedByPath.values()) {
      if (!item.entitySlug) continue;
      if (item.entityType === 'event') eventSlugs.add(item.entitySlug);
      else if (item.entityType === 'article') articleSlugs.add(item.entitySlug);
      else if (item.entityType === 'location') locationSlugs.add(item.entitySlug);
    }

    const [eventsRes, articlesRes, locationsRes] = await Promise.all([
      eventSlugs.size > 0
        ? supabase.from('events').select('slug, title').in('slug', Array.from(eventSlugs))
        : Promise.resolve({ data: [] as Array<{ slug: string; title: string }> }),
      articleSlugs.size > 0
        ? supabase.from('articles').select('slug, title').in('slug', Array.from(articleSlugs))
        : Promise.resolve({ data: [] as Array<{ slug: string; title: string }> }),
      locationSlugs.size > 0
        ? supabase.from('locations').select('slug, name').in('slug', Array.from(locationSlugs))
        : Promise.resolve({ data: [] as Array<{ slug: string; name: string }> }),
    ]);

    const eventTitles = new Map<string, string>(
      (eventsRes.data || []).map((e) => [e.slug, e.title])
    );
    const articleTitles = new Map<string, string>(
      (articlesRes.data || []).map((a) => [a.slug, a.title])
    );
    const locationTitles = new Map<string, string>(
      (locationsRes.data || []).map((l) => [l.slug, l.name])
    );

    const allItems: AnalyticsItemStat[] = Array.from(aggregatedByPath.values())
      .map((item) => {
        let title: string | undefined;
        if (item.entityType === 'event' && item.entitySlug) {
          title = eventTitles.get(item.entitySlug);
        } else if (item.entityType === 'article' && item.entitySlug) {
          title = articleTitles.get(item.entitySlug);
        } else if (item.entityType === 'location' && item.entitySlug) {
          title = locationTitles.get(item.entitySlug);
        }

        return {
          path: item.path,
          entityType: item.entityType,
          entitySlug: item.entitySlug,
          title: title || getFallbackTitle(item.path, item.entityType, item.entitySlug),
          views: item.views,
          uniqueVisitors: item.uniqueVisitors,
        };
      })
      .sort((a, b) => b.views - a.views || b.uniqueVisitors - a.uniqueVisitors);

    return {
      period: validPeriod,
      totalViews,
      uniqueVisitorsToday,
      uniqueVisitorsPeriod,
      dailySeries,
      topPages: allItems.slice(0, 50),
      topEvents: allItems.filter((i) => i.entityType === 'event').slice(0, 50),
      topArticles: allItems.filter((i) => i.entityType === 'article').slice(0, 50),
      topLocations: allItems.filter((i) => i.entityType === 'location').slice(0, 50),
      migrationPending: false,
    };
  } catch (err) {
    console.error('Failed to get analytics overview:', err);
    return createEmptyOverview(validPeriod, false);
  }
}

export async function getEntityViewCounts(
  entityType: 'event' | 'article' | 'location',
  days = 30
): Promise<Record<string, { views: number; uniqueVisitors: number }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const today = getAmsterdamDateString();
    const startDate = days > 0 ? addDaysToDateString(today, -(days - 1)) : null;

    let query = supabase
      .from('analytics_daily_stats')
      .select('entity_slug, views, unique_visitors')
      .eq('entity_type', entityType)
      .not('entity_slug', 'is', null);

    if (startDate) {
      query = query.gte('stat_date', startDate);
    }

    const { data, error } = await query;

    if (error) {
      if (!isMissingTableError(error)) {
        console.error(`Error fetching ${entityType} view counts:`, error.message);
      }
      return {};
    }

    const counts: Record<string, { views: number; uniqueVisitors: number }> = {};

    for (const row of data || []) {
      const slug = row.entity_slug as string | null;
      if (!slug) continue;

      if (!counts[slug]) {
        counts[slug] = { views: 0, uniqueVisitors: 0 };
      }
      counts[slug].views += row.views || 0;
      counts[slug].uniqueVisitors += row.unique_visitors || 0;
    }

    return counts;
  } catch (err) {
    console.error(`Failed to get ${entityType} view counts:`, err);
    return {};
  }
}
