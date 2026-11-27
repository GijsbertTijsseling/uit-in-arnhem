import { NextResponse } from 'next/server';
import {
  SITE_ACCESS_COOKIE,
  SITE_ACCESS_MAX_AGE,
  computeAccessToken,
  getSitePassword,
  verifySitePassword,
} from '@/lib/site-access';

export async function POST(request: Request) {
  const expectedPassword = getSitePassword();

  if (!expectedPassword) {
    return NextResponse.json({ ok: true });
  }

  let submittedPassword = '';
  try {
    const body = await request.json();
    submittedPassword = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json(
      { error: 'Ongeldig verzoek.' },
      { status: 400 }
    );
  }

  const isValid = await verifySitePassword(submittedPassword, expectedPassword);

  if (!isValid) {
    return NextResponse.json(
      { error: 'Onjuist wachtwoord. Probeer het opnieuw.' },
      { status: 401 }
    );
  }

  const token = await computeAccessToken(expectedPassword);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SITE_ACCESS_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SITE_ACCESS_MAX_AGE,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SITE_ACCESS_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}

