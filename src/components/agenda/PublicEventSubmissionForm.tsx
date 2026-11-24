'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Location } from '@/types';
import { EVENT_CATEGORIES } from '@/data/mockData';
import { LOCATIONS_CATALOG } from '@/data/locationsData';
import { LocationCombobox } from '@/components/admin/LocationCombobox';
import { submitPublicEvent, uploadImageToSupabase, getLocations } from '@/lib/supabase/api';
import { Button, ButtonLink } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Image as ImageIcon,
  Upload,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Building2,
  HelpCircle,
} from 'lucide-react';

export function PublicEventSubmissionForm() {
  // Event details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('muziek');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');

  // Date & Time
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('20:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Location
  const [locations, setLocations] = useState<Location[]>(LOCATIONS_CATALOG);
  const [selectedLocationSlug, setSelectedLocationSlug] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isCustomVenue, setIsCustomVenue] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueCity, setVenueCity] = useState('Arnhem');

  // Pricing & Tickets
  const [priceType, setPriceType] = useState<'free' | 'paid'>('free');
  const [priceFrom, setPriceFrom] = useState<number | ''>('');
  const [ticketUrl, setTicketUrl] = useState('');

  // Media
  const [heroImage, setHeroImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Submitter / Contact Details
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState('');

  // Load locations on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await getLocations();
        if (data && data.length > 0) {
          setLocations(data);
        }
      } catch { }
    }
    load();
  }, []);

  const handleLocationSelect = (loc: Location | null) => {
    setSelectedLocation(loc);
    if (loc) {
      setSelectedLocationSlug(loc.slug);
      setVenueName(loc.name);
      setVenueAddress(loc.address || '');
      setVenueCity(loc.city || 'Arnhem');
      setIsCustomVenue(false);
    } else {
      setSelectedLocationSlug('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage('');

    try {
      const publicUrl = await uploadImageToSupabase(file);
      if (publicUrl) {
        setHeroImage(publicUrl);
      } else {
        setErrorMessage('Kon de afbeelding niet uploaden. Probeer een ander bestand (JPG, PNG of WebP).');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Fout bij het uploaden van de afbeelding.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!title.trim()) {
      setErrorMessage('Vul een titel in voor het evenement.');
      return;
    }
    if (!startDate) {
      setErrorMessage('Selecteer een datum voor het evenement.');
      return;
    }
    if (!venueName.trim()) {
      setErrorMessage('Kies een locatie of vul een podium/locatienaam in.');
      return;
    }
    if (!shortDesc.trim()) {
      setErrorMessage('Geef een korte omschrijving van 1 of 2 zinnen.');
      return;
    }
    if (!contactName.trim() || !contactEmail.trim()) {
      setErrorMessage('Vul je naam en e-mailadres in zodat de redactie contact kan opnemen.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Compose start ISO string
      const startDateTimeString = `${startDate}T${startTime ? startTime : '20:00'}:00`;
      const startIso = new Date(startDateTimeString).toISOString();

      let endIso: string | null = null;
      if (endDate) {
        const endDateTimeString = `${endDate}T${endTime ? endTime : '23:59'}:00`;
        endIso = new Date(endDateTimeString).toISOString();
      }

      const payload = {
        title: title.trim(),
        category,
        start_date: startIso,
        end_date: endIso,
        venue_name: venueName.trim(),
        venue_address: venueAddress.trim() || 'Arnhem',
        venue_city: venueCity.trim() || 'Arnhem',
        location_id: selectedLocation?.id || null,
        price_type: priceType,
        price_from: priceType === 'paid' && priceFrom !== '' ? Number(priceFrom) : 0,
        ticket_url: ticketUrl.trim() || undefined,
        hero_image_url: heroImage.trim() || '/logo.png',
        short_description: shortDesc.trim(),
        full_description: fullDesc.trim() || shortDesc.trim(),
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || undefined,
        submission_notes: submissionNotes.trim() || undefined,
      };

      const { error } = await submitPublicEvent(payload);

      if (error) {
        console.error('Submission error:', error);
        setErrorMessage('Er is iets misgegaan bij het versturen van je aanmelding. Probeer het opnieuw.');
      } else {
        setSubmittedTitle(title.trim());
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Error submitting event:', err);
      setErrorMessage(err.message || 'Onverwachte fout opgetreden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF4F00]">
            Aanmelding Succesvol Ontvangen
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-zinc-950">
            Bedankt voor je inzending!
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            We hebben je evenement <strong className="text-zinc-900 font-bold">"{submittedTitle}"</strong> in goede orde ontvangen.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-left text-xs sm:text-sm text-zinc-600 space-y-2.5">
          <div className="font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF4F00]" />
            Hoe gaat het nu verder?
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-zinc-600">
            <li>Onze redactie controleert je aanmelding binnen <strong>1 tot 2 werkdagen</strong>.</li>
            <li>Zodra het evenement is goedgekeurd, staat het direct live in de Arnhemse culturele agenda.</li>
            <li>Hebben we nog een vraag over het beeldmateriaal of aanvangstijden? Dan nemen we contact op via <strong>{contactEmail}</strong>.</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <ButtonLink href="/agenda" variant="primary" size="md" className="w-full sm:w-auto">
            Bekijk de agenda
          </ButtonLink>
          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => {
              setIsSuccess(false);
              setTitle('');
              setShortDesc('');
              setFullDesc('');
              setStartDate('');
              setVenueName('');
              setVenueAddress('');
              setHeroImage('');
              setSelectedLocationSlug('');
              setSelectedLocation(null);
            }}
          >
            Nog een evenement aanmelden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Stap 1: Wat voor evenement is het? */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <span className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] font-heading font-black text-sm flex items-center justify-center">
            1
          </span>
          <div>
            <h3 className="font-heading font-black text-lg text-zinc-900">Over het evenement</h3>
            <p className="text-xs text-zinc-500">Wat organiseer je en in welke categorie valt het?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Titel van het evenement <span className="text-[#FF4F00]">*</span></span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Sonsbeek Zomerfestival, Jazz in de Eusebius, etc."
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Categorie <span className="text-[#FF4F00]">*</span></span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
            >
              {EVENT_CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
            Korte wervende teaser <span className="text-[#FF4F00]">*</span>
          </label>
          <p className="text-[11px] text-zinc-400 mb-2">
            1 of 2 pakkende zinnen die op de agendakaart worden getoond (max 160 tekens aanbevolen).
          </p>
          <input
            type="text"
            required
            maxLength={220}
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="Bijv. Een sfeervolle openlucht jazzavond onder de monumentale bomen van Park Sonsbeek."
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
            Uitgebreide omschrijving & programma
          </label>
          <p className="text-[11px] text-zinc-400 mb-2">
            Vertel meer over de artiesten, het programma, eventuele speciale acts of praktische tips.
          </p>
          <textarea
            rows={5}
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
            placeholder="Beschrijf hier het evenement..."
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
          />
        </div>
      </div>

      {/* Stap 2: Datum & Tijden */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <span className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] font-heading font-black text-sm flex items-center justify-center">
            2
          </span>
          <div>
            <h3 className="font-heading font-black text-lg text-zinc-900">Wanneer vindt het plaats?</h3>
            <p className="text-xs text-zinc-500">Kies datum en aanvangstijd.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Startdatum <span className="text-[#FF4F00]">*</span></span>
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
            />
          </div>

          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Aanvangstijd</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
            />
          </div>

          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Einddatum <span className="text-zinc-400 font-normal">(optioneel)</span></span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
            />
          </div>

          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Eindtijd <span className="text-zinc-400 font-normal">(optioneel)</span></span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Stap 3: Locatie */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <span className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] font-heading font-black text-sm flex items-center justify-center">
            3
          </span>
          <div>
            <h3 className="font-heading font-black text-lg text-zinc-900">Locatie & Podium in Arnhem</h3>
            <p className="text-xs text-zinc-500">Kies een bekende Arnhemse locatie of vul een eigen locatie in.</p>
          </div>
        </div>

        {!isCustomVenue ? (
          <div className="space-y-4">
            <LocationCombobox
              locations={locations}
              selectedSlug={selectedLocationSlug}
              onSelect={handleLocationSelect}
              label="Kies een bekend podium of locatie"
              placeholder="Zoek op podiumnaam of adres (bijv. Luxor Live, Focus Filmtheater)..."
              helpText="Vind direct een van de bekende Arnhemse culturele locaties."
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">Staat jouw locatie of zaal er niet tussen?</span>
              <button
                type="button"
                onClick={() => {
                  setIsCustomVenue(true);
                  setSelectedLocation(null);
                  setSelectedLocationSlug('');
                }}
                className="text-xs font-bold text-[#FF4F00] hover:underline cursor-pointer"
              >
                + Voer zelf een locatie in
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">Eigen Locatie Invoeren</span>
              <button
                type="button"
                onClick={() => setIsCustomVenue(false)}
                className="text-xs text-[#FF4F00] font-bold hover:underline"
              >
                ← Terug naar bekende podia lijst
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                  <span>Locatienaam / Podium <span className="text-[#FF4F00]">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="Bijv. De Eusebiuskerk, Café Stella, Pop-up tentoonstelling..."
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div>
                <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                  <span>Straat en huisnummer</span>
                </label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Bijv. Kerkplein 1"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stap 4: Entree & Tickets */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <span className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] font-heading font-black text-sm flex items-center justify-center">
            4
          </span>
          <div>
            <h3 className="font-heading font-black text-lg text-zinc-900">Entree & Tickets</h3>
            <p className="text-xs text-zinc-500">Is het evenement gratis toegankelijk of betaald?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Toegangstype</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPriceType('free');
                  setPriceFrom('');
                }}
                className={`py-3 px-4 rounded-2xl text-xs font-bold border text-center transition-all cursor-pointer ${priceType === 'free'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                Gratis toegang
              </button>
              <button
                type="button"
                onClick={() => setPriceType('paid')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold border text-center transition-all cursor-pointer ${priceType === 'paid'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                Betaalde toegang
              </button>
            </div>
          </div>

          {priceType === 'paid' && (
            <div>
              <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                <span>Prijs vanaf (€)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="Bijv. 12.50"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
            Ticket of Website URL <span className="text-zinc-400 font-normal">(optioneel)</span>
          </label>
          <input
            type="url"
            value={ticketUrl}
            onChange={(e) => setTicketUrl(e.target.value)}
            placeholder="https://jouwevenement.nl of ticketshop link"
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
          />
        </div>
      </div>

      {/* Stap 5: Beeldmateriaal */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <span className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] font-heading font-black text-sm flex items-center justify-center">
            5
          </span>
          <div>
            <h3 className="font-heading font-black text-lg text-zinc-900">Beeldmateriaal / Foto</h3>
            <p className="text-xs text-zinc-500">Upload een liggende foto (16:9 formaat) van hoge kwaliteit.</p>
          </div>
        </div>

        <div className="space-y-4">
          {!heroImage ? (
            <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-[#FF4F00] hover:bg-zinc-100/50 transition-all cursor-pointer text-center">
              <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-zinc-200 flex items-center justify-center text-[#FF4F00]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 block">
                  {uploadingImage ? 'Bezig met uploaden...' : 'Klik om een foto te uploaden'}
                </span>
                <span className="text-xs text-zinc-400 mt-0.5 block">
                  PNG, JPG of WEBP (aanbevolen min. 1200 x 675 px)
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                <Image
                  src={heroImage}
                  alt="Geüploade afbeelding"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Foto succesvol geüpload
                </span>
                <label className="text-xs font-bold text-[#FF4F00] hover:underline cursor-pointer">
                  Andere foto kiezen
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stap 6: Contactgegevens Indiener */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <span className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] font-heading font-black text-sm flex items-center justify-center">
            6
          </span>
          <div>
            <h3 className="font-heading font-black text-lg text-zinc-900">Jouw Contactgegevens</h3>
            <p className="text-xs text-zinc-500">
              Strikt voor de redactie van Uit in Arnhem om contact op te nemen over je aanmelding. Wordt nooit publiek gedeeld.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Naam contactpersoon / organisatie <span className="text-[#FF4F00]">*</span></span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Bijv. Laura van den Berg"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>E-mailadres <span className="text-[#FF4F00]">*</span></span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="organisatie@evenement.nl"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="h-9 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
              <span>Telefoonnummer <span className="text-zinc-400 font-normal">(optioneel)</span></span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="06 - 12345678"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
            Opmerking voor de redactie <span className="text-zinc-400 font-normal">(optioneel)</span>
          </label>
          <textarea
            rows={2}
            value={submissionNotes}
            onChange={(e) => setSubmissionNotes(e.target.value)}
            placeholder="Bijv. Vragen over persaccreditatie, bijzondere doelgroep of embargo..."
            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
          />
        </div>
      </div>

      {/* Submit Button Bar */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500 max-w-md">
          Door te versturen geef je de redactie van Uit in Arnhem toestemming om deze informatie en het beeldmateriaal redactioneel te publiceren.
        </p>

        <Button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <span>Bezig met verzenden...</span>
          ) : (
            <>
              <span>Evenement gratis aanmelden</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
