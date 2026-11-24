'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Article, LayoutTemplate, CtaBlock, Location } from '@/types';
import { ARTICLE_CATEGORIES } from '@/data/mockData';
import { uploadImageToSupabase, saveArticleToSupabase, getLocations } from '@/lib/supabase/api';
import { getCurrentEditorUser, DEFAULT_AUTHOR_NAME } from '@/lib/auth';
import { LOCATIONS_CATALOG } from '@/data/locationsData';
import { LocationCombobox } from '@/components/admin/LocationCombobox';
import {
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bold,
  Italic,
  List,
  Heading3,
  Quote,
  User,
  MapPin,
  Trash2,
} from 'lucide-react';

interface ArticleEditorFormProps {
  initialArticle?: Partial<Article>;
  isNew?: boolean;
}

export function ArticleEditorForm({ initialArticle, isNew = false }: ArticleEditorFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [category, setCategory] = useState(initialArticle?.category || 'eten-drinken');
  const [template, setTemplate] = useState<LayoutTemplate>(initialArticle?.layout_template || 'standard');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [featuredImage, setFeaturedImage] = useState(
    initialArticle?.featured_image_url ||
    '/logo.png'
  );
  const [status, setStatus] = useState<'draft' | 'published'>(
    initialArticle?.status === 'draft' ? 'draft' : 'published'
  );
  const [isFeatured, setIsFeatured] = useState(initialArticle?.is_featured || false);
  const [authorName, setAuthorName] = useState(
    initialArticle?.author_name && initialArticle.author_name !== DEFAULT_AUTHOR_NAME
      ? initialArticle.author_name
      : ''
  );
  const [authorId, setAuthorId] = useState<string | undefined>(initialArticle?.author_id);
  const [accountAuthorName, setAccountAuthorName] = useState<string | null>(null);

  // CTA Builder
  const [enableCta, setEnableCta] = useState(!!initialArticle?.cta_block);
  const [ctaHeading, setCtaHeading] = useState(initialArticle?.cta_block?.heading || '');
  const [ctaDesc, setCtaDesc] = useState(initialArticle?.cta_block?.description || '');
  const [ctaBtnLabel, setCtaBtnLabel] = useState(initialArticle?.cta_block?.button_label || '');
  const [ctaBtnUrl, setCtaBtnUrl] = useState(initialArticle?.cta_block?.button_url || '');

  // Loading & notification states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Locations state
  const [locationsList, setLocationsList] = useState<Location[]>(LOCATIONS_CATALOG);
  const [selectedLocationSlug, setSelectedLocationSlug] = useState<string>('');

  useEffect(() => {
    getLocations().then((res) => {
      if (res && res.length > 0) {
        setLocationsList(res);
      }
    });
  }, []);

  useEffect(() => {
    const loadEditor = async (prefillIfNew: boolean) => {
      const editor = await getCurrentEditorUser();
      setAccountAuthorName(editor?.author_name || null);
      if (prefillIfNew && isNew) {
        if (editor?.id) {
          setAuthorId(editor.id);
        }
        if (editor?.author_name) {
          setAuthorName((prev) => prev || editor.author_name || '');
        }
      }
    };

    loadEditor(true);

    const handleProfileUpdate = () => {
      loadEditor(false);
    };
    window.addEventListener('uit-arnhem-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('uit-arnhem-profile-updated', handleProfileUpdate);
  }, [isNew]);

  const handleLocationSelect = (loc: Location | null) => {
    if (!loc) {
      setSelectedLocationSlug('');
      return;
    }
    setSelectedLocationSlug(loc.slug);
  };

  const handleInsertLocationIntoContent = (loc: Location) => {
    const addressBlock = `\n\n**${loc.name}**\n${loc.address ? `*Adres: ${loc.address}${loc.city ? `, ${loc.city}` : ''}*\n` : ''}${loc.website ? `*Website:* [${loc.name}](${loc.website})\n` : ''}`;
    setContent((prev) => prev + addressBlock);
    setFeedback({ type: 'success', message: `Locatie "${loc.name}" ingevoegd in artikeltekst.` });
  };

  const handleApplyLocationToCta = (loc: Location) => {
    setEnableCta(true);
    setCtaHeading(`Bezoek ${loc.name}`);
    setCtaDesc(loc.description || `Ontdek ${loc.name} aan ${loc.address || 'Arnhem'}.`);
    setCtaBtnLabel('Meer informatie');
    setCtaBtnUrl(loc.website || `/locatie/${loc.slug}`);
    setFeedback({ type: 'success', message: `CTA blok automatisch gevuld met gegevens van "${loc.name}"!` });
  };

  // Auto-slug generator
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

  // Image upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);

    try {
      const publicUrl = await uploadImageToSupabase(file);
      setFeaturedImage(publicUrl);
      setFeedback({ type: 'success', message: 'Afbeelding succesvol geüpload naar Supabase Storage!' });
    } catch (err: any) {
      console.warn('Storage upload error, using local object url for preview:', err);
      // Fallback to local URL preview
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

  // Content formatting toolbar
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n${prefix}Tekst hier${suffix}\n`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const ctaBlock: CtaBlock | undefined = enableCta
      ? {
        heading: ctaHeading,
        description: ctaDesc,
        button_label: ctaBtnLabel,
        button_url: ctaBtnUrl,
      }
      : undefined;

    const articleData: Partial<Article> = {
      id: initialArticle?.id,
      title,
      slug,
      category,
      layout_template: template,
      excerpt,
      content,
      featured_image_url: featuredImage,
      status,
      is_featured: isFeatured,
      cta_block: ctaBlock,
      author_name: authorName.trim() || DEFAULT_AUTHOR_NAME,
      author_id: authorId,
    };

    try {
      const { error } = await saveArticleToSupabase(articleData);
      if (error) {
        console.warn('Supabase save error, fallback to local state:', error);
      }
      setFeedback({ type: 'success', message: 'Artikel succesvol opgeslagen en bijgewerkt!' });
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Fout bij opslaan.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {isNew ? 'Nieuw Artikel Schrijven' : `Artikel Bewerken: ${title || 'Naamloos'}`}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Kies een lay-out template, voeg beeld toe en publiceer naar het Arnhem Magazine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Prikkelende Kop / Titel *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Bijv. 6x De lekkerste specialty coffee in Klarendal..."
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
                <span className="text-xs text-zinc-400 font-mono">/artikelen/</span>
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

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Korte Samenvatting / Teaser (Lead) *
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={3}
                placeholder="Twee of drie zinnen die de lezer verleiden..."
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>
          </div>

          {/* Body Content & Formatting Toolbar */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Artikel Inhoud (Rich Text / Markdown) *
              </label>
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => insertFormatting('### Kop: ')}
                  className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900"
                  title="Kop 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900"
                  title="Vetgedrukt"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900"
                  title="Cursief"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ')}
                  className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900"
                  title="Opsomming"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*Adres: Straat 1, Arnhem*')}
                  className="inline-flex items-center gap-1 px-2 py-1 hover:bg-white rounded-lg text-[11px] font-bold text-zinc-600 cursor-pointer"
                  title="Adresblok invoegen"
                >
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Adres</span>
                </button>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={14}
              placeholder="Schrijf hier het volledige artikelverhaal. Gebruik ### voor tussenkopjes..."
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white leading-relaxed"
            />
          </div>

          {/* Modular CTA Builder */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF4F00]" />
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                  Modulaire Call-To-Action (CTA) Blok
                </h3>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCta}
                  onChange={(e) => setEnableCta(e.target.checked)}
                  className="rounded text-[#FF4F00] focus:ring-[#FF4F00]"
                />
                Insluiten in artikel
              </label>
            </div>

            {enableCta && (
              <div className="p-4 bg-[#FFF3ED] rounded-2xl border border-[#FF4F00]/20 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    CTA Titel
                  </label>
                  <input
                    type="text"
                    value={ctaHeading}
                    onChange={(e) => setCtaHeading(e.target.value)}
                    placeholder="Bijv. Bezoek deze expositie met korting"
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    CTA Omschrijving
                  </label>
                  <input
                    type="text"
                    value={ctaDesc}
                    onChange={(e) => setCtaDesc(e.target.value)}
                    placeholder="Boek nu je museumticket vooraf online..."
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="h-7 flex items-end text-[11px] font-bold uppercase text-zinc-700 mb-1.5">
                      Knop Tekst
                    </label>
                    <input
                      type="text"
                      value={ctaBtnLabel}
                      onChange={(e) => setCtaBtnLabel(e.target.value)}
                      placeholder="Tickets reserveren"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="h-7 flex items-end text-[11px] font-bold uppercase text-zinc-700 mb-1.5">
                      Knop Doel URL
                    </label>
                    <input
                      type="text"
                      value={ctaBtnUrl}
                      onChange={(e) => setCtaBtnUrl(e.target.value)}
                      placeholder="https://museumarnhem.nl"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Options & Media Upload */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication status */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
              Publicatie Status
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold"
              >
                <option value="published">Gepubliceerd (Direct zichtbaar)</option>
                <option value="draft">Concept (Niet openbaar)</option>
              </select>
            </div>

            <div className="pt-2 space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#FF4F00] focus:ring-[#FF4F00]"
                />
                <span>Uitlichten op Homepage</span>
              </label>
              <p className="text-[11px] text-zinc-500 pl-6">
                Als je dit aanzet, vervalt het vorige uitgelichte verhaal automatisch.
              </p>
            </div>
          </div>

          {/* Template Selector */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
              Layout Template
            </h3>

            <div className="space-y-2">
              {[
                { id: 'standard', label: 'Standaard Redactioneel', desc: 'Klassieke editorial stijl met sidebar' },
                { id: 'split_header', label: 'Portret / Split Header', desc: 'Ideaal voor interviews en staande foto\'s (2-koloms)' },
                { id: 'editorial_story', label: 'Groot Magazine Verhaal', desc: 'Brede hero header met meeslepende layout' },
                { id: 'listicle', label: 'Toplijst / Hotspots', desc: 'Genummerde lijstjes (bijv. 5x terras)' },
                { id: 'visual_gallery', label: 'Beeldreportage', desc: 'Fotografische fotogalerij layout' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`block p-3 rounded-xl border text-xs cursor-pointer transition-all ${template === item.id
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="template"
                      value={item.id}
                      checked={template === item.id}
                      onChange={(e) => setTemplate(e.target.value as any)}
                      className="accent-white"
                    />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <p className={`text-[11px] mt-1 pl-5 ${template === item.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {item.desc}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {/* Author / Redacteur */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                Auteur / Redacteur
              </h3>
              {accountAuthorName && authorName.trim() !== accountAuthorName && (
                <button
                  type="button"
                  onClick={() => setAuthorName(accountAuthorName)}
                  className="text-[11px] font-bold text-[#FF4F00] hover:underline cursor-pointer"
                >
                  Gebruik mijn naam
                </button>
              )}
            </div>

            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={DEFAULT_AUTHOR_NAME}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
              />
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {accountAuthorName ? (
                <>
                  Automatisch gekoppeld aan je account (<span className="font-semibold text-zinc-700">{accountAuthorName}</span>). Laat leeg voor <span className="font-semibold text-zinc-700">{DEFAULT_AUTHOR_NAME}</span>.
                </>
              ) : (
                <>
                  Geen voor- en achternaam ingesteld bij je account. Vul hier een naam in of stel je naam in via je profiel linksonder. Leeg = <span className="font-semibold text-zinc-700">{DEFAULT_AUTHOR_NAME}</span>.
                </>
              )}
            </p>
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
              {ARTICLE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location / Spot linking */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
              Locatie / Spot Koppelen (Optioneel)
            </h3>
            <LocationCombobox
              locations={locationsList}
              selectedSlug={selectedLocationSlug}
              onSelect={handleLocationSelect}
              label=""
              placeholder="Zoek locatie of hotspot..."
              helpText="Selecteer een Arnhemse locatie om gegevens direct in te voegen."
            />

            {selectedLocationSlug && (() => {
              const loc = locationsList.find((l) => l.slug === selectedLocationSlug);
              if (!loc) return null;
              return (
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                    Snelle acties voor {loc.name}:
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleInsertLocationIntoContent(loc)}
                      className="w-full text-left px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>Voeg adresblok in artikeltekst</span>
                      </span>
                      <span className="text-[10px] text-[#FF4F00] font-bold shrink-0">+ Invoegen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyLocationToCta(loc)}
                      className="w-full text-left px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
                        <span>Vul artikel CTA-blok automatisch</span>
                      </span>
                      <span className="text-[10px] text-[#FF4F00] font-bold shrink-0">+ CTA</span>
                    </button>
                    {loc.featured_image && loc.featured_image !== '/logo.png' && (
                      <button
                        type="button"
                        onClick={() => {
                          setFeaturedImage(loc.featured_image!);
                          setFeedback({ type: 'success', message: 'Locatie-afbeelding ingesteld als hoofdafbeelding.' });
                        }}
                        className="w-full text-left px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>Gebruik locatiefoto als cover</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold shrink-0">Instellen</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Featured Image & Supabase Media Upload */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                Hoofdafbeelding
              </h3>
              <span className="text-[11px] text-zinc-400">Media Bucket</span>
            </div>

            {/* Eenduidige uploadzone met preview */}
            {featuredImage ? (
              <div className="space-y-3">
                <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                  <Image
                    src={featuredImage}
                    alt="Voorvertoning"
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
                    onClick={() => setFeaturedImage('')}
                    aria-label="Afbeelding verwijderen"
                    className="p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 aspect-16/9 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-[#FF4F00] bg-zinc-50 hover:bg-white cursor-pointer transition-colors p-4 text-center">
                <Upload className="w-6 h-6 text-[#FF4F00]" />
                <span className="text-xs font-bold text-zinc-800">
                  {uploadingImage ? 'Bezig met uploaden...' : 'Klik om hoofdafbeelding te uploaden'}
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
        </div>
      </div>
    </form>
  );
}
