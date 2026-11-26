import React from 'react';
import Link from 'next/link';
import { getArticles } from '@/lib/supabase/api';
import { getEntityViewCounts } from '@/lib/analytics';
import { PlusCircle } from 'lucide-react';
import { AdminArticlesTable } from '@/components/admin/AdminArticlesTable';

export const revalidate = 0;

export default async function AdminArticlesListPage() {
  const [articles, viewCounts] = await Promise.all([
    getArticles(),
    getEntityViewCounts('article', 30),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            Artikelen Beheren
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Overzicht van alle verhalen, recensies en redactionele tips in het magazine.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nieuw Artikel Schrijven</span>
        </Link>
      </div>

      <AdminArticlesTable initialArticles={articles} viewCounts={viewCounts} />
    </div>
  );
}
