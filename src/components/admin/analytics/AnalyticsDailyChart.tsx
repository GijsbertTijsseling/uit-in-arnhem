'use client';

import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { AnalyticsDailyPoint } from '@/lib/analytics';

interface AnalyticsDailyChartProps {
  series: AnalyticsDailyPoint[];
  periodLabel: string;
}

type MetricMode = 'views' | 'unique';

function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

function formatFullDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function AnalyticsDailyChart({ series, periodLabel }: AnalyticsDailyChartProps) {
  const [metric, setMetric] = useState<MetricMode>('views');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hasData = series.length > 0 && series.some((p) => p.views > 0 || p.uniqueVisitors > 0);
  const activePoint =
    hoveredIndex !== null && series[hoveredIndex]
      ? series[hoveredIndex]
      : series.length > 0
      ? series[series.length - 1]
      : null;

  const maxValue = Math.max(
    1,
    ...series.map((p) => (metric === 'views' ? p.views : p.uniqueVisitors))
  );

  // Determine tick indices so x-axis labels don't overlap on dense ranges (e.g. 30d / 90d)
  const labelStep = series.length <= 10 ? 1 : series.length <= 31 ? 5 : Math.ceil(series.length / 7);

  return (
    <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FF4F00]" />
            <h2 className="font-heading font-black text-lg text-zinc-900">
              Bezoekersverloop ({periodLabel})
            </h2>
          </div>
          {activePoint ? (
            <p className="text-xs text-zinc-500 mt-1">
              <span className="font-semibold text-zinc-800">{formatFullDate(activePoint.date)}:</span>{' '}
              {activePoint.views.toLocaleString('nl-NL')} weergaven •{' '}
              {activePoint.uniqueVisitors.toLocaleString('nl-NL')} unieke dagbezoekers
            </p>
          ) : (
            <p className="text-xs text-zinc-500 mt-1">
              Dagelijkse weergaven en unieke dagbezoekers (cookieloos gemeten).
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('views')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              metric === 'views'
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            Weergaven
          </button>
          <button
            type="button"
            onClick={() => setMetric('unique')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              metric === 'unique'
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            Unieke dagbezoekers
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="py-14 text-center space-y-2">
          <BarChart3 className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="text-sm font-bold text-zinc-800">Nog geen meetgegevens voor deze periode</p>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Zodra bezoekers de publieke website bekijken, verschijnt hier automatisch het dagelijkse verloop.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Y-axis reference & bars */}
          <div className="relative pt-4">
            {/* Horizontal grid lines */}
            <div className="pointer-events-none absolute inset-x-0 top-4 bottom-6 flex flex-col justify-between">
              {[1, 0.5, 0].map((ratio) => (
                <div key={ratio} className="flex items-center gap-2">
                  <span className="w-10 text-right text-[10px] font-semibold text-zinc-400 tabular-nums shrink-0">
                    {Math.round(maxValue * ratio).toLocaleString('nl-NL')}
                  </span>
                  <div className="flex-1 border-b border-dashed border-zinc-200/80" />
                </div>
              ))}
            </div>

            {/* Bars container */}
            <div
              className="relative pl-12 h-56 flex items-end gap-1 sm:gap-1.5"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {series.map((point, idx) => {
                const value = metric === 'views' ? point.views : point.uniqueVisitors;
                const heightPct = value > 0 ? Math.max(3, Math.round((value / maxValue) * 100)) : 0;
                const isActive =
                  hoveredIndex === idx || (hoveredIndex === null && idx === series.length - 1);

                return (
                  <button
                    key={point.date}
                    type="button"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onFocus={() => setHoveredIndex(idx)}
                    aria-label={`${formatFullDate(point.date)}: ${point.views} weergaven, ${point.uniqueVisitors} unieke dagbezoekers`}
                    className="group relative flex-1 h-full flex flex-col justify-end items-center focus:outline-none cursor-pointer"
                  >
                    <div className="w-full h-[calc(100%-24px)] flex items-end justify-center">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[36px] rounded-t-md transition-all duration-150 ${
                          value === 0
                            ? 'bg-zinc-100 min-h-[2px]'
                            : isActive
                            ? 'bg-[#FF4F00]'
                            : metric === 'views'
                            ? 'bg-zinc-900/80 group-hover:bg-[#FF4F00]'
                            : 'bg-zinc-700/80 group-hover:bg-[#FF4F00]'
                        }`}
                      />
                    </div>
                    <div className="h-6 flex items-center justify-center">
                      {(idx % labelStep === 0 || idx === series.length - 1) && (
                        <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap">
                          {formatShortDate(point.date)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
