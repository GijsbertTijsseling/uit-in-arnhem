import { NextRequest, NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam || !nextParam.startsWith('/') || nextParam.startsWith('//')) {
    return '/login';
  }
  return nextParam;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const nextPath = getSafeNextPath(searchParams.get('next'));

  const supabase = await createServerSupabaseClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectUrl = new URL(nextPath, origin);
      if (nextPath === '/login') {
        redirectUrl.searchParams.set('confirmed', 'true');
      }
      return NextResponse.redirect(redirectUrl);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      const redirectUrl = new URL(nextPath, origin);
      if (nextPath === '/login') {
        redirectUrl.searchParams.set('confirmed', 'true');
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  const errorUrl = new URL('/login', origin);
  errorUrl.searchParams.set('error', 'confirmation_failed');
  return NextResponse.redirect(errorUrl);
}

