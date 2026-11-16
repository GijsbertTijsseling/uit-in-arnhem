'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export function NewsletterCta() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FF4F00] to-[#E04500] text-white rounded-3xl p-8 sm:p-12 shadow-xl my-12">
      {/* Background graphic elements */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
          <Mail className="w-3.5 h-3.5" />
          <span>Arnhemse Weekendtips</span>
        </div>

        <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
          Mis nooit meer wat er bruist in Arnhem
        </h2>

        <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Ontvang elke donderdagochtend onze redactionele selectie van de beste exposities, concerten, geheime terrassen en weekendtips rechtstreeks in je inbox.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 bg-white text-zinc-900 px-6 py-4 rounded-2xl font-bold text-sm shadow-md animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Top! Je bent ingeschreven voor de Uit in Arnhem weekendbrief.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Vul je e-mailadres in..."
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-white text-zinc-900 placeholder:text-zinc-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-inner"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-zinc-900 text-white font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <span>Aanmelden</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-white/70 text-xs pt-1">
          Geen spam, uitschrijven kan op ieder moment met één klik.
        </p>
      </div>
    </section>
  );
}
