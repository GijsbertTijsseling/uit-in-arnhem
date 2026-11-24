'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const siteOrigin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://uit-in-arnhem.vercel.app';

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${siteOrigin}/auth/callback?next=/wachtwoord-herstellen`,
      });

      if (error) {
        setErrorMsg(error.message || 'Kon geen herstelmail versturen. Probeer het opnieuw.');
        return;
      }

      setSuccessMsg(
        'Als dit e-mailadres bij ons bekend is, ontvang je binnen enkele minuten een e-mail om een nieuw wachtwoord in te stellen.'
      );
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
            Wachtwoord vergeten
          </h1>
          <p className="text-xs text-zinc-500">
            Vul het e-mailadres van je CMS-account in om een herstellink te ontvangen.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
            >
              E-mailadres
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="reset-email"
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

          <Button type="submit" disabled={loading} variant="primary" size="lg" fullWidth>
            <span>{loading ? 'Bezig met versturen...' : 'Herstellink versturen'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs text-zinc-500 hover:text-[#FF4F00] underline">
            Terug naar inloggen
          </Link>
        </div>
      </div>
    </div>
  );
}
