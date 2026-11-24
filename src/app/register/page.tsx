'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'editor' | 'contributor'>('editor');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const fullName = `${cleanFirst} ${cleanLast}`.trim();

    if (!cleanFirst || !cleanLast) {
      setErrorMsg('Vul zowel je voornaam als achternaam in.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const siteOrigin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://uit-in-arnhem.vercel.app';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteOrigin}/auth/callback?next=/login`,
          data: {
            first_name: cleanFirst,
            last_name: cleanLast,
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message || 'Registreren is niet gelukt. Controleer je gegevens.');
      } else {
        setMessage('Registratie succesvol! Controleer je e-mail om je account te bevestigen en log daarna in.');
        setTimeout(() => router.push('/login'), 1800);
      }
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
              className="object-contain"
            />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-zinc-900 tracking-tight pt-2">
            Redactie Aanmelden
          </h1>
          <p className="text-xs text-zinc-500">
            Word auteur of cultureel partner voor Uit in Arnhem.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="h-5 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Voornaam
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Bijv. Sanne"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="h-5 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Achternaam
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Bijv. van den Berg"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

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
                placeholder="jouw.naam@domein.nl"
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
                minLength={6}
                placeholder="Minstens 6 tekens"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white font-medium"
            >
              <option value="editor">Redacteur (artikelen schrijven & publiceren)</option>
              <option value="contributor">Organisator / Partner (agenda evenementen insturen)</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} variant="primary" size="lg" fullWidth>
            <span>{loading ? 'Bezig met registreren...' : 'Account aanmaken'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs text-zinc-500 hover:text-[#FF4F00] underline">
            Heb je al een account? Log hier in →
          </Link>
        </div>
      </div>
    </div>
  );
}
