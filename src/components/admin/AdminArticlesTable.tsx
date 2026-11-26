'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit3, Eye, Flame, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { setFeaturedArticle } from '@/lib/supabase/api';

interface AdminArticlesTableProps {
  initialArticles: Article[];
  viewCounts?: Record<string, { views: number; uniqueVisitors: number }>;
}

export function AdminArticlesTable({
  initialArticles,
  viewCounts = {},
}: AdminArticlesTableProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const featuredArticle = articles.find((a) => a.is_featured);

  const handleToggleFeatured = async (article: Article) => {
    const nextFeatured = !article.is_featured;
    setUpdatingId(article.id);
    setFeedback(null);

    const { success, error } = await setFeaturedArticle(article.id, nextFeatured);

    if (!success) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Kon uitgelicht verhaal niet bijwerken.',
      });
      setUpdatingId(null);
      return;
    }

    setArticles((prev) =>
      prev.map((item) => ({
        ...item,
        is_featured: item.id === article.id ? nextFeatured : nextFeatured ? false : item.is_featured,
      }))
    );

    setFeedback({
      type: 'success',
      message: nextFeatured
        ? `"${article.title}" is nu ingesteld als uitgelicht verhaal op de homepage. Het vorige uitgelichte verhaal is automatisch vervallen.`
        : `"${article.title}" is niet langer uitgelicht op de homepage.`,
    });

    setUpdatingId(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Huidig uitgelicht verhaal overzicht */}
      <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-700">
          <Flame className="w-4 h-4 text-[#FF4F00] fill-[#FF4F00] shrink-0" />
          {featuredArticle ? (
            <span>
              Uitgelicht op de homepage:{' '}
              <strong className="text-zinc-900">{featuredArticle.title}</strong>
            </span>
          ) : (
            <span>
              Geen artikel handmatig uitgelicht (de homepage toont dan automatisch het nieuwste verhaal).
            </span>
          )}
        </div>
        <span className="text-zinc-500 shrink-0">
          Maximaal 1 verhaal tegelijk
        </span>
      </div>

      {/* Feedback melding */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-6">Titel &amp; Teaser</th>
                <th className="py-4 px-4">Categorie</th>
                <th className="py-4 px-4">Uitgelicht</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Weergaven (30d)</th>
                <th className="py-4 px-4">Publicatiedatum</th>
                <th className="py-4 px-6 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {articles.map((article) => {
                const isUpdating = updatingId === article.id;
                const isFeatured = Boolean(article.is_featured);

                return (
                  <tr
                    key={article.id}
                    className={`transition-colors ${
                      isFeatured ? 'bg-[#FFF3ED]/35 hover:bg-[#FFF3ED]/50' : 'hover:bg-zinc-50/80'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                          <Image
                            src={article.featured_image_url || '/logo.png'}
                            alt={article.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-md">
                          <div className="font-bold text-zinc-900 line-clamp-1 text-sm">
                            {article.title}
                          </div>
                          <div className="text-zinc-500 line-clamp-1 mt-0.5 text-xs">
                            {article.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-semibold uppercase text-[10px] tracking-wider">
                        {article.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        type="button"
                        disabled={updatingId !== null}
                        onClick={() => handleToggleFeatured(article)}
                        title={
                          isFeatured
                            ? 'Klik om uitgelicht-status te verwijderen'
                            : 'Stel in als uitgelicht verhaal op de homepage'
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                          isFeatured
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Flame
                            className={`w-3.5 h-3.5 ${
                              isFeatured ? 'text-[#FF4F00] fill-[#FF4F00]' : 'text-zinc-400'
                            }`}
                          />
                        )}
                        <span>{isFeatured ? 'Uitgelicht' : 'Uitlichten'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          article.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {article.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      {(() => {
                        const stat = viewCounts[article.slug];
                        const views = stat?.views ?? 0;
                        const unique = stat?.uniqueVisitors ?? 0;
                        return (
                          <div
                            title={`${views.toLocaleString('nl-NL')} weergaven, ${unique.toLocaleString('nl-NL')} unieke dagbezoekers (30d)`}
                          >
                            <div className="font-bold text-zinc-900 tabular-nums">
                              {views.toLocaleString('nl-NL')}
                            </div>
                            <div className="text-[10px] text-zinc-400 tabular-nums">
                              {unique.toLocaleString('nl-NL')} uniek/dag
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    <td className="py-4 px-4 text-zinc-500">
                      {formatDate(article.published_at)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/artikelen/${article.slug}`}
                          target="_blank"
                          className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
                          title="Bekijk live pagina"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-2 text-zinc-600 hover:text-[#FF4F00] rounded-lg hover:bg-[#FFF3ED] transition-colors font-semibold"
                          title="Bewerken"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

