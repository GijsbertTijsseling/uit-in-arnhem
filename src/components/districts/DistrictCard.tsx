import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { District } from '@/data/districtsData';

interface DistrictCardProps {
  district: District;
}

export function DistrictCard({ district }: DistrictCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <Link
        href={`/wijken/${district.slug}`}
        className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 block"
      >
        <Image
          src={district.heroImage}
          alt={district.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/20 to-transparent" />

        {/* Vibe badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm flex items-center gap-1.5 border border-zinc-100">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: district.accentColor || '#FF4F00' }}
          />
          <span className="text-[11px] font-bold text-zinc-800 tracking-wide">
            {district.vibe}
          </span>
        </div>

        {/* District name on image overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Wijk van Arnhem
          </p>
          <h3 className="font-heading font-black text-xl sm:text-2xl text-white drop-shadow-xs leading-tight">
            {district.name}
          </h3>
        </div>
      </Link>

      {/* Content body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3">
            {district.description}
          </p>

          {/* Character tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {district.characterTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-full border border-zinc-200/60"
              >
                #{tag}
              </span>
            ))}
            {district.highlights.length > 0 && (
              <span className="text-[11px] font-bold text-zinc-500 px-2 py-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF4F00]" />
                {district.highlights.length} hotspots
              </span>
            )}
          </div>
        </div>

        {/* CTA link */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <Link
            href={`/wijken/${district.slug}`}
            className="text-xs font-black text-[#121212] group-hover:text-[#FF4F00] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Ontdek {district.shortName}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
