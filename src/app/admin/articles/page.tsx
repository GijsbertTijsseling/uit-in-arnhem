import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/supabase/api';
import { PlusCircle, Search, Edit3, Trash2, Eye, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminArticlesListPage() {
  const articles = await getArticles();

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

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-6">Titel & Teaser</th>
                <th className="py-4 px-4">Categorie</th>
                <th className="py-4 px-4">Template</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Publicatiedatum</th>
                <th className="py-4 px-6 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                        <Image
                          src={article.featured_image_url}
                          alt={article.title}
                          fill
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
                        {article.is_featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF4F00] mt-1">
                            <Sparkles className="w-3 h-3" />
                            Homepage Uitgelicht
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-semibold uppercase text-[10px] tracking-wider">
                      {article.category}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-zinc-600 font-mono text-[11px]">
                      {article.layout_template || 'standard'}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
