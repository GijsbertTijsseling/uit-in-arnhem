import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DISTRICTS } from '@/data/districtsData';
import { InteractiveDistrictMap } from '@/components/districts/InteractiveDistrictMap';
import { DistrictCard } from '@/components/districts/DistrictCard';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wijken van Arnhem | Ontdek alle buurten & interactieve kaart',
  description:
    'Ontdek de 8 unieke wijken van Arnhem: van het creatieve Modekwartier en statige Spijkerkwartier tot het groene Sonsbeek en levendige Centrum. Verken de interactieve wijkkaart!',
  openGraph: {
    title: 'Wijken van Arnhem | Ontdek alle buurten & interactieve kaart',
    description:
      'Verken alle 8 unieke wijken van Arnhem met onze interactieve wijkkaart, hotspots, verhalen en uitagenda.',
    images: [
      '/images/arnhem/rijnkade-schemering.jpg',
    ],
  },
};

export default function WijkenHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16">
      {/* 1. HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-tight">
          Ontdek de wijken van <span className="text-[#FF4F00]">Arnhem</span>
        </h1>
        <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
          Arnhem is een stad met vele gezichten. Van het creatieve Modekwartier
          en statige herenhuizen in het Spijkerkwartier tot de weelderige parken
          van Sonsbeek en de ruige natuur van Meinerswijk aan de Rijn. Klik op de
          kaart of kies een wijk en ontdek de leukste hotspots, verhalen en
          agenda!
        </p>
      </div>

      {/* 2. INTERACTIVE DISTRICT MAP */}
      <section aria-labelledby="map-heading" className="space-y-4">
        <div className="sr-only">
          <h2 id="map-heading">Interactieve wijkkaart van Arnhem</h2>
        </div>
        <InteractiveDistrictMap
          title="Interactieve Wijkkaart Arnhem"
          subtitle="Beweeg over of klik op een wijk om direct door te reizen naar hotspots, verhalen en de wijkagenda."
        />
      </section>

      {/* 3. DISTRICTS GRID SECTION */}
      <section aria-labelledby="districts-grid-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <h2
              id="districts-grid-heading"
              className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 tracking-tight"
            >
              Alle 8 wijken op een rij
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              Elke wijk heeft een eigen karakter, dynamiek en verborgen schatten.
            </p>
          </div>

          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {DISTRICTS.length} wijken
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISTRICTS.map((district) => (
            <DistrictCard key={district.id} district={district} />
          ))}
        </div>
      </section>

      {/* 4. INFORMATIVE HIGHLIGHT BANNER */}
      <section className="bg-cta-tint text-ink border border-cta-border rounded-3xl p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight leading-tight">
            Tussen Veluwe &amp; Rivier: de veelzijdigheid van de stad
          </h2>
          <p className="text-ink-body text-sm sm:text-base leading-relaxed">
            Geen stad in Nederland kent zulke grote hoogteverschillen, parken en
            waterlinies als Arnhem. Met de iconische John Frostbrug en Nelson
            Mandelabrug als levensaders verbinden de noordelijke heuvels en het
            weidse uiterwaardengebied van Meinerswijk elkaar dagelijks.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <ButtonLink href="/agenda" variant="primary" surface="light" size="md">
              <span>Bekijk complete uitagenda</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
            <ButtonLink href="/artikelen" variant="secondary" surface="light" size="md">
              <span>Lees alle stadsverhalen</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
