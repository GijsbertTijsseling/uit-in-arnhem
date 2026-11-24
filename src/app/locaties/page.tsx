import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, Search, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { getLocations, getEvents } from '@/lib/supabase/api';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Culturele Locaties & Podia in Arnhem | Uit in Arnhem',
  description:
    'Overzicht van alle vaste culturele locaties, poppodia, theaters, musea en ontmoetingsplekken in Arnhem. Bekijk het actuele programma per locatie.',
};

export default async function LocatiesPage() {
  const [locations, events] = await Promise.all([getLocations(), getEvents({ includePast: false })]);

  // Count events per location
  const eventCounts: { [key: string]: number } = {};
  events.forEach((evt) => {
    if (evt.location_slug) {
      eventCounts[evt.location_slug] = (eventCounts[evt.location_slug] || 0) + 1;
    } else if (evt.venue_name) {
      const lower = evt.venue_name.toLowerCase();
      eventCounts[lower] = (eventCounts[lower] || 0) + 1;
    }
  });

  // Top featured venues for Arnhem
  const prioritySlugs = [
    'koepelgevangenis',
    'luxor-live',
    'focus-filmtheater',
    'musis',
    'museum-arnhem',
    'rozet',
    'willemeen',
    'stadsvilla-sonsbeek',
    'posttheater',
    'huis-van-puck',
  ];

  const featuredLocations = locations.filter((l) => prioritySlugs.includes(l.slug));

  return (
    <div className="min-h-screen bg-canvas pb-20">
      {/* Hero Header */}
      <section className="bg-surface-subtle border-b border-border-warm py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-zinc-950 tracking-tight leading-tight">
              Culturele Locaties &amp; Podia in Arnhem
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
              Van historische monumenten zoals de Koepelgevangenis tot intieme podia, musea en filmtheaters.
              Bekijk per locatie het actuele programma, adresgegevens en route.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Featured Top Venues Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-2xl text-zinc-950">
              Bekende Podia & Hotspots
            </h2>
            <span className="text-xs font-semibold text-zinc-500">
              {featuredLocations.length} Uitgelichte locaties
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLocations.map((loc) => {
              const count =
                eventCounts[loc.slug] || eventCounts[loc.name.toLowerCase()] || 0;

              return (
                <Link
                  key={loc.slug}
                  href={`/locatie/${loc.slug}`}
                  className="group bg-surface rounded-3xl border border-border-warm overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
                    <Image
                      src={loc.featured_image || '/logo.png'}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF4F00]" />
                        <span className="truncate">{loc.city || 'Arnhem'}</span>
                      </span>

                      {count > 0 && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FF4F00] text-white flex items-center gap-1 shadow-sm">
                          <Calendar className="w-3 h-3" />
                          <span>{count} {count === 1 ? 'evenement' : 'evenementen'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-black text-xl text-zinc-950 group-hover:text-[#FF4F00] transition-colors leading-snug">
                        {loc.name}
                      </h3>
                      {loc.address && (
                        <p className="text-xs text-zinc-500 mt-1 truncate">
                          {loc.address}, {loc.postal_code} {loc.city}
                        </p>
                      )}
                      {loc.description && (
                        <p className="text-xs text-zinc-600 mt-2.5 line-clamp-2 leading-relaxed">
                          {loc.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#FF4F00]">
                      <span>Bekijk programma</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Locations Directory List */}
        <section className="space-y-6 pt-6 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-black text-2xl text-zinc-950">
                Alle Locaties in Arnhem ({locations.length})
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Alfabetisch overzicht van alle zalen, cafés, monumenten en parken.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-3xl border border-border-warm shadow-card divide-y divide-border-warm overflow-hidden">
            {locations.map((loc) => {
              const count =
                eventCounts[loc.slug] || eventCounts[loc.name.toLowerCase()] || 0;

              return (
                <div
                  key={loc.slug}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/80 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-[#FF4F00] shrink-0 font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/locatie/${loc.slug}`}
                        className="font-bold text-zinc-950 hover:text-[#FF4F00] transition-colors truncate block text-sm sm:text-base"
                      >
                        {loc.name}
                      </Link>
                      <div className="text-xs text-zinc-500 flex items-center gap-2 truncate mt-0.5">
                        <span className="truncate">{loc.address || 'Arnhem'}</span>
                        {loc.postal_code && <span>• {loc.postal_code}</span>}
                        <span>• {loc.city || 'Arnhem'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {count > 0 && (
                      <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold">
                        {count} {count === 1 ? 'evenement' : 'evenementen'}
                      </span>
                    )}
                    <ButtonLink href={`/locatie/${loc.slug}`} variant="secondary" size="sm">
                      <span>Locatiepagina</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </ButtonLink>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

