import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  DISTRICTS,
  getDistrictBySlug,
  District,
} from '@/data/districtsData';
import { getArticles, getEvents } from '@/lib/supabase/api';
import { HotspotCard } from '@/components/districts/HotspotCard';
import { DistrictCard } from '@/components/districts/DistrictCard';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { EventCard } from '@/components/agenda/EventCard';
import { NewsletterCta } from '@/components/common/NewsletterCta';
import {
  ChevronLeft,
  ArrowRight,
  Compass,
  MapPin,
  Sparkles,
  Bus,
  Bike,
  Car,
  Calendar,
  BookOpen,
  CheckCircle2,
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
        <div className="flex items-center justify-between">
          <Link
            href="/wijken"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#FF4F00] uppercase tracking-wider transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Alle wijken van Arnhem</span>
          </Link>

          <span className="text-xs font-semibold text-zinc-400 hidden sm:inline-block">
            Wijk van Arnhem: {district.shortName}
          </span>
        </div>
      </div>

      {/* 2. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white min-h-[420px] sm:min-h-[500px] flex flex-col justify-end shadow-2xl">
          {/* Background Hero Image */}
          <Image
            src={district.heroImage}
            alt={district.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#FF4F00] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Wijk
              </span>
              <span className="bg-white/90 backdrop-blur-sm text-zinc-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {district.vibe}
              </span>
              {district.characterTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-black/50 backdrop-blur-sm text-zinc-200 text-xs font-medium px-3 py-1 rounded-full border border-white/20"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              {district.name}
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-zinc-200 font-medium max-w-2xl leading-relaxed">
              {district.tagLine}
            </p>

            {/* Quick jump anchor links */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href="#over"
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
              >
                Over de wijk
              </a>
              <a
                href="#highlights"
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
              >
                Hotspots ({district.highlights.length})
              </a>
              <a
                href="#agenda"
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
              >
                Uitagenda
              </a>
              <a
                href="#praktisch"
                className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
              >
                Bereikbaarheid
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: OVER DE WIJK & KARAKTERISTIEKEN */}
      <section
        id="over"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00]">
              <Compass className="w-3.5 h-3.5" />
              <span>Over {district.shortName}</span>
            </div>
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

          {/* District Quick Facts & Highlights Card */}
          <div className="lg:col-span-5 bg-stone-50 border border-stone-200/90 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-heading font-black text-xl text-zinc-900">
              Wijkkenmerken & Sfeer
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF4F00]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Sfeer & Karakter
                  </h4>
                  <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                    {district.vibe}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF4F00]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Ligging & Buurten
                  </h4>
                  <p className="text-sm font-medium text-zinc-800 mt-0.5">
                    {district.characterTags.join(' • ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5 text-[#FF4F00]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Aantal Uitgelichte Hotspots
                  </h4>
                  <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                    {district.highlights.length} zorgvuldig geselecteerde tips
                  </p>
                </div>
              </div>
            </div>

            {/* Back to map button */}
            <div className="pt-2 border-t border-stone-200">
              <Link
                href="/wijken"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF4F00] transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Bekijk alle wijken op de interactieve kaart</span>
              </Link>
            </div>
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lokale tips</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
              Hotspots & Highlights in {district.shortName}
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              De favoriete cafés, winkels, musea en bezienswaardigheden van locals
              en de redactie.
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            {district.highlights.length} hotspots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {district.highlights.map((highlight) => (
            <HotspotCard
              key={highlight.name}
              highlight={highlight}
              accentColor={district.accentColor}
            />
          ))}
        </div>
      </section>

      {/* 5. SECTION 3: VERHALEN & ARTIKELEN */}
      <section
        id="artikelen"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Inspiratie & Verhalen</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
              Verhalen uit {district.shortName}
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              Lees reportages, interviews en wandelroutes over deze wijk.
            </p>
          </div>

          <Link
            href="/artikelen"
            className="text-xs font-bold text-zinc-500 hover:text-[#FF4F00] uppercase tracking-wider inline-flex items-center gap-1 group"
          >
            Alle artikelen{' '}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-50 rounded-2xl text-zinc-500 text-sm">
            Binnenkort verschijnen hier nieuwe artikelen over {district.shortName}.
          </div>
        )}
      </section>

      {/* 6. SECTION 4: UITAGENDA IN DEZE WIJK */}
      <section
        id="agenda"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Wat is er te doen</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
              Uitagenda in {district.shortName}
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              Evenementen, voorstellingen en activiteiten in en rond deze wijk.
            </p>
          </div>

          <Link
            href="/agenda"
            className="text-xs font-bold text-zinc-500 hover:text-[#FF4F00] uppercase tracking-wider inline-flex items-center gap-1 group"
          >
            Volledige agenda{' '}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-50 rounded-2xl text-zinc-500 text-sm">
            Momenteel geen evenementen in de wijkagenda voor {district.shortName}.
          </div>
        )}
      </section>

      {/* 7. SECTION 5: PRAKTISCH & BEREIKBAARHEID */}
      <section
        id="praktisch"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Praktische tips</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight">
            Bereikbaarheid van {district.shortName}
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base mt-1">
            Handige reisinformatie voor trein, trolleybus, fiets en auto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* OV Card */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-zinc-900">
              Openbaar Vervoer
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed flex-1">
              {district.transportInfo.ov}
            </p>
          </div>

          {/* Fiets Card */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-zinc-900">
              Met de Fiets
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed flex-1">
              {district.transportInfo.bike}
            </p>
          </div>

          {/* Parkeren Card */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-xs flex flex-col space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-zinc-900">
              Parkeren & Auto
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed flex-1">
              {district.transportInfo.parking}
            </p>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: BEKIJK ANDERE WIJKEN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6 border-t border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Verder verkennen</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
              Bekijk ook de andere wijken van Arnhem
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              Ontdek wat Arnhem nog meer te bieden heeft.
            </p>
          </div>

          <Link
            href="/wijken"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF4F00] transition-colors shadow-sm self-start sm:self-auto"
          >
            <span>Interactieve wijkkaart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherDistricts.slice(0, 4).map((other) => (
            <DistrictCard key={other.id} district={other} />
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterCta />
      </div>
    </div>
  );
}
