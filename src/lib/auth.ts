import { createClient } from '@/lib/supabase/client';

export const DEFAULT_AUTHOR_NAME = 'Redactie Uit in Arnhem';

export interface CurrentEditorUser {
  id?: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  /** Only populated when both a first name and last name are present on the account. */
  author_name: string | null;
}

const GENERIC_NAMES = new Set([
  'redactie uit in arnhem',
  'redactie',
  'hoofdredacteur arnhem',
  'redacteur arnhem',
]);

export function resolveFullNameFromParts(
  firstName?: string | null,
  lastName?: string | null,
  fullName?: string | null
): string | null {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';

  if (first && last) {
    return `${first} ${last}`;
  }

  const combined = fullName?.trim() || '';
  if (!combined) return null;
  if (GENERIC_NAMES.has(combined.toLowerCase())) return null;

  // Require at least two words (first name + last name)
  const parts = combined.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return combined;
  }

  return null;
}

export function splitFullName(fullName?: string | null): { firstName: string; lastName: string } {
  const trimmed = fullName?.trim() || '';
  if (!trimmed || GENERIC_NAMES.has(trimmed.toLowerCase())) {
    return { firstName: '', lastName: '' };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export async function getCurrentEditorUser(): Promise<CurrentEditorUser | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('uit_arnhem_user');
      }
      return null;
    }

    const meta = (user.user_metadata || {}) as Record<string, any>;
    let profileFirst = meta.first_name as string | undefined;
    let profileLast = meta.last_name as string | undefined;
    let profileFull = (meta.full_name || meta.name) as string | undefined;
    let profileRole = (meta.role as string | undefined) || 'editor';

    // Fetch from public.profiles if available (gracefully handle missing first_name/last_name columns)
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('first_name, last_name, full_name, role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profileErr && profile) {
      profileFirst = profile.first_name || profileFirst;
      profileLast = profile.last_name || profileLast;
      profileFull = profile.full_name || profileFull;
      profileRole = profile.role || profileRole;
    } else if (profileErr) {
      const { data: basicProfile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .maybeSingle();
      if (basicProfile) {
        profileFull = basicProfile.full_name || profileFull;
        profileRole = basicProfile.role || profileRole;
      }
    }

    const authorName = resolveFullNameFromParts(profileFirst, profileLast, profileFull);
    const split = !profileFirst && !profileLast ? splitFullName(profileFull) : null;

    const resolvedUser: CurrentEditorUser = {
      id: user.id,
      email: user.email || 'redactie@uitinarnhem.nl',
      role: profileRole,
      first_name: profileFirst || split?.firstName || undefined,
      last_name: profileLast || split?.lastName || undefined,
      full_name: authorName || profileFull || undefined,
      author_name: authorName,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'uit_arnhem_user',
        JSON.stringify({
          id: resolvedUser.id,
          email: resolvedUser.email,
          role: resolvedUser.role,
          first_name: resolvedUser.first_name,
          last_name: resolvedUser.last_name,
          full_name: resolvedUser.full_name,
          name: resolvedUser.full_name,
        })
      );
    }

    return resolvedUser;
  } catch {
    return null;
  }
}

export async function updateCurrentEditorName(
  firstName: string,
  lastName: string
): Promise<{ fullName: string; error?: string }> {
  const first = firstName.trim();
  const last = lastName.trim();
  const fullName = first && last ? `${first} ${last}` : '';

  if (!first || !last) {
    return { fullName: '', error: 'Vul zowel een voornaam als een achternaam in.' };
  }

  // Update localStorage session if present (or create it to keep UI in sync)
  if (typeof window !== 'undefined') {
    let existing: Record<string, any> = {};
    try {
      const stored = localStorage.getItem('uit_arnhem_user');
      if (stored) existing = JSON.parse(stored);
    } catch {}
    localStorage.setItem(
      'uit_arnhem_user',
      JSON.stringify({
        ...existing,
        first_name: first,
        last_name: last,
        full_name: fullName,
        name: fullName,
      })
    );
  }

  // Update Supabase Auth metadata + profiles table if logged in
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.updateUser({
        data: {
          first_name: first,
          last_name: last,
          full_name: fullName,
        },
      });

      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ first_name: first, last_name: last, full_name: fullName })
        .eq('id', user.id);

      if (profileErr) {
        // Fallback if first_name/last_name columns aren't migrated yet
        await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', user.id);
      }
    }
  } catch (err: any) {
    console.warn('Could not sync editor name to Supabase:', err);
  }

  return { fullName };
}
