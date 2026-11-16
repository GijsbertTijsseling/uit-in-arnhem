import React from 'react';
import Link from 'next/link';
import { getArticles, getEvents } from '@/lib/supabase/api';
import { EventCard } from '@/components/agenda/EventCard';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { NewsletterCta } from '@/components/common/NewsletterCta';
import { HotspotHighlights } from '@/components/home/HotspotHighlights';
import { Calendar, ArrowRight, Sparkles, Flame, Compass } from 'lucide-react';
import { HomePageClient } from '@/components/home/HomePageClient';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [articles, events] = await Promise.all([
    getArticles(),
    getEvents(),
  ]);

  const featuredArticle = articles.find((a) => a.is_featured) || articles[0];
  const otherArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 3);
  const highlightEvents = events.filter((e) => e.is_highlight);
  const regularEvents = events.filter((e) => !e.is_highlight);
  const displayEvents = [...highlightEvents, ...regularEvents].slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* 1. HERO FEATURE STORY */}
      {featuredArticle && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF4F00]">
              <Flame className="w-4 h-4 fill-[#FF4F00]" />
              <span>Verhaal van de week</span>
            </div>
            <Link
              href="/artikelen"
              className="text-xs font-bold text-zinc-500 hover:text-[#FF4F00] uppercase tracking-wider inline-flex items-center gap-1 group"
            >
              Alle verhalen <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ArticleCard article={featuredArticle} featured={true} />
        </section>
      )}

      {/* 2. AGENDA SECTION WITH DYNAMIC DATE FILTER STRIP */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-2">
              <Calendar className="w-4 h-4" />
              <span>Wat is er te doen</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-zinc-900 tracking-tight">
              De Arnhem Agenda
            </h2>
            <p className="text-zinc-600 text-sm mt-1">
              Van intieme concerten in de Spijkerbuurt tot grote exposities in Museum Arnhem.
            </p>
          </div>

          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF4F00] transition-colors shadow-sm self-start sm:self-auto"
          >
            <span>Bekijk volledige agenda ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Client filterable component */}
        <HomePageClient initialEvents={events} />
      </section>

      {/* 3. HOTSPOTS & WIJKEN EXPLORER */}
      <HotspotHighlights />

      {/* 4. LATEST ARTICLES / MAGAZINE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Redactionele Tips</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-zinc-900 tracking-tight">
              Verhalen, Hotspots & Reviews
            </h2>
            <p className="text-zinc-600 text-sm mt-1">
              Gidsen door de stad geschreven door locals die Arnhem door en door kennen.
            </p>
          </div>

          <Link
            href="/artikelen"
            className="text-xs font-bold text-[#FF4F00] hover:text-[#E04500] uppercase tracking-wider inline-flex items-center gap-1 group"
          >
            Meer artikelen <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArticles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* 5. NEWSLETTER CTA BLOCK */}
      <NewsletterCta />
    </div>
  );
}
