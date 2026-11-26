'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { Article } from '@/types';
import { formatDate, isLogoFallbackImage } from '@/lib/utils';
import { getArticleCategoryLabel } from '@/data/mockData';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const isLogoFallback = isLogoFallbackImage(article.featured_image_url);

  // Reading time estimate
  const words = article.content ? article.content.split(/\s+/).length : 200;
  const readMinutes = Math.max(1, Math.ceil(words / 200));

  if (featured) {
    return (
      <article className="group relative rounded-3xl overflow-hidden bg-ink text-white shadow-card-hover grid grid-cols-1 lg:grid-cols-12 min-h-120">
        {/* Image col */}
        <div
          className={`lg:col-span-7 relative min-h-75 lg:min-h-full overflow-hidden flex items-center justify-center ${
            isLogoFallback ? 'bg-surface-muted' : 'bg-ink'
          }`}
        >
          {/* Ambient blur background for portrait images */}
          {isPortrait && !isLogoFallback && (
            <div className="absolute -inset-6 overflow-hidden pointer-events-none">
              <Image
                src={article.featured_image_url}
                alt=""
                fill
                aria-hidden="true"
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover blur-xl scale-125 opacity-70 brightness-90 saturate-150"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}

          <Image
            src={article.featured_image_url || '/logo.png'}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            onLoad={(e) => {
              if (isLogoFallback) return;
              const img = e.currentTarget;
              if (img.naturalHeight > img.naturalWidth) {
                setIsPortrait(true);
              }
            }}
            className={`${
              isLogoFallback
                ? 'object-contain p-10 sm:p-14 transition-transform duration-500 group-hover:scale-103'
                : isPortrait
                  ? 'object-contain relative z-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105'
                  : 'object-cover transition-transform duration-700 group-hover:scale-105'
            }`}
          />
          {!isLogoFallback && (
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/55 via-transparent to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* Content col */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {getArticleCategoryLabel(article.category)}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {formatDate(article.published_at)}
              </span>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight group-hover:text-[#FF4F00] transition-colors">
              <Link href={`/artikelen/${article.slug}`}>
                {article.title}
              </Link>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base mt-4 line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Door {article.author_name || 'Redactie'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readMinutes} min leestijd
              </span>
            </div>

            <Link
              href={`/artikelen/${article.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4F00] group-hover:translate-x-1 transition-transform uppercase tracking-wider"
            >
              Lees verhaal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-surface rounded-2xl overflow-hidden border border-border-warm shadow-card hover:shadow-card-hover transition-all duration-300">
      <Link
        href={`/artikelen/${article.slug}`}
        className="relative aspect-16/10 w-full overflow-hidden bg-surface-muted block"
      >
        {/* Ambient Blur Layer if portrait: uses object-fill so the top (sky/bridge) and bottom (bricks/water) 
            are preserved rather than zoomed into the dark torso by object-cover */}
        {isPortrait && !isLogoFallback && (
          <div className="absolute -inset-4 overflow-hidden pointer-events-none">
            <Image
              src={article.featured_image_url}
              alt=""
              fill
              aria-hidden="true"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-fill blur-2xl scale-115 opacity-80 brightness-105 saturate-110"
            />
            <div className="absolute inset-0 bg-white/5" />
          </div>
        )}

        <Image
          src={article.featured_image_url || '/logo.png'}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={(e) => {
            if (isLogoFallback) return;
            const img = e.currentTarget;
            if (img.naturalHeight > img.naturalWidth) {
              setIsPortrait(true);
            }
          }}
          className={`${
            isLogoFallback
              ? 'object-contain p-8 sm:p-10 opacity-85 transition-transform duration-500 group-hover:scale-103'
              : isPortrait
                ? 'object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105'
                : 'object-cover transition-transform duration-500 group-hover:scale-105'
          }`}
        />
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white/90 backdrop-blur-sm text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-zinc-100 shadow-xs">
            {getArticleCategoryLabel(article.category)}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-muted mb-2 font-medium">
            <span>{formatDate(article.published_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readMinutes} min
            </span>
          </div>

          <h3 className="font-heading font-bold text-lg text-ink group-hover:text-[#FF4F00] transition-colors leading-snug line-clamp-2">
            <Link href={`/artikelen/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="text-ink-body text-sm mt-2 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-border-warm flex items-center justify-between text-xs">
          <span className="text-ink-muted font-medium">Door {article.author_name || 'Redactie'}</span>
          <Link
            href={`/artikelen/${article.slug}`}
            className="text-[#FF4F00] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            Lezen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
