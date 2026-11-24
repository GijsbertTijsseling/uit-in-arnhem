import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CtaBlock } from '@/types';
import { ButtonLink } from '@/components/ui/Button';

interface ModularCtaBlockProps {
  cta: CtaBlock;
}

export function ModularCtaBlock({ cta }: ModularCtaBlockProps) {
  if (!cta || !cta.heading) return null;

  return (
    <div className="my-10 p-6 sm:p-8 rounded-2xl bg-cta-tint border border-cta-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4F00] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tip van Uit in Arnhem</span>
        </div>
        <h4 className="font-heading font-extrabold text-xl text-ink">
          {cta.heading}
        </h4>
        <p className="text-sm text-ink-body leading-relaxed">
          {cta.description}
        </p>
      </div>

      <div className="shrink-0">
        <ButtonLink href={cta.button_url || '#'} variant="primary" size="md">
          <span>{cta.button_label || 'Meer informatie'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </ButtonLink>
      </div>
    </div>
  );
}
