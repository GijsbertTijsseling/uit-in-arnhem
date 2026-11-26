-- Migration: 20261126000003_public_event_submissions_and_rejected_status.sql
-- 1. Allow 'rejected' status on public.events (used by CMS review queue)
-- 2. Allow public (anon + authenticated) visitors to submit events for editorial review
-- 3. Allow public visitors to upload event submission photos to media bucket under uploads/submissions/

-- 1. Extend events_status_check to include 'rejected'
ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_status_check;

ALTER TABLE public.events
  ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'submitted', 'published', 'rejected', 'missing', 'cancelled'));

-- 2. Allow anyone to submit an external event for review (status='submitted' only)
DROP POLICY IF EXISTS "Anyone can submit events for review" ON public.events;
CREATE POLICY "Anyone can submit events for review"
  ON public.events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'submitted'
    AND source = 'external_submission'
    AND is_highlight = false
  );

-- 3. Allow public visitors to upload event submission images to uploads/submissions/*
DROP POLICY IF EXISTS "Public visitors can upload event submission images" ON storage.objects;
CREATE POLICY "Public visitors can upload event submission images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'media'
    AND name LIKE 'uploads/submissions/%'
  );
