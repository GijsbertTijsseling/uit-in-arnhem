'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Article, LayoutTemplate, CtaBlock, Location } from '@/types';
import {
  ARTICLE_CATEGORIES,
  SUGGESTED_ARTICLE_TAGS,
  normalizeArticleCategorySlug,
} from '@/data/mockData';
import {
  uploadImageToSupabase,
  saveArticleToSupabase,
  deleteArticleFromSupabase,
  getLocations,
} from '@/lib/supabase/api';
import { getCurrentEditorUser, DEFAULT_AUTHOR_NAME } from '@/lib/auth';
import { LOCATIONS_CATALOG } from '@/data/locationsData';
import { LocationCombobox } from '@/components/admin/LocationCombobox';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { LayoutTemplateView } from '@/components/articles/LayoutTemplateView';
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
  Eye,
  PenLine,
  Monitor,
  Smartphone,
  ListOrdered,
  X,
} from 'lucide-react';

const LAYOUT_TEMPLATES: {
  id: LayoutTemplate;
  label: string;
  shortLabel: string;
  desc: string;
}[] = [
    {
      id: 'standard',
      label: 'Standaard Redactioneel',
      shortLabel: 'Standaard',
      desc: 'Klassieke editorial stijl met liggende hoofdfoto',
    },
    {
      id: 'split_header',
      label: 'Portret / Split Header',
      shortLabel: 'Portret / Split',
      desc: "Ideaal voor interviews en staande foto's (2-koloms)",
    },
    {
      id: 'editorial_story',
      label: 'Groot Magazine Verhaal',
      shortLabel: 'Magazine',
      desc: 'Brede hero header met meeslepende layout',
    },
    {
      id: 'listicle',
      label: 'Toplijst / Hotspots',
      shortLabel: 'Toplijst',
      desc: 'Genummerde lijstjes met opvallende 01/02/03 kopjes',
    },
  ];

interface ArticleEditorFormProps {
  initialArticle?: Partial<Article>;
  isNew?: boolean;
}

