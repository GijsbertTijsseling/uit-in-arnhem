import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Globe,
  Phone,
  Navigation,
  ExternalLink,
  Calendar,
  Clock,
  Ticket,
  ChevronRight,
  Sparkles,
  Building2,
  Share2,
} from 'lucide-react';
import { getLocationBySlug, getEventsByLocation, getLocations } from '@/lib/supabase/api';
import { formatDate, formatTime } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const locations = await getLocations();
  return locations.slice(0, 30).map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    return {
      title: 'Locatie niet gevonden | Uit in Arnhem',
    };
  }

  const title = `${location.name} in Arnhem | Programma, Agenda & Adres | Uit in Arnhem`;
  const description =
    location.description?.slice(0, 160) ||
    `Bekijk alle aankomende evenementen, concerten en activiteiten bij ${location.name} in Arnhem. Adres: ${location.address}, ${location.postal_code} ${location.city}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: location.featured_image ? [location.featured_image] : ['/logo.png'],
    },
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  // Fetch all upcoming & active events for this venue
  const events = await getEventsByLocation(slug, { includePast: false });
  // Also fetch past events if upcoming is empty to still show recent activity
  const allLocationEvents = events.length > 0 ? events : await getEventsByLocation(slug, { includePast: true });

  const hasEvents = allLocationEvents.length > 0;

  // Directions and Maps URLs
  const fullAddress = `${location.address || ''}, ${location.postal_code || ''} ${location.city || 'Arnhem'}`.trim();
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${location.name}, ${fullAddress}`
  )}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${location.name}, ${fullAddress}`
  )}`;

  const mapQuery = [location.name, location.address, location.postal_code, location.city || 'Arnhem']
    .filter(Boolean)
    .join(', ');

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  // Group events by Month Year
  const groupedEvents: { [key: string]: typeof allLocationEvents } = {};
  allLocationEvents.forEach((evt) => {
    const d = new Date(evt.start_date);
    const monthYear = isNaN(d.getTime())
      ? 'Binnenkort'
      : d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    if (!groupedEvents[monthYear]) {
      groupedEvents[monthYear] = [];
    }
    groupedEvents[monthYear].push(evt);
  });

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-20">
      {/* Breadcrumb strip */}
      <div className="bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <Link href="/locaties" className="hover:text-zinc-900 transition-colors">
              Locaties
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-900 font-bold truncate">{location.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Top Location Info Card (styled after legacy layout + modern Polish) */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Col: Location Info */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-zinc-950 tracking-tight leading-tight">
                  {location.name}
                </h1>

                {/* Address & Meta */}
                <div className="mt-5 space-y-2.5 text-sm text-zinc-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#FF4F00] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-zinc-900">
                        {location.address || 'Adres op aanvraag'}
                      </div>
                      <div className="text-zinc-500">
                        {location.city || 'Arnhem'}
                        {location.postal_code ? `, ${location.postal_code}` : ''}{' '}
                        {location.country || 'Nederland'}
                      </div>
                    </div>
                  </div>

                  {location.website && (
                    <div className="flex items-center gap-2.5 pt-1">
                      <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                      <a
                        href={location.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-zinc-800 hover:text-[#FF4F00] flex items-center gap-1.5 transition-colors group break-all"
                      >
                        <span className="group-hover:underline">{location.website}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-[#FF4F00] shrink-0" />
                      </a>
                    </div>
                  )}

                  {location.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                      <a
                        href={`tel:${location.phone}`}
                        className="text-xs font-medium text-zinc-700 hover:text-[#FF4F00] transition-colors"
                      >
                        {location.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Snippet */}
              {location.description && (
                <div className="mt-6 pt-6 border-t border-zinc-100">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {location.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Col: Interactive Map & Actions */}
            <div className="lg:col-span-5 relative bg-zinc-100 min-h-64 sm:min-h-80 border-t lg:border-t-0 lg:border-l border-zinc-200">
              <iframe
                title={`Kaart van ${location.name}`}
                src={mapEmbedUrl}
                className="w-full h-full border-0 filter saturate-90 contrast-95"
                loading="lazy"
              />

              {/* "Open in Maps" overlay button exactly like the legacy UI */}
              <div className="absolute top-4 right-4 z-10">
                <a
                  href={googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/95 hover:bg-white text-zinc-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-md border border-zinc-200/90 backdrop-blur-xs flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF4F00]" />
                </a>
              </div>

              {/* Bottom bar inside map card with quick actions */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between text-xs">
                  <div className="font-bold text-zinc-800 truncate px-1">
                    {location.name}
                  </div>
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold rounded-xl flex items-center gap-1 transition-colors shrink-0 shadow-xs"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Navigeer</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agenda Section: Events at this location */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF4F00]" />
                <h2 className="font-heading font-black text-2xl text-zinc-950">
                  Evenementen & Programma bij {location.name}
                </h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Aankomende voorstellingen, optredens, feesten en activiteiten op deze locatie.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/agenda/aanmelden"
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <span>Evenement toevoegen</span>
              </Link>
            </div>
          </div>

          {hasEvents ? (
            <div className="space-y-8">
              {Object.entries(groupedEvents).map(([monthGroup, monthEvents]) => (
                <div key={monthGroup} className="space-y-4">
                  {/* Month header divider */}
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-black text-sm uppercase tracking-wider text-zinc-700 bg-zinc-200/70 px-3 py-1 rounded-lg">
                      {monthGroup}
                    </span>
                    <div className="flex-1 h-px bg-zinc-200" />
                  </div>

                  {/* List of events matching legacy layout with modern styling */}
                  <div className="space-y-4">
                    {monthEvents.map((evt) => {
                      const evtDate = new Date(evt.start_date);
                      const dayNumber = isNaN(evtDate.getTime()) ? '' : evtDate.getDate();
                      const weekdayStr = isNaN(evtDate.getTime())
                        ? 'DAG'
                        : evtDate.toLocaleDateString('nl-NL', { weekday: 'short' }).toUpperCase();
                      const formattedDateString = formatDate(evt.start_date);
                      const timeStr = formatTime(evt.start_date);
                      const endTimeStr = evt.end_date ? formatTime(evt.end_date) : '';
                      const isFree = evt.price_type === 'free' || evt.price_from === 0;

                      return (
                        <div
                          key={evt.id || evt.slug}
                          className="bg-white rounded-3xl border border-zinc-200/90 shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all p-5 sm:p-6 flex flex-col md:flex-row gap-5 md:gap-6 items-stretch group"
                        >
                          {/* Left: Date Badge */}
                          <div className="flex md:flex-col items-center justify-center shrink-0 w-auto md:w-20 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3 text-center self-start">
                            <span className="text-xs font-extrabold text-[#FF4F00] tracking-wider uppercase">
                              {weekdayStr}
                            </span>
                            <span className="text-3xl font-black text-zinc-900 leading-none my-1">
                              {dayNumber}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">
                              {evtDate.toLocaleDateString('nl-NL', { month: 'short' })}
                            </span>
                          </div>

                          {/* Middle: Details */}
                          <div className="flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              {/* Date & Time line */}
                              <div className="text-xs font-semibold text-zinc-500 mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                <span>
                                  {formattedDateString}
                                  {timeStr ? `: ${timeStr}` : ''}
                                  {endTimeStr ? ` - ${endTimeStr}` : ''}
                                </span>
                              </div>

                              {/* Title */}
                              <Link
                                href={`/agenda/${evt.slug}`}
                                className="font-heading font-black text-xl sm:text-2xl text-zinc-950 group-hover:text-[#FF4F00] transition-colors leading-snug"
                              >
                                {evt.title}
                              </Link>

                              {/* Location subtitle */}
                              <div className="text-xs text-zinc-500 font-medium mt-1">
                                <span className="font-semibold text-zinc-700">{location.name}</span>
                                {location.address && ` ${location.address}, Arnhem`}
                              </div>

                              {/* Excerpt */}
                              <p className="text-sm text-zinc-600 mt-2.5 line-clamp-3 leading-relaxed">
                                {evt.short_description || evt.full_description?.replace(/<[^>]*>/g, '').slice(0, 180)}
                              </p>
                            </div>

                            {/* Price & Action Row */}
                            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
                              <div className="flex items-center gap-3">
                                <span className="font-black text-base text-zinc-900">
                                  {isFree ? 'Gratis entree' : `€${evt.price_from?.toFixed(2).replace('.', ',') || '–'}`}
                                </span>

                                {evt.is_highlight && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF3ED] text-[#FF4F00] text-[11px] font-bold">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Redactietip</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {evt.ticket_url && (
                                  <a
                                    href={evt.ticket_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                                  >
                                    <Ticket className="w-3.5 h-3.5" />
                                    <span>Tickets</span>
                                  </a>
                                )}
                                <Link
                                  href={`/agenda/${evt.slug}`}
                                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors"
                                >
                                  Bekijk details
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Right: Event Photo */}
                          {evt.hero_image_url && (
                            <Link
                              href={`/agenda/${evt.slug}`}
                              className="relative w-full md:w-56 lg:w-64 h-48 md:h-auto rounded-2xl overflow-hidden bg-zinc-100 shrink-0 self-stretch group-hover:opacity-95"
                            >
                              <Image
                                src={evt.hero_image_url}
                                alt={evt.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 256px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-zinc-200 p-10 text-center space-y-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-2xl mx-auto flex items-center justify-center text-zinc-400">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-black text-lg text-zinc-800">
                Geen aankomende evenementen bekend voor {location.name}
              </h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                Organiseer je een feest, concert, tentoonstelling of lezing bij {location.name}? Voeg je
                evenement direct toe aan de cultuuragenda van Arnhem.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/agenda/aanmelden"
                  className="px-5 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Evenement Aanmelden
                </Link>
                <Link
                  href="/agenda"
                  className="px-5 py-2.5 border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-xs font-bold rounded-xl transition-colors"
                >
                  Bekijk de hele agenda
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

