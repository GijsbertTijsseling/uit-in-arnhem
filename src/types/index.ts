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

export interface Location {
  id?: string;
  slug: string;
  name: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  phone?: string;
  website?: string;
  email?: string;
  description?: string;
  featured_image?: string;
  coordinates?: { lat: number; lng: number };
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EventPerformance {
  start_date: string;
  end_date?: string | null;
  ticket_url?: string;
  is_sold_out?: boolean;
  venue_sublocation?: string;
}

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
  location_id?: string | null;
  location_slug?: string | null;
  location?: Location | null;
  coordinates?: { lat: number; lng: number };
  price_type: 'free' | 'paid' | 'donation';
  price_from?: number | null;
  price_to?: number | null;
  ticket_url?: string;
  organizer_id?: string;
  organizer_name?: string;
  status: 'submitted' | 'approved' | 'rejected' | 'published' | 'missing' | 'cancelled';
  is_highlight: boolean;
  source?: string;
  source_id?: string;
  source_url?: string;
  production_id?: string;
  performances?: EventPerformance[];
  is_manually_edited?: boolean;
  manual_override_fields?: string[];
  missing_count?: number;
  missing_since?: string | null;
  last_synced_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AgendaSource {
  id: string;
  name: string;
  slug: string;
  url: string;
  adapter_type: string;
  default_venue_name: string;
  default_venue_address: string;
  default_venue_city: string;
  default_category_slug: string;
  is_active: boolean;
  is_running: boolean;
  locked_at?: string | null;
  sync_frequency: string;
  last_run_at?: string | null;
  last_run_status?: 'success' | 'warning' | 'error' | null;
  last_run_message?: string | null;
  total_events_count: number;
  created_at: string;
  updated_at: string;
}

export interface AgendaSyncLog {
  id: string;
  source_id?: string;
  source_slug: string;
  started_at: string;
  completed_at?: string | null;
  status: 'running' | 'success' | 'warning' | 'error';
  items_scraped: number;
  items_inserted: number;
  items_updated: number;
  items_missing: number;
  items_cancelled: number;
  items_skipped: number;
  error_message?: string | null;
  log_details?: Record<string, any>;
  created_at: string;
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
