import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  DISTRICTS,
  getDistrictBySlug,
} from '@/data/districtsData';
import { getArticles, getEvents } from '@/lib/supabase/api';
import { HotspotCard } from '@/components/districts/HotspotCard';
import { DistrictCard } from '@/components/districts/DistrictCard';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { EventCard } from '@/components/agenda/EventCard';
import { ButtonLink } from '@/components/ui/Button';
import {
  ChevronLeft,
  ArrowRight,
  Bus,
  Bike,
  Car,
} from 'lucide-react';

interface DistrictDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DISTRICTS.map((district) => ({
    slug: district.slug,
  }));
}

export async function generateMetadata({
  params,
}: DistrictDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);

  if (!district) {
    return {
      title: 'Wijk niet gevonden | Uit in Arnhem',
    };
  }

  return {
    title: `${district.name} | Wijken van Arnhem`,
    description: district.description,
    openGraph: {
      title: `${district.name} - ${district.tagLine} | Uit in Arnhem`,
      description: district.description,
      images: [district.heroImage],
    },
  };
}

export default async function DistrictDetailPage({
  params,
}: DistrictDetailPageProps) {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);

  if (!district) {
    notFound();
  }

  // Fetch articles and events in parallel
  const [allArticles, allEvents] = await Promise.all([
    getArticles(),
    getEvents(),
  ]);

  // Filter articles strictly for this district based on authentic tags and venue associations
  const relatedArticles = allArticles.filter((article) => {
    const articleTags = (article.tags || []).map((t) => t.toLowerCase());
    const matchesTag = district.articleTags?.some((tag) =>
      articleTags.includes(tag.toLowerCase())
    );

    const searchSpace = `${article.title} ${article.excerpt || ''} ${article.slug}`.toLowerCase();
    const matchesKeyword = (district.articleTags || []).some((kw) =>
      searchSpace.includes(kw.toLowerCase())
    );

    const matchesHighlight = district.highlights.some((h) => {
      const cleanH = h.name.toLowerCase().split('&')[0].trim();
      return cleanH.length > 3 && searchSpace.includes(cleanH);
    });

    return matchesTag || matchesKeyword || matchesHighlight;
  });

  // Only display authentic articles that belong to this district (no unrelated fallback)
  const displayedArticles = relatedArticles.slice(0, 6);

  // Filter events strictly for this district based on authentic venues and tags (only current & upcoming)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const relatedEvents = allEvents.filter((event) => {
    const eDate = new Date(event.start_date);
    const eEndDate = event.end_date ? new Date(event.end_date) : eDate;
    if (eEndDate < startOfToday && eDate < startOfToday) return false;

    const venue = (event.venue_name || '').toLowerCase();
    const address = (event.venue_address || '').toLowerCase();
    const title = (event.title || '').toLowerCase();
    const desc = (event.short_description || event.full_description || '').toLowerCase();
    const searchSpace = `${venue} ${address} ${title} ${desc}`;

    const matchesKeyword = (district.articleTags || []).some((kw) =>
      searchSpace.includes(kw.toLowerCase())
    );

    const matchesHighlightVenue = district.highlights.some((h) => {
      const cleanH = h.name.toLowerCase().split('&')[0].trim();
      const addrClean = (h.address || '').toLowerCase();
      return (cleanH.length > 3 && searchSpace.includes(cleanH)) || (addrClean.length > 4 && address.includes(addrClean));
    });

    return matchesKeyword || matchesHighlightVenue;
  });

  // Only display authentic events that belong to this district (no unrelated fallback)
  const displayedEvents = relatedEvents.slice(0, 6);

  // Other districts for the navigation footer
  const otherDistricts = DISTRICTS.filter((d) => d.slug !== district.slug);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. TOP BREADCRUMB / NAV BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Link
          href="/wijken"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#FF4F00] uppercase tracking-wider transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Alle wijken van Arnhem</span>
        </Link>
      </div>

      {/* 2. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-ink text-white min-h-[380px] sm:min-h-[460px] flex flex-col justify-end shadow-card-hover">
          {/* Background Hero Image */}
          <Image
            src={district.heroImage}
            alt={district.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-3">
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight drop-shadow-xs">
              {district.name}
            </h1>

            <p className="text-base sm:text-xl text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-xs">
              {district.tagLine}
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: OVER DE WIJK */}
      <section
        id="over"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-5">
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-zinc-900 tracking-tight leading-tight">
              Het karakter van {district.shortName}
            </h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 text-base sm:text-lg leading-relaxed space-y-4">
              <p className="font-medium text-zinc-900">
                {district.description}
              </p>
              <p>{district.longDescription}</p>
            </div>
          </div>

          {/* District Quick Facts */}
          <div className="lg:col-span-4 bg-surface-muted border border-border-warm rounded-2xl p-6 space-y-5">
            <h3 className="font-heading font-bold text-base text-ink">
              In het kort
            </h3>

            <dl className="divide-y divide-border-warm text-sm">
              <div className="pb-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Sfeer
                </dt>
                <dd className="font-semibold text-ink mt-1">
                  {district.vibe}
                </dd>
              </div>

              <div className="pt-4">
                <dt className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Kenmerken
                </dt>
                <dd className="text-ink-body mt-1 leading-relaxed">
                  {district.characterTags.join(' · ')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: HOTSPOTS & HIGHLIGHTS */}
      <section
        id="highlights"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
              Hotspots & Highlights in {district.shortName}
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              De favoriete cafés, winkels, musea en bezienswaardigheden van locals
              en de redactie.
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {district.highlights.length} hotspots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {district.highlights.map((highlight) => (
            <HotspotCard key={highlight.name} highlight={highlight} />
          ))}
        </div>
      </section>

      {/* 5. SECTION 3: VERHALEN & ARTIKELEN */}
      {displayedArticles.length > 0 && (
        <section
          id="artikelen"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
                Verhalen uit {district.shortName}
              </h2>
              <p className="text-zinc-600 text-sm sm:text-base mt-1">
                Lees reportages, interviews en wandelroutes over deze wijk.
              </p>
            </div>

            <ButtonLink href="/artikelen" variant="secondary" size="sm" className="self-start sm:self-auto shrink-0">
              <span>Alle artikelen</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 6. SECTION 4: UITAGENDA IN DEZE WIJK */}
      {displayedEvents.length > 0 && (
        <section
          id="agenda"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
                Uitagenda in {district.shortName}
              </h2>
              <p className="text-zinc-600 text-sm sm:text-base mt-1">
                Evenementen, voorstellingen en activiteiten in en rond deze wijk.
              </p>
            </div>

            <ButtonLink href="/agenda" variant="secondary" size="sm" className="self-start sm:self-auto shrink-0">
              <span>Volledige agenda</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* 7. SECTION 5: PRAKTISCH & BEREIKBAARHEID */}
      <section
        id="praktisch"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6"
      >
        <div className="border-b border-zinc-200 pb-5">
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
            Bereikbaarheid van {district.shortName}
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base mt-1">
            Handige reisinformatie voor trein, trolleybus, fiets en auto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 space-y-2.5">
            <h3 className="font-heading font-bold text-base text-zinc-900 flex items-center gap-2">
              <Bus className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Openbaar Vervoer</span>
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {district.transportInfo.ov}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 space-y-2.5">
            <h3 className="font-heading font-bold text-base text-zinc-900 flex items-center gap-2">
              <Bike className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Met de Fiets</span>
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {district.transportInfo.bike}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 space-y-2.5">
            <h3 className="font-heading font-bold text-base text-zinc-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Parkeren & Auto</span>
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {district.transportInfo.parking}
            </p>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: BEKIJK ANDERE WIJKEN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6 border-t border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
              Bekijk ook andere wijken van Arnhem
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              Ontdek wat Arnhem nog meer te bieden heeft.
            </p>
          </div>

          <ButtonLink href="/wijken" variant="secondary" size="md" className="self-start sm:self-auto shrink-0">
            <span>Alle wijken op de kaart</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherDistricts.slice(0, 4).map((other) => (
            <DistrictCard key={other.id} district={other} />
          ))}
        </div>
      </section>
    </div>
  );
}
