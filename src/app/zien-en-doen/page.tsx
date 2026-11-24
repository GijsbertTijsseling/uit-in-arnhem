import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, MapPin, ArrowRight, Calendar, Coffee, Landmark, Trees } from 'lucide-react';
import { HotspotHighlights } from '@/components/home/HotspotHighlights';
import { ButtonLink } from '@/components/ui/Button';

export const metadata = {
  title: 'Zien en doen in Arnhem | Uit in Arnhem',
  description: 'Ontdek de leukste bezienswaardigheden, musea, parken, theaters en wijken in Arnhem.',
};

const HIGHLIGHTS = [
  {
    title: 'Kunst & Musea',
    description: 'Van hedendaagse kunst in Museum Arnhem hoog op de stuwwal tot de rijke geschiedenis van de Slag om Arnhem.',
    icon: Landmark,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2021/08/Afbeelding-Bronbeek-scaled.jpg',
    href: '/agenda?category=kunst-expo',
    count: 'Musea & Expo',
  },
  {
    title: 'Theater & Live Muziek',
    description: 'Geniet van concerten in poptempel Luxor Live, klassiek in Musis en vernieuwende dans bij Introdans en Oostpool.',
    icon: Sparkles,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/AM_VerlatenVrouwen_03-1-LRG-CROP.jpg',
    href: '/agenda?category=theater-dans',
    count: 'Podia & Live',
  },
  {
    title: 'Groen & Parken',
    description: 'Arnhem is de groenste stad van Nederland. Dwaal door het glooiende Sonsbeekpark of trek de Veluwezoom in.',
    icon: Trees,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/Sonsbeekmarkt.jpg',
    href: '/artikelen?category=ontdekken',
    count: 'Natuur & Wandelen',
  },
  {
    title: 'Eten, Drinken & Koffie',
    description: 'Ontdek specialty coffee in het Modekwartier, zwoele zomerterrassen aan de Rijnkade en intieme proeverijen in de 7straatjes.',
    icon: Coffee,
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/04/Ketelhuis-Sonsbeek-6.jpg',
    href: '/artikelen?category=eten-drinken',
    count: 'Culinaire Hotspots',
  },
];

export default function ZienEnDoenPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-zinc-950 tracking-tight leading-tight">
          Zien en doen in Arnhem
        </h1>
        <p className="text-zinc-600 text-lg sm:text-xl leading-relaxed">
          Of je nu houdt van toonaangevende mode en design, historische straatjes, uitgestrekte stadsparken of bruisende cultuurpodia: in Arnhem valt altijd iets te beleven.
        </p>
      </div>

      {/* Main Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative rounded-3xl overflow-hidden bg-ink text-white shadow-card hover:shadow-card-hover transition-all duration-300 min-h-[380px] flex flex-col justify-end p-8 border border-border-warm"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/92 via-black/60 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.count}</span>
                  </span>
                  <span className="text-xs text-white font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 drop-shadow-xs">
                    <span>Ontdekken</span>
                    <ArrowRight className="w-4 h-4 text-[#FF4F00]" />
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white drop-shadow-xs group-hover:text-[#FF4F00] transition-colors">
                  {item.title}
                </h2>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed drop-shadow-xs">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Arnhem Wijken */}
      <HotspotHighlights />

      {/* Direct Agenda CTA Banner */}
      <div className="rounded-3xl bg-cta-tint text-ink p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-cta-border">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink">
            Benieuwd wat er vandaag of dit weekend te doen is?
          </h3>
          <p className="text-ink-body text-sm sm:text-base max-w-xl">
            Bekijk direct alle aankomende concerten, exposities, theatervoorstellingen en markten in de complete Arnhem agenda.
          </p>
        </div>
        <ButtonLink href="/agenda" variant="primary" surface="light" size="lg" className="shrink-0">
          <Calendar className="w-4 h-4" />
          <span>Naar de Uitagenda</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </ButtonLink>
      </div>
    </div>
  );
}