export function ArticleEditorForm({ initialArticle, isNew = false }: ArticleEditorFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [category, setCategory] = useState(
    initialArticle?.category
      ? normalizeArticleCategorySlug(initialArticle.category)
      : 'eten-drinken'
  );
  const [tags, setTags] = useState<string[]>(
    Array.isArray(initialArticle?.tags) ? initialArticle.tags : []
  );
  const [tagInput, setTagInput] = useState('');
  const [template, setTemplate] = useState<LayoutTemplate>(
    initialArticle?.layout_template && initialArticle.layout_template !== 'visual_gallery'
      ? initialArticle.layout_template
      : 'standard'
  );
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const canDelete = Boolean(!isNew && initialArticle?.id && !initialArticle.id.startsWith('art-'));

  const handleConfirmDelete = async () => {
    if (!initialArticle?.id) return;
    setDeleting(true);
    setFeedback(null);
    const { success, error } = await deleteArticleFromSupabase(initialArticle.id);
    if (!success) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Kon artikel niet verwijderen.',
      });
      setDeleting(false);
      setDeleteModalOpen(false);
      return;
    }
    router.push('/admin/articles');
    router.refresh();
  };

  // Preview & inline photo states
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [showInlineImagePanel, setShowInlineImagePanel] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [inlineImageCaption, setInlineImageCaption] = useState('');
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);
  const [inlineUploadError, setInlineUploadError] = useState<string | null>(null);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

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

  // Insert snippet at current cursor position in content textarea
  const insertAtCursor = (snippet: string, wrapSuffix?: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) {
      setContent((prev) => `${prev}${snippet}${wrapSuffix || ''}`);
      return;
    }

    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;
    const selectedText = content.slice(start, end);

    let nextContent: string;
    let nextCursorPos: number;

    if (wrapSuffix !== undefined) {
      const inner = selectedText || 'Tekst hier';
      const replacement = `${snippet}${inner}${wrapSuffix}`;
      nextContent = content.slice(0, start) + replacement + content.slice(end);
      nextCursorPos = start + snippet.length + inner.length + wrapSuffix.length;
    } else {
      nextContent = content.slice(0, start) + snippet + content.slice(end);
      nextCursorPos = start + snippet.length;
    }

    setContent(nextContent);

    requestAnimationFrame(() => {
      if (contentTextareaRef.current) {
        contentTextareaRef.current.focus();
        contentTextareaRef.current.setSelectionRange(nextCursorPos, nextCursorPos);
      }
    });
  };

  const handleInsertLocationIntoContent = (loc: Location) => {
    const addressBlock = `\n\n**${loc.name}**\n${loc.address ? `*Adres: ${loc.address}${loc.city ? `, ${loc.city}` : ''}*\n` : ''}${loc.website ? `*Website:* [${loc.name}](${loc.website})\n` : ''}`;
    insertAtCursor(addressBlock);
    setFeedback({ type: 'success', message: `Locatie "${loc.name}" ingevoegd in artikeltekst.` });
  };

  const handleInsertLocationImageIntoContent = (loc: Location) => {
    if (!loc.featured_image) return;
    const safeCaption = loc.name.replace(/[\[\]]/g, '');
    insertAtCursor(`\n\n![${safeCaption}](${loc.featured_image})\n\n`);
    setFeedback({ type: 'success', message: `Locatiefoto van "${loc.name}" ingevoegd in artikeltekst.` });
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

  // Image upload handler (featured cover — min. 800px breed)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setCoverUploadError(null);
    setFeedback(null);

    try {
      const publicUrl = await uploadImageToSupabase(file, { minWidth: 800 });
      setFeaturedImage(publicUrl);
      setFeedback({ type: 'success', message: 'Hoofdafbeelding succesvol geüpload!' });
    } catch (err: any) {
      console.warn('Storage upload error:', err);
      setCoverUploadError(
        err?.message || 'Upload naar Supabase Storage is mislukt. Gebruik een JPG, PNG of WebP bestand (min. 800px breed).'
      );
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Inline article photo upload handler (min. 600px breed)
  const handleInlineImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInlineImage(true);
    setInlineUploadError(null);
    setFeedback(null);

    try {
      const publicUrl = await uploadImageToSupabase(file, { minWidth: 600 });
      setInlineImageUrl(publicUrl);
    } catch (err: any) {
      console.warn('Inline photo upload error:', err);
      setInlineImageUrl('');
      setInlineUploadError(
        err?.message || 'Upload naar Supabase Storage is mislukt. Gebruik een JPG, PNG of WebP bestand (min. 600px breed).'
      );
    } finally {
      setUploadingInlineImage(false);
      e.target.value = '';
    }
  };

  const handleConfirmInsertInlineImage = () => {
    if (!inlineImageUrl) return;
    const cleanCaption = inlineImageCaption.trim().replace(/[\[\]]/g, '');
    insertAtCursor(`\n\n![${cleanCaption}](${inlineImageUrl})\n\n`);
    setInlineImageUrl('');
    setInlineImageCaption('');
    setInlineUploadError(null);
    setShowInlineImagePanel(false);
    setFeedback({ type: 'success', message: 'Foto ingevoegd in de artikeltekst.' });
  };

  // Content formatting toolbar (cursor-aware)
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (suffix) {
      insertAtCursor(prefix, suffix);
    } else {
      const needsLeadingNewline = content.length > 0 && !content.endsWith('\n');
      insertAtCursor(`${needsLeadingNewline ? '\n\n' : ''}${prefix}`);
    }
  };

  // Insert next numbered listicle item
  const handleInsertListicleItem = () => {
    const existingHeadings = content.match(/^###\s+.+$/gm) || [];
    const nextNumber = existingHeadings.length + 1;
    const prefix = content.trim().length > 0 ? '\n\n' : '';
    const block = `${prefix}### ${nextNumber}. Naam van de plek\n\nKorte omschrijving van waarom deze plek de moeite waard is.\n\n*Adres: Straat 1, Arnhem*\n`;
    insertAtCursor(block);
  };

  // Live preview article model
  const previewCtaBlock: CtaBlock | undefined =
    enableCta && (ctaHeading || ctaDesc || ctaBtnLabel)
      ? {
        heading: ctaHeading || 'Meer weten?',
        description: ctaDesc || '',
        button_label: ctaBtnLabel || 'Bekijk meer',
        button_url: ctaBtnUrl || '#',
      }
      : undefined;

  const defaultPreviewContent =
    template === 'listicle'
      ? '### 1. Eerste hotspot in Arnhem\n\nSchrijf hier een korte, prikkelende alinea over de eerste plek uit je lijstje. Via de knop Foto in de editor voeg je per item direct een foto toe.\n\n*Adres: Klarendalseweg 100, Arnhem*\n\n### 2. Tweede hotspot in Arnhem\n\nElk ###-kopje krijgt in het Toplijst-template automatisch een herkenbaar genummerd blok.'
      : 'Schrijf je artikeltekst in het tabblad Bewerken om hier direct het eindresultaat te zien. Gebruik ### voor tussenkopjes en de knop Foto om beelden door je verhaal heen te plaatsen.';

  const previewArticle: Article = {
    id: initialArticle?.id || 'preview',
    slug: slug || 'voorbeeld-artikel',
    title: title.trim() || 'Titel van je artikel',
    excerpt:
      excerpt.trim() ||
      'Korte samenvatting of lead van het artikel die lezers nieuwsgierig maakt.',
    content: content.trim() || defaultPreviewContent,
    featured_image_url: featuredImage || '/logo.png',
    gallery_image_urls: initialArticle?.gallery_image_urls,
    author_name: authorName.trim() || accountAuthorName || DEFAULT_AUTHOR_NAME,
    category,
    tags,
    status,
    is_featured: isFeatured,
    layout_template: template,
    cta_block: previewCtaBlock,
    published_at: initialArticle?.published_at || new Date().toISOString(),
    created_at: initialArticle?.created_at || new Date().toISOString(),
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
      setActiveTab('edit');
      setFeedback({
        type: 'error',
        message: 'Vul eerst titel, slug, korte samenvatting en artikelinhoud in voordat je opslaat.',
      });
      return;
    }
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
      tags,
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
        console.warn('Supabase save error:', error);
        setFeedback({
          type: 'error',
          message: error.message || 'Opslaan in database is mislukt.',
        });
        return;
      }
      setFeedback({ type: 'success', message: 'Artikel succesvol opgeslagen en bijgewerkt!' });
      setTimeout(() => {
        router.push('/admin/articles');
        router.refresh();
      }, 800);
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

        <div className="flex flex-wrap items-center gap-3">
          {/* Bewerken / Voorvertoning tabje */}
          <div
            role="tablist"
            aria-label="Weergave"
            className="inline-flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'edit'}
              onClick={() => setActiveTab('edit')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'edit'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Bewerken</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'preview'}
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'preview'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
                }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Voorvertoning</span>
            </button>
          </div>

          {canDelete && (
            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
              title="Artikel verwijderen"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Verwijderen</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
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

      {/* Live Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* Preview Controls Bar: Template switcher + Viewport toggle */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mr-1">
                Template:
              </span>
              {LAYOUT_TEMPLATES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTemplate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${template === item.id
                    ? 'bg-zinc-900 border-zinc-900 text-white'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                >
                  {item.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-3">
              {template === 'listicle' && (
                <span className="text-[11px] text-zinc-500">
                  Tip: elk <code className="px-1 py-0.5 bg-zinc-100 rounded text-zinc-800 font-mono">###</code> kopje wordt automatisch genummerd.
                </span>
              )}
              <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${previewViewport === 'desktop'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  title="Desktop weergave"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${previewViewport === 'mobile'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  title="Mobiele weergave"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobiel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-100/70 p-3 sm:p-6 overflow-hidden">
            <div
              className={`mx-auto bg-canvas rounded-2xl border border-border-warm shadow-card overflow-hidden transition-all duration-300 ${previewViewport === 'mobile' ? 'max-w-[400px]' : 'w-full'
                }`}
            >
              <div className="px-4 py-2.5 bg-surface border-b border-border-warm flex items-center justify-between text-[11px] text-ink-muted">
                <span className="font-mono truncate">
                  uitinarnhem.nl/artikelen/{previewArticle.slug}
                </span>
                <span className="font-semibold text-ink shrink-0 ml-3">
                  {LAYOUT_TEMPLATES.find((t) => t.id === template)?.label}
                </span>
              </div>
              <div className="pb-12">
                <LayoutTemplateView article={previewArticle} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout (Edit Tab) */}
      {activeTab === 'edit' && (
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Artikel Inhoud (Rich Text / Markdown) *
                </label>
                <div className="flex flex-wrap items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ')}
                    className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    title="Tussenkop (H3)"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    title="Vetgedrukt"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    title="Cursief"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    title="Quote"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ')}
                    className="p-1.5 hover:bg-white rounded-lg text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    title="Opsomming"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*Adres: Straat 1, Arnhem*')}
                    className="inline-flex items-center gap-1 px-2 py-1 hover:bg-white rounded-lg text-[11px] font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                    title="Adresblok invoegen"
                  >
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Adres</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInlineImagePanel((prev) => !prev)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${showInlineImagePanel
                      ? 'bg-zinc-900 text-white'
                      : 'hover:bg-white text-zinc-700 hover:text-zinc-900'
                      }`}
                    title="Foto invoegen op cursorpositie"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto</span>
                  </button>
                  {template === 'listicle' && (
                    <button
                      type="button"
                      onClick={handleInsertListicleItem}
                      className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white rounded-lg text-[11px] font-bold text-zinc-700 hover:text-zinc-900 cursor-pointer"
                      title="Volgend genummerd lijstitem invoegen"
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-[#FF4F00]" />
                      <span>+ Lijstitem</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Photo Uploader Panel */}
              {showInlineImagePanel && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        Foto invoegen in artikeltekst
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Wordt geplaatst op de huidige cursorpositie (ideaal voor 5x-lijstjes en tussenbeelden).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInlineImagePanel(false);
                        setInlineImageUrl('');
                        setInlineImageCaption('');
                        setInlineUploadError(null);
                      }}
                      aria-label="Sluiten"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/70 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {inlineUploadError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{inlineUploadError}</span>
                    </div>
                  )}

                  {inlineImageUrl ? (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-5 relative aspect-16/10 rounded-xl overflow-hidden bg-zinc-200 border border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={inlineImageUrl}
                          alt={inlineImageCaption || 'Voorvertoning foto'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="sm:col-span-7 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                            Bijschrift / Fotocredit (optioneel)
                          </label>
                          <input
                            type="text"
                            value={inlineImageCaption}
                            onChange={(e) => setInlineImageCaption(e.target.value)}
                            placeholder="Bijv. Terras in de zon bij Koffiebar X"
                            className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleConfirmInsertInlineImage}
                            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Foto invoegen in tekst
                          </button>
                          <label className="px-3 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 cursor-pointer transition-colors">
                            <span>{uploadingInlineImage ? 'Uploaden...' : 'Andere foto'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                              onChange={handleInlineImageFileChange}
                              disabled={uploadingInlineImage}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col sm:flex-row items-center justify-center gap-2.5 py-5 px-4 rounded-xl border-2 border-dashed border-zinc-300 hover:border-[#FF4F00] bg-white cursor-pointer transition-colors text-center">
                      <Upload className="w-5 h-5 text-[#FF4F00] shrink-0" />
                      <span className="text-xs font-bold text-zinc-800">
                        {uploadingInlineImage ? 'Bezig met uploaden...' : 'Klik om een foto te uploaden'}
                      </span>
                      <span className="text-[11px] text-zinc-500">(JPG, PNG of WebP · min. 600px breed)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        onChange={handleInlineImageFileChange}
                        disabled={uploadingInlineImage}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              <textarea
                ref={contentTextareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={14}
                placeholder={
                  template === 'listicle'
                    ? 'Begin met een korte intro en gebruik ### 1. Naam van de plek voor elk genummerd item. Klik op Foto om per item een afbeelding in te voegen...'
                    : 'Schrijf hier het volledige artikelverhaal. Gebruik ### voor tussenkopjes en de knop Foto voor beelden in de tekst...'
                }
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
            {/* Featured Image & Supabase Media Upload (top of sidebar so it's never missed) */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                  Hoofdafbeelding
                </h3>
                <span className="text-[11px] text-zinc-400">Min. 800px breed</span>
              </div>

              {coverUploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{coverUploadError}</span>
                </div>
              )}

              {/* Eenduidige uploadzone met preview */}
              {featuredImage ? (
                <div className="space-y-3">
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredImage}
                      alt="Voorvertoning hoofdafbeelding"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploaden...' : 'Andere foto kiezen'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
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
                  <span className="text-[11px] text-zinc-500">JPG, PNG of WebP · min. 800px breed</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>

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
                {LAYOUT_TEMPLATES.map((item) => (
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

            {/* Category & Tags */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-xs space-y-5">
              <div className="space-y-2.5">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-800">
                  Hoofdcategorie
                </h3>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
                >
                  {ARTICLE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {(() => {
                  const activeCat = ARTICLE_CATEGORIES.find((c) => c.id === category);
                  return activeCat?.description ? (
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      {activeCat.description}
                    </p>
                  ) : null;
                })()}
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Tags (Optioneel)
                  </h4>
                  <span className="text-[11px] text-zinc-400">Format of wijk</span>
                </div>

                {/* Selected tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-semibold"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                          aria-label={`Verwijder tag ${tag}`}
                          className="text-zinc-300 hover:text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Free tag input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const cleaned = tagInput.trim().toLowerCase().replace(/^#+/, '').replace(/,+$/, '');
                        if (cleaned && !tags.includes(cleaned)) {
                          setTags((prev) => [...prev, cleaned]);
                        }
                        setTagInput('');
                      }
                    }}
                    placeholder="Voeg tag toe en druk op Enter..."
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const cleaned = tagInput.trim().toLowerCase().replace(/^#+/, '');
                      if (cleaned && !tags.includes(cleaned)) {
                        setTags((prev) => [...prev, cleaned]);
                      }
                      setTagInput('');
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Toevoegen
                  </button>
                </div>

                {/* Quick suggested tags */}
                <div className="space-y-1.5">
                  <p className="text-[11px] text-zinc-500">Snelle suggesties:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_ARTICLE_TAGS.map((suggested) => {
                      const isSelected = tags.includes(suggested);
                      return (
                        <button
                          key={suggested}
                          type="button"
                          onClick={() =>
                            setTags((prev) =>
                              isSelected
                                ? prev.filter((t) => t !== suggested)
                                : [...prev, suggested]
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-900 border-zinc-900 text-white'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                          }`}
                        >
                          #{suggested}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
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
                        <>
                          <button
                            type="button"
                            onClick={() => handleInsertLocationImageIntoContent(loc)}
                            className="w-full text-left px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <span className="inline-flex items-center gap-2">
                              <ImageIcon className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
                              <span>Voeg locatiefoto in tekst</span>
                            </span>
                            <span className="text-[10px] text-[#FF4F00] font-bold shrink-0">+ Foto</span>
                          </button>
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
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={deleteModalOpen}
        title="Artikel verwijderen"
        itemName={title || initialArticle?.title || 'Dit artikel'}
        description="Het artikel wordt definitief verwijderd uit het CMS en de website."
        loading={deleting}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </form>
  );
}
