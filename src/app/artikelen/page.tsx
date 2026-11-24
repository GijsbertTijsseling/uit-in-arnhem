import React from 'react';
import { getArticles } from '@/lib/supabase/api';
import { ArticlesPageClient } from '@/components/articles/ArticlesPageClient';

export const metadata = {
  title: 'Magazine & Artikelen | Uit in Arnhem',
  description: 'Inspirerende gidsen, restaurantrecensies, interviews en cultuurtips over het leven in Arnhem.',
};

export const revalidate = 60;

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedParams = await searchParams;
  const articles = await getArticles();
  const parsedPage = Number(resolvedParams.page);
  const defaultPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
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
        defaultPage={defaultPage}
      />
    </div>
  );
}
