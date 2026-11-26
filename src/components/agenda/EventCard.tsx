'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Sparkles, Calendar, AlertCircle } from 'lucide-react';
import { AgendaItem } from '@/types';
import { formatTime, formatPrice } from '@/lib/utils';
import { getEventCategoryLabel } from '@/data/mockData';

interface EventCardProps {
  event: AgendaItem;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.start_date);
  const day = isNaN(eventDate.getTime()) ? '' : eventDate.getDate();
  const month = isNaN(eventDate.getTime())
    ? ''
    : eventDate.toLocaleDateString('nl-NL', { month: 'short' }).toUpperCase();
  const weekday = isNaN(eventDate.getTime())
    ? ''
    : eventDate.toLocaleDateString('nl-NL', { weekday: 'short' });

  const timeStr = formatTime(event.start_date);
  const isFree = event.price_type === 'free' || event.price_from === 0;
  const isCancelled = event.status === 'cancelled';
  const hasMultipleDates = event.performances && event.performances.length > 1;

  // Detect portrait theater posters (e.g. Posttheater / Ticketmatic)
  const initialIsPortrait =
    event.source === 'posttheater' ||
    Boolean(event.hero_image_url?.includes('ticketmatic')) ||
    Boolean(event.hero_image_url?.includes('portrait'));

  const [isPortrait, setIsPortrait] = useState(initialIsPortrait);

  return (
    <Link
      href={`/agenda/${event.slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isCancelled ? 'opacity-70 grayscale-30' : ''
        }`}
    >
      {/* Image container: 16:9 ratio with light background */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-100">
        {/* Ambient blurred backdrop that preserves full top-to-bottom colors */}
        {isPortrait && (
          <div className="absolute -inset-4 overflow-hidden pointer-events-none">
            <Image
              src={event.hero_image_url || '/logo.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-fill blur-2xl scale-115 opacity-80 brightness-105 saturate-110 transition-transform duration-500 group-hover:scale-125"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-white/5" />
          </div>
        )}

        {/* Foreground sharp image */}
        <Image
          src={event.hero_image_url || '/logo.png'}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalHeight > img.naturalWidth) {
              setIsPortrait(true);
            }
          }}
          className={`${isPortrait
            ? 'object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.18)]'
            : 'object-cover'
            } transition-transform duration-500 group-hover:scale-105`}
        />

        {/* Date sticker - High z-index to stay above foreground image */}
        <div className="absolute top-3 left-3 z-30 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md flex flex-col items-center justify-center border border-zinc-100 text-center min-w-13">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-none">
            {month}
          </span>
          <span className="text-xl font-black text-[#121212] leading-none my-0.5">
            {day}
          </span>
          <span className="text-[9px] font-semibold text-[#FF4F00] uppercase tracking-wider leading-none">
            {weekday}
          </span>
        </div>

        {/* Highlight or Cancelled badge */}
        {isCancelled ? (
          <div className="absolute top-3 right-3 z-30 bg-zinc-900/90 text-white px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-md">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>Afgelast</span>
          </div>
        ) : event.is_highlight ? (
          <div className="absolute top-3 right-3 z-30 bg-[#FF4F00] text-white px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>Tip van de Redactie</span>
          </div>
        ) : null}

        {/* Price & Category tags bottom - High z-index so tags never disappear behind image */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
          <span className="bg-black/80 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {getEventCategoryLabel(event.category)}
          </span>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${isFree
              ? 'bg-emerald-500 text-white'
              : 'bg-white/95 backdrop-blur-sm text-zinc-900 border border-zinc-200'
              }`}
          >
            {isFree ? 'Gratis' : event.price_from != null ? `Vanaf ${formatPrice(event.price_from)}` : 'Betaald'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Venue & Time metadata */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-2">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
              <span className="truncate">{event.venue_name}</span>
            </div>
            {timeStr && (
              <div className="flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{timeStr}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg text-zinc-900 leading-snug group-hover:text-[#FF4F00] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Short description */}
          {event.short_description && (
            <p className="text-zinc-600 text-xs mt-2 line-clamp-2 leading-relaxed">
              {event.short_description}
            </p>
          )}
        </div>

        {/* Multiple dates badge */}
        {hasMultipleDates && (
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
            <Calendar className="w-3.5 h-3.5 text-[#FF4F00]" />
            <span>Speelt op {event.performances?.length} data</span>
          </div>
        )}
      </div>
    </Link>
  );
}
