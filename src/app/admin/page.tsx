import React from 'react';
import Link from 'next/link';
import { getArticles, getEvents } from '@/lib/supabase/api';
import {
  FileText,
  Calendar,
  Eye,
  PlusCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [articles, events] = await Promise.all([
    getArticles(),
    getEvents(),
  ]);

  const draftArticles = articles.filter((a) => a.status === 'draft');
  const publishedArticles = articles.filter((a) => a.status === 'published');
  const highlightEvents = events.filter((e) => e.is_highlight);

  const stats = [
    {
      label: 'Artikelen',
      value: articles.length,
      sub: `${publishedArticles.length} live, ${draftArticles.length} concept`,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Agenda Items',
      value: events.length,
      sub: `${highlightEvents.length} redactionele tips`,
      icon: Calendar,
      color: 'text-[#FF4F00]',
      bg: 'bg-[#FFF3ED]',
    },
    {
      label: 'Maandelijkse Views',
      value: '42.850',
      sub: '+18% t.o.v. vorige maand',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Nieuwsbrief Leden',
      value: '3.420',
      sub: 'Wekelijkse Arnhemse lezers',
      icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            Redactie Dashboard
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
            Welkom bij het redactiesysteem van Uit in Arnhem. Beheer content, evenementen en publicaties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nieuw Artikel</span>
          </Link>
          <Link
            href="/admin/agenda/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Nieuw Evenement</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-xs flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{s.label}</div>
              <div className="text-2xl font-black text-zinc-900 mt-0.5">{s.value}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section: Recent Articles & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF4F00]" />
              <h2 className="font-heading font-black text-lg text-zinc-900">
                Laatste Artikelen
              </h2>
            </div>
            <Link
              href="/admin/articles"
              className="text-xs font-bold text-[#FF4F00] hover:underline"
            >
              Bekijk alles ({articles.length}) →
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {articles.slice(0, 4).map((art) => (
              <div key={art.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="truncate">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      {art.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      art.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {art.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 truncate">
                    {art.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {formatDate(art.published_at)} • Door {art.author_name || 'Redactie'}
                  </p>
                </div>

                <Link
                  href={`/admin/articles/${art.id}`}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
                >
                  Bewerken
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF4F00]" />
              <h2 className="font-heading font-black text-lg text-zinc-900">
                Aankomende Agenda Items
              </h2>
            </div>
            <Link
              href="/admin/agenda"
              className="text-xs font-bold text-[#FF4F00] hover:underline"
            >
              Bekijk alles ({events.length}) →
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {events.slice(0, 4).map((evt) => (
              <div key={evt.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="truncate">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      {evt.category}
                    </span>
                    {evt.is_highlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF3ED] text-[#FF4F00]">
                        ★ Tip
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 truncate">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{evt.venue_name}</span>
                    <span>•</span>
                    <span>{formatDate(evt.start_date)}</span>
                  </div>
                </div>

                <Link
                  href={`/admin/agenda/${evt.id}`}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-colors"
                >
                  Bewerken
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
