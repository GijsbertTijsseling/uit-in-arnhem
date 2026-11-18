import React from 'react';
import Link from 'next/link';
import { HighlightItem } from '@/data/districtsData';
import {
  Coffee,
  ShoppingBag,
  Landmark,
  Trees,
  Sparkles,
  MapPin,
  Lightbulb,
  BookOpen,
  Calendar,
  ArrowRight,
} from 'lucide-react';

interface HotspotCardProps {
  highlight: HighlightItem;
  accentColor?: string;
}

export function HotspotCard({ highlight, accentColor = '#FF4F00' }: HotspotCardProps) {
  const getCategoryIcon = (cat: HighlightItem['category']) => {
    switch (cat) {
      case 'eten-drinken':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'winkelen':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'cultuur':
      case 'bezienswaardigheid':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'natuur':
        return <Trees className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

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

  const getSourceIcon = (sourceType: HighlightItem['sourceType']) => {
    switch (sourceType) {
      case 'article':
        return <BookOpen className="w-3 h-3 text-[#FF4F00]" />;
      case 'agenda':
        return <Calendar className="w-3 h-3 text-[#FF4F00]" />;
      case 'locatie':
        return <MapPin className="w-3 h-3 text-[#FF4F00]" />;
      default:
        return <BookOpen className="w-3 h-3 text-[#FF4F00]" />;
    }
  };

  const getSourceLabel = (sourceType: HighlightItem['sourceType']) => {
    switch (sourceType) {
      case 'article':
        return 'Bron: Artikel';
      case 'agenda':
        return 'Bron: Uitagenda';
      case 'locatie':
        return 'Bron: Officiële Locatie';
      default:
        return 'Bron: Uit in Arnhem';
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
    <div className="flex flex-col bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 group">
      {/* Category header & Source badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
          {getCategoryIcon(highlight.category)}
          <span>{getCategoryLabel(highlight.category)}</span>
        </span>

        {highlight.sourceType && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 bg-zinc-50 border border-zinc-200/70 px-2 py-0.5 rounded-md">
            {getSourceIcon(highlight.sourceType)}
            <span>{getSourceLabel(highlight.sourceType)}</span>
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-heading font-black text-lg sm:text-xl text-zinc-900 mb-2 leading-snug group-hover:text-[#FF4F00] transition-colors">
        {highlight.name}
      </h3>

      {/* Description */}
      <p className="text-zinc-600 text-sm leading-relaxed mb-4 flex-1">
        {highlight.description}
      </p>

      {/* Tip callout */}
      {highlight.tip && (
        <div className="mb-4 bg-orange-50/70 border border-orange-200/60 rounded-xl p-3 text-xs text-orange-950 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-[#FF4F00] shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-zinc-900">Lokale tip: </strong>
            <span>{highlight.tip}</span>
          </div>
        </div>
      )}

      {/* Address & Verified Source Link Footer */}
      <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
        {highlight.address && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{highlight.address}</span>
          </div>
        )}

        {highlight.sourceUrl && (
          <Link
            href={highlight.sourceUrl}
            className="mt-1 inline-flex items-center justify-between text-xs font-bold text-[#FF4F00] hover:text-[#E04500] uppercase tracking-wider py-1.5 transition-colors group/link"
          >
            <span className="truncate">{getActionLabel(highlight.sourceType)}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform shrink-0 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
