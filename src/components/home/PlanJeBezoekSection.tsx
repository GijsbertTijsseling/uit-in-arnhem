import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

const INSPIRATION_CARDS = [
  {
    title: 'Dagje Arnhem',
    description:
      'Struin door de 7straatjes en het Modekwartier, duik een museum in en strijk neer in Park Sonsbeek.',
    href: '/zien-en-doen',
    cta: 'Zien & doen',
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/zevenstraatjes-eusebius.jpg',
    alt: 'Gezellige terrassen en boetieks in De 7straatjes met uitzicht op de Eusebiuskerk',
  },
  {
    title: 'Weekendje & overnachten',
    description:
      'Blijf een nachtje slapen in een boutique hotel of B&B en proef Arnhem van ochtendkoffie tot avondvoorstelling.',
    href: '/plan-je-bezoek#overnachten',
    cta: 'Tips om te overnachten',
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/wp-migrated/2024/04/Ketelhuis-Sonsbeek-6.jpg',
    alt: 'Sfeervol interieur voor een ontspannen weekendje weg in Arnhem',
  },
  {
    title: 'Bezienswaardigheden',
    description:
      'Van de Eusebiuskerk en de John Frostbrug tot toonaangevende musea, theaters en historische hofjes.',
    href: '/locaties',
    cta: 'Bekijk alle locaties',
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/eusebiuskerk-bloemen.jpg',
    alt: 'De historische Eusebiuskerk in het hart van Arnhem',
  },
];

const PRACTICAL_LINKS = [
  {
    kicker: 'Openbaar vervoer',
    title: 'Trein & trolleybus',
    summary: 'Arnhem Centraal op 5 min. lopen en direct verder met de trolleybus of OV-fiets.',
    href: '/plan-je-bezoek#ov',
  },
  {
    kicker: 'Met de auto',
    title: 'Parkeren & P+R',
    summary: 'P+R GelreDome of Arnhem Zuid, en garages Centraal, Musis en Rozet aan de ring.',
    href: '/plan-je-bezoek#parkeren',
  },
  {
    kicker: 'VVV Informatiepunt',
    title: 'Citystore Arnhem',
    summary: 'In de Eusebiuskerk (Kerkplein 1) voor routes, tips en lokale cadeaus.',
    href: '/plan-je-bezoek#vvv',
  },
  {
    kicker: 'Binnenstad',
    title: 'Markt & koopzondag',
    summary: 'Warenmarkt op vrijdag en zaterdag, koopavond op donderdag.',
    href: '/plan-je-bezoek#praktisch',
  },
];

export function PlanJeBezoekSection() {
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

        {/* Rustige redactionele praktische lijst */}
        <div className="pt-8 border-t border-border-warm space-y-5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
            Direct handig voor onderweg
          </p>
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
        </div>
      </div>
    </section>
  );
}
