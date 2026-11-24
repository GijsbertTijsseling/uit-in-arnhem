import React from 'react';
import { InteractiveDistrictMap } from '@/components/districts/InteractiveDistrictMap';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function WijkMapSection() {
  return (
    <section id="wijken" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight leading-tight">
            Ontdek Arnhem per wijk
          </h2>

          <p className="text-ink-body text-sm sm:text-base leading-relaxed">
            Iedere wijk in Arnhem heeft een eigen energie, unieke hotspots en verborgen verhalen.
            Klik op een wijk op de kaart om direct cafés, winkels, wandelroutes en de wijkagenda te verkennen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <ButtonLink href="/wijken" variant="secondary" size="md">
            <span>Ontdek alle 8 wijken</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </ButtonLink>
        </div>
      </div>

      {/* Interactive Map Embed */}
      <div className="relative">
        <InteractiveDistrictMap
          title=""
          subtitle=""
          showSelector={true}
        />
      </div>
    </section>
  );
}
