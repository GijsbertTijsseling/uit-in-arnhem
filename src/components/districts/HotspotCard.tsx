import React from 'react';
import Link from 'next/link';
import { HighlightItem } from '@/data/districtsData';
import { MapPin, ArrowRight } from 'lucide-react';

interface HotspotCardProps {
  highlight: HighlightItem;
}

export function HotspotCard({ highlight }: HotspotCardProps) {
  const getCategoryLabel = (cat: HighlightItem['category']) => {
    switch (cat) {
      case 'eten-drinken':
        return 'Eten & Drinken';
      case 'winkelen':
        return 'Winkelen';
      case 'cultuur':
        return 'Cultuur';
      case 'bezienswaardigheid':
        return 'Bezienswaardigheid';
      case 'natuur':
        return 'Natuur & Parken';
      case 'actief':
        return 'Actief & Sport';
      default:
        return cat;
    }
  };

  const getActionLabel = (sourceType: HighlightItem['sourceType']) => {
    switch (sourceType) {
      case 'article':
        return 'Lees het artikel';
      case 'agenda':
        return 'Bekijk in agenda';
      case 'locatie':
        return 'Bekijk locatie & programma';
      default:
        return 'Ontdekken';
    }
  };

  return (
    <div className="flex flex-col bg-surface rounded-2xl p-5 sm:p-6 border border-border-warm shadow-card hover:shadow-card-hover transition-all duration-200 group">
      {/* Category */}
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-2">
        {getCategoryLabel(highlight.category)}
      </span>

      {/* Title */}
      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-ink mb-2 leading-snug group-hover:text-[#FF4F00] transition-colors">
        {highlight.name}
      </h3>

      {/* Description */}
      <p className="text-ink-body text-sm leading-relaxed mb-5 flex-1">
        {highlight.description}
      </p>

      {/* Address & Link Footer */}
      <div className="pt-3 border-t border-border-warm flex flex-col gap-2">
        {highlight.address && (
          <div className="flex items-center gap-1.5 text-xs text-ink-muted font-medium">
            <MapPin className="w-3.5 h-3.5 text-ink-muted shrink-0" />
            <span className="truncate">{highlight.address}</span>
          </div>
        )}

        {highlight.sourceUrl && (
          <Link
            href={highlight.sourceUrl}
            className="inline-flex items-center justify-between text-xs font-bold text-[#FF4F00] hover:text-[#E04500] uppercase tracking-wider pt-1 transition-colors group/link"
          >
            <span className="truncate">{getActionLabel(highlight.sourceType)}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform shrink-0 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
