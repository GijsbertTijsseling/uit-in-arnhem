'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AgendaItem, EventCategory, Location } from '@/types';
import { EVENT_CATEGORIES } from '@/data/mockData';
import { uploadImageToSupabase, saveEventToSupabase, getLocations } from '@/lib/supabase/api';
import { LOCATIONS_CATALOG } from '@/data/locationsData';
import {
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Sparkles,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface AgendaEditorFormProps {
  initialEvent?: Partial<AgendaItem>;
  isNew?: boolean;
}

export function AgendaEditorForm({ initialEvent, isNew = false }: AgendaEditorFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialEvent?.title || '');
  const [slug, setSlug] = useState(initialEvent?.slug || '');
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [category, setCategory] = useState<string>(initialEvent?.category || 'muziek');

  // Locations state
  const [locationsList, setLocationsList] = useState<Location[]>(LOCATIONS_CATALOG);
  const [selectedLocationSlug, setSelectedLocationSlug] = useState<string>(() => {
    if (initialEvent?.location_slug) return initialEvent.location_slug;
    if (initialEvent?.venue_name) {
      const match = LOCATIONS_CATALOG.find(
        (l) => l.name.toLowerCase() === initialEvent.venue_name?.toLowerCase()
      );
      return match?.slug || '';
    }
    return '';
  });

  useEffect(() => {
    getLocations().then((res) => {
      if (res && res.length > 0) {
        setLocationsList(res);
      }
    });
  }, []);

  // Dates
  const defaultStart = initialEvent?.start_date
    ? new Date(initialEvent.start_date).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);
  const defaultEnd = initialEvent?.end_date
    ? new Date(initialEvent.end_date).toISOString().slice(0, 16)
    : '';

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  // Venue
  const [venueName, setVenueName] = useState(initialEvent?.venue_name || 'Luxor Live');
  const [venueAddress, setVenueAddress] = useState(initialEvent?.venue_address || 'Willemsplein 10');
  const [venueCity, setVenueCity] = useState(initialEvent?.venue_city || 'Arnhem');

  // Pricing & Tickets
  const [priceType, setPriceType] = useState<'free' | 'paid' | 'donation'>(
    initialEvent?.price_type || 'paid'
  );
  const [price, setPrice] = useState<string>(
    initialEvent?.price_from !== undefined ? String(initialEvent.price_from) : '15.00'
  );
  const [ticketUrl, setTicketUrl] = useState(initialEvent?.ticket_url || '');

  // Media
  const [heroImage, setHeroImage] = useState(
    initialEvent?.hero_image_url ||
    '/logo.png'
  );

  // Descriptions
  const [shortDesc, setShortDesc] = useState(initialEvent?.short_description || '');
  const [fullDesc, setFullDesc] = useState(initialEvent?.full_description || '');

  // Flags
  const [isHighlight, setIsHighlight] = useState(initialEvent?.is_highlight || false);
  const [status, setStatus] = useState<'draft' | 'published'>(
    initialEvent?.status === 'published' ? 'published' : 'published'
  );

  // State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLocationSelect = (slug: string) => {
    setSelectedLocationSlug(slug);
    if (!slug) return;
    const loc = locationsList.find((l) => l.slug === slug);
    if (loc) {
      setVenueName(loc.name);
      setVenueAddress(loc.address || '');
      setVenueCity(loc.city || 'Arnhem');
      if (isNew && (!heroImage || heroImage === '/logo.png') && loc.featured_image) {
        setHeroImage(loc.featured_image);
      }
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (autoSlug) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);

    try {
      const publicUrl = await uploadImageToSupabase(file);
      setHeroImage(publicUrl);
      setFeedback({ type: 'success', message: 'Evenementfoto succesvol geüpload naar Supabase!' });
    } catch (err: any) {
      const localUrl = URL.createObjectURL(file);
      setHeroImage(localUrl);
      setFeedback({
        type: 'error',
        message: 'Lokale preview geladen; je kunt ook een directe fotolink invullen.',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const matchedLoc = locationsList.find((l) => l.slug === selectedLocationSlug);
    const eventPayload: Partial<AgendaItem> = {
      id: initialEvent?.id,
      title,
      slug,
      category,
      start_date: new Date(startDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      venue_name: venueName,
      venue_address: venueAddress,
      venue_city: venueCity,
      location_id: matchedLoc?.id || initialEvent?.location_id || null,
      location_slug: selectedLocationSlug || null,
      price_type: priceType,
      price_from: priceType === 'free' ? 0 : parseFloat(price) || 0,
      ticket_url: ticketUrl,
      hero_image_url: heroImage,
      short_description: shortDesc,
      full_description: fullDesc,
      is_highlight: isHighlight,
      status: status === 'draft' ? 'submitted' : 'published',
      is_manually_edited: true,
      manual_override_fields: ['title', 'description', 'short_description', 'featured_image'],
    };

    try {
      await saveEventToSupabase(eventPayload);
      setFeedback({ type: 'success', message: 'Evenement succesvol opgeslagen!' });
      setTimeout(() => {
        router.push('/admin/agenda');
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Fout bij opslaan.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {isNew ? 'Nieuw Agenda Item Aanmaken' : `Evenement Bewerken: ${title || 'Naamloos'}`}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Voer datum, tijd, locatie en ticketinformatie in voor de Arnhem cultuuragenda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/agenda')}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Opslaan...' : 'Publiceren / Opslaan'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Main Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Evenement Titel *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Bijv. Nachtparlement: Deep Melodic & Groove Techno"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] text-[#FF4F00] hover:underline"
                >
                  {autoSlug ? 'Handmatig aanpassen' : 'Auto-genereer uit titel'}
                </button>
              </div>
              <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden px-3">
                <span className="text-xs text-zinc-400 font-mono">/agenda/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setSlug(e.target.value);
                  }}
                  required
                  className="flex-1 py-2.5 px-2 bg-transparent text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Short description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Korte Omschrijving (Lead / Kaart) *
              </label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                required
                rows={3}
                placeholder="Korte pakkende introtekst voor op de agenda-overzichtskaart..."
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>

            {/* Full description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Uitgebreide Toelichting & Line-up *
              </label>
              <textarea
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                required
                rows={8}
                placeholder="Volledige beschrijving van het programma, artiesten, praktische info..."
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF4F00]" />
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                Datum & Aanvangstijd
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Startdatum & Tijd *
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Einddatum & Tijd (Optioneel)
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF4F00]" />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                  Podium & Locatie
                </h3>
              </div>
              <Link
                href="/admin/locaties/new"
                target="_blank"
                className="text-xs font-bold text-[#FF4F00] hover:underline flex items-center gap-1"
              >
                <span>+ Nieuwe vaste locatie</span>
              </Link>
            </div>

            {/* Fast selector dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Kies een vaste locatie (Adres & info automatisch ingevuld)
              </label>
              <select
                value={selectedLocationSlug}
                onChange={(e) => handleLocationSelect(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              >
                <option value="">-- Handmatige invoer of selecteer vaste locatie --</option>
                <optgroup label="Vaste Locaties in Arnhem">
                  {locationsList.map((loc) => (
                    <option key={loc.slug} value={loc.slug}>
                      {loc.name} {loc.address ? `• ${loc.address}` : ''}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Linked badge feedback */}
            {selectedLocationSlug && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    Gekoppeld aan <strong>{venueName}</strong>. Adres en kaart worden automatisch gekoppeld.
                  </span>
                </div>
                <Link
                  href={`/locatie/${selectedLocationSlug}`}
                  target="_blank"
                  className="font-bold underline text-emerald-900 shrink-0 ml-2 flex items-center gap-1"
                >
                  <span>Locatiepagina</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Podium / Zaal *
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => {
                    setVenueName(e.target.value);
                  }}
                  required
                  placeholder="Bijv. Koepelgevangenis"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Adres *
                </label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  required
                  placeholder="Wilhelminastraat 16"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Stad
                </label>
                <input
                  type="text"
                  value={venueCity}
                  onChange={(e) => setVenueCity(e.target.value)}
                  placeholder="Arnhem"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Media, Tickets & Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication & Highlight */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
              Instellingen & Redactietip
            </h3>

            <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer p-3 rounded-xl bg-[#FFF3ED] border border-[#FF4F00]/20">
              <input
                type="checkbox"
                checked={isHighlight}
                onChange={(e) => setIsHighlight(e.target.checked)}
                className="rounded text-[#FF4F00] focus:ring-[#FF4F00]"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>Markeer als "Tip van de Redactie"</span>
              </span>
            </label>
          </div>

          {/* Category */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-3">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
              Categorie
            </h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold"
            >
              {EVENT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing & Tickets */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#FF4F00]" />
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                Tickets & Prijs
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1.5">Prijs Type</label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold"
              >
                <option value="paid">Betaald ticket</option>
                <option value="free">Gratis toegang</option>
                <option value="donation">Vrije gift / Donatie</option>
              </select>
            </div>

            {priceType !== 'free' && (
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">Prijs (€)</label>
                <input
                  type="number"
                  step="0.50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="15.00"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1.5">Ticket URL</label>
              <input
                type="url"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://luxorlive.nl/tickets/..."
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* Hero Image & Supabase Upload */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                Hero Afbeelding
              </h3>
              <span className="text-[11px] text-zinc-400">Media Bucket</span>
            </div>

            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
              {heroImage ? (
                <Image src={heroImage} alt="Voorvertoning" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span>Geen foto</span>
                </div>
              )}
            </div>

            <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors shadow-sm">
              <Upload className="w-4 h-4 text-[#FF4F00]" />
              <span>{uploadingImage ? 'Bezig met uploaden...' : 'Upload naar Supabase Media'}</span>
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
            </label>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Of directe fotolink:
              </label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
