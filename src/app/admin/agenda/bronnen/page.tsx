'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  PlusCircle,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Globe,
  Clock,
  Sparkles,
  ArrowLeft,
  Calendar,
  Eye,
  Sliders,
} from 'lucide-react';
import { AgendaSource, AgendaSyncLog } from '@/types';

export default function AdminAgendaSourcesPage() {
  const [sources, setSources] = useState<AgendaSource[]>([]);
  const [logs, setLogs] = useState<AgendaSyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // New source form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    slug: '',
    url: '',
    adapter_type: 'generic_jsonld',
    default_venue_name: '',
    default_venue_address: '',
    default_category_slug: 'cultuur',
    sync_frequency: 'bi-weekly',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sources');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSources(data);
      }
    } catch (err: any) {
      console.error('Failed to load sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async (sourceIdOrSlug: string, sourceName: string) => {
    try {
      setSyncingId(sourceIdOrSlug);
      setFeedback({ type: 'info', message: `Synchronisatie gestart voor ${sourceName}... Dit kan enkele seconden duren.` });

      const res = await fetch(`/api/admin/sources/${sourceIdOrSlug}/sync`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: data.message || `Synchronisatie voltooid voor ${sourceName}!` });
        await fetchData();
      } else {
        setFeedback({ type: 'error', message: data.error || `Synchronisatie mislukt voor ${sourceName}.` });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Fout bij aanroepen synchronisatie.' });
    } finally {
      setSyncingId(null);
    }
  };

  const handleToggleActive = async (source: AgendaSource) => {
    try {
      const updatedStatus = !source.is_active;
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...source, is_active: updatedStatus }),
      });
      if (res.ok) {
        setSources((prev) =>
          prev.map((s) => (s.id === source.id ? { ...s, is_active: updatedStatus } : s))
        );
        setFeedback({
          type: 'success',
          message: `${source.name} is nu ${updatedStatus ? 'geactiveerd' : 'gepauzeerd'}.`,
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Fout bij wijzigen status.' });
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) {
      setFeedback({ type: 'error', message: 'Vul minimaal een naam en geldige URL in.' });
      return;
    }

    try {
      const slug = newSource.slug || newSource.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSource,
          slug,
          default_venue_name: newSource.default_venue_name || newSource.name,
          default_venue_address: newSource.default_venue_address || 'Arnhem',
        }),
      });

      const result = await res.json();
      if (result.success) {
        setFeedback({ type: 'success', message: `Bron "${newSource.name}" succesvol toegevoegd!` });
        setShowAddModal(false);
        setNewSource({
          name: '',
          slug: '',
          url: '',
          adapter_type: 'generic_jsonld',
          default_venue_name: '',
          default_venue_address: '',
          default_category_slug: 'cultuur',
          sync_frequency: 'bi-weekly',
        });
        await fetchData();
      } else {
        setFeedback({ type: 'error', message: result.error || 'Kon bron niet toevoegen.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Fout bij opslaan.' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/agenda"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Terug naar Agenda</span>
            </Link>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950 flex items-center gap-3">
            <span>Agenda Scraper & Bronnen</span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FF4F00]/10 text-[#FF4F00] rounded-full uppercase tracking-wider">
              Python Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Beheer externe podia en culturele agenda-URLs die automatisch worden gesynchroniseerd.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSync('all', 'alle actieve bronnen')}
            disabled={syncingId !== null}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'all' ? 'animate-spin' : ''}`} />
            <span>{syncingId === 'all' ? 'Synchroniseren...' : 'Alles Nu Scrapen'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nieuwe Bron Toevoegen</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium border flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedback.type === 'error' ? (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-400 hover:text-zinc-700 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((src) => {
          const isSyncing = syncingId === src.id || syncingId === src.slug;
          return (
            <div
              key={src.id}
              className={`bg-white rounded-3xl border transition-all shadow-xs p-6 flex flex-col justify-between ${
                src.is_active ? 'border-zinc-200/90' : 'border-zinc-200 opacity-60 bg-zinc-50/50'
              }`}
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-black text-lg text-zinc-950">
                        {src.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">
                      adapter: {src.adapter_type}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      src.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {src.is_active ? 'Actief' : 'Gepauzeerd'}
                  </span>
                </div>

                {/* Target URL */}
                <div className="text-xs text-zinc-600 flex items-center gap-1.5 truncate">
                  <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#FF4F00] hover:underline truncate"
                  >
                    {src.url}
                  </a>
                </div>

                {/* Metadata details */}
                <div className="bg-zinc-50 rounded-2xl p-3 text-xs space-y-1.5 border border-zinc-100 text-zinc-600">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Categorie:</span>
                    <span className="font-semibold text-zinc-800 capitalize">{src.default_category_slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Frequentie:</span>
                    <span className="font-semibold text-zinc-800">{src.sync_frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Laatste status:</span>
                    <span
                      className={`font-semibold inline-flex items-center gap-1 ${
                        src.last_run_status === 'success'
                          ? 'text-emerald-600'
                          : src.last_run_status === 'warning'
                          ? 'text-amber-600'
                          : src.last_run_status === 'error'
                          ? 'text-rose-600'
                          : 'text-zinc-400'
                      }`}
                    >
                      {src.last_run_status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                      {src.last_run_status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                      {src.last_run_status === 'error' && <XCircle className="w-3 h-3" />}
                      {src.last_run_status || 'Nog niet gedraaid'}
                    </span>
                  </div>
                  {src.last_run_message && (
                    <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/60 line-clamp-2">
                      {src.last_run_message}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleActive(src)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {src.is_active ? 'Pauzeren' : 'Inschakelen'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSync(src.id || src.slug, src.name)}
                  disabled={isSyncing || !src.is_active}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Play className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Scrapen...' : 'Nu Synchroniseren'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl border border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-xl text-zinc-950">
                  Nieuwe Agenda Bron Toevoegen
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Voeg een nieuw cultureel podium of website toe aan de automatische scraper.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">Naam van het podium *</label>
                <input
                  type="text"
                  required
                  placeholder="bijv. Focus Filmtheater Arnhem"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">Agenda URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.focusarnhem.nl/agenda/"
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Adapter Type</label>
                  <select
                    value={newSource.adapter_type}
                    onChange={(e) => setNewSource({ ...newSource, adapter_type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#FF4F00] bg-white"
                  >
                    <option value="generic_jsonld">Schema.org JSON-LD (Universeel)</option>
                    <option value="luxor">Luxor Live (Microdata)</option>
                    <option value="musis">Musis & Stadstheater (API)</option>
                    <option value="posttheater">Posttheater (Ticketmatic)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Standaard Categorie</label>
                  <select
                    value={newSource.default_category_slug}
                    onChange={(e) => setNewSource({ ...newSource, default_category_slug: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#FF4F00] bg-white"
                  >
                    <option value="muziek">Muziek</option>
                    <option value="theater-dans">Theater & Dans</option>
                    <option value="film">Film</option>
                    <option value="festival">Festival</option>
                    <option value="kunst-expo">Kunst & Expo</option>
                    <option value="kinderen-familie">Kinderen & Familie</option>
                    <option value="cultuur">Cultuur Algemeen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Standaard Zaalnaam</label>
                  <input
                    type="text"
                    placeholder="Focus Filmtheater"
                    value={newSource.default_venue_name}
                    onChange={(e) => setNewSource({ ...newSource, default_venue_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#FF4F00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Adres</label>
                  <input
                    type="text"
                    placeholder="Audrey Hepburnplein 1"
                    value={newSource.default_venue_address}
                    onChange={(e) => setNewSource({ ...newSource, default_venue_address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#FF4F00]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-zinc-600 font-bold hover:bg-zinc-100 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Bron Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

