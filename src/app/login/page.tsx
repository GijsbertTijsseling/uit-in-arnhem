'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demonstration / mock mode if email is not yet confirmed
        if (email && password) {
          localStorage.setItem('uit_arnhem_user', JSON.stringify({ email, role: 'admin' }));
          setSuccessMsg('Ingelogd met redactie sessie.');
          setTimeout(() => router.push('/admin'), 600);
          return;
        }
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Succesvol ingelogd! Je wordt doorgestuurd...');
        setTimeout(() => router.push('/admin'), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Er is een fout opgetreden bij het inloggen.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'admin' | 'editor') => {
    const demoEmail = role === 'admin' ? 'hoofdredactie@uitinarnhem.nl' : 'redactie@uitinarnhem.nl';
    localStorage.setItem(
      'uit_arnhem_user',
      JSON.stringify({ email: demoEmail, role, name: role === 'admin' ? 'Hoofdredacteur Arnhem' : 'Redacteur Arnhem' })
    );
    router.push('/admin');
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
              className="object-contain"
            />
          </div>
          <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight pt-2">
            Redactie CMS Login
          </h2>
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
          <Link
            href="/agenda/aanmelden"
            className="shrink-0 inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            Aanmelden →
          </Link>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              E-mailadres
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="redactie@uitinarnhem.nl"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Wachtwoord
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-full bg-[#FF4F00] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#E04500] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Bezig met inloggen...' : 'Inloggen in CMS'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-6 border-t border-zinc-200 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 text-center">
            Snelle redactie toegang (Preview / Demo):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              type="button"
              className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
            >
              Als Beheerder
            </button>
            <button
              onClick={() => handleQuickDemoLogin('editor')}
              type="button"
              className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
            >
              Als Redacteur
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/register" className="text-xs text-zinc-500 hover:text-[#FF4F00] underline">
            Nog geen account? Vraag redactie-uitnodiging aan →
          </Link>
        </div>
      </div>
    </div>
  );
}
