import React from 'react';
import { HighlightItem } from '@/data/districtsData';
import {
  Coffee,
  ShoppingBag,
  Landmark,
  Trees,
  Sparkles,
  MapPin,
  Lightbulb,
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

  return (
    <div className="flex flex-col bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg transition-all duration-300">
      {/* Category header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
          {getCategoryIcon(highlight.category)}
          <span>{getCategoryLabel(highlight.category)}</span>
        </span>
      </div>

      {/* Title */}
      <h3 className="font-heading font-black text-lg sm:text-xl text-zinc-900 mb-2 leading-snug">
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

      {/* Address footer */}
      {highlight.address && (
        <div className="pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">{highlight.address}</span>
        </div>
      )}
    </div>
  );
}
