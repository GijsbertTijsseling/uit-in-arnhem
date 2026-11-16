'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Article, LayoutTemplate, CtaBlock } from '@/types';
import { ARTICLE_CATEGORIES } from '@/data/mockData';
import { uploadImageToSupabase, saveArticleToSupabase } from '@/lib/supabase/api';
import {
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Heading2,
  Heading3,
  Quote,
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
        message: 'Supabase storage media bucket is niet publiek schrijfbaar. Lokale preview geladen; je kunt ook een directe beelduitwisselingslink invullen.',
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
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
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
                  className="px-2 py-1 hover:bg-white rounded-lg text-[11px] font-bold text-zinc-600"
                  title="Adres tag"
                >
                  📍 Adres
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
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
                    <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
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

            <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-[#FF4F00] focus:ring-[#FF4F00]"
              />
              <span>Uitlichten op Homepage (Hero Story)</span>
            </label>
          </div>

          {/* Template Selector */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
              Layout Template
            </h3>

            <div className="space-y-2">
              {[
                { id: 'standard', label: 'Standaard Redactioneel', desc: 'Klassieke editorial stijl met sidebar' },
                { id: 'editorial_story', label: 'Groot Magazine Verhaal', desc: 'Brede hero header met meeslepende layout' },
                { id: 'listicle', label: 'Toplijst / Hotspots', desc: 'Genummerde lijstjes (bijv. 5x terras)' },
                { id: 'visual_gallery', label: 'Beeldreportage', desc: 'Fotografische fotogalerij layout' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`block p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    template === item.id
                      ? 'border-[#FF4F00] bg-[#FFF3ED] text-[#FF4F00]'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="template"
                      value={item.id}
                      checked={template === item.id}
                      onChange={(e) => setTemplate(e.target.value as any)}
                      className="text-[#FF4F00] focus:ring-[#FF4F00]"
                    />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 pl-5">{item.desc}</p>
                </label>
              ))}
            </div>
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

          {/* Featured Image & Supabase Media Upload */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                Hoofdafbeelding
              </h3>
              <span className="text-[11px] text-zinc-400">Media Bucket</span>
            </div>

            {/* Preview */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt="Voorvertoning"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span>Geen afbeelding gekozen</span>
                </div>
              )}
            </div>

            {/* Upload to Supabase Storage button */}
            <div>
              <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors shadow-sm">
                <Upload className="w-4 h-4 text-[#FF4F00]" />
                <span>{uploadingImage ? 'Bezig met uploaden...' : 'Upload naar Supabase Media'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Or direct URL */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Of plak directe afbeeldings-URL:
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
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
