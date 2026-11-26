-- Migration: 20261126000002_cleanup_article_categories.sql
-- Consolidate article categories to the 6 official editorial pillars and remove unused legacy WP categories.

-- 1. Ensure the 6 official editorial categories exist with clean names and descriptions
INSERT INTO public.categories (name, slug, description, color)
VALUES
  ('Nieuws & Tips', 'nieuws-tips', 'Stadsnieuws, openingen, achtergronden & weekendtips', '#3B82F6'),
  ('Eten & Drinken', 'eten-drinken', 'Koffiebars, terrassen, borrels & restaurants', '#F97316'),
  ('Cultuur', 'cultuur', 'Musea, theater, muziek, film & exposities', '#8B5CF6'),
  ('Ontdekken', 'ontdekken', 'Wijken, Sonsbeek, wandelroutes & uitjes', '#10B981'),
  ('Winkelen', 'winkelen', 'Modekwartier, 7straatjes & concept stores', '#EC4899'),
  ('Nachtleven', 'nachtleven', 'Clubs, cafés & avonden uit', '#6366F1')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color;

-- 2. Reassign any articles linked to legacy WP slugs to the matching official category
UPDATE public.articles a
SET category_id = (SELECT id FROM public.categories WHERE slug = 'eten-drinken')
WHERE a.category_id IN (
  SELECT id FROM public.categories WHERE slug IN ('eten', 'drinken')
);

UPDATE public.articles a
SET category_id = (SELECT id FROM public.categories WHERE slug = 'ontdekken')
WHERE a.category_id IN (
  SELECT id FROM public.categories WHERE slug IN ('hotspots', 'buiten', 'wijken-2', '7-straatjes', 'binnenstad', 'klarendal', 'korenkwartier', 'sonsbeek', 'spijkerkwartier')
);

UPDATE public.articles a
SET category_id = (SELECT id FROM public.categories WHERE slug = 'nieuws-tips')
WHERE a.category_id IS NULL
   OR a.category_id NOT IN (
     SELECT id FROM public.categories
     WHERE slug IN ('nieuws-tips', 'eten-drinken', 'cultuur', 'ontdekken', 'winkelen', 'nachtleven')
   );

-- 3. Remove unused legacy WordPress categories (only those not in the 6 official slugs and with 0 linked articles)
DELETE FROM public.categories c
WHERE c.slug NOT IN ('nieuws-tips', 'eten-drinken', 'cultuur', 'ontdekken', 'winkelen', 'nachtleven')
  AND NOT EXISTS (
    SELECT 1 FROM public.articles a WHERE a.category_id = c.id
  );

