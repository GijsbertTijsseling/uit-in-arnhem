-- Migration: 20261123000001_article_author_and_profile_names.sql
-- Add first_name / last_name to profiles and author_name to articles

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Update auth.users -> public.profiles trigger to store first_name, last_name and full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_full_name TEXT;
BEGIN
  v_first_name := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'first_name', '')), '');
  v_last_name := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'last_name', '')), '');

  IF v_first_name IS NOT NULL AND v_last_name IS NOT NULL THEN
    v_full_name := v_first_name || ' ' || v_last_name;
  ELSE
    v_full_name := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')), '');
  END IF;

  INSERT INTO public.profiles (id, email, first_name, last_name, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    v_first_name,
    v_last_name,
    COALESCE(v_full_name, split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'contributor')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
