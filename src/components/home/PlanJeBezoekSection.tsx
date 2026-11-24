'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Train,
  Car,
  Info,
  ShoppingBag,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

const INSPIRATION_CARDS = [
  {
    title: 'Dagje Arnhem',
    description:
      'Struin door de 7straatjes en het Modekwartier, duik een museum in en strijk neer in Park Sonsbeek.',
    href: '/zien-en-doen',
    cta: 'Zien & doen',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/04/Ketelhuis-Sonsbeek-6.jpg',
    alt: 'Terras en groen bij het Ketelhuis in Park Sonsbeek in Arnhem',
  },
  {
    title: 'Weekendje & overnachten',
    description:
      'Blijf een nachtje slapen in een boutique hotel of B&B en proef Arnhem van ochtendkoffie tot avondvoorstelling.',
    href: '/plan-je-bezoek#overnachten',
    cta: 'Tips om te overnachten',
    image: '/images/bridge_uiterwaarden.jpg',
    alt: 'Uitzicht over de Nederrijn en de John Frostbrug in Arnhem',
  },
  {
    title: 'Bezienswaardigheden',
    description:
      'Van de Eusebiuskerk en de John Frostbrug tot toonaangevende musea, theaters en historische hofjes.',
    href: '/locaties',
    cta: 'Bekijk alle locaties',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2021/08/Afbeelding-Bronbeek-scaled.jpg',
    alt: 'Historisch Landgoed Bronbeek in Arnhem',
  },
];

const PRACTICAL_LINKS = [
  {
    kicker: 'Openbaar vervoer',
    title: 'Trein & trolleybus',
    summary: 'Arnhem Centraal op 5 min. lopen en direct verder met de trolleybus.',
    href: '/plan-je-bezoek#ov',
    icon: Train,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2026/01/2025-01-24-UitnachtArnhem-WEBSIZE-JortBrummel-30.jpg',
    alt: 'Avondsfeer en bereikbaarheid in het centrum van Arnhem',
  },
  {
    kicker: 'Met de auto',
    title: 'Parkeren & P+R',
    summary: 'Voordelig via P+R GelreDome of garages Centraal, Rozet en Musis.',
    href: '/plan-je-bezoek#parkeren',
    icon: Car,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/05/Street-Art-Tour-20230804_105441-scaled.jpg',
    alt: 'Straten en wandelroutes vanaf de parkeergarages in Arnhem',
  },
  {
    kicker: 'Informatiepunt',
    title: 'VVV & Rozet',
    summary: 'Bezoekerscentrum aan de Kortestraat 16 voor plattegronden en routes.',
    href: '/plan-je-bezoek#vvv',
    icon: Info,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2026/01/eus1kQ2zZk4zSUlPWH2CHfgBV6pjemxr5uyL4XQu.png',
    alt: 'Cultuur- en bezoekerscentrum Rozet aan de Kortestraat in Arnhem',
  },
  {
    kicker: 'Binnenstad',
    title: 'Markt & koopzondag',
    summary: 'Warenmarkt op vrijdag en zaterdag, koopavond op donderdag.',
    href: '/plan-je-bezoek#praktisch',
    icon: ShoppingBag,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/Sonsbeekmarkt.jpg',
    alt: 'Marktkramen en gezelligheid in Arnhem',
  },
];

type PracticalVariant = 'thumbnails' | 'photo-tiles' | 'editorial-list' | 'cards';

const VARIANT_OPTIONS: { id: PracticalVariant; label: string }[] = [
  { id: 'thumbnails', label: '1. Foto-thumbnails' },
  { id: 'photo-tiles', label: '2. Fototegels' },
  { id: 'editorial-list', label: '3. Rustige lijst' },
  { id: 'cards', label: '4. Huidig (icoonkaarten)' },
];

export function PlanJeBezoekSection() {
  const [variant, setVariant] = useState<PracticalVariant>('thumbnails');

  return (
    <section id="plan-je-bezoek" className="bg-surface-subtle py-14 sm:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF4F00] mb-2">
              Plan je bezoek
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight">
              Op pad in Arnhem
            </h2>
            <p className="text-ink-body text-sm sm:text-base mt-1 max-w-xl">
              Inspiratie voor een dagje of weekendje weg, samen met alles wat je praktisch wilt weten voor vertrek.
            </p>
          </div>

          <ButtonLink
            href="/plan-je-bezoek"
            variant="secondary"
            size="md"
            className="self-start sm:self-auto shrink-0"
          >
            <span>Alle praktische info</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </ButtonLink>
        </div>

        {/* 3 Open Editorial Inspiration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {INSPIRATION_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-muted">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="pt-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-ink group-hover:text-[#FF4F00] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#FF4F00] shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-sm text-ink-body leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink group-hover:text-[#FF4F00] transition-colors pt-1">
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF4F00] group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Integrated Practical Strip + Tijdelijke Variant Toggle */}
        <div className="pt-8 border-t border-border-warm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
              Direct handig voor onderweg
            </p>

            {/* Preview Toggle */}
            <div
              role="group"
              aria-label="Kies weergave praktische info"
              className="flex flex-wrap items-center gap-1.5"
            >
              {VARIANT_OPTIONS.map((opt) => {
                const isActive = variant === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVariant(opt.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${isActive
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* VARIANT 1: Open redactionele 2x2 foto-thumbnails (zoals rechterkolom artikelen) */}
          {variant === 'thumbnails' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {PRACTICAL_LINKS.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-start gap-4"
                >
                  <div className="relative w-28 sm:w-32 aspect-[4/3] rounded-xl overflow-hidden bg-surface-muted shrink-0">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1 pt-0.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF4F00]">
                      {item.kicker}
                    </p>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-extrabold text-base text-ink group-hover:text-[#FF4F00] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#FF4F00] shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* VARIANT 2: 4 compacte fototegels met heldere foto + sterke onderste gradient */}
          {variant === 'photo-tiles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRACTICAL_LINKS.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-ink flex flex-col justify-end p-4 sm:p-5"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none" />
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-extrabold text-base text-white leading-snug">
                        {item.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#FF4F00] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-white/85 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* VARIANT 3: Rustige open redactionele lijst (geen kaders, geen extra foto's) */}
          {variant === 'editorial-list' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {PRACTICAL_LINKS.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group space-y-1.5"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF4F00]">
                    {item.kicker}
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-extrabold text-base text-ink group-hover:text-[#FF4F00] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#FF4F00] shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                    {item.summary}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* VARIANT 4: Huidig (4 witte icoonkaarten) */}
          {variant === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRACTICAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group bg-surface rounded-2xl border border-border-warm p-5 flex flex-col justify-between gap-3 hover:border-[#FF4F00]/40 hover:shadow-card transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover:text-[#FF4F00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-sm sm:text-base text-ink group-hover:text-[#FF4F00] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-body leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
