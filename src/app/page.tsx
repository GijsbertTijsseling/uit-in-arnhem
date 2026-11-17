import React from 'react';
import Link from 'next/link';
import { getArticles, getEvents } from '@/lib/supabase/api';
import { EventCard } from '@/components/agenda/EventCard';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { NewsletterCta } from '@/components/common/NewsletterCta';
import { HotspotHighlights } from '@/components/home/HotspotHighlights';
import { IntoArnhemHero } from '@/components/home/IntoArnhemHero';
import { SocialMediaBlock } from '@/components/home/SocialMediaBlock';
import { HomePageClient } from '@/components/home/HomePageClient';
import { Calendar, ArrowRight, Sparkles, BookOpen, Flame } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [articles, events] = await Promise.all([
    getArticles(),
    getEvents(),
  ]);

  const featuredArticle = articles.find((a) => a.is_featured) || articles[0];
  const recentArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-16 sm:space-y-20">
      {/* 1. HERO SECTION WITH ICONIC ARNHEM BRIDGE BACKGROUND & CALM UNIFORM PILLS */}
      <IntoArnhemHero />

      {/* 2. UITGELICHT VERHAAL (TOP HIGHLIGHT STORY) */}
      {featuredArticle && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF4F00]">
              <Flame className="w-4 h-4 fill-[#FF4F00]" />
              <span>Uitgelicht Verhaal</span>
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

      {/* 3. DE ARNHEM UITAGENDA */}
      <section id="agenda" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-2">
              <Calendar className="w-4 h-4" />
              <span>Wat is er te doen in Arnhem</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-zinc-900 tracking-tight">
              De Arnhem Uitagenda
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1 max-w-xl">
              De meest actuele concerten, theatervoorstellingen, festivals en exposities op een rij.
            </p>
          </div>

          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-[#FF4F00] transition-colors shadow-sm self-start sm:self-auto"
          >
            <span>Bekijk alle evenementen ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Date Filter & Events Grid */}
        <HomePageClient initialEvents={events} />
      </section>

      {/* 4. VERHALEN UIT DE STAD (NIEUWS & ARTIKELEN) */}
      <section id="verhalen" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Verhalen & Tips</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-zinc-900 tracking-tight">
              Nieuwste artikelen uit de stad
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1 max-w-xl">
              Achtergrondverhalen, interviews met lokale makers, horecatips en gidsen door Arnhem.
            </p>
          </div>

          <Link
            href="/artikelen"
            className="text-xs font-bold text-[#FF4F00] hover:text-[#E04500] uppercase tracking-wider inline-flex items-center gap-1 group self-start sm:self-auto"
          >
            Alle artikelen bekijken ({articles.length}) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* 5. WIJKEN & SFEER VAN ARNHEM */}
      <HotspotHighlights />

      {/* 6. VOLG ONS OP SOCIAL MEDIA (Instagram Community) */}
      <SocialMediaBlock />

      {/* 7. ARNHEMSE WEEKENDBRIEF / NIEUWSBRIEF */}
      <NewsletterCta />
    </div>
  );
}
