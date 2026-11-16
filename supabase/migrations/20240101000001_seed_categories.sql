-- Seed standard categories and event categories

INSERT INTO public.categories (name, slug, description, color)
VALUES
  ('Eten & Drinken', 'eten-drinken', 'Koffiebars, restaurants en borrels in Arnhem', '#F97316'),
  ('Cultuur', 'cultuur', 'Musea, theater, kunst en film in Arnhem', '#8B5CF6'),
  ('Winkelen', 'winkelen', 'Mode, vintage en concept stores in de 7straatjes', '#EC4899'),
  ('Ontdekken', 'ontdekken', 'Parken, hotspots en architectuur in de Rijnstad', '#10B981'),
  ('Nieuws & Tips', 'nieuws-tips', 'Weekoverzichten en weekendtips voor Arnhem', '#3B82F6'),
  ('Nachtleven', 'nachtleven', 'Clubs, cafés en live optredens in de nacht', '#6366F1')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color;

INSERT INTO public.event_categories (name, slug, description, icon)
VALUES
  ('Muziek', 'muziek', 'Concerten, live bands en optredens', 'Music'),
  ('Theater & Dans', 'theater-dans', 'Schouwburg, dansvoorstellingen en cabaret', 'Drama'),
  ('Film', 'film', 'Focus filmtheater, outdoor bios en festivals', 'Film'),
  ('Festival', 'festival', 'Zomerfeesten, Proefpark, Bridge to Liberation', 'Sparkles'),
  ('Kunst & Expo', 'kunst-expo', 'Museum Arnhem, kunstgalerieën en exposities', 'Palette'),
  ('Kinderen & Familie', 'kinderen-familie', 'Burgers Zoo, Openluchtmuseum en jeugdtheater', 'Baby'),
  ('Sport & Outdoor', 'sport-outdoor', 'Posbank runs, Rijn-activiteiten en sporttoernooien', 'Activity'),
  ('Eten, Drinken & Markten', 'eten-drinken-markten', 'Foodfestivals, streekmarkten en proeverijen', 'Utensils')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;
