'use client';

import React, { useState, useMemo } from 'react';
import { AgendaItem } from '@/types';
import { EventCard } from '@/components/agenda/EventCard';
import { DateFilterStrip } from '@/components/agenda/DateFilterStrip';
import { EVENT_CATEGORIES } from '@/data/mockData';
import { Search, Filter, Calendar, X, Tag } from 'lucide-react';

interface AgendaPageClientProps {
  initialEvents: AgendaItem[];
  defaultCategory?: string;
  defaultFilter?: string;
}

export function AgendaPageClient({
  initialEvents,
  defaultCategory = 'all',
  defaultFilter = 'all',
}: AgendaPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedDateFilter, setSelectedDateFilter] = useState(defaultFilter);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const dayOfWeek = today.getDay();
    let fridayDiff = (5 - dayOfWeek + 7) % 7;
    const friday = new Date(today);
    friday.setDate(friday.getDate() + fridayDiff);
    friday.setHours(17, 0, 0, 0);

    const sunday = new Date(friday);
    sunday.setDate(sunday.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));
    sunday.setHours(23, 59, 59, 999);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return initialEvents.filter((item) => {
      // 1. Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 2. Price filter
      if (priceFilter === 'free' && item.price_type !== 'free' && item.price_from !== 0) {
        return false;
      }
      if (priceFilter === 'paid' && (item.price_type === 'free' || item.price_from === 0)) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.short_description?.toLowerCase().includes(q) || false;
        const matchesVenue = item.venue_name?.toLowerCase().includes(q) || false;
        if (!matchesTitle && !matchesDesc && !matchesVenue) return false;
      }

      // 4. Date filter
      const eDate = new Date(item.start_date);
      if (isNaN(eDate.getTime())) return true;

      if (selectedDateFilter === 'today') {
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);
        return eDate >= today && eDate <= endOfToday;
      }
      if (selectedDateFilter === 'tomorrow') {
        return eDate >= tomorrow && eDate <= endOfTomorrow;
      }
      if (selectedDateFilter === 'weekend') {
        return eDate >= friday && eDate <= sunday;
      }
      if (selectedDateFilter === 'this_week') {
        return eDate >= today && eDate <= nextWeek;
      }
      if (selectedDateFilter === 'next_week') {
        const endOfNextWeek = new Date(nextWeek);
        endOfNextWeek.setDate(endOfNextWeek.getDate() + 7);
        return eDate > nextWeek && eDate <= endOfNextWeek;
      }

      return true;
    });
  }, [initialEvents, selectedCategory, selectedDateFilter, priceFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Main Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search bar */}
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek op titel, podium (bijv. Luxor, Focus) of genre..."
              className="w-full pl-12 pr-10 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price Selector */}
          <div className="md:col-span-4 flex items-center bg-zinc-100 p-1 rounded-2xl">
            <button
              onClick={() => setPriceFilter('all')}
              type="button"
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                priceFilter === 'all'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Alles
            </button>
            <button
              onClick={() => setPriceFilter('free')}
              type="button"
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                priceFilter === 'free'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Gratis
            </button>
            <button
              onClick={() => setPriceFilter('paid')}
              type="button"
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                priceFilter === 'paid'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Tickets
            </button>
          </div>
        </div>

        {/* Date Filter Strip */}
        <DateFilterStrip
          selectedFilter={selectedDateFilter}
          onSelectFilter={setSelectedDateFilter}
        />

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {EVENT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-500">
          {filteredEvents.length}{' '}
          {filteredEvents.length === 1 ? 'evenement gevonden' : 'evenementen gevonden'}
        </p>

        {(selectedCategory !== 'all' || selectedDateFilter !== 'all' || priceFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDateFilter('all');
              setPriceFilter('all');
              setSearchQuery('');
            }}
            type="button"
            className="text-xs font-bold text-[#FF4F00] hover:underline"
          >
            Filters wissen
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-zinc-50 rounded-3xl border border-zinc-200 px-4">
          <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-zinc-800">
            Geen evenementen gevonden met deze filters
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
            Probeer een andere datum of reset de categorie en zoekterm.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDateFilter('all');
              setPriceFilter('all');
              setSearchQuery('');
            }}
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E04500] cursor-pointer"
          >
            Reset alle filters
          </button>
        </div>
      )}
    </div>
  );
}
