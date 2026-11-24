'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Send, PlusCircle, CheckCircle2, MessageSquare, Megaphone, ArrowRight } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'tip',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-zinc-950 tracking-tight leading-tight">
          Contact opnemen met Uit in Arnhem
        </h1>
        <p className="text-zinc-600 text-lg sm:text-xl leading-relaxed">
          Heb je een culturele tip, wil je een nieuw café onder de aandacht brengen, een evenement aanmelden of samenwerken? We horen heel graag van je.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <h2 className="font-heading font-black text-2xl text-zinc-950">
            Stuur ons een bericht
          </h2>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-heading font-bold text-xl text-emerald-900">
                Bedankt voor je bericht!
              </h3>
              <p className="text-sm text-emerald-700 max-w-md mx-auto">
                Onze redactie heeft je bericht ontvangen. We nemen zo snel mogelijk contact met je op.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                Nog een bericht sturen
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Naam
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jouw naam"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="naam@voorbeeld.nl"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Onderwerp
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] text-sm bg-white"
                >
                  <option value="tip">Tip voor de redactie (nieuws / hotspot)</option>
                  <option value="evenement">Vraag over een evenement / agenda</option>
                  <option value="adverteren">Adverteren & Partnerschappen</option>
                  <option value="overig">Overige vraag of opmerking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Bericht
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Vertel ons meer over je tip of vraag..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] text-sm"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth>
                <Send className="w-4 h-4" />
                <span>Bericht versturen</span>
              </Button>
            </form>
          )}
        </div>

        {/* Right Column: Direct Info & Quick CTAs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Evenement Aanmelden Box */}
          <div className="bg-[#FFF3ED] border border-[#FF4F00]/30 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF4F00] text-white flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-black text-xl text-zinc-950">
              Zelf een evenement toevoegen?
            </h3>
            <p className="text-zinc-700 text-sm leading-relaxed">
              Organiseer je een concert, expositie, markt of voorstelling in Arnhem? Meld je evenement gratis aan voor onze culturele uitagenda.
            </p>
            <ButtonLink href="/agenda/aanmelden" variant="primary" size="md">
              <span>Evenement aanmelden</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
          </div>

          {/* Redactiegegevens */}
          <div className="bg-zinc-50 border border-zinc-200/90 rounded-3xl p-8 space-y-4 text-sm">
            <h3 className="font-heading font-bold text-lg text-zinc-900">
              Redactie & Colofon
            </h3>
            <div className="space-y-3 text-zinc-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF4F00] mt-0.5 shrink-0" />
                <span>Arnhem, Gelderland</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#FF4F00] mt-0.5 shrink-0" />
                <a href="mailto:info@uitinarnhem.nl" className="hover:underline text-zinc-900 font-medium">
                  info@uitinarnhem.nl
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Megaphone className="w-4 h-4 text-[#FF4F00] mt-0.5 shrink-0" />
                <span>Reactietijd: binnen 1-2 werkdagen</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

