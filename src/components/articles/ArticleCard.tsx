import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  // Reading time estimate
  const words = article.content ? article.content.split(/\s+/).length : 200;
  const readMinutes = Math.max(1, Math.ceil(words / 200));

  if (featured) {
    return (
      <article className="group relative rounded-3xl overflow-hidden bg-zinc-950 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-120">
        {/* Image col */}
        <div className="lg:col-span-7 relative min-h-75 lg:min-h-full overflow-hidden">
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
        </div>

        {/* Content col */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {article.category}
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
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg transition-all duration-300">
      <Link href={`/artikelen/${article.slug}`} className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100">
        <Image
          src={article.featured_image_url}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-zinc-900 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-zinc-100">
            {article.category}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
            <span>{formatDate(article.published_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readMinutes} min
            </span>
          </div>

          <h3 className="font-heading font-bold text-lg text-zinc-900 group-hover:text-[#FF4F00] transition-colors leading-snug line-clamp-2">
            <Link href={`/artikelen/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="text-zinc-600 text-sm mt-2 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium">Door {article.author_name || 'Redactie'}</span>
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
