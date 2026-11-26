'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';
import { ModularCtaBlock } from './ModularCtaBlock';
import { formatDate, isLogoFallbackImage } from '@/lib/utils';
import { formatRichContent } from '@/lib/contentRenderer';
import { getArticleCategoryLabel } from '@/data/mockData';

interface LayoutTemplateViewProps {
  article: Article;
}

export function LayoutTemplateView({ article }: LayoutTemplateViewProps) {
  const template = article.layout_template || 'standard';
  const featuredImageSrc = article.featured_image_url || '/logo.png';
  const isLogoFallback = isLogoFallbackImage(featuredImageSrc);
  const isBlobImage = featuredImageSrc.startsWith('blob:');
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const wordCount = article.content
    ? article.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
    : 200;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    if (!featuredImageSrc) return;
    const img = new window.Image();
    img.src = featuredImageSrc;
    if (img.complete && img.naturalHeight > 0) {
      const portrait = img.naturalHeight > img.naturalWidth;
      setIsPortrait(portrait);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    } else {
      img.onload = () => {
        const portrait = img.naturalHeight > img.naturalWidth;
        setIsPortrait(portrait);
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      };
    }
  }, [featuredImageSrc]);

  const showSplitHeader =
    template === 'split_header' ||
    (template !== 'editorial_story' && isPortrait);

  return (
    <article className="w-full">
      {/* 1. EDITORIAL STORY TEMPLATE: Big immersive banner */}
      {template === 'editorial_story' && (
        <div className={`relative w-full h-[65vh] min-h-[450px] flex items-end mb-12 ${isLogoFallback ? 'bg-surface-muted' : 'bg-ink'}`}>
          <Image
            src={featuredImageSrc}
            alt={article.title || 'Artikelafbeelding'}
            fill
            priority
            unoptimized={isBlobImage}
            sizes="100vw"
            className={isLogoFallback ? 'object-contain p-16 sm:p-24 opacity-80' : 'object-cover'}
          />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white">
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-xs">
              {article.title}
            </h1>

            <p className="text-white/90 text-lg sm:text-xl mt-4 font-normal max-w-2xl leading-relaxed drop-shadow-xs">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-6 pt-6 border-t border-white/20 text-xs text-zinc-300">
              <span className="uppercase tracking-wider font-bold text-[#FF4F00]">
                {getArticleCategoryLabel(article.category)}
              </span>
              <span aria-hidden="true">•</span>
              <span className="font-bold text-white">Door {article.author_name || 'Redactie'}</span>
              <span aria-hidden="true">•</span>
              <span>{formatDate(article.published_at)}</span>
              <span aria-hidden="true">•</span>
              <span>Leestijd {readMinutes} min</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. OPTION C: SPLIT HEADER (FOR PORTRAIT IMAGES & INTERVIEWS) */}
      {showSplitHeader && (
        <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Vertical Portrait Image */}
            <div className="md:col-span-5 order-2 md:order-1 flex justify-center">
              <div
                className="relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl bg-zinc-100 ring-1 ring-zinc-900/10 group"
                style={{
                  aspectRatio: aspectRatio ? `${aspectRatio}` : '2/3',
                  maxHeight: '640px',
                }}
              >
                <Image
                  src={featuredImageSrc}
                  alt={article.title || 'Artikelafbeelding'}
                  fill
                  priority
                  unoptimized={isBlobImage}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className={
                    isLogoFallback
                      ? 'object-contain p-10 opacity-85'
                      : 'object-contain sm:object-cover transition-transform duration-700 group-hover:scale-102'
                  }
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl pointer-events-none" />
              </div>
            </div>

            {/* Right Column: Article Details */}
            <div className="md:col-span-7 order-1 md:order-2 flex flex-col justify-center">
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-zinc-950 leading-[1.15] tracking-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-zinc-500 font-medium">
                <span className="uppercase tracking-wider font-bold text-[#FF4F00]">
                  {getArticleCategoryLabel(article.category)}
                </span>
                <span className="text-zinc-300" aria-hidden="true">•</span>
                <span>Gepubliceerd op {formatDate(article.published_at)}</span>
                <span className="text-zinc-300" aria-hidden="true">•</span>
                <span>{readMinutes} min leestijd</span>
              </div>

              <p className="text-zinc-600 text-lg sm:text-xl mt-5 leading-relaxed font-normal">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-zinc-200 text-xs text-zinc-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold text-sm shadow-inner">
                    {(article.author_name || 'Redactie Uit in Arnhem').trim()[0]?.toUpperCase() || 'R'}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">{article.author_name || 'Redactie Uit in Arnhem'}</p>
                    <p className="text-xs text-zinc-500">Redacteur Uit in Arnhem</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 bg-zinc-100 rounded-full text-zinc-700 font-semibold text-xs">
                    {template === 'listicle' ? 'Topselectie' : template === 'visual_gallery' ? 'Beeldreportage' : 'Portret & Interview'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 3. STANDARD / LISTICLE / VISUAL GALLERY HEADER (LANDSCAPE IMAGES) */}
      {!showSplitHeader && template !== 'editorial_story' && (
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-zinc-950 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-zinc-500 font-medium">
            <span className="uppercase tracking-wider font-bold text-[#FF4F00]">
              {getArticleCategoryLabel(article.category)}
            </span>
            <span className="text-zinc-300" aria-hidden="true">•</span>
            <span>Gepubliceerd op {formatDate(article.published_at)}</span>
            <span className="text-zinc-300" aria-hidden="true">•</span>
            <span>{readMinutes} min leestijd</span>
          </div>

          <p className="text-zinc-600 text-lg sm:text-xl mt-4 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-zinc-200 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
                {(article.author_name || 'Redactie Uit in Arnhem').trim()[0]?.toUpperCase() || 'R'}
              </div>
              <div>
                <p className="font-bold text-zinc-900">{article.author_name || 'Redactie Uit in Arnhem'}</p>
                <p className="text-[11px] text-zinc-500">Redacteur Uit in Arnhem</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-zinc-100 rounded-full text-zinc-600 font-semibold">
                {template === 'listicle' ? 'Topselectie' : template === 'visual_gallery' ? 'Beeldreportage' : 'Redactioneel'}
              </span>
            </div>
          </div>

          {/* Main Feature Image */}
          <div className="relative aspect-16/9 w-full mt-8 rounded-3xl overflow-hidden shadow-lg bg-surface-muted">
            <Image
              src={featuredImageSrc}
              alt={article.title || 'Artikelafbeelding'}
              fill
              priority
              unoptimized={isBlobImage}
              className={isLogoFallback ? 'object-contain p-12 sm:p-20 opacity-85' : 'object-cover'}
            />
          </div>
        </header>
      )}

      {/* ARTICLE BODY CONTENT */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`prose prose-zinc prose-lg max-w-none text-zinc-800 leading-relaxed
            [&>p]:mb-6 [&>p]:leading-relaxed
            [&>h2]:font-heading [&>h2]:font-black [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:text-zinc-900 [&>h2]:mt-10 [&>h2]:mb-4
            ${template !== 'listicle' ? '[&>h3]:font-heading [&>h3]:font-bold [&>h3]:text-xl [&>h3]:text-zinc-900 [&>h3]:mt-8 [&>h3]:mb-3' : ''}
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-6 [&>ul>li]:mb-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-6 [&>ol>li]:mb-2
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#FF4F00] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:text-zinc-700
            [&>strong]:font-bold [&>strong]:text-zinc-900
            [&_a]:text-[#FF4F00] [&_a]:underline [&_a]:decoration-[#FF4F00]/50 hover:[&_a]:text-[#E04500] hover:[&_a]:decoration-[#E04500]
            [&>figure]:my-8 [&>figure>img]:max-w-full [&>figure>img]:w-auto [&>figure>img]:max-h-[560px] [&>figure>img]:mx-auto [&>figure>img]:rounded-2xl [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-zinc-500 [&>figure>figcaption]:mt-2.5`}
          dangerouslySetInnerHTML={{
            __html: formatRichContent(article.content, article.title, { layoutTemplate: template }),
          }}
        />

        {/* Visual Gallery if template is visual_gallery or has gallery images */}
        {article.gallery_image_urls && article.gallery_image_urls.length > 0 && (
          <div className="my-10 space-y-4">
            <h4 className="font-heading font-bold text-lg text-zinc-900">Fotoreportage</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.gallery_image_urls.map((url, gIdx) => (
                <div key={gIdx} className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={url}
                    alt={`Foto ${gIdx + 1} bij ${article.title}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modular CTA Block */}
        {article.cta_block && <ModularCtaBlock cta={article.cta_block} />}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-8 border-t border-zinc-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2">Tags:</span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/artikelen?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
