'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check, Lock, Plus } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';

const DISCOVER_LINKS = [
  { label: 'Uitagenda', href: '/agenda' },
  { label: 'Dit weekend', href: '/agenda?filter=weekend' },
  { label: 'Zien & doen', href: '/zien-en-doen' },
  { label: 'Wijken van Arnhem', href: '/wijken' },
  { label: 'Podia & locaties', href: '/locaties' },
  { label: 'Verhalen & nieuws', href: '/artikelen' },
];

const PLATFORM_LINKS = [
  { label: 'Plan je bezoek', href: '/plan-je-bezoek' },
  { label: 'Over Uit in Arnhem', href: '/over-ons' },
  { label: 'Samenwerken & adverteren', href: '/over-ons#samenwerken' },
  { label: 'Tip de redactie', href: '/contact' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isHome = pathname === '/';
  const hideNewsletterBand =
    pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className={isHome ? 'mt-0' : 'mt-16 sm:mt-20'}>
      {/* Pre-footer: Nieuwsbriefband (#FAF9F6) */}
      {!hideNewsletterBand && (
        <section
          aria-labelledby="footer-newsletter-heading"
          className="bg-surface-subtle text-ink"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-2">
                <h2
                  id="footer-newsletter-heading"
                  className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-ink"
                >
                  Elke week de beste tips uit Arnhem
                </h2>
                <p className="text-sm sm:text-base text-ink-body leading-relaxed max-w-xl">
                  Ontvang iedere donderdagochtend onze redactionele selectie met concerten, exposities, nieuwe horeca en weekendtips.
                </p>
              </div>

              <div className="lg:col-span-6 lg:flex lg:flex-col lg:items-end">
                <div className="w-full max-w-md space-y-2">
                  {submitted ? (
                    <div className="flex items-center gap-2.5 bg-surface border border-border-warm text-ink px-5 py-3.5 rounded-full text-sm font-medium shadow-card">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bedankt! Je bent ingeschreven voor de wekelijkse uittips.</span>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-2xl sm:rounded-full p-1.5 bg-surface border border-border-warm shadow-card focus-within:border-ink-muted transition-colors"
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Je e-mailadres"
                        required
                        aria-label="E-mailadres voor nieuwsbrief"
                        className="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                      />
                      <Button type="submit" variant="primary" size="md" className="shrink-0">
                        <span>Inschrijven</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </form>
                  )}
                  <p className="text-xs text-ink-muted sm:pl-4">
                    Geen spam. Uitschrijven kan op elk moment met één klik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Dark Editorial Footer */}
      <footer className="bg-ink text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-14 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
              {/* 1. Platform uitleg & Socials */}
              <div className="lg:col-span-4 space-y-5 lg:pr-6">
                <Link href="/" className="inline-block group brightness-0 invert">
                  <Image
                    src="/logo.png"
                    alt="Uit in Arnhem"
                    width={180}
                    height={44}
                    className="h-9 w-auto object-contain object-left transition-opacity group-hover:opacity-80"
                  />
                </Link>

                <p className="text-sm text-ink-dark-body leading-relaxed max-w-sm">
                  Uit in Arnhem is het onafhankelijke cultuur- en uitgaansplatform van de stad. Van concerten, theater en exposities tot lokale hotspots en verhalen uit de wijken — voor en door Arnhemmers.
                </p>

                <div className="pt-1 space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-dark-muted">
                    Volg Uit in Arnhem
                  </p>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://www.instagram.com/uitinarnhem/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/8 border border-white/10 text-ink-dark-body hover:bg-[#FF4F00] hover:border-[#FF4F00] hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Volg Uit in Arnhem op Instagram"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="https://nl-nl.facebook.com/uitinarnhem/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/8 border border-white/10 text-ink-dark-body hover:bg-[#FF4F00] hover:border-[#FF4F00] hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Volg Uit in Arnhem op Facebook"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.tiktok.com/@uitinarnhem"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/8 border border-white/10 text-ink-dark-body hover:bg-[#FF4F00] hover:border-[#FF4F00] hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Volg Uit in Arnhem op TikTok"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. Ontdek Arnhem */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-ink-dark-muted">
                  Ontdek Arnhem
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {DISCOVER_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-ink-dark-body hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Platform & Praktisch */}
              <div className="lg:col-span-3 space-y-4">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-ink-dark-muted">
                  Platform &amp; praktisch
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {PLATFORM_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-ink-dark-body hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Organisatoren & Redactie */}
              <div className="lg:col-span-3 space-y-5">
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-ink-dark-muted">
                    Organiseer je iets?
                  </h3>
                  <p className="text-sm text-ink-dark-body leading-relaxed">
                    Concert, expositie, voorstelling of markt in Arnhem? Meld je activiteit gratis aan voor de uitagenda.
                  </p>
                  <div className="pt-1">
                    <ButtonLink href="/agenda/aanmelden" variant="primary" surface="dark" size="md">
                      <Plus className="w-4 h-4" />
                      <span>Evenement aanmelden</span>
                    </ButtonLink>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-ink-dark-body hover:text-white transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-ink-dark-muted" />
                    <span>Inloggen voor redactie</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Onderste balk */}
          <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-ink-dark-muted">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
              <span>© {new Date().getFullYear()} Uit in Arnhem</span>
              <span className="hidden sm:inline text-white/20">·</span>
              <a
                href="mailto:info@uitinarnhem.nl"
                className="text-ink-dark-body hover:text-white transition-colors"
              >
                info@uitinarnhem.nl
              </a>
            </div>

            <nav aria-label="Footer juridische links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link href="/over-ons#privacy" className="text-ink-dark-body hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/over-ons#samenwerken" className="text-ink-dark-body hover:text-white transition-colors">
                Samenwerken
              </Link>
              <Link href="/contact" className="text-ink-dark-body hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
