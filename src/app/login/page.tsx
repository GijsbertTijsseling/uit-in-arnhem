'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Onjuist e-mailadres of wachtwoord.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Je e-mailadres is nog niet bevestigd. Klik op de bevestigingslink in je inbox of bevestig het account in Supabase.';
  }
  if (lower.includes('too many requests')) {
    return 'Te veel inlogpogingen. Probeer het over een paar minuten opnieuw.';
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const supabase = createClient();
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const code = params.get('code');

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/wachtwoord-herstellen');
      }
    });

    if (hashParams.get('type') === 'recovery') {
      router.replace('/wachtwoord-herstellen');
      return () => subscription.unsubscribe();
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setErrorMsg('De bevestigingslink is verlopen of ongeldig. Probeer opnieuw in te loggen of vraag een nieuwe link aan.');
        } else {
          setSuccessMsg('Je e-mailadres is bevestigd! Je kunt nu inloggen.');
        }
        window.history.replaceState({}, '', '/login');
      });
      return () => subscription.unsubscribe();
    }

    if (params.get('passwordReset') === 'true') {
      setSuccessMsg('Je wachtwoord is gewijzigd! Je kunt nu inloggen met je nieuwe wachtwoord.');
      window.history.replaceState({}, '', '/login');
    } else if (params.get('confirmed') === 'true' || hashParams.get('type') === 'signup') {
      setSuccessMsg('Je e-mailadres is bevestigd! Je kunt nu inloggen.');
      window.history.replaceState({}, '', '/login');
    } else if (params.get('error') === 'confirmation_failed') {
      setErrorMsg('De bevestigingslink is verlopen of ongeldig. Probeer opnieuw in te loggen of registreer opnieuw.');
      window.history.replaceState({}, '', '/login');
    }

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        setErrorMsg(translateAuthError(error?.message || 'Inloggen mislukt.'));
        return;
      }

      const meta = (data.user.user_metadata || {}) as Record<string, any>;
      localStorage.setItem(
        'uit_arnhem_user',
        JSON.stringify({
          id: data.user.id,
          email: data.user.email || email.trim(),
          role: meta.role || 'editor',
          first_name: meta.first_name,
          last_name: meta.last_name,
          full_name: meta.full_name || meta.name,
          name: meta.full_name || meta.name,
        })
      );
      setSuccessMsg('Succesvol ingelogd! Je wordt doorgestuurd...');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Er is een fout opgetreden bij het inloggen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="relative h-12 w-48 mx-auto">
            <Image
              src="/logo.png"
              alt="Uit in Arnhem"
              fill
              sizes="192px"
              className="object-contain"
            />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-zinc-900 tracking-tight pt-2">
            Redactie CMS Login
          </h1>
          <p className="text-xs text-zinc-500">
            Beheer artikelen, de culturele agenda en gebruikersrollen.
          </p>
        </div>

        {/* Public Submitter Callout */}
        <div className="p-4 rounded-2xl bg-[#FFF3ED] border border-[#FF4F00]/25 text-xs text-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-bold text-zinc-900 block">Organisator of artiest in Arnhem?</span>
            <span className="text-zinc-600 text-[11px]">
              Voor het gratis aanmelden van een evenement heb je géén CMS-account nodig.
            </span>
          </div>
          <ButtonLink href="/agenda/aanmelden" variant="primary" size="sm" className="shrink-0">
            <span>Aanmelden</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </ButtonLink>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
            >
              E-mailadres
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="naam@uitinarnhem.nl"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600"
              >
                Wachtwoord
              </label>
              <Link
                href="/wachtwoord-vergeten"
                className="text-xs text-zinc-500 hover:text-[#FF4F00] underline"
              >
                Wachtwoord vergeten?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} variant="primary" size="lg" fullWidth>
            <span>{loading ? 'Bezig met inloggen...' : 'Inloggen in CMS'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link href="/register" className="text-xs text-zinc-500 hover:text-[#FF4F00] underline">
            Nog geen account? Vraag redactie-toegang aan
          </Link>
        </div>
      </div>
    </div>
  );
}
