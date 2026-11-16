import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  Sparkles,
  BookOpen,
  Coffee,
  Compass,
  ArrowRight,
  Flame,
  MapPin,
  Clock,
} from 'lucide-react';

interface IntoArnhemHeroProps {
  featuredArticle?: Article;
  totalEventsCount: number;
}

export function IntoArnhemHero({ featuredArticle, totalEventsCount }: IntoArnhemHeroProps) {
  const quickLinks = [
    {
      label: 'Uitagenda',
      href: '#agenda',
      icon: Calendar,
      badge: `${totalEventsCount}+ items`,
      color: 'bg-zinc-900 text-white hover:bg-[#FF4F00]',
    },
    {
      label: 'Weekendtips',
      href: '/agenda?filter=weekend',
      icon: Sparkles,
      badge: 'Vrij – Zo',
      color: 'bg-[#FFF3ED] text-[#FF4F00] hover:bg-[#FFE5D6] border border-[#FF4F00]/20',
    },
    {
      label: 'Verhalen',
      href: '#verhalen',
      icon: BookOpen,
      badge: 'Redactie',
      color: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    },
    {
      label: 'Eten & Drinken',
      href: '/artikelen?category=eten-drinken',
      icon: Coffee,
      badge: 'Hotspots',
      color: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    },
    {
      label: 'Wijken van Arnhem',
      href: '#wijken',
      icon: Compass,
      badge: 'Ontdek',
      color: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    },
  ];

  return (
    <section className="relative pt-4 sm:pt-8 pb-12 border-b border-zinc-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Bold Into Arnhem Manifesto & Quick Navigation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3ED] border border-[#FF4F00]/25 text-[#FF4F00] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FF4F00] animate-pulse" />
            <span>Stadsgids voor de Rijnstad</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-zinc-950 tracking-tight leading-[1.05]">
            Ontdek wat er bruist in{' '}
            <span className="text-[#FF4F00] relative inline-block">
              Arnhem.
              <span className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-1.5 sm:h-2 bg-[#FF4F00]/20 rounded-full" />
            </span>
          </h1>

          <p className="text-zinc-600 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
            Jouw onafhankelijke gids voor live muziek, theater, exposities, verborgen koffiebars en de mooiste verhalen van locals uit Arnhem.
          </p>

          {/* Quick Category Discovery Pills (Into Nijmegen Style) */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Direct naar:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-tight transition-all duration-200 shadow-sm active:scale-95 ${item.color}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    <span className="text-[10px] font-semibold opacity-75 ml-0.5">
                      • {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Feature Card (Top Story) */}
        {featuredArticle && (
          <div className="lg:col-span-5">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] flex flex-col justify-end p-6 sm:p-8 border border-zinc-800">
              <Image
                src={featuredArticle.featured_image_url}
                alt={featuredArticle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FF4F00] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>Uitgelicht Verhaal</span>
                  </span>
                  <span className="text-xs text-zinc-300 font-medium">
                    {formatDate(featuredArticle.published_at)}
                  </span>
                </div>

                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight group-hover:text-[#FF4F00] transition-colors">
                  <Link href={`/artikelen/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed font-normal">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    Door {featuredArticle.author_name || 'Redactie'}
                  </span>
                  <Link
                    href={`/artikelen/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-[#FF4F00] hover:text-white transition-all shadow-md group-hover:translate-x-1"
                  >
                    <span>Lezen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
