import React from 'react';
import Image from 'next/image';
import { Article } from '@/types';
import { ModularCtaBlock } from './ModularCtaBlock';
import { Clock, Calendar, User, Tag, Share2, Bookmark } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface LayoutTemplateViewProps {
  article: Article;
}

export function LayoutTemplateView({ article }: LayoutTemplateViewProps) {
  const template = article.layout_template || 'standard';

  // Format paragraphs
  const paragraphs = article.content.split('\n\n').filter(Boolean);

  return (
    <article className="w-full">
      {/* 1. EDITORIAL STORY TEMPLATE: Big immersive banner */}
      {template === 'editorial_story' && (
        <div className="relative w-full h-[65vh] min-h-[450px] bg-zinc-950 flex items-end mb-12">
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            priority
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                {article.category}
              </span>
              <span className="text-xs text-zinc-300 font-medium">
                {formatDate(article.published_at)}
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-tight">
              {article.title}
            </h1>

            <p className="text-zinc-200 text-lg sm:text-xl mt-4 font-normal max-w-2xl leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/20 text-xs text-zinc-300">
              <span className="font-bold text-white">Door {article.author_name || 'Redactie'}</span>
              <span>•</span>
              <span>Leestijd ~4 minuten</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. STANDARD / LISTICLE / VISUAL GALLERY HEADER */}
      {template !== 'editorial_story' && (
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              Gepubliceerd op {formatDate(article.published_at)}
            </span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-zinc-950 leading-tight">
            {article.title}
          </h1>

          <p className="text-zinc-600 text-lg sm:text-xl mt-4 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-zinc-200 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
                {article.author_name ? article.author_name[0] : 'R'}
              </div>
              <div>
                <p className="font-bold text-zinc-900">{article.author_name || 'Redactie Uit in Arnhem'}</p>
                <p className="text-[11px] text-zinc-500">Cultuur & Lifestyle redacteur</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-zinc-100 rounded-full text-zinc-600 font-semibold">
                {template === 'listicle' ? 'Topselectie' : template === 'visual_gallery' ? 'Beeldreportage' : 'Redactioneel'}
              </span>
            </div>
          </div>

          {/* Main Feature Image */}
          <div className="relative aspect-16/9 w-full mt-8 rounded-3xl overflow-hidden shadow-lg bg-zinc-100">
            <Image
              src={article.featured_image_url}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </header>
      )}

      {/* ARTICLE BODY CONTENT */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6 text-zinc-800 leading-relaxed text-base sm:text-lg">
          {paragraphs.map((p, idx) => {
            // Check if paragraph is markdown heading
            if (p.startsWith('### ')) {
              return (
                <div key={idx} className="pt-6">
                  {template === 'listicle' && (
                    <span className="inline-block w-8 h-8 rounded-full bg-[#FF4F00] text-white text-center leading-8 font-black text-sm mr-3">
                      {p.match(/^\d+/) || (idx % 6) + 1}
                    </span>
                  )}
                  <h3 className="font-heading font-black text-2xl text-zinc-900 inline">
                    {p.replace('### ', '')}
                  </h3>
                </div>
              );
            }

            if (p.startsWith('*Adres:')) {
              return (
                <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-sm text-zinc-600 font-mono">
                  📍 {p.replace(/\*/g, '')}
                </div>
              );
            }

            return (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>

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
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
