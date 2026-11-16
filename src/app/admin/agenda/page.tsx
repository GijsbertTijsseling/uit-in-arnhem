import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getEvents } from '@/lib/supabase/api';
import { PlusCircle, Edit3, Eye, Sparkles, MapPin, Calendar, Ticket } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminAgendaListPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            Agenda & Evenementen Beheren
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Overzicht van concerten, voorstellingen en culturele evenementen in Arnhem.
          </p>
        </div>

        <Link
          href="/admin/agenda/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nieuw Evenement Toevoegen</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-6">Evenement</th>
                <th className="py-4 px-4">Datum & Tijd</th>
                <th className="py-4 px-4">Podium / Locatie</th>
                <th className="py-4 px-4">Categorie</th>
                <th className="py-4 px-4">Entree</th>
                <th className="py-4 px-6 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {events.map((evt) => {
                const isFree = evt.price_type === 'free' || evt.price_from === 0;
                return (
                  <tr key={evt.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                          <Image
                            src={evt.hero_image_url}
                            alt={evt.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-sm">
                          <div className="font-bold text-zinc-900 line-clamp-1 text-sm">
                            {evt.title}
                          </div>
                          <div className="text-zinc-500 line-clamp-1 mt-0.5 text-xs">
                            {evt.short_description}
                          </div>
                          {evt.is_highlight && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF4F00] mt-1">
                              <Sparkles className="w-3 h-3" />
                              Redactietip
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-800">
                        {formatDate(evt.start_date)}
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        {formatTime(evt.start_date)} uur
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-900">{evt.venue_name}</div>
                      <div className="text-zinc-400 text-[11px] truncate max-w-35">{evt.venue_address}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-semibold uppercase text-[10px] tracking-wider">
                        {evt.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        {isFree ? 'Gratis' : `€${evt.price_from?.toFixed(2)}`}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/agenda/${evt.slug}`}
                          target="_blank"
                          className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
                          title="Bekijk live"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/agenda/${evt.id}`}
                          className="p-2 text-zinc-600 hover:text-[#FF4F00] rounded-lg hover:bg-[#FFF3ED] transition-colors"
                          title="Bewerken"
                        >
                          <Edit3 className="w-4 h-4" />
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
