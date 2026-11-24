import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { District } from '@/data/districtsData';

interface DistrictCardProps {
  district: District;
}

export function DistrictCard({ district }: DistrictCardProps) {
  return (
    <article className="group flex flex-col bg-surface rounded-2xl overflow-hidden border border-border-warm shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Image Container */}
      <Link
        href={`/wijken/${district.slug}`}
        className="relative aspect-16/10 w-full overflow-hidden bg-surface-muted block"
      >
        <Image
          src={district.heroImage}
          alt={district.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

        {/* District name on image overlay */}
        <div className="absolute bottom-3.5 left-4 right-4 text-white">
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white drop-shadow-xs leading-tight">
            {district.name}
          </h3>
        </div>
      </Link>

      {/* Content body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            {district.vibe}
          </p>
          <p className="text-ink-body text-sm leading-relaxed line-clamp-3">
            {district.description}
          </p>
        </div>

        {/* CTA link */}
        <div className="pt-3 border-t border-border-warm">
          <Link
            href={`/wijken/${district.slug}`}
            className="text-xs font-extrabold text-ink group-hover:text-[#FF4F00] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Ontdek {district.shortName}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
