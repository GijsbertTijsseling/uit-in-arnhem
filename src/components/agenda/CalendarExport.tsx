'use client';

import React from 'react';
import { CalendarPlus, Download } from 'lucide-react';
import { AgendaItem } from '@/types';

interface CalendarExportProps {
  event: AgendaItem;
}

export function CalendarExport({ event }: CalendarExportProps) {
  const downloadIcs = () => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 2 * 3600 * 1000);

    const formatDateForIcs = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Uit in Arnhem//Agenda//NL',
      'BEGIN:VEVENT',
      `UID:${event.id || event.slug}@uitinarnhem.nl`,
      `DTSTAMP:${formatDateForIcs(new Date())}`,
      `DTSTART:${formatDateForIcs(startDate)}`,
      `DTEND:${formatDateForIcs(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.short_description || ''}`,
      `LOCATION:${event.venue_name}, ${event.venue_address}, ${event.venue_city}`,
      `URL:https://uitinarnhem.nl/agenda/${event.slug}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGoogleCalendarUrl = () => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 2 * 3600 * 1000);

    const formatGoogleDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.short_description}\n\nMeer info: https://uitinarnhem.nl/agenda/${event.slug}`);
    const location = encodeURIComponent(`${event.venue_name}, ${event.venue_address}, ${event.venue_city}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={downloadIcs}
        type="button"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer"
        title="Download .ics bestand voor Apple Agenda, Outlook"
      >
        <Download className="w-3.5 h-3.5 text-[#FF4F00]" />
        <span>Voeg toe aan Agenda (.ics)</span>
      </button>

      <a
        href={getGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors"
      >
        <CalendarPlus className="w-3.5 h-3.5 text-[#FF4F00]" />
        <span>Google Agenda</span>
      </a>
    </div>
  );
}
