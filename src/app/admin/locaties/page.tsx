import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocations, getEvents } from '@/lib/supabase/api';
import { PlusCircle, Edit3, Eye, MapPin, Building2, Globe, ExternalLink, Calendar } from 'lucide-react';

export const revalidate = 0;

export default async function AdminLocationsListPage() {
  const [locations, events] = await Promise.all([getLocations(), getEvents({ includePast: true })]);

  // Count events per location
  const eventCounts: { [key: string]: number } = {};
  events.forEach((evt) => {
    if (evt.location_slug) {
      eventCounts[evt.location_slug] = (eventCounts[evt.location_slug] || 0) + 1;
    } else if (evt.venue_name) {
      const lower = evt.venue_name.toLowerCase();
      eventCounts[lower] = (eventCounts[lower] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            Vaste Locaties & Podia Beheren
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Beheer alle vaste podia, theaters, monumenten en zalen in Arnhem ({locations.length} geregistreerd).
          </p>
        </div>

        <Link
          href="/admin/locaties/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nieuwe Locatie Toevoegen</span>
        </Link>
      </div>

      {/* Info notice about agenda auto-fill */}
      <div className="p-4 bg-orange-50/70 border border-[#FF4F00]/20 rounded-2xl flex items-center justify-between gap-4 text-xs text-zinc-700">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-[#FF4F00] shrink-0" />
          <span>
            <strong>Tip voor redacteuren:</strong> Vaste locaties kunnen direct worden geselecteerd bij het aanmaken van een nieuw agenda item. Adres, postcode en kaart worden dan direct automatisch ingevuld.
          </span>
        </div>
        <Link
          href="/locaties"
          target="_blank"
          className="font-bold text-[#FF4F00] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Publiek overzicht bekijken</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-6">Locatie</th>
                <th className="py-4 px-4">Adres & Postcode</th>
                <th className="py-4 px-4">Website</th>
                <th className="py-4 px-4 text-center">Gekoppelde Events</th>
                <th className="py-4 px-6 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {locations.map((loc) => {
                const count = eventCounts[loc.slug] || eventCounts[loc.name.toLowerCase()] || 0;
                return (
                  <tr key={loc.slug} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                          <Image
                            src={loc.featured_image || '/logo.png'}
                            alt={loc.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/locaties/${loc.slug}`}
                            className="font-bold text-zinc-900 hover:text-[#FF4F00] transition-colors text-sm"
                          >
                            {loc.name}
                          </Link>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            /locatie/{loc.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-800">
                        {loc.address || 'Adres onbekend'}
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        {loc.postal_code ? `${loc.postal_code} ` : ''}
                        {loc.city || 'Arnhem'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {loc.website ? (
                        <a
                          href={loc.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 hover:text-[#FF4F00] truncate max-w-44 flex items-center gap-1 group"
                        >
                          <span className="truncate group-hover:underline">{loc.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                        </a>
                      ) : (
                        <span className="text-zinc-400 italic">–</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      {count > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-[#FF4F00] font-bold text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{count}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">0</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/locatie/${loc.slug}`}
                          target="_blank"
                          title="Bekijk live pagina"
                          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/locaties/${loc.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 font-bold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Bewerken</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

