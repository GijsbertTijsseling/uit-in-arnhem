import React from 'react';
import { getArticles } from '@/lib/supabase/api';
import { ArticlesPageClient } from '@/components/articles/ArticlesPageClient';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Magazine & Artikelen | Uit in Arnhem',
  description: 'Inspirerende gidsen, restaurantrecensies, interviews en cultuurtips over het leven in Arnhem.',
};

export const revalidate = 60;

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedParams = await searchParams;
  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Arnhem Magazine</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-zinc-950 tracking-tight">
          Verhalen uit de stad
        </h1>
        <p className="text-zinc-600 text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
          Ontdek de beste koffiebars, verborgen terrassen aan de Rijn, museumrecensies en wandelroutes door Arnhemse buurten.
        </p>
      </div>

      <ArticlesPageClient
        initialArticles={articles}
        defaultCategory={resolvedParams.category || 'all'}
        defaultTag={resolvedParams.tag}
      />
    </div>
  );
}
