'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AgendaItem } from '@/types';
import { updateEventStatus } from '@/lib/supabase/api';
import { getCurrentEditorUser } from '@/lib/auth';
import { formatDate, formatTime } from '@/lib/utils';
import {
  Calendar,
  Sparkles,
  Edit3,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Ticket,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  PlusCircle,
  Search,
} from 'lucide-react';

interface AdminAgendaManagerProps {
  initialEvents: AgendaItem[];
  userRole?: string;
  viewCounts?: Record<string, { views: number; uniqueVisitors: number }>;
}

export function AdminAgendaManager({
  initialEvents,
  userRole: initialRole,
  viewCounts = {},
}: AdminAgendaManagerProps) {
  const [userRole, setUserRole] = useState<string>(initialRole || 'editor');
  const [events, setEvents] = useState<AgendaItem[]>(initialEvents);

  useEffect(() => {
    if (initialRole) return;
    getCurrentEditorUser().then((editor) => {
      if (editor?.role) {
        setUserRole(editor.role);
      }
    });
  }, [initialRole]);
  const [activeTab, setActiveTab] = useState<'submitted' | 'all' | 'published' | 'other'>(
    initialEvents.some((e) => e.status === 'submitted') ? 'submitted' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (eventId: string, newStatus: 'published' | 'rejected') => {
    setLoadingId(eventId);
    try {
      const res = await updateEventStatus(eventId, newStatus);
      if (res.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
        );
        showToast(
          newStatus === 'published'
            ? 'Evenement goedgekeurd en gepubliceerd in de live agenda!'
            : 'Evenement afgewezen.',
          'success'
        );
      } else {
        showToast('Fout bij het bijwerken van de status.', 'error');
      }
    } catch {
      showToast('Er is een onverwachte fout opgetreden.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  // Counts
  const submittedCount = events.filter((e) => e.status === 'submitted').length;
  const publishedCount = events.filter((e) => e.status === 'published').length;
  const otherCount = events.filter((e) => e.status === 'draft' || e.status === 'rejected' || e.status === 'missing').length;

  // Filtered by tab and search
  const filteredEvents = events.filter((evt) => {
    // Tab filter
    if (activeTab === 'submitted' && evt.status !== 'submitted') return false;
    if (activeTab === 'published' && evt.status !== 'published') return false;
    if (activeTab === 'other' && (evt.status === 'published' || evt.status === 'submitted')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchVenue = (evt.venue_name || '').toLowerCase().includes(q);
      const matchContact = (evt.contact_name || '').toLowerCase().includes(q) || (evt.contact_email || '').toLowerCase().includes(q);
      const matchCategory = (evt.category || '').toLowerCase().includes(q);
      return matchTitle || matchVenue || matchContact || matchCategory;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-3 transition-all animate-in fade-in shadow-md ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header and CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            Agenda & Inzendingen Beheer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Beoordeel externe evenement-aanmeldingen en beheer de culturele programmering in Arnhem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userRole === 'admin' && (
            <Link
              href="/admin/agenda/bronnen"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Scrapers & Bronnen</span>
            </Link>
          )}

          <Link
            href="/admin/agenda/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nieuw Evenement</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-zinc-200/70 rounded-2xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'submitted'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span>Inzendingen ter Goedkeuring</span>
            {submittedCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF4F00] text-white animate-pulse">
                {submittedCount}
              </span>
            ) : (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === 'submitted' ? 'bg-white/15 text-zinc-200' : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                0
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Alle Evenementen ({events.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'published'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Live Gepubliceerd ({publishedCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('other')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'other'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Concept / Afgewezen ({otherCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek op titel, zaal of indiener..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
          />
        </div>
      </div>

      {/* Event List or Review Cards */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-zinc-300 mx-auto" />
          <h3 className="font-heading font-black text-zinc-900 text-lg">
            Geen evenementen gevonden in deze selectie
          </h3>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto">
            {activeTab === 'submitted'
              ? 'Er zijn momenteel geen nieuwe externe inzendingen die wachten op beoordeling. Alles is bijgewerkt!'
              : 'Er zijn geen evenementen die voldoen aan je zoekcriteria.'}
          </p>
        </div>
      ) : activeTab === 'submitted' ? (
        /* Review Queue Card View for Submitted Events */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FFF3ED] border border-[#FF4F00]/20 text-xs text-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF4F00] shrink-0" />
              <span>
                <strong>{submittedCount} evenementen</strong> wachten op redactionele goedkeuring voordat ze live op de site verschijnen.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#FF4F00]">Kwaliteitscontrole Uit in Arnhem</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-zinc-200 p-5 sm:p-6 shadow-xs hover:border-zinc-300 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Event Summary */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                      <Image
                        src={evt.hero_image_url || '/logo.png'}
                        alt={evt.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                          In afwachting van review
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold text-[10px] uppercase tracking-wider">
                          {evt.category}
                        </span>
                        <span className="text-zinc-400 text-xs">
                          {formatDate(evt.start_date)} om {formatTime(evt.start_date)} uur
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-lg text-zinc-950">
                        {evt.title}
                      </h3>
                      <p className="text-zinc-600 text-xs line-clamp-2 max-w-2xl">
                        {evt.short_description || evt.full_description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
                        <div className="flex items-center gap-1 font-medium text-zinc-800">
                          <MapPin className="w-3.5 h-3.5 text-[#FF4F00]" />
                          <span>{evt.venue_name}</span>
                          {evt.venue_address && <span className="text-zinc-400">({evt.venue_address})</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Ticket className="w-3.5 h-3.5 text-zinc-400" />
                          <span>
                            {evt.price_type === 'free' ? 'Gratis entree' : evt.price_from != null ? `Vanaf €${evt.price_from.toFixed(2)}` : 'Betaald'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                    <button
                      type="button"
                      disabled={loadingId === evt.id}
                      onClick={() => handleStatusChange(evt.id, 'published')}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Goedkeuren & Live Zetten</span>
                    </button>

                    <Link
                      href={`/admin/agenda/${evt.id}`}
                      className="p-2.5 text-zinc-600 hover:text-[#FF4F00] rounded-xl hover:bg-zinc-100 transition-colors border border-zinc-200"
                      title="Bewerken voor publicatie"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      disabled={loadingId === evt.id}
                      onClick={() => handleStatusChange(evt.id, 'rejected')}
                      className="p-2.5 text-zinc-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors border border-zinc-200 cursor-pointer disabled:opacity-50"
                      title="Afwijzen"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Submitter info box */}
                {(evt.contact_name || evt.contact_email || evt.submission_notes) && (
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-bold text-zinc-800 uppercase tracking-wider text-[10px]">
                        Ingediend door:
                      </span>
                      {evt.contact_name && (
                        <div className="flex items-center gap-1.5 text-zinc-900 font-medium">
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{evt.contact_name}</span>
                        </div>
                      )}
                      {evt.contact_email && (
                        <a
                          href={`mailto:${evt.contact_email}`}
                          className="flex items-center gap-1.5 text-zinc-600 hover:text-[#FF4F00] underline"
                        >
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{evt.contact_email}</span>
                        </a>
                      )}
                      {evt.contact_phone && (
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{evt.contact_phone}</span>
                        </div>
                      )}
                    </div>

                    {evt.submission_notes && (
                      <div className="flex items-center gap-1.5 text-zinc-500 italic">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                        <span>"{evt.submission_notes}"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Regular Table View for All / Published / Other */
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  <th className="py-4 px-6">Evenement</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Datum & Tijd</th>
                  <th className="py-4 px-4">Podium / Locatie</th>
                  <th className="py-4 px-4">Entree</th>
                  <th className="py-4 px-4 text-right">Weergaven (30d)</th>
                  <th className="py-4 px-6 text-right">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredEvents.map((evt) => {
                  const isFree = evt.price_type === 'free' || evt.price_from === 0;
                  return (
                    <tr key={evt.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                            <Image
                              src={evt.hero_image_url || '/logo.png'}
                              alt={evt.title}
                              fill
                              sizes="48px"
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
                        {evt.status === 'published' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] tracking-wider">
                            Live
                          </span>
                        ) : evt.status === 'submitted' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold uppercase text-[10px] tracking-wider">
                            Inzending
                          </span>
                        ) : evt.status === 'rejected' ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold uppercase text-[10px] tracking-wider">
                            Afgewezen
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-semibold uppercase text-[10px] tracking-wider">
                            {evt.status}
                          </span>
                        )}
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
                        <div className="text-zinc-400 text-[11px] truncate max-w-36">{evt.venue_address}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          {isFree ? 'Gratis' : evt.price_from != null ? `€${evt.price_from.toFixed(2)}` : '–'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {(() => {
                          const stat = viewCounts[evt.slug];
                          const views = stat?.views ?? 0;
                          const unique = stat?.uniqueVisitors ?? 0;
                          return (
                            <div
                              title={`${views.toLocaleString('nl-NL')} weergaven, ${unique.toLocaleString('nl-NL')} unieke dagbezoekers (30d)`}
                            >
                              <div className="font-bold text-zinc-900 tabular-nums">
                                {views.toLocaleString('nl-NL')}
                              </div>
                              <div className="text-[10px] text-zinc-400 tabular-nums">
                                {unique.toLocaleString('nl-NL')} uniek/dag
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {evt.status === 'published' && (
                            <Link
                              href={`/agenda/${evt.slug}`}
                              target="_blank"
                              className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
                              title="Bekijk live in agenda"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
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
      )}
    </div>
  );
}

