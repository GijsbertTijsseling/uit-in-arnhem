-- Migration: 20240101000000_initial_schema.sql
-- Uit in Arnhem Platform Database Schema & RLS

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'contributor' CHECK (role IN ('admin', 'editor', 'contributor')),
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CATEGORIES TABLE (for articles / editorial)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. EVENT CATEGORIES TABLE (for agenda / events)
CREATE TABLE IF NOT EXISTS public.event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  layout_template TEXT NOT NULL DEFAULT 'standard',
  cta_block JSONB,
  tags TEXT[] DEFAULT '{}'::text[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. EVENTS TABLE (Agenda)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  venue_name TEXT,
  venue_address TEXT,
  venue_city TEXT DEFAULT 'Arnhem',
  price_type TEXT NOT NULL DEFAULT 'unknown' CHECK (price_type IN ('free', 'paid', 'donation', 'unknown')),
  price NUMERIC(10,2),
  ticket_url TEXT,
  category_id UUID REFERENCES public.event_categories(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_highlight BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'submitted', 'published', 'cancelled')),
  featured_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  alt_text TEXT,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(is_featured);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date ASC);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_highlight ON public.events(is_highlight);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_event_categories_slug ON public.event_categories(slug);
CREATE INDEX IF NOT EXISTS idx_media_storage_path ON public.media_assets(storage_path);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_event_categories_updated_at ON public.event_categories;
CREATE TRIGGER set_event_categories_updated_at BEFORE UPDATE ON public.event_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for auth.users -> profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'contributor')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$;

-- Helper function to check admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile or editor/admin update any" ON public.profiles;
CREATE POLICY "Users can update own profile or editor/admin update any"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin_or_editor())
  WITH CHECK (auth.uid() = id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- 2. CATEGORIES POLICIES
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Editors and Admins can insert categories" ON public.categories;
CREATE POLICY "Editors and Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Editors and Admins can update categories" ON public.categories;
CREATE POLICY "Editors and Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Editors and Admins can delete categories" ON public.categories;
CREATE POLICY "Editors and Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin_or_editor());

-- 3. EVENT CATEGORIES POLICIES
DROP POLICY IF EXISTS "Event categories are viewable by everyone" ON public.event_categories;
CREATE POLICY "Event categories are viewable by everyone"
  ON public.event_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Editors and Admins can insert event categories" ON public.event_categories;
CREATE POLICY "Editors and Admins can insert event categories"
  ON public.event_categories FOR INSERT
  WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Editors and Admins can update event categories" ON public.event_categories;
CREATE POLICY "Editors and Admins can update event categories"
  ON public.event_categories FOR UPDATE
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Editors and Admins can delete event categories" ON public.event_categories;
CREATE POLICY "Editors and Admins can delete event categories"
  ON public.event_categories FOR DELETE
  USING (public.is_admin_or_editor());

-- 4. ARTICLES POLICIES
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON public.articles;
CREATE POLICY "Published articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.articles;
CREATE POLICY "Authenticated users can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.uid() = author_id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Authors and editors/admins can update articles" ON public.articles;
CREATE POLICY "Authors and editors/admins can update articles"
  ON public.articles FOR UPDATE
  USING (auth.uid() = author_id OR public.is_admin_or_editor())
  WITH CHECK (auth.uid() = author_id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Authors and editors/admins can delete articles" ON public.articles;
CREATE POLICY "Authors and editors/admins can delete articles"
  ON public.articles FOR DELETE
  USING (auth.uid() = author_id OR public.is_admin_or_editor());

-- 5. EVENTS POLICIES
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON public.events;
CREATE POLICY "Published events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status = 'published' OR auth.uid() = organizer_id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Organizers and editors/admins can update events" ON public.events;
CREATE POLICY "Organizers and editors/admins can update events"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id OR public.is_admin_or_editor())
  WITH CHECK (auth.uid() = organizer_id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Organizers and editors/admins can delete events" ON public.events;
CREATE POLICY "Organizers and editors/admins can delete events"
  ON public.events FOR DELETE
  USING (auth.uid() = organizer_id OR public.is_admin_or_editor());

-- 6. MEDIA ASSETS POLICIES
DROP POLICY IF EXISTS "Media assets are viewable by everyone" ON public.media_assets;
CREATE POLICY "Media assets are viewable by everyone"
  ON public.media_assets FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert media assets" ON public.media_assets;
CREATE POLICY "Authenticated users can insert media assets"
  ON public.media_assets FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Uploaders and editors/admins can update media assets" ON public.media_assets;
CREATE POLICY "Uploaders and editors/admins can update media assets"
  ON public.media_assets FOR UPDATE
  USING (auth.uid() = uploader_id OR public.is_admin_or_editor())
  WITH CHECK (auth.uid() = uploader_id OR public.is_admin_or_editor());

DROP POLICY IF EXISTS "Uploaders and editors/admins can delete media assets" ON public.media_assets;
CREATE POLICY "Uploaders and editors/admins can delete media assets"
  ON public.media_assets FOR DELETE
  USING (auth.uid() = uploader_id OR public.is_admin_or_editor());

-- ==========================================
-- STORAGE CONFIGURATION
-- ==========================================

-- Ensure storage bucket 'media' exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];

-- Storage RLS policies for 'media' bucket
DROP POLICY IF EXISTS "Public media bucket viewable by everyone" ON storage.objects;
CREATE POLICY "Public media bucket viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated users can upload to media bucket" ON storage.objects;
CREATE POLICY "Authenticated users can upload to media bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

DROP POLICY IF EXISTS "Uploaders or editors/admins can update files in media bucket" ON storage.objects;
CREATE POLICY "Uploaders or editors/admins can update files in media bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND (auth.uid() = owner OR public.is_admin_or_editor() OR auth.role() = 'service_role'));

DROP POLICY IF EXISTS "Uploaders or editors/admins can delete files in media bucket" ON storage.objects;
CREATE POLICY "Uploaders or editors/admins can delete files in media bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND (auth.uid() = owner OR public.is_admin_or_editor() OR auth.role() = 'service_role'));

-- Public bucket visibility
DROP POLICY IF EXISTS "Public buckets are viewable by everyone" ON storage.buckets;
CREATE POLICY "Public buckets are viewable by everyone" ON storage.buckets
  FOR SELECT USING (public = true);

-- Role schema grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
