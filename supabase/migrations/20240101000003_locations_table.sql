-- Migration: 20240101000002_locations_table.sql
-- Fixed Locations / Venues table for Uit in Arnhem

CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT NOT NULL DEFAULT 'Arnhem',
  country TEXT NOT NULL DEFAULT 'Nederland',
  phone TEXT,
  website TEXT,
  email TEXT,
  description TEXT,
  featured_image TEXT,
  coordinates JSONB,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_locations_slug ON public.locations(slug);
CREATE INDEX IF NOT EXISTS idx_locations_name ON public.locations(name);

-- Trigger to auto-update updated_at timestamp
DROP TRIGGER IF EXISTS set_locations_updated_at ON public.locations;
CREATE TRIGGER set_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add location_id to events table if not already existing
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_location_id ON public.events(location_id);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access for locations" ON public.locations;
DROP POLICY IF EXISTS "Authenticated users with admin/editor can insert locations" ON public.locations;
DROP POLICY IF EXISTS "Authenticated users with admin/editor can update locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can delete locations" ON public.locations;

-- RLS Policies
CREATE POLICY "Public read access for locations" ON public.locations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users with admin/editor can insert locations" ON public.locations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Authenticated users with admin/editor can update locations" ON public.locations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete locations" ON public.locations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

