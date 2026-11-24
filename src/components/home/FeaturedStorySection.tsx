'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/Button';

interface FeaturedStorySectionProps {
  article: Article;
}

export function FeaturedStorySection({ article }: FeaturedStorySectionProps) {
  const [isPortrait, setIsPortrait] = useState(false);

  const words = article.content ? article.content.split(/\s+/).length : 200;
  const readMinutes = Math.max(1, Math.ceil(words / 200));

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalHeight > img.naturalWidth) {
      setIsPortrait(true);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF4F00]">
          Uitgelicht verhaal
        </span>

        <ButtonLink href="/artikelen" variant="secondary" size="sm">
          <span>Alle verhalen</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </ButtonLink>
      </div>

      {/* Open Editorial Layout (geen buitenste kaartcontainer, border of shadow) */}
      <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Foto links: 16:10, afgeronde hoeken, 100% helder */}
        <div className="lg:col-span-7">
          <Link
            href={`/artikelen/${article.slug}`}
            className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden block bg-surface-muted"
          >
            {isPortrait && (
              <div className="absolute -inset-4 overflow-hidden pointer-events-none rounded-2xl">
                <Image
                  src={article.featured_image_url}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-fill blur-2xl scale-115 opacity-75 brightness-105 saturate-110"
                />
                <div className="absolute inset-0 bg-white/15" />
              </div>
            )}

            <Image
              src={article.featured_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              onLoad={handleImageLoad}
              className={`${
                isPortrait
                  ? 'object-contain relative z-10 drop-shadow-[0_8px_24px_rgba(0,0,0,0.14)]'
                  : 'object-cover'
              } transition-transform duration-700 group-hover:scale-[1.03]`}
            />
          </Link>
        </div>

        {/* Tekst rechts: verticaal gecentreerd naast de foto, zonder kunstmatige witruimte */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-ink-muted">
            <span className="uppercase tracking-wider font-bold text-[#FF4F00]">
              {article.category}
            </span>
            <span aria-hidden="true">•</span>
            <span>{formatDate(article.published_at)}</span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readMinutes} min
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.5rem] text-ink leading-[1.08] tracking-tight group-hover:text-[#FF4F00] transition-colors">
            <Link href={`/artikelen/${article.slug}`}>{article.title}</Link>
          </h2>

          <p className="text-ink-body text-base sm:text-lg leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href={`/artikelen/${article.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF4F00] hover:text-[#E04500] transition-colors"
            >
              <span>Lees het verhaal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <span className="text-xs text-ink-muted">
              Door {article.author_name || 'Redactie Uit in Arnhem'}
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
