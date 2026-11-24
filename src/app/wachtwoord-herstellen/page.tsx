'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const init = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error && mounted) {
            setErrorMsg('De herstellink is ongeldig of verlopen. Vraag een nieuwe link aan.');
          }
          window.history.replaceState({}, '', '/wachtwoord-herstellen');
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setHasSession(Boolean(session));
          setCheckingSession(false);
        }
      } catch {
        if (mounted) {
          setErrorMsg('Kon de herstelsessie niet verifiëren. Vraag een nieuwe link aan.');
          setCheckingSession(false);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasSession(true);
        setCheckingSession(false);
      }
    });

    init();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg('Kies een wachtwoord van minstens 6 tekens.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('De twee wachtwoorden komen niet overeen.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMsg(error.message || 'Het bijwerken van je wachtwoord is niet gelukt.');
        return;
      }

      setSuccessMsg('Je wachtwoord is gewijzigd! Je wordt doorgestuurd naar de loginpagina...');
      setTimeout(() => {
        router.push('/login?passwordReset=true');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Er is een fout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl">
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
            Nieuw wachtwoord instellen
          </h1>
          <p className="text-xs text-zinc-500">
            Kies een nieuw wachtwoord voor je Uit in Arnhem CMS-account.
          </p>
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

        {checkingSession ? (
          <div className="py-6 text-center text-xs text-zinc-500">
            Herstellink wordt gecontroleerd...
          </div>
        ) : !hasSession ? (
          <div className="space-y-4 text-center">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Deze herstellink is niet meer actief of ontbreekt. Vraag een nieuwe herstellink aan om je wachtwoord opnieuw in te stellen.
            </p>
            <Link
              href="/wachtwoord-vergeten"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-[#FF4F00] text-white text-sm font-semibold hover:bg-[#E04500] transition-colors"
            >
              <span>Nieuwe herstellink aanvragen</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
              >
                Nieuw wachtwoord
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Minstens 6 tekens"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
              >
                Bevestig nieuw wachtwoord
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Herhaal wachtwoord"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} variant="primary" size="lg" fullWidth>
              <span>{loading ? 'Bezig met opslaan...' : 'Wachtwoord opslaan'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs text-zinc-500 hover:text-[#FF4F00] underline">
            Terug naar inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
