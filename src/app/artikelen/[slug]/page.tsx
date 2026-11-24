import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles, getEvents } from '@/lib/supabase/api';
import { LayoutTemplateView } from '@/components/articles/LayoutTemplateView';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { EventCard } from '@/components/agenda/EventCard';
import { ButtonLink } from '@/components/ui/Button';
import { ChevronLeft, ArrowRight, Share2, Sparkles } from 'lucide-react';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Artikel niet gevonden | Uit in Arnhem' };
  }

  return {
    title: `${article.title} | Uit in Arnhem`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.featured_image_url],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [allArticles, allEvents] = await Promise.all([
    getArticles(),
    getEvents(),
  ]);

  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const relatedEvents = allEvents.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/artikelen"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#FF4F00] uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Terug naar artikelen</span>
        </Link>
      </div>

      {/* Main Layout Component with template rendering */}
      <LayoutTemplateView article={article} />

      {/* Related Events Section */}
      {relatedEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sluit aan bij dit verhaal</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-zinc-900">
                Aanbevolen evenementen in Arnhem
              </h3>
            </div>
            <ButtonLink href="/agenda" variant="secondary" size="sm" className="self-start sm:self-auto shrink-0">
              <span>Bekijk agenda</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 className="font-heading font-extrabold text-2xl text-zinc-900">
              Meer verhalen om te ontdekken
            </h3>
            <ButtonLink href="/artikelen" variant="secondary" size="sm" className="self-start sm:self-auto shrink-0">
              <span>Alle artikelen</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
