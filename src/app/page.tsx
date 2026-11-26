import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles, getEvents } from '@/lib/supabase/api';
import { EventCard } from '@/components/agenda/EventCard';
import { WijkMapSection } from '@/components/home/WijkMapSection';
import { PlanJeBezoekSection } from '@/components/home/PlanJeBezoekSection';
import { IntoArnhemHero } from '@/components/home/IntoArnhemHero';
import { FeaturedStorySection } from '@/components/home/FeaturedStorySection';
import { SocialMediaBlock } from '@/components/home/SocialMediaBlock';
import { ButtonLink } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { getArticleCategoryLabel } from '@/data/mockData';
import { Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [articles, events] = await Promise.all([
    getArticles(),
    getEvents(),
  ]);

  const featuredArticle = articles.find((a) => a.is_featured) || articles[0];
  const candidateArticles = articles.filter((a) => a.id !== featuredArticle?.id);
  const hasRealImage = (url?: string | null) =>
    Boolean(url && !url.includes('/logo') && !url.endsWith('logo.png'));
  const prioritizedArticles = [
    ...candidateArticles.filter((a) => hasRealImage(a.featured_image_url)),
    ...candidateArticles.filter((a) => !hasRealImage(a.featured_image_url)),
  ];
  const recentArticles = prioritizedArticles.slice(0, 4);
  const [leadArticle, ...listArticles] = recentArticles;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events
    .filter((event) => {
      const eDate = new Date(event.start_date);
      if (isNaN(eDate.getTime())) return true;
      const eEndDate = event.end_date ? new Date(event.end_date) : eDate;
      return !(eEndDate < today && eDate < today);
    })
    .slice(0, 6);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <IntoArnhemHero />

      {/* 2 & 3. UITGELICHT VERHAAL + BINNENKORT IN ARNHEM (#FDFCFA canvas) */}
      <div className="bg-canvas py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {featuredArticle && (
            <FeaturedStorySection article={featuredArticle} />
          )}

          <section id="agenda" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF4F00] mb-2">
                  Wat speelt er binnenkort
                </p>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight">
                  Binnenkort in Arnhem
                </h2>
                <p className="text-ink-body text-sm sm:text-base mt-1 max-w-xl">
                  De eerstvolgende concerten, theatervoorstellingen, festivals en exposities op een rij.
                </p>
              </div>

              <ButtonLink
                href="/agenda"
                variant="secondary"
                size="md"
                className="self-start sm:self-auto shrink-0"
              >
                <span>Bekijk alle evenementen ({events.length})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </ButtonLink>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-surface-subtle rounded-3xl border border-border-warm px-4">
                <Calendar className="w-10 h-10 text-ink-muted mx-auto mb-3" />
                <p className="text-sm text-ink-muted">
                  Er staan momenteel geen aankomende evenementen gepland.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* 4. NIEUWSTE ARTIKELEN UIT DE STAD (#FAF9F6 subtle band, open editorial layout) */}
      {recentArticles.length > 0 && (
        <section id="verhalen" className="bg-surface-subtle py-14 sm:py-20 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF4F00] mb-2">
                  Verhalen &amp; Tips
                </p>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight">
                  Nieuwste artikelen uit de stad
                </h2>
                <p className="text-ink-body text-sm sm:text-base mt-1 max-w-xl">
                  Achtergrondverhalen, interviews met lokale makers, horecatips en gidsen door Arnhem.
                </p>
              </div>

              <ButtonLink
                href="/artikelen"
                variant="secondary"
                size="md"
                className="self-start sm:self-auto shrink-0"
              >
                <span>Alle artikelen ({articles.length})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </ButtonLink>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Links: 1 groot artikel in natuurlijk 16:10-formaat */}
              {leadArticle && (
                <Link
                  href={`/artikelen/${leadArticle.slug}`}
                  className="lg:col-span-6 group flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-muted">
                    <Image
                      src={leadArticle.featured_image_url || '/logo.png'}
                      alt={leadArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={
                        hasRealImage(leadArticle.featured_image_url)
                          ? 'object-cover group-hover:scale-103 transition-transform duration-500'
                          : 'object-contain p-10 opacity-70'
                      }
                    />
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-ink-muted font-medium">
                      <span className="uppercase tracking-wider font-bold text-[#FF4F00]">
                        {getArticleCategoryLabel(leadArticle.category)}
                      </span>
                      <span aria-hidden="true">•</span>
                      <span>{formatDate(leadArticle.published_at)}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-ink group-hover:text-[#FF4F00] transition-colors leading-snug">
                        {leadArticle.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#FF4F00] shrink-0 mt-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-sm sm:text-base text-ink-body line-clamp-2 leading-relaxed">
                      {leadArticle.excerpt}
                    </p>
                  </div>
                </Link>
              )}

              {/* Rechts: 3 compacte verhalen met royale 4:3 thumbnails */}
              {listArticles.length > 0 && (
                <div className="lg:col-span-6 space-y-6">
                  {listArticles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/artikelen/${art.slug}`}
                      className="group flex items-start gap-4 sm:gap-5"
                    >
                      <div className="relative w-32 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-surface-muted shrink-0">
                        <Image
                          src={art.featured_image_url || '/logo.png'}
                          alt={art.title}
                          fill
                          sizes="(max-width: 640px) 128px, 176px"
                          className={
                            hasRealImage(art.featured_image_url)
                              ? 'object-cover group-hover:scale-105 transition-transform duration-500'
                              : 'object-contain p-4 opacity-70'
                          }
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
                        <div className="flex items-center gap-2 text-[11px] text-ink-muted font-medium">
                          <span className="uppercase tracking-wider font-bold text-[#FF4F00]">
                            {getArticleCategoryLabel(art.category)}
                          </span>
                          <span aria-hidden="true">•</span>
                          <span>{formatDate(art.published_at)}</span>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-heading font-extrabold text-base sm:text-lg text-ink group-hover:text-[#FF4F00] transition-colors leading-snug line-clamp-2">
                            {art.title}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 text-[#FF4F00] shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <p className="text-xs sm:text-sm text-ink-body line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. INTERACTIEVE WIJKKAART (#FDFCFA canvas) */}
      <div className="bg-canvas py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WijkMapSection />
        </div>
      </div>

      {/* 6. PLAN JE BEZOEK & PRAKTISCHE INFO (#FAF9F6 subtle band) */}
      <PlanJeBezoekSection />

      {/* 7. ARNHEM DOOR JOUW OGEN (#FDFCFA canvas) */}
      <SocialMediaBlock />
    </div>
  );
}
