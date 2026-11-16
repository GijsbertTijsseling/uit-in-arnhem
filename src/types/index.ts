export type ArticleCategory =
  | 'eten-drinken'
  | 'cultuur'
  | 'winkelen'
  | 'ontdekken'
  | 'nieuws-tips'
  | 'nachtleven';

export interface CtaBlock {
  heading: string;
  description: string;
  button_label: string;
  button_url: string;
}

export type LayoutTemplate = 'standard' | 'editorial_story' | 'visual_gallery' | 'listicle';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  gallery_image_urls?: string[];
  author_id?: string;
  author_name?: string;
  category: ArticleCategory | string;
  tags?: string[];
  status: 'draft' | 'pending_review' | 'published' | 'archived';
  is_featured?: boolean;
  layout_template?: LayoutTemplate;
  cta_block?: CtaBlock;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}

export type EventCategory =
  | 'muziek'
  | 'theater-dans'
  | 'film'
  | 'festival'
  | 'kunst-expo'
  | 'kinderen-familie'
  | 'sport-outdoor'
  | 'eten-drinken-markten';

export interface AgendaItem {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  hero_image_url: string;
  category: EventCategory | string;
  start_date: string; // ISO 8601 string
  end_date?: string | null;
  is_all_day?: boolean;
  is_recurring?: boolean;
  recurrence_rule?: string;
  venue_name: string;
  venue_address: string;
  venue_city: string;
  coordinates?: { lat: number; lng: number };
  price_type: 'free' | 'paid' | 'donation';
  price_from?: number | null;
  price_to?: number | null;
  ticket_url?: string;
  organizer_id?: string;
  organizer_name?: string;
  status: 'submitted' | 'approved' | 'rejected' | 'published';
  is_highlight: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'admin' | 'editor' | 'contributor';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
