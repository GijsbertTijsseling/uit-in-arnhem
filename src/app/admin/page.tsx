import React from 'react';
import Link from 'next/link';
import { getArticles, getAllEventsForAdmin, getLocations } from '@/lib/supabase/api';
import { getAnalyticsOverview } from '@/lib/analytics';
import { MigrationPendingNotice } from '@/components/admin/analytics/MigrationPendingNotice';
import {
  FileText,
  Calendar,
  PlusCircle,
  Clock,
  MapPin,
  Star,
  BarChart3,
  Eye,
  Users,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getArticleCategoryLabel, getEventCategoryLabel } from '@/data/mockData';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [articles, allEvents, locations, analytics] = await Promise.all([
    getArticles(),
    getAllEventsForAdmin(),
    getLocations(),
    getAnalyticsOverview('30d'),
  ]);

  const draftArticles = articles.filter((a) => a.status === 'draft');
  const publishedArticles = articles.filter((a) => a.status === 'published');
  const submittedEvents = allEvents.filter((e) => e.status === 'submitted');
  const publishedEvents = allEvents.filter((e) => e.status === 'published');
  const highlightEvents = publishedEvents.filter((e) => e.is_highlight);

  const stats = [
    {
      label: 'Artikelen',
      value: articles.length,
      sub: `${publishedArticles.length} live, ${draftArticles.length} concept`,
      icon: FileText,
      color: 'text-zinc-700',
      bg: 'bg-zinc-100',
      href: '/admin/articles',
    },
    {
      label: 'Inzendingen ter Review',
      value: submittedEvents.length,
      sub: submittedEvents.length > 0 ? 'Wacht op goedkeuring' : 'Alles bijgewerkt',
      icon: Clock,
      color: submittedEvents.length > 0 ? 'text-[#FF4F00]' : 'text-zinc-600',
      bg: submittedEvents.length > 0 ? 'bg-[#FFF3ED]' : 'bg-zinc-100',
      href: '/admin/agenda',
    },
    {
      label: 'Live Agenda Items',
      value: publishedEvents.length,
      sub: `${highlightEvents.length} redactionele tips`,
      icon: Calendar,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/agenda',
    },
    {
      label: 'Vaste Locaties',
      value: locations.length,
      sub: 'Podia, musea & hotspots',
      icon: MapPin,
      color: 'text-zinc-700',
      bg: 'bg-zinc-100',
      href: '/admin/locaties',
    },
  ];

  const topEvent = analytics.topEvents[0] || null;
  const topArticle = analytics.topArticles[0] || null;

  const analyticsStats = [
    {
      label: 'Paginaweergaven (30d)',
      value: analytics.totalViews.toLocaleString('nl-NL'),
      sub: 'Totaal gemeten op publieke site',
      icon: Eye,
      color: 'text-[#FF4F00]',
      bg: 'bg-[#FFF3ED]',
      href: '/admin/statistieken',
    },
    {
      label: 'Unieke bezoekers vandaag',
      value: analytics.uniqueVisitorsToday.toLocaleString('nl-NL'),
      sub: 'Cookieloos gemeten per dag',
      icon: Users,
      color: 'text-zinc-700',
      bg: 'bg-zinc-100',
      href: '/admin/statistieken?period=today',
    },
    {
      label: 'Unieke dagbezoekers (30d)',
      value: analytics.uniqueVisitorsPeriod.toLocaleString('nl-NL'),
      sub: 'Som van unieke dagbezoekers',
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/statistieken?period=30d',
    },
    {
      label: 'Meest bekeken (30d)',
      value: topEvent
        ? `${topEvent.views.toLocaleString('nl-NL')} views`
        : topArticle
        ? `${topArticle.views.toLocaleString('nl-NL')} views`
        : '0 views',
      sub: topEvent?.title || topArticle?.title || 'Nog geen bezoekersdata',
      icon: BarChart3,
      color: 'text-zinc-700',
      bg: 'bg-zinc-100',
      href: '/admin/statistieken',
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

      {/* Pending Submissions Alert Banner */}
      {submittedEvents.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#FFF3ED] border border-[#FF4F00]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4F00] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm animate-pulse">
              {submittedEvents.length}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-heading font-black text-zinc-950">
                {submittedEvents.length === 1
                  ? 'Er wacht 1 externe evenement-aanmelding op beoordeling!'
                  : `Er wachten ${submittedEvents.length} externe evenement-aanmeldingen op beoordeling!`}
              </h4>
              <p className="text-xs text-zinc-600 mt-0.5">
                Organisatoren hebben nieuwe programma's ingestuurd. Beoordeel ze om ze live in de agenda te zetten.
              </p>
            </div>
          </div>
          <Link
            href="/admin/agenda"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0"
          >
            Aanmeldingen Beoordelen →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="bg-white p-5 rounded-2xl border border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm shadow-xs flex items-center gap-4 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{s.label}</div>
              <div className="text-2xl font-extrabold text-zinc-900 mt-0.5">{s.value}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{s.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics KPI Row (30d) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FF4F00]" />
            <h2 className="font-heading font-black text-lg text-zinc-900">
              Bezoekersstatistieken (30 dagen)
            </h2>
          </div>
          <Link
            href="/admin/statistieken"
            className="text-xs font-bold text-[#FF4F00] hover:underline"
          >
            Volledig overzicht →
          </Link>
        </div>

        {analytics.migrationPending && <MigrationPendingNotice compact />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsStats.map((s, idx) => (
            <Link
              key={idx}
              href={s.href}
              className="bg-white p-5 rounded-2xl border border-zinc-200/90 hover:border-zinc-300 hover:shadow-sm shadow-xs flex items-center gap-4 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider truncate">
                  {s.label}
                </div>
                <div className="text-2xl font-extrabold text-zinc-900 mt-0.5 tabular-nums truncate">
                  {s.value}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{s.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
                      {getArticleCategoryLabel(art.category)}
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
              Bekijk alles ({allEvents.length}) →
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {allEvents.slice(0, 4).map((evt) => (
              <div key={evt.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="truncate">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      {getEventCategoryLabel(evt.category)}
                    </span>
                    {evt.is_highlight && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF3ED] text-[#FF4F00]">
                        <Star className="w-2.5 h-2.5 fill-[#FF4F00]" />
                        <span>Tip</span>
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

      {/* Top 5 Agenda Items & Top 5 Articles (30d) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 5 Agenda Items */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF4F00]" />
              <h2 className="font-heading font-black text-lg text-zinc-900">
                Top 5 Agenda-items (30d)
              </h2>
            </div>
            <Link
              href="/admin/statistieken"
              className="text-xs font-bold text-[#FF4F00] hover:underline"
            >
              Alle cijfers →
            </Link>
          </div>

          {analytics.topEvents.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">
              Nog geen bezoekersdata voor agenda-items in de afgelopen 30 dagen.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {analytics.topEvents.slice(0, 5).map((item, idx) => (
                <div key={item.path} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-zinc-900 truncate">{item.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {item.uniqueVisitors.toLocaleString('nl-NL')} unieke dagbezoekers
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-extrabold text-zinc-900 tabular-nums">
                      {item.views.toLocaleString('nl-NL')} views
                    </span>
                    <Link
                      href={item.path}
                      target="_blank"
                      title="Bekijk live pagina"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-[#FF4F00] hover:bg-[#FFF3ED] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top 5 Articles */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF4F00]" />
              <h2 className="font-heading font-black text-lg text-zinc-900">
                Top 5 Artikelen (30d)
              </h2>
            </div>
            <Link
              href="/admin/statistieken"
              className="text-xs font-bold text-[#FF4F00] hover:underline"
            >
              Alle cijfers →
            </Link>
          </div>

          {analytics.topArticles.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">
              Nog geen bezoekersdata voor artikelen in de afgelopen 30 dagen.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {analytics.topArticles.slice(0, 5).map((item, idx) => (
                <div key={item.path} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-zinc-900 truncate">{item.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {item.uniqueVisitors.toLocaleString('nl-NL')} unieke dagbezoekers
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-extrabold text-zinc-900 tabular-nums">
                      {item.views.toLocaleString('nl-NL')} views
                    </span>
                    <Link
                      href={item.path}
                      target="_blank"
                      title="Bekijk live pagina"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-[#FF4F00] hover:bg-[#FFF3ED] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
