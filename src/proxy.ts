import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  SITE_ACCESS_COOKIE,
  getSitePassword,
  isIndexingAllowed,
  isValidAccessToken,
  sanitizeNextPath,
} from '@/lib/site-access';

const PUBLIC_PATHS = new Set([
  '/toegang',
  '/api/site-access',
  '/robots.txt',
  '/logo.png',
  '/favicon.ico',
  '/icon.png',
  '/apple-icon.png',
]);

function applyRobotsHeader(response: NextResponse): NextResponse {
  if (!isIndexingAllowed()) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sitePassword = getSitePassword();

  // Als er geen wachtwoord is ingesteld, stuur /toegang door naar home
  if (!sitePassword) {
    if (pathname === '/toegang') {
      return applyRobotsHeader(NextResponse.redirect(new URL('/', request.url)));
    }
    return applyRobotsHeader(NextResponse.next());
  }

  const cookieValue = request.cookies.get(SITE_ACCESS_COOKIE)?.value;
  const isAuthenticated = await isValidAccessToken(cookieValue, sitePassword);

  // Ingelogde bezoeker op /toegang direct doorsturen
  if (pathname === '/toegang') {
    if (isAuthenticated) {
      const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get('next'));
      return applyRobotsHeader(NextResponse.redirect(new URL(nextPath, request.url)));
    }
    return applyRobotsHeader(NextResponse.next());
  }

  // Publieke assets en toegang-endpoint doorlaten
  if (PUBLIC_PATHS.has(pathname)) {
    return applyRobotsHeader(NextResponse.next());
  }

  // Bezoeker met geldige cookie doorlaten
  if (isAuthenticated) {
    return applyRobotsHeader(NextResponse.next());
  }

  // API-verzoeken zonder toegang afwijzen met 401
  if (pathname.startsWith('/api/')) {
    return applyRobotsHeader(
      NextResponse.json({ error: 'Toegang vereist een wachtwoord.' }, { status: 401 })
    );
  }

  // Alle overige pagina's doorsturen naar het wachtwoordscherm
  const redirectUrl = new URL('/toegang', request.url);
  const requestedPath = `${pathname}${search}`;
  if (requestedPath && requestedPath !== '/') {
    redirectUrl.searchParams.set('next', requestedPath);
  }
  return applyRobotsHeader(NextResponse.redirect(redirectUrl));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
};

