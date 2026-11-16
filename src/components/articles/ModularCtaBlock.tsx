import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CtaBlock } from '@/types';

interface ModularCtaBlockProps {
  cta: CtaBlock;
}

export function ModularCtaBlock({ cta }: ModularCtaBlockProps) {
  if (!cta || !cta.heading) return null;

  return (
    <div className="my-10 p-6 sm:p-8 rounded-2xl bg-[#FFF3ED] border-2 border-[#FF4F00]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4F00] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tip van Uit in Arnhem</span>
        </div>
        <h4 className="font-heading font-black text-xl text-zinc-900">
          {cta.heading}
        </h4>
        <p className="text-sm text-zinc-700 leading-relaxed">
          {cta.description}
        </p>
      </div>

      <div className="shrink-0">
        <Link
          href={cta.button_url || '#'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF4F00] text-white font-bold text-sm hover:bg-[#E04500] transition-colors shadow-sm"
        >
          <span>{cta.button_label || 'Meer informatie'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
