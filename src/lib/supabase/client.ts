import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldvclkymaiopytbkjulp.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_v4FLLzJvOTLRr_FNyqreQg_pWyBfHvp';

  return createBrowserClient(supabaseUrl, supabaseKey);
}
