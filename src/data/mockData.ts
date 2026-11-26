// Official taxonomies for categories and filtering

export interface CategoryDefinition {
  id: string;
  label: string;
  description?: string;
}

export const ARTICLE_CATEGORIES: CategoryDefinition[] = [
  { id: 'all', label: 'Alles' },
  {
    id: 'nieuws-tips',
    label: 'Nieuws & Tips',
    description: 'Stadsnieuws, openingen, achtergronden & weekendtips',
  },
  {
    id: 'eten-drinken',
    label: 'Eten & Drinken',
    description: 'Koffiebars, terrassen, borrels & restaurants',
  },
  {
    id: 'cultuur',
    label: 'Cultuur',
    description: 'Musea, theater, muziek, film & exposities',
  },
  {
    id: 'ontdekken',
    label: 'Ontdekken',
    description: 'Wijken, Sonsbeek, wandelroutes & uitjes',
  },
  {
    id: 'winkelen',
    label: 'Winkelen',
    description: 'Modekwartier, 7straatjes & concept stores',
  },
  {
    id: 'nachtleven',
    label: 'Nachtleven',
    description: 'Clubs, cafés & avonden uit',
  },
];

export const SUGGESTED_ARTICLE_TAGS: string[] = [
  'lijstje',
  'interview',
  'hotspot',
  'recensie',
  'weekendtip',
  'gratis',
  'kinderen',
  'klarendal',
  'spijkerkwartier',
  'sonsbeek',
  'centrum',
];

export const EVENT_CATEGORIES: CategoryDefinition[] = [
  { id: 'all', label: 'Alles' },
  { id: 'muziek', label: 'Muziek & Concerten' },
  { id: 'theater-dans', label: 'Theater & Dans' },
  { id: 'comedy', label: 'Comedy & Cabaret' },
  { id: 'film', label: 'Film' },
  { id: 'festival', label: 'Festivals' },
  { id: 'kunst-expo', label: 'Kunst & Expo' },
  { id: 'eten-drinken-markten', label: 'Eten, Drinken & Markten' },
  { id: 'kinderen-familie', label: 'Familie & Kids' },
  { id: 'sport-outdoor', label: 'Sport & Buiten' },
];

const ARTICLE_CATEGORY_ALIASES: Record<string, string> = {
  nieuws: 'nieuws-tips',
  tips: 'nieuws-tips',
  uittips: 'nieuws-tips',
  eten: 'eten-drinken',
  drinken: 'eten-drinken',
  hotspots: 'ontdekken',
  buiten: 'ontdekken',
};

export function normalizeArticleCategorySlug(slug?: string | null): string {
  if (!slug) return 'nieuws-tips';
  const cleaned = slug.trim().toLowerCase();
  return ARTICLE_CATEGORY_ALIASES[cleaned] || cleaned;
}

export function getArticleCategoryLabel(slug?: string | null): string {
  const normalized = normalizeArticleCategorySlug(slug);
  const match = ARTICLE_CATEGORIES.find((c) => c.id === normalized);
  if (match) return match.label;
  if (!slug) return 'Nieuws & Tips';
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function getEventCategoryLabel(slug?: string | null): string {
  if (!slug) return 'Cultuur';
  const cleaned = slug.trim().toLowerCase();
  const match = EVENT_CATEGORIES.find((c) => c.id === cleaned);
  if (match) return match.label;
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
