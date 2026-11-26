'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit3, Eye, Flame, CheckCircle2, AlertCircle, Loader2, Trash2, FileText } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { getArticleCategoryLabel } from '@/data/mockData';
import { setFeaturedArticle, deleteArticleFromSupabase } from '@/lib/supabase/api';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

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
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);
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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setFeedback(null);

    const { success, error } = await deleteArticleFromSupabase(deleteTarget.id);

    if (!success) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Kon artikel niet verwijderen.',
      });
      setDeleting(false);
      setDeleteTarget(null);
      return;
    }

    const removedTitle = deleteTarget.title;
    setArticles((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setFeedback({
      type: 'success',
      message: `"${removedTitle}" is definitief verwijderd.`,
    });
    setDeleting(false);
    setDeleteTarget(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Huidig uitgelicht verhaal overzicht */}
      <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-700 min-w-0">
          <Flame className="w-4 h-4 text-[#FF4F00] fill-[#FF4F00] shrink-0" />
          {featuredArticle ? (
            <span className="truncate">
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
          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-medium ${feedback.type === 'success'
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
      {articles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-zinc-300 mx-auto" />
          <h3 className="font-heading font-black text-zinc-900 text-lg">
            Geen artikelen gevonden
          </h3>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto">
            Er staan momenteel geen artikelen in het overzicht. Maak een nieuw artikel aan om te beginnen.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< md) */}
          <div className="md:hidden space-y-3">
            {articles.map((article) => {
              const isUpdating = updatingId === article.id;
              const isFeatured = Boolean(article.is_featured);
              const stat = viewCounts[article.slug];
              const views = stat?.views ?? 0;

              return (
                <div
                  key={article.id}
                  className={`rounded-2xl border p-4 shadow-xs space-y-3 transition-colors ${isFeatured
                      ? 'bg-[#FFF3ED]/40 border-[#FF4F00]/25'
                      : 'bg-white border-zinc-200/90'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                      <Image
                        src={article.featured_image_url || '/logo.png'}
                        alt={article.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-zinc-900 text-sm leading-snug line-clamp-2">
                        {article.title}
                      </div>
                      {article.excerpt && (
                        <div className="text-zinc-500 text-xs line-clamp-1 mt-0.5">
                          {article.excerpt}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${article.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                        }`}
                    >
                      {article.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold uppercase text-[10px] tracking-wider">
                      {getArticleCategoryLabel(article.category)}
                    </span>
                    <span>{formatDate(article.published_at)}</span>
                    <span className="tabular-nums">· {views.toLocaleString('nl-NL')} weergaven</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={updatingId !== null || deleting}
                      onClick={() => handleToggleFeatured(article)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${isFeatured
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Flame
                          className={`w-3.5 h-3.5 ${isFeatured ? 'text-[#FF4F00] fill-[#FF4F00]' : 'text-zinc-400'
                            }`}
                        />
                      )}
                      <span>{isFeatured ? 'Uitgelicht' : 'Uitlichten'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/artikelen/${article.slug}`}
                        target="_blank"
                        className="p-2 text-zinc-500 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors"
                        title="Bekijk live pagina"
                        aria-label={`Bekijk artikel ${article.title}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="p-2 text-zinc-600 hover:text-[#FF4F00] rounded-lg hover:bg-[#FFF3ED] transition-colors"
                        title="Bewerken"
                        aria-label={`Bewerk artikel ${article.title}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => setDeleteTarget(article)}
                        className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Artikel verwijderen"
                        aria-label={`Verwijder artikel ${article.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tablet & Desktop Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    <th className="py-3.5 pl-5 pr-3 w-full min-w-[180px]">Titel &amp; Teaser</th>
                    <th className="hidden lg:table-cell py-3.5 px-3 whitespace-nowrap">Categorie</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Uitgelicht</th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Status</th>
                    <th className="hidden xl:table-cell py-3.5 px-3 text-right whitespace-nowrap">Weergaven</th>
                    <th className="hidden lg:table-cell py-3.5 px-3 whitespace-nowrap">Datum</th>
                    <th className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {articles.map((article) => {
                    const isUpdating = updatingId === article.id;
                    const isFeatured = Boolean(article.is_featured);

                    return (
                      <tr
                        key={article.id}
                        className={`transition-colors ${isFeatured ? 'bg-[#FFF3ED]/35 hover:bg-[#FFF3ED]/50' : 'hover:bg-zinc-50/80'
                          }`}
                      >
                        <td className="py-3.5 pl-5 pr-3 max-w-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                              <Image
                                src={article.featured_image_url || '/logo.png'}
                                alt={article.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-zinc-900 truncate text-sm">
                                {article.title}
                              </div>
                              <div className="text-zinc-500 truncate mt-0.5 text-xs">
                                {article.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="hidden lg:table-cell py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-semibold uppercase text-[10px] tracking-wider">
                            {getArticleCategoryLabel(article.category)}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <button
                            type="button"
                            disabled={updatingId !== null || deleting}
                            onClick={() => handleToggleFeatured(article)}
                            title={
                              isFeatured
                                ? 'Klik om uitgelicht-status te verwijderen'
                                : 'Stel in als uitgelicht verhaal op de homepage'
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${isFeatured
                                ? 'bg-zinc-900 text-white shadow-xs'
                                : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                              }`}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Flame
                                className={`w-3.5 h-3.5 ${isFeatured ? 'text-[#FF4F00] fill-[#FF4F00]' : 'text-zinc-400'
                                  }`}
                              />
                            )}
                            <span>{isFeatured ? 'Uitgelicht' : 'Uitlichten'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${article.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                              }`}
                          >
                            {article.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                          </span>
                        </td>

                        <td className="hidden xl:table-cell py-3.5 px-3 text-right whitespace-nowrap">
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

                        <td className="hidden lg:table-cell py-3.5 px-3 text-zinc-500 whitespace-nowrap">
                          {formatDate(article.published_at)}
                        </td>

                        <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/artikelen/${article.slug}`}
                              target="_blank"
                              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
                              title="Bekijk live pagina"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/articles/${article.id}`}
                              className="p-1.5 text-zinc-600 hover:text-[#FF4F00] rounded-lg hover:bg-[#FFF3ED] transition-colors"
                              title="Bewerken"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              disabled={deleting}
                              onClick={() => setDeleteTarget(article)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                              title="Artikel verwijderen"
                              aria-label={`Verwijder artikel ${article.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        title="Artikel verwijderen"
        itemName={deleteTarget?.title || ''}
        description="Het artikel wordt definitief verwijderd uit het CMS en de website."
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
