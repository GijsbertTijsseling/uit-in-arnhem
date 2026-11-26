import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getAmsterdamDateString,
  isBotOrPrefetch,
  parseTrackedPath,
} from '@/lib/analytics';

export const runtime = 'nodejs';

const FALLBACK_SUPABASE_URL = 'https://ldvclkymaiopytbkjulp.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_v4FLLzJvOTLRr_FNyqreQg_pWyBfHvp';

// In-memory cache voor de dagelijkse salt (max 1 entry voor vandaag)
const dailySaltCache = new Map<string, string>();

function getTrackingSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    FALLBACK_SUPABASE_ANON_KEY;

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getDailySalt(
  supabase: ReturnType<typeof getTrackingSupabaseClient>,
  statDate: string
): Promise<string | null> {
  const cached = dailySaltCache.get(statDate);
  if (cached) {
    return cached;
  }

  const { data, error } = await supabase.rpc('get_or_create_daily_salt', {
    p_stat_date: statDate,
  });

  if (error || typeof data !== 'string' || !data) {
    return null;
  }

  // Houd alleen de huidige dag in het geheugen
  dailySaltCache.clear();
  dailySaltCache.set(statDate, data);
  return data;
}

function extractClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    if (isBotOrPrefetch(req.headers)) {
      return new NextResponse(null, { status: 204 });
    }

    let rawPath = '';
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      rawPath = typeof body?.path === 'string' ? body.path : '';
    } else {
      const text = await req.text();
      if (text) {
        const parsedBody = JSON.parse(text);
        rawPath = typeof parsedBody?.path === 'string' ? parsedBody.path : '';
      }
    }

    const parsed = parseTrackedPath(rawPath);
    if (!parsed) {
      return new NextResponse(null, { status: 204 });
    }

    const statDate = getAmsterdamDateString();
    const supabase = getTrackingSupabaseClient();
    const dailySalt = await getDailySalt(supabase, statDate);

    if (!dailySalt) {
      // Migratie mogelijk nog niet gedraaid; faal stil met 204
      return new NextResponse(null, { status: 204 });
    }

    // Bereken cookieloze dag-hash uitsluitend in Node-geheugen; sla IP/UA nooit op en log ze nooit
    const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || 'uitinarnhem.nl')
      .split(',')[0]
      .trim()
      .toLowerCase();
    const ip = extractClientIp(req.headers);
    const ua = req.headers.get('user-agent') || '';
    const acceptLang = req.headers.get('accept-language') || '';
    const secChUaPlatform = req.headers.get('sec-ch-ua-platform') || '';

    const visitorHash = createHash('sha256')
      .update(`${dailySalt}|${host}|${ip}|${ua}|${acceptLang}|${secChUaPlatform}`)
      .digest('hex');

    await supabase.rpc('record_page_view', {
      p_stat_date: statDate,
      p_path: parsed.path,
      p_entity_type: parsed.entityType,
      p_entity_slug: parsed.entitySlug,
      p_visitor_hash: visitorHash,
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // Tracking mag nooit gebruikersfouten of zichtbare foutmeldingen veroorzaken
    return new NextResponse(null, { status: 204 });
  }
}
