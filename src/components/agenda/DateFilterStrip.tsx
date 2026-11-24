'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, CalendarDays, ChevronDown, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DateFilterStripProps {
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

export const DATE_FILTERS = [
  { id: 'all', label: 'Alle data' },
  { id: 'today', label: 'Vandaag' },
  { id: 'tomorrow', label: 'Morgen' },
  { id: 'weekend', label: 'Dit weekend' },
];

export function DateFilterStrip({
  selectedFilter,
  onSelectFilter,
  startDate = '',
  endDate = '',
  onDateRangeChange,
}: DateFilterStripProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync internal state when external props change
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  // Click outside listener for the popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const isCustomActive = selectedFilter === 'custom' && (Boolean(startDate) || Boolean(endDate));

  // Formatted label for active custom range
  const getRangeLabel = () => {
    if (!startDate && !endDate) return 'Datum kiezen';
    const sDate = startDate ? new Date(startDate + 'T00:00:00') : null;
    const eDate = endDate ? new Date(endDate + 'T00:00:00') : null;

    const formatShort = (d: Date) =>
      d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });

    if (sDate && eDate) {
      if (startDate === endDate) return formatShort(sDate);
      return `${formatShort(sDate)} – ${formatShort(eDate)}`;
    }
    if (sDate) return `Vanaf ${formatShort(sDate)}`;
    if (eDate) return `Tot ${formatShort(eDate)}`;
    return 'Datum kiezen';
  };

  const handleApply = () => {
    if (onDateRangeChange) {
      onDateRangeChange(tempStart, tempEnd);
    }
    onSelectFilter('custom');
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTempStart('');
    setTempEnd('');
    if (onDateRangeChange) {
      onDateRangeChange('', '');
    }
    onSelectFilter('all');
    setIsOpen(false);
  };

  return (
    <div className="w-full py-1">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 mr-1 shrink-0">
          <CalendarIcon className="w-4 h-4 text-[#FF4F00]" />
          <span>Wanneer:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DATE_FILTERS.map((item) => {
            const active = selectedFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectFilter(item.id);
                  if (item.id !== 'custom') {
                    setIsOpen(false);
                  }
                }}
                type="button"
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-150 cursor-pointer ${active
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Date range picker popover trigger */}
          <div className="relative inline-block" ref={popoverRef}>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer ${isCustomActive || selectedFilter === 'custom'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{isCustomActive ? getRangeLabel() : 'Datum kiezen'}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isCustomActive && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Wis datumfilter"
                  aria-label="Wis datumfilter"
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Popover for date range */}
            {isOpen && (
              <div className="absolute left-0 mt-2 z-40 bg-white rounded-2xl shadow-xl border border-zinc-200 p-4 w-[min(20rem,calc(100vw-2rem))] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                    <CalendarDays className="w-4 h-4 text-[#FF4F00]" />
                    <span>Selecteer periode</span>
                  </div>
                  {(tempStart || tempEnd) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[11px] font-semibold text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Wissen
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Van datum
                    </label>
                    <input
                      type="date"
                      value={tempStart}
                      onChange={(e) => setTempStart(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white transition-all text-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Tot en met
                    </label>
                    <input
                      type="date"
                      min={tempStart || undefined}
                      value={tempEnd}
                      onChange={(e) => setTempEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white transition-all text-zinc-800"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleApply}
                    disabled={!tempStart && !tempEnd}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Toepassen</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
