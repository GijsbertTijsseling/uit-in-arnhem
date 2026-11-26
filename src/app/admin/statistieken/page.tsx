import React from 'react';
import Link from 'next/link';
import { Eye, Users, TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { getAnalyticsOverview, type AnalyticsPeriod } from '@/lib/analytics';
import { AnalyticsDailyChart } from '@/components/admin/analytics/AnalyticsDailyChart';
import { AnalyticsBreakdownTabs } from '@/components/admin/analytics/AnalyticsBreakdownTabs';
import { MigrationPendingNotice } from '@/components/admin/analytics/MigrationPendingNotice';

export const revalidate = 0;

interface AdminStatisticsPageProps {
  searchParams: Promise<{ period?: string }>;
}

const PERIOD_OPTIONS: Array<{ value: AnalyticsPeriod; label: string; shortLabel: string }> = [
  { value: 'today', label: 'Vandaag', shortLabel: 'vandaag' },
  { value: '7d', label: '7 dagen', shortLabel: '7d' },
  { value: '30d', label: '30 dagen', shortLabel: '30d' },
  { value: '90d', label: '90 dagen', shortLabel: '90d' },
  { value: 'all', label: 'Totaal', shortLabel: 'totaal' },
];

function parsePeriod(raw?: string): AnalyticsPeriod {
  if (raw === 'today' || raw === '7d' || raw === '30d' || raw === '90d' || raw === 'all') {
    return raw;
  }
  return '30d';
}

export default async function AdminStatisticsPage({ searchParams }: AdminStatisticsPageProps) {
  const params = await searchParams;
  const period = parsePeriod(params?.period);
  const overview = await getAnalyticsOverview(period);

  const activeOption =
    PERIOD_OPTIONS.find((opt) => opt.value === period) || PERIOD_OPTIONS[2];

  const daysCount = Math.max(1, overview.dailySeries.length);
  const avgViewsPerDay = Math.round(overview.totalViews / daysCount);

  const kpis = [
    {
      label: `Paginaweergaven (${activeOption.shortLabel})`,
      value: overview.totalViews.toLocaleString('nl-NL'),
      sub: 'Totaal aantal geregistreerde pageviews',
      icon: Eye,
      color: 'text-[#FF4F00]',
      bg: 'bg-[#FFF3ED]',
    },
    {
      label: 'Unieke bezoekers vandaag',
      value: overview.uniqueVisitorsToday.toLocaleString('nl-NL'),
      sub: 'Cookieloos gemeten per dag',
      icon: Users,
      color: 'text-zinc-700',
      bg: 'bg-zinc-100',
    },
    {
      label: `Unieke dagbezoekers (${activeOption.shortLabel})`,
      value: overview.uniqueVisitorsPeriod.toLocaleString('nl-NL'),
      sub:
        period === 'today'
          ? 'Cookieloos gemeten per dag'
          : 'Som van unieke dagbezoekers (cookieloos)',
      icon: Activity,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Gem. weergaven per dag',
      value: avgViewsPerDay.toLocaleString('nl-NL'),
      sub:
        period === 'today'
          ? 'Actueel daggemiddelde'
          : `Over ${daysCount} ${daysCount === 1 ? 'dag' : 'dagen'} in deze periode`,
      icon: TrendingUp,
      color: 'text-zinc-700',
      bg: 'bg-zinc-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Period Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            Bezoekersstatistieken
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Cookieloos overzicht van websitebezoeken per pagina, agenda-item, artikel en locatie.
          </p>
        </div>

        <nav aria-label="Periodefilter" className="flex flex-wrap items-center gap-2">
          {PERIOD_OPTIONS.map((opt) => {
            const isActive = opt.value === period;
            const href =
              opt.value === '30d'
                ? '/admin/statistieken'
                : `/admin/statistieken?period=${opt.value}`;

            return (
              <Link
                key={opt.value}
                href={href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Migration Pending Notice */}
      {overview.migrationPending && <MigrationPendingNotice />}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-xs flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider truncate">
                {kpi.label}
              </div>
              <div className="text-2xl font-extrabold text-zinc-900 mt-0.5 tabular-nums">
                {kpi.value}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Trend Chart */}
      <AnalyticsDailyChart
        series={overview.dailySeries}
        periodLabel={activeOption.label}
      />

      {/* Breakdown Tabs */}
      <AnalyticsBreakdownTabs
        topPages={overview.topPages}
        topEvents={overview.topEvents}
        topArticles={overview.topArticles}
        topLocations={overview.topLocations}
        periodLabel={activeOption.label}
      />

      {/* Privacy & Methodology Note */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex items-start gap-3 text-xs text-zinc-600">
        <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold text-zinc-800">Privacyvriendelijke meting:</span> Statistieken
          worden volledig cookieloos verzameld met een dagelijks roterende hash zonder opslag van
          IP-adressen. Bekende zoekmachine-bots en CMS-bezoeken worden automatisch uitgesloten. Over
          meerdaagse periodes wordt de som van unieke dagbezoekers getoond.
        </p>
      </div>
    </div>
  );
}
