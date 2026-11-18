'use client';

import React, { useState, useMemo } from 'react';
import { AgendaItem } from '@/types';
import { EventCard } from '@/components/agenda/EventCard';
import { DateFilterStrip } from '@/components/agenda/DateFilterStrip';
import { Calendar, Search } from 'lucide-react';
import Link from 'next/link';

interface HomePageClientProps {
  initialEvents: AgendaItem[];
}

export function HomePageClient({ initialEvents }: HomePageClientProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Calculate weekend (upcoming Friday 17:00 to Sunday 23:59)
    const dayOfWeek = today.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    let fridayDiff = (5 - dayOfWeek + 7) % 7;
    const friday = new Date(today);
    friday.setDate(friday.getDate() + fridayDiff);
    friday.setHours(17, 0, 0, 0);

    const sunday = new Date(friday);
    sunday.setDate(sunday.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));
    sunday.setHours(23, 59, 59, 999);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return initialEvents.filter((event) => {
      const eDate = new Date(event.start_date);
      if (isNaN(eDate.getTime())) return true;
      const eEndDate = event.end_date ? new Date(event.end_date) : eDate;

      // Base filter: hide events that have already ended before today
      if (eEndDate < today && eDate < today) {
        return false;
      }

      if (selectedFilter === 'today') {
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);
        return (eDate >= today && eDate <= endOfToday) || (eDate <= today && eEndDate >= today);
      }

      if (selectedFilter === 'tomorrow') {
        return (eDate >= tomorrow && eDate <= endOfTomorrow) || (eDate <= tomorrow && eEndDate >= tomorrow);
      }

      if (selectedFilter === 'weekend') {
        return (eDate >= friday && eDate <= sunday) || (eDate <= sunday && eEndDate >= friday);
      }

      if (selectedFilter === 'this_week') {
        return (eDate >= today && eDate <= nextWeek) || (eDate <= nextWeek && eEndDate >= today);
      }

      if (selectedFilter === 'next_week') {
        const endOfNextWeek = new Date(nextWeek);
        endOfNextWeek.setDate(endOfNextWeek.getDate() + 7);
        return eDate > nextWeek && eDate <= endOfNextWeek;
      }

      return true;
    });
  }, [initialEvents, selectedFilter]);

  const displayList = filteredEvents.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Date Filter Bar */}
      <DateFilterStrip
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* Events Grid */}
      {displayList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {displayList.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-zinc-50 rounded-3xl border border-zinc-200/80 px-4">
          <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-zinc-800">
            Geen evenementen gevonden voor deze periode
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
            Probeer een andere datum of bekijk het complete aanbod in onze overzichtskalender.
          </p>
          <button
            onClick={() => setSelectedFilter('all')}
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E04500] cursor-pointer"
          >
            Toon alle data
          </button>
        </div>
      )}
    </div>
  );
}
