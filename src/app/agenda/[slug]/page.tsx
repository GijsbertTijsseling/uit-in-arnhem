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
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Building2,
} from 'lucide-react';
import { formatDateTime, formatDate, formatTime } from '@/lib/utils';
import { formatRichContent } from '@/lib/contentRenderer';

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

  const targetLocationSlug =
    event.location_slug ||
    event.location?.slug ||
    (event.venue_name
      ? event.venue_name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : null);

  const addressQuery = [
    event.venue_name,
    event.venue_address,
    event.venue_city || 'Arnhem',
  ]
    .filter(Boolean)
    .join(', ');

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressQuery
  )}`;

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    addressQuery
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const isPortrait =
    event.source === 'posttheater' ||
    Boolean(event.hero_image_url?.includes('ticketmatic')) ||
    Boolean(event.hero_image_url?.includes('portrait'));

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
          <div className="relative aspect-16/9 w-full rounded-3xl overflow-hidden shadow-lg bg-zinc-950">
            {isPortrait ? (
              <>
                {/* Blurred ambient background for portrait theater posters */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={event.hero_image_url}
                    alt=""
                    fill
                    priority
                    className="object-cover scale-110 blur-2xl opacity-50 brightness-75 transition-all"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                </div>

                {/* Foreground sharp portrait image contained without any cropping */}
                <Image
                  src={event.hero_image_url}
                  alt={event.title}
                  fill
                  priority
                  className="object-contain relative z-10 drop-shadow-xl"
                />
              </>
            ) : (
              /* Standard landscape widescreen image (Musis, Luxor): full bleed */
              <Image
                src={event.hero_image_url}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />
            )}

            {event.is_highlight && (
              <div className="absolute top-4 left-4 z-20 bg-[#FF4F00] text-white px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-lg">
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
                className={`text-xs font-bold px-3 py-1 rounded-full ${isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-zinc-100 text-zinc-800'
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
            <div
              className="text-zinc-700 leading-relaxed text-base sm:text-lg
                [&_p.intro]:font-bold [&_p.intro]:text-lg [&_p.intro]:sm:text-xl [&_p.intro]:text-zinc-950 [&_p.intro]:leading-snug [&_p.intro]:mb-6
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_h2]:font-heading [&_h2]:font-black [&_h2]:text-2xl [&_h2]:text-zinc-950 [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:font-heading [&_h3]:font-black [&_h3]:text-xl [&_h3]:text-zinc-950 [&_h3]:mt-8 [&_h3]:mb-3
                [&_h4]:font-heading [&_h4]:font-black [&_h4]:text-lg [&_h4]:text-zinc-950 [&_h4]:mt-6 [&_h4]:mb-2
                [&_h5]:font-heading [&_h5]:font-black [&_h5]:text-lg [&_h5]:text-zinc-950 [&_h5]:mt-6 [&_h5]:mb-2
                [&_h6]:font-heading [&_h6]:font-bold [&_h6]:text-base [&_h6]:text-zinc-950 [&_h6]:mt-4 [&_h6]:mb-1
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_ul_li]:mb-1.5
                [&_strong]:font-bold [&_strong]:text-zinc-950
                [&_a]:text-[#FF4F00] [&_a]:underline [&_a]:decoration-[#FF4F00]/50 [&_a]:font-semibold hover:[&_a]:text-[#E04500] hover:[&_a]:decoration-[#E04500]"
              dangerouslySetInnerHTML={{ __html: formatRichContent(event.full_description, event.title) }}
            />
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
            {/* Status Alert if Cancelled */}
            {event.status === 'cancelled' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                ⚠️ Let op: Dit evenement is geannuleerd of verwijderd bij de organisator.
              </div>
            )}

            {/* Ticket & Price box */}
            <div className="pb-6 border-b border-zinc-200">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Entree</span>
              <div className="text-3xl font-black text-zinc-950 mt-1">
                {isFree ? 'Gratis entree' : `€${event.price_from?.toFixed(2)}`}
              </div>

              {event.ticket_url && event.status !== 'cancelled' ? (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Bestel tickets bij {event.venue_name}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              ) : event.status === 'cancelled' ? (
                <div className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-zinc-200 text-zinc-600 text-xs font-medium text-center">
                  Tickets niet meer beschikbaar
                </div>
              ) : (
                <div className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-medium text-center">
                  Vrije inloop / Geen ticket vereist
                </div>
              )}
            </div>

            {/* Multi-performance Schedule List */}
            {event.performances && event.performances.length > 1 && (
              <div className="pb-6 border-b border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF4F00]" />
                    Alle Speeldata ({event.performances.length})
                  </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {event.performances.map((perf, idx) => {
                    const pDate = new Date(perf.start_date);
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-zinc-200/80 text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-zinc-900">
                            {formatDate(perf.start_date)}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {formatTime(perf.start_date)} uur {perf.venue_sublocation ? `• ${perf.venue_sublocation}` : ''}
                          </div>
                        </div>

                        {perf.is_sold_out ? (
                          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full uppercase">
                            Uitverkocht
                          </span>
                        ) : perf.ticket_url ? (
                          <a
                            href={perf.ticket_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-[#FF4F00] text-white text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
                          >
                            <span>Tickets</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date & Time details */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-zinc-200 text-[#FF4F00] shrink-0">
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
                <div className="p-2 rounded-xl bg-white border border-zinc-200 text-[#FF4F00] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Locatie & Zaal
                  </div>
                  {targetLocationSlug ? (
                    <Link
                      href={`/locatie/${targetLocationSlug}`}
                      className="group inline-flex items-center gap-1.5 font-bold text-zinc-900 hover:text-[#FF4F00] transition-colors mt-0.5"
                    >
                      <span className="text-base font-black group-hover:underline">
                        {event.venue_name}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#FF4F00] transition-colors shrink-0" />
                    </Link>
                  ) : (
                    <div className="text-base font-bold text-zinc-900 mt-0.5">{event.venue_name}</div>
                  )}
                  {event.venue_address && (
                    <div className="text-xs text-zinc-600 mt-0.5">{event.venue_address}</div>
                  )}
                  {event.venue_city && (
                    <div className="text-xs text-zinc-400">{event.venue_city}</div>
                  )}
                </div>
              </div>

              {/* Mini Map preview */}
              <div className="pt-2">
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-zinc-200/90 shadow-2xs group">
                  <iframe
                    title={`Kaart van ${event.venue_name}`}
                    src={mapEmbedUrl}
                    className="w-full h-full border-0 pointer-events-none filter saturate-90 contrast-95 group-hover:filter-none transition-all"
                    loading="lazy"
                  />
                  {/* Clickable overlay to open Google Maps */}
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open locatie in Google Maps"
                    className="absolute inset-0 bg-transparent flex items-end justify-end p-2 group-hover:bg-black/5 transition-colors"
                  >
                    <span className="bg-white/95 hover:bg-white text-zinc-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-zinc-200/90 backdrop-blur-xs flex items-center gap-1 transition-transform group-hover:scale-105">
                      <span>Open kaart</span>
                      <ExternalLink className="w-3 h-3 text-[#FF4F00]" />
                    </span>
                  </a>
                </div>
              </div>

              {/* Organizer (only if known and distinct from venue) */}
              {event.organizer_name &&
                event.organizer_name !== 'Organisatie Arnhem' &&
                event.organizer_name.toLowerCase() !== event.venue_name.toLowerCase() && (
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
