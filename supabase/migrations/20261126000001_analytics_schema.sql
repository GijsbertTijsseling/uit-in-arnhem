-- Migration: 20261126000001_analytics_schema.sql
-- Cookieloze, privacy-vriendelijke bezoekersstatistieken voor Uit in Arnhem

-- Zorg dat pgcrypto beschikbaar is voor cryptografisch willekeurige dag-salts
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Dagelijks geaggregeerde paginastatistieken (blijvend, zonder persoonsgegevens)
CREATE TABLE IF NOT EXISTS public.analytics_daily_stats (
  stat_date DATE NOT NULL,
  path TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('site', 'page', 'event', 'article', 'location', 'wijk')),
  entity_slug TEXT,
  views INT NOT NULL DEFAULT 0,
  unique_visitors INT NOT NULL DEFAULT 0,
  PRIMARY KEY (stat_date, path)
);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_stats_entity
  ON public.analytics_daily_stats (entity_type, entity_slug);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_stats_date
  ON public.analytics_daily_stats (stat_date DESC);

-- 2. Tijdelijke deduplicatietabel voor unieke dagbezoekers (max 24-48u bewaard, alleen SHA-256 hash)
CREATE TABLE IF NOT EXISTS public.analytics_daily_visitors (
  stat_date DATE NOT NULL,
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  PRIMARY KEY (stat_date, path, visitor_hash)
);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_visitors_date
  ON public.analytics_daily_visitors (stat_date);

-- 3. Dagelijks roterende random salt (werkt over meerdere serverless instances)
CREATE TABLE IF NOT EXISTS public.analytics_daily_salts (
  stat_date DATE PRIMARY KEY,
  salt TEXT NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) & RECHTEN
-- ==========================================

ALTER TABLE public.analytics_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_salts ENABLE ROW LEVEL SECURITY;

-- Alleen admins en editors mogen geaggregeerde statistieken lezen
DROP POLICY IF EXISTS "Admins and editors can view analytics stats" ON public.analytics_daily_stats;
CREATE POLICY "Admins and editors can view analytics stats"
  ON public.analytics_daily_stats FOR SELECT
  USING (public.is_admin_or_editor());

-- Geen publieke policies op analytics_daily_visitors en analytics_daily_salts
-- Beperk directe tabelrechten voor anon en authenticated
REVOKE ALL ON public.analytics_daily_stats FROM anon, authenticated;
GRANT SELECT ON public.analytics_daily_stats TO authenticated;

REVOKE ALL ON public.analytics_daily_visitors FROM anon, authenticated;
REVOKE ALL ON public.analytics_daily_salts FROM anon, authenticated;

-- ==========================================
-- SECURITY DEFINER RPC-FUNCTIES
-- ==========================================

-- Haal of maak de dag-salt aan en ruim oude salts en visitor-hashes (> 1 dag oud) direct op
CREATE OR REPLACE FUNCTION public.get_or_create_daily_salt(
  p_stat_date DATE DEFAULT (timezone('Europe/Amsterdam', now()))::date
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_salt TEXT;
BEGIN
  -- Ruim verlopen salts en tijdelijke dag-hashes op
  DELETE FROM public.analytics_daily_salts
  WHERE stat_date < p_stat_date - INTERVAL '1 day';

  DELETE FROM public.analytics_daily_visitors
  WHERE stat_date < p_stat_date - INTERVAL '1 day';

  SELECT salt INTO v_salt
  FROM public.analytics_daily_salts
  WHERE stat_date = p_stat_date;

  IF v_salt IS NULL THEN
    INSERT INTO public.analytics_daily_salts (stat_date, salt)
    VALUES (p_stat_date, encode(gen_random_bytes(32), 'hex'))
    ON CONFLICT (stat_date) DO NOTHING;

    SELECT salt INTO v_salt
    FROM public.analytics_daily_salts
    WHERE stat_date = p_stat_date;
  END IF;

  RETURN v_salt;
END;
$$;

-- Registreer een paginaweergave atomair voor zowel het specifieke pad als site-totaal ('__site__')
CREATE OR REPLACE FUNCTION public.record_page_view(
  p_stat_date DATE,
  p_path TEXT,
  p_entity_type TEXT,
  p_entity_slug TEXT,
  p_visitor_hash TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_new_path_visitor INT := 0;
  v_is_new_site_visitor INT := 0;
BEGIN
  IF p_path IS NULL OR length(trim(p_path)) = 0 OR length(p_path) > 255 THEN
    RETURN;
  END IF;

  IF p_visitor_hash IS NULL OR length(p_visitor_hash) <> 64 THEN
    RETURN;
  END IF;

  IF p_entity_type NOT IN ('page', 'event', 'article', 'location', 'wijk') THEN
    RETURN;
  END IF;

  -- 1. Pagina-specifieke unieke bezoeker en view
  INSERT INTO public.analytics_daily_visitors (stat_date, path, visitor_hash)
  VALUES (p_stat_date, p_path, p_visitor_hash)
  ON CONFLICT (stat_date, path, visitor_hash) DO NOTHING;

  GET DIAGNOSTICS v_is_new_path_visitor = ROW_COUNT;

  INSERT INTO public.analytics_daily_stats (
    stat_date,
    path,
    entity_type,
    entity_slug,
    views,
    unique_visitors
  )
  VALUES (
    p_stat_date,
    p_path,
    p_entity_type,
    p_entity_slug,
    1,
    v_is_new_path_visitor
  )
  ON CONFLICT (stat_date, path) DO UPDATE SET
    views = public.analytics_daily_stats.views + 1,
    unique_visitors = public.analytics_daily_stats.unique_visitors + EXCLUDED.unique_visitors,
    entity_type = EXCLUDED.entity_type,
    entity_slug = COALESCE(EXCLUDED.entity_slug, public.analytics_daily_stats.entity_slug);

  -- 2. Site-brede unieke dagbezoeker en totaal aantal views
  INSERT INTO public.analytics_daily_visitors (stat_date, path, visitor_hash)
  VALUES (p_stat_date, '__site__', p_visitor_hash)
  ON CONFLICT (stat_date, path, visitor_hash) DO NOTHING;

  GET DIAGNOSTICS v_is_new_site_visitor = ROW_COUNT;

  INSERT INTO public.analytics_daily_stats (
    stat_date,
    path,
    entity_type,
    entity_slug,
    views,
    unique_visitors
  )
  VALUES (
    p_stat_date,
    '__site__',
    'site',
    NULL,
    1,
    v_is_new_site_visitor
  )
  ON CONFLICT (stat_date, path) DO UPDATE SET
    views = public.analytics_daily_stats.views + 1,
    unique_visitors = public.analytics_daily_stats.unique_visitors + EXCLUDED.unique_visitors;
END;
$$;

-- Beperk uitvoerrechten expliciet
REVOKE ALL ON FUNCTION public.get_or_create_daily_salt(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_or_create_daily_salt(DATE) TO anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.record_page_view(DATE, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_page_view(DATE, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
