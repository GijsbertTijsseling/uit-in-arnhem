-- Migration: 20240101000002_agenda_scraper_schema.sql
-- Agenda Scraper, Bronnenbeheer & Synchronisatie Schema voor Uit in Arnhem

-- 1. AGENDA BRONNEN TABEL (Configuratie van externe podia)
CREATE TABLE IF NOT EXISTS public.agenda_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                             -- bijv. 'Luxor Live'
  slug TEXT NOT NULL UNIQUE,                      -- bijv. 'luxor'
  url TEXT NOT NULL,                              -- bijv. 'https://www.luxorlive.nl/agenda/'
  adapter_type TEXT NOT NULL,                     -- 'luxor', 'musis', 'posttheater', 'generic_jsonld'
  default_venue_name TEXT,                        -- bijv. 'Luxor Live'
  default_venue_address TEXT,                     -- bijv. 'Willemsplein 10'
  default_venue_city TEXT DEFAULT 'Arnhem',
  default_category_slug TEXT DEFAULT 'muziek',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_running BOOLEAN NOT NULL DEFAULT false,
  locked_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'bi-weekly',        -- 'daily', 'weekly', 'bi-weekly', 'monthly'
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT,                           -- 'success', 'warning', 'error'
  last_run_message TEXT,
  total_events_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. AGENDA SYNC LOGS TABEL (Audit historie en fouten per run)
CREATE TABLE IF NOT EXISTS public.agenda_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.agenda_sources(id) ON DELETE CASCADE,
  source_slug TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'warning', 'error')),
  items_scraped INT DEFAULT 0,
  items_inserted INT DEFAULT 0,
  items_updated INT DEFAULT 0,
  items_missing INT DEFAULT 0,
  items_cancelled INT DEFAULT 0,
  items_skipped INT DEFAULT 0,
  error_message TEXT,
  log_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. UITBREIDING VAN DE EVENTS TABEL
-- Status check constraints uitbreiden met 'missing'
ALTER TABLE public.events 
  DROP CONSTRAINT IF EXISTS events_status_check;

ALTER TABLE public.events 
  ADD CONSTRAINT events_status_check 
  CHECK (status IN ('draft', 'submitted', 'published', 'missing', 'cancelled'));

-- Kolommen toevoegen aan events voor scraper tracking, hashing, multi-date en overrides
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS source_id TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS content_hash TEXT,
  ADD COLUMN IF NOT EXISTS production_id TEXT,
  ADD COLUMN IF NOT EXISTS performances JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_manually_edited BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS manual_override_fields TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS missing_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS missing_since TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Unieke index op (source, source_id) voor geautomatiseerde events (voorkomt duplicaten)
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_source_unique 
  ON public.events(source, source_id) 
  WHERE source IS NOT NULL AND source != 'manual';

-- Extra indexen voor snelle lookups tijdens sync & agenda queries
CREATE INDEX IF NOT EXISTS idx_events_source ON public.events(source);
CREATE INDEX IF NOT EXISTS idx_events_production_id ON public.events(production_id);
CREATE INDEX IF NOT EXISTS idx_events_missing_count ON public.events(missing_count);
CREATE INDEX IF NOT EXISTS idx_agenda_sources_slug ON public.agenda_sources(slug);
CREATE INDEX IF NOT EXISTS idx_agenda_sources_is_active ON public.agenda_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_agenda_sync_logs_source ON public.agenda_sync_logs(source_slug, created_at DESC);

-- Trigger voor updated_at op agenda_sources
DROP TRIGGER IF EXISTS set_agenda_sources_updated_at ON public.agenda_sources;
CREATE TRIGGER set_agenda_sources_updated_at 
  BEFORE UPDATE ON public.agenda_sources 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies voor agenda_sources en sync logs
ALTER TABLE public.agenda_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agenda sources viewable by authenticated users and editors"
  ON public.agenda_sources FOR SELECT
  USING (true);

CREATE POLICY "Only admins and editors can manage agenda sources"
  ON public.agenda_sources FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "Agenda sync logs viewable by editors/admins"
  ON public.agenda_sync_logs FOR SELECT
  USING (public.is_admin_or_editor());

CREATE POLICY "Agenda sync logs manageable by editors/admins"
  ON public.agenda_sync_logs FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- 4. SEED STANDAARD ARNHEMSE CULTURELE PODIA
INSERT INTO public.agenda_sources (
  name, slug, url, adapter_type, default_venue_name, default_venue_address, default_category_slug, is_active
)
VALUES
  (
    'Musis & Stadstheater Arnhem',
    'musis',
    'https://www.musisenstadstheater.nl/api/events',
    'musis',
    'Musis & Stadstheater',
    'Velperbinnensingel 15',
    'theater-dans',
    true
  ),
  (
    'Luxor Live',
    'luxor',
    'https://www.luxorlive.nl/agenda/',
    'luxor',
    'Luxor Live',
    'Willemsplein 10',
    'muziek',
    true
  ),
  (
    'Posttheater',
    'posttheater',
    'https://www.posttheater.nl/agenda',
    'posttheater',
    'Posttheater',
    'Rosendaalsestraat 27',
    'theater-dans',
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  adapter_type = EXCLUDED.adapter_type,
  default_venue_name = EXCLUDED.default_venue_name,
  default_venue_address = EXCLUDED.default_venue_address,
  default_category_slug = EXCLUDED.default_category_slug;

