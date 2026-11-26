'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, FileText, Calendar, MapPin, Globe } from 'lucide-react';
import type { AnalyticsItemStat } from '@/lib/analytics';

interface AnalyticsBreakdownTabsProps {
  topPages: AnalyticsItemStat[];
  topEvents: AnalyticsItemStat[];
  topArticles: AnalyticsItemStat[];
  topLocations: AnalyticsItemStat[];
  periodLabel: string;
}

type TabKey = 'pages' | 'events' | 'articles' | 'locations';

export function AnalyticsBreakdownTabs({
  topPages,
  topEvents,
  topArticles,
  topLocations,
  periodLabel,
}: AnalyticsBreakdownTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('pages');

  const tabs: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    items: AnalyticsItemStat[];
    emptyText: string;
  }> = [
    {
      key: 'pages',
      label: "Alle pagina's",
      icon: Globe,
      items: topPages,
      emptyText: "Nog geen paginaweergaven geregistreerd in deze periode.",
    },
    {
      key: 'events',
      label: 'Agenda-items',
      icon: Calendar,
      items: topEvents,
      emptyText: 'Nog geen bezoeken aan agenda-items geregistreerd in deze periode.',
    },
    {
      key: 'articles',
      label: 'Artikelen',
      icon: FileText,
      items: topArticles,
      emptyText: 'Nog geen bezoeken aan artikelen geregistreerd in deze periode.',
    },
    {
      key: 'locations',
      label: 'Locaties',
      icon: MapPin,
      items: topLocations,
      emptyText: 'Nog geen bezoeken aan locatiepagina’s geregistreerd in deze periode.',
    },
  ];

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];
  const maxViews = Math.max(1, ...currentTab.items.map((item) => item.views));

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-lg text-zinc-900">
            Bezoeken per onderdeel ({periodLabel})
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Meest bekeken pagina&apos;s, agenda-items, artikelen en vaste locaties.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums ${
                    isActive ? 'bg-white/15 text-zinc-100' : 'bg-zinc-200/80 text-zinc-600'
                  }`}
                >
                  {tab.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {currentTab.items.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <currentTab.icon className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="text-sm font-bold text-zinc-800">{currentTab.emptyText}</p>
          <p className="text-xs text-zinc-500">
            Selecteer een andere periode of kom later terug zodra er meer verkeer is gemeten.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-3.5 px-6 w-12">#</th>
                <th className="py-3.5 px-4">Titel &amp; Pad</th>
                <th className="py-3.5 px-4 text-right w-36">Weergaven</th>
                <th className="py-3.5 px-4 text-right w-44">Unieke dagbezoekers</th>
                <th className="py-3.5 px-6 text-right w-20">Live</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {currentTab.items.map((item, idx) => {
                const barWidth = Math.max(4, Math.round((item.views / maxViews) * 100));
                return (
                  <tr key={`${item.path}-${idx}`} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-zinc-400 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5 max-w-xl">
                        <div className="font-bold text-zinc-900 text-sm line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono truncate">
                          {item.path}
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${barWidth}%` }}
                            className="h-full bg-[#FF4F00]/80 rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-zinc-900 text-sm tabular-nums">
                      {item.views.toLocaleString('nl-NL')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-zinc-600 tabular-nums">
                      {item.uniqueVisitors.toLocaleString('nl-NL')}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={item.path}
                        target="_blank"
                        title={`Open ${item.path}`}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-[#FF4F00] hover:bg-[#FFF3ED] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
