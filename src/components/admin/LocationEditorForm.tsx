'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Location } from '@/types';
import { saveLocationToSupabase, uploadImageToSupabase } from '@/lib/supabase/api';
import {
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface LocationEditorFormProps {
  initialLocation?: Partial<Location>;
  isNew?: boolean;
}

export function LocationEditorForm({ initialLocation, isNew = false }: LocationEditorFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialLocation?.name || '');
  const [slug, setSlug] = useState(initialLocation?.slug || '');
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [postalCode, setPostalCode] = useState(initialLocation?.postal_code || '');
  const [city, setCity] = useState(initialLocation?.city || 'Arnhem');
  const [country, setCountry] = useState(initialLocation?.country || 'Nederland');
  const [website, setWebsite] = useState(initialLocation?.website || '');
  const [phone, setPhone] = useState(initialLocation?.phone || '');
  const [email, setEmail] = useState(initialLocation?.email || '');
  const [description, setDescription] = useState(initialLocation?.description || '');
  const [featuredImage, setFeaturedImage] = useState(initialLocation?.featured_image || '/logo.png');
  const [lat, setLat] = useState<string>(
    initialLocation?.coordinates?.lat ? String(initialLocation.coordinates.lat) : '51.9851'
  );
  const [lng, setLng] = useState<string>(
    initialLocation?.coordinates?.lng ? String(initialLocation.coordinates.lng) : '5.8987'
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      const generated = val
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
      setFeaturedImage(publicUrl);
      setFeedback({ type: 'success', message: 'Locatiefoto succesvol geüpload naar Supabase!' });
    } catch (err: any) {
      const localUrl = URL.createObjectURL(file);
      setFeaturedImage(localUrl);
      setFeedback({
        type: 'error',
        message: 'Upload naar Supabase Storage is mislukt. Probeer een ander bestand (JPG, PNG of WebP).',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload: Partial<Location> = {
      id: initialLocation?.id,
      name,
      slug,
      address,
      postal_code: postalCode,
      city,
      country,
      website: website ? (website.startsWith('http') ? website : `https://${website}`) : undefined,
      phone,
      email,
      description,
      featured_image: featuredImage,
      coordinates: {
        lat: parseFloat(lat) || 51.9851,
        lng: parseFloat(lng) || 5.8987,
      },
    };

    try {
      const res = await saveLocationToSupabase(payload);
      if (res.error) throw res.error;

      setFeedback({ type: 'success', message: 'Locatie succesvol opgeslagen!' });
      setTimeout(() => {
        router.push('/admin/locaties');
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Fout bij opslaan van locatie.' });
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
            {isNew ? 'Nieuwe Vaste Locatie Toevoegen' : `Locatie Bewerken: ${name || 'Naamloos'}`}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Beheer adresgegevens, website, foto en beschrijving voor cultuurlocaties in Arnhem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/locaties')}
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
            <span>{saving ? 'Opslaan...' : 'Locatie Opslaan'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Naam van de Locatie / Podium *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Bijv. Koepelgevangenis Arnhem"
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
                  {autoSlug ? 'Handmatig aanpassen' : 'Auto-genereer uit naam'}
                </button>
              </div>
              <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden px-3">
                <span className="text-xs text-zinc-400 font-mono">/locatie/</span>
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

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Beschrijving & Historie van de Locatie
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Historische achtergrond, sfeer, capaciteit, type evenementen..."
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          {/* Address & Contact */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF4F00]" />
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                Adres & Kaartcoördinaten
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Straatnaam & Huisnummer *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Wilhelminastraat 16"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div>
                <label className="h-9 flex items-end text-xs font-bold text-zinc-600 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="6812 CW"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div>
                <label className="h-9 flex items-end text-xs font-bold text-zinc-600 mb-2">
                  Stad
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Arnhem"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div>
                <label className="h-9 flex items-end text-xs font-bold text-zinc-600 mb-2">
                  Breedtegraad (Latitude)
                </label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="51.9868"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>

              <div>
                <label className="h-9 flex items-end text-xs font-bold text-zinc-600 mb-2">
                  Lengtegraad (Longitude)
                </label>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="5.8943"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Photo */}
        <div className="lg:col-span-4 space-y-6">
          {/* Photo */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
              Locatiefoto
            </h3>

            {featuredImage && featuredImage !== '/logo.png' ? (
              <div className="space-y-3">
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                  <Image
                    src={featuredImage}
                    alt={name || 'Locatie preview'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploaden...' : 'Andere foto kiezen'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('/logo.png')}
                    aria-label="Locatiefoto verwijderen"
                    className="p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 aspect-16/10 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-[#FF4F00] bg-zinc-50 hover:bg-white cursor-pointer transition-colors p-4 text-center">
                <Upload className="w-6 h-6 text-[#FF4F00]" />
                <span className="text-xs font-bold text-zinc-800">
                  {uploadingImage ? 'Uploaden...' : 'Klik om locatiefoto te uploaden'}
                </span>
                <span className="text-[11px] text-zinc-500">JPG, PNG of WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Online & Contact Channels */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-zinc-800">
              Contact &amp; Links
            </h3>

            <div>
              <label className="text-xs font-bold text-zinc-600 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Website</span>
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://koepelgevangenisarnhem.nl"
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-600 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Telefoonnummer</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="026 123 4567"
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-600 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>E-mailadres</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@locatie.nl"
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
              />
            </div>

            {!isNew && slug && (
              <div className="pt-2">
                <Link
                  href={`/locatie/${slug}`}
                  target="_blank"
                  className="w-full py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Bekijk publieke pagina</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF4F00]" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

