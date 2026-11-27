export const SITE_ACCESS_COOKIE = 'uia_site_access';
export const SITE_ACCESS_MAX_AGE = 60 * 60 * 24 * 14; // 14 dagen

export function getSitePassword(): string {
  return (process.env.SITE_PASSWORD ?? '').trim();
}

export function isSitePasswordProtected(): boolean {
  return getSitePassword().length > 0;
}

/**
 * Zoekmachines en crawlers zijn standaard geblokkeerd.
 * Zet in Vercel de environment variable ALLOW_INDEXING=true (en verwijder SITE_PASSWORD)
 * zodra de site live mag gaan.
 */
export function isIndexingAllowed(): boolean {
  return process.env.ALLOW_INDEXING === 'true' && !isSitePasswordProtected();
}

export async function computeAccessToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`uit-in-arnhem-access-v1:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function isValidAccessToken(
  cookieValue: string | undefined,
  password: string
): Promise<boolean> {
  if (!cookieValue || !password) return false;
  const expected = await computeAccessToken(password);
  return timingSafeEqual(cookieValue, expected);
}

export async function verifySitePassword(
  submittedPassword: string,
  expectedPassword: string
): Promise<boolean> {
  if (!submittedPassword || !expectedPassword) return false;
  const [submittedHash, expectedHash] = await Promise.all([
    computeAccessToken(submittedPassword),
    computeAccessToken(expectedPassword),
  ]);
  return timingSafeEqual(submittedHash, expectedHash);
}

export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/';
  }
  if (next === '/toegang' || next.startsWith('/toegang?')) {
    return '/';
  }
  return next;
}

