import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug, getEvents } from '@/lib/supabase/api';
import { CalendarExport } from '@/components/agenda/CalendarExport';
import { EventCard } from '@/components/agenda/EventCard';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ExternalLink,
  ChevronLeft,
  Share2,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { formatDateTime, formatDate, formatTime } from '@/lib/utils';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Evenement niet gevonden | Uit in Arnhem' };
  }

  return {
    title: `${event.title} | Uit in Arnhem`,
    description: event.short_description,
    openGraph: {
      title: event.title,
      description: event.short_description,
      images: [event.hero_image_url],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const allEvents = await getEvents();
  const relatedEvents = allEvents
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);

  const isFree = event.price_type === 'free' || event.price_from === 0;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue_name}, ${event.venue_address}, ${event.venue_city}`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/agenda"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#FF4F00] uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Terug naar agenda</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Media & Full Story */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Image */}
          <div className="relative aspect-16/9 w-full rounded-3xl overflow-hidden shadow-lg bg-zinc-100">
            <Image
              src={event.hero_image_url}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
            {event.is_highlight && (
              <div className="absolute top-4 left-4 bg-[#FF4F00] text-white px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Redactietip Arnhem</span>
              </div>
            )}
          </div>

          {/* Title & Category */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFF3ED] text-[#FF4F00] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#FF4F00]/20">
                {event.category}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-zinc-100 text-zinc-800'
                }`}
              >
                {isFree ? 'Gratis Toegang' : `Vanaf €${event.price_from?.toFixed(2)}`}
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl text-zinc-950 tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-zinc-600 text-lg leading-relaxed font-normal">
              {event.short_description}
            </p>
          </div>

          {/* Event description */}
          <div className="pt-6 border-t border-zinc-200 prose prose-zinc max-w-none">
            <h3 className="font-heading font-black text-xl text-zinc-900 mb-4">Over dit evenement</h3>
            <div className="space-y-4 text-zinc-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
              {event.full_description}
            </div>
          </div>

          {/* Calendar Export */}
          <div className="pt-6 border-t border-zinc-200 space-y-3">
            <h4 className="font-heading font-bold text-sm text-zinc-900">Agenda synchronisatie</h4>
            <CalendarExport event={event} />
          </div>
        </div>

        {/* Right Column: Venue, Time & Ticket Widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200/90 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-sm">
            {/* Ticket & Price box */}
            <div className="pb-6 border-b border-zinc-200">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Entree</span>
              <div className="text-3xl font-black text-zinc-950 mt-1">
                {isFree ? 'Gratis entree' : `€${event.price_from?.toFixed(2)}`}
              </div>

              {event.ticket_url ? (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#FF4F00] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#E04500] transition-colors shadow-sm"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Koop Tickets</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                </a>
              ) : (
                <div className="mt-4 w-full py-3 px-4 rounded-2xl bg-zinc-200/60 text-zinc-700 text-xs font-semibold text-center">
                  Vrije inloop / Geen ticket vereist
                </div>
              )}
            </div>

            {/* Date & Time details */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-zinc-200 text-[#FF4F00]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900">Datum & Tijd</div>
                  <div className="text-zinc-600 mt-0.5">{formatDateTime(event.start_date)}</div>
                  {event.end_date && (
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Tot {formatTime(event.end_date)} uur
                    </div>
                  )}
                </div>
              </div>

              {/* Venue & Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-zinc-200 text-[#FF4F00]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900">{event.venue_name}</div>
                  <div className="text-zinc-600 mt-0.5">{event.venue_address}</div>
                  <div className="text-xs text-zinc-400">{event.venue_city}</div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF4F00] hover:underline mt-2"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Organizer */}
              {event.organizer_name && (
                <div className="pt-4 border-t border-zinc-200 text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-700">Georganiseerd door: </span>
                  {event.organizer_name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related events */}
      {relatedEvents.length > 0 && (
        <section className="pt-12 border-t border-zinc-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-2xl text-zinc-900">
              Ook interessant in Arnhem
            </h3>
            <Link
              href="/agenda"
              className="text-xs font-bold text-[#FF4F00] hover:text-[#E04500] uppercase tracking-wider"
            >
              Volledige agenda bekijken →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedEvents.map((item) => (
              <EventCard key={item.id} event={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
