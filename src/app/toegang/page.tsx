'use client';

import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { sanitizeNextPath } from '@/lib/site-access';

function AccessForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const nextPath = sanitizeNextPath(searchParams.get('next'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Vul een wachtwoord in.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/site-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMsg(data?.error || 'Onjuist wachtwoord. Probeer het opnieuw.');
        setLoading(false);
        return;
      }

      window.location.assign(nextPath);
    } catch {
      setErrorMsg('Er ging iets mis. Probeer het opnieuw.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="site-password"
          className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-2"
        >
          Wachtwoord
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="site-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Voer het wachtwoord in"
            autoComplete="current-password"
            autoFocus
            required
            className="w-full pl-10 pr-11 py-3 rounded-xl bg-surface-subtle border border-border-warm text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-[#FF4F00]/25 focus:border-[#FF4F00] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="w-full justify-center"
      >
        <span>{loading ? 'Controleren...' : 'Toegang krijgen'}</span>
        {!loading && (
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        )}
      </Button>
    </form>
  );
}

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-3xl border border-border-warm shadow-card space-y-7">
        <div className="text-center space-y-3">
          <div className="relative h-11 w-44 mx-auto">
            <Image
              src="/logo.png"
              alt="Uit in Arnhem"
              fill
              sizes="176px"
              priority
              className="object-contain"
            />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-ink tracking-tight pt-1">
            Preview in ontwikkeling
          </h1>
          <p className="text-sm text-ink-body leading-relaxed">
            Deze omgeving is nog niet openbaar. Voer het wachtwoord in om verder te gaan.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-32 rounded-2xl bg-surface-subtle animate-pulse" />
          }
        >
          <AccessForm />
        </Suspense>
      </div>
    </div>
  );
}

