'use client';

import React from 'react';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface DateFilterStripProps {
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
}

export const DATE_FILTERS = [
  { id: 'all', label: 'Alle data' },
  { id: 'today', label: 'Vandaag' },
  { id: 'tomorrow', label: 'Morgen' },
  { id: 'weekend', label: 'Dit weekend' },
  { id: 'this_week', label: 'Deze week' },
  { id: 'next_week', label: 'Volgende week' },
];

export function DateFilterStrip({ selectedFilter, onSelectFilter }: DateFilterStripProps) {
  return (
    <div className="w-full bg-white border-y border-zinc-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2 shrink-0">
            <CalendarIcon className="w-4 h-4 text-[#FF4F00]" />
            <span className="hidden sm:inline">Wanneer:</span>
          </div>

          <div className="flex items-center gap-2">
            {DATE_FILTERS.map((item) => {
              const active = selectedFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectFilter(item.id)}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-[#FF4F00] text-white shadow-sm ring-2 ring-[#FF4F00]/20'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
