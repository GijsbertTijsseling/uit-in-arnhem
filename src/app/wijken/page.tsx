import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DISTRICTS } from '@/data/districtsData';
import { InteractiveDistrictMap } from '@/components/districts/InteractiveDistrictMap';
import { DistrictCard } from '@/components/districts/DistrictCard';
import { NewsletterCta } from '@/components/common/NewsletterCta';
import { MapPin, Compass, Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wijken van Arnhem | Ontdek alle buurten & interactieve kaart',
  description:
    'Ontdek de 8 unieke wijken van Arnhem: van het creatieve Modekwartier en statige Spijkerkwartier tot het groene Sonsbeek en levendige Centrum. Verken de interactieve wijkkaart!',
  openGraph: {
    title: 'Wijken van Arnhem | Ontdek alle buurten & interactieve kaart',
    description:
      'Verken alle 8 unieke wijken van Arnhem met onze interactieve wijkkaart, hotspots, verhalen en uitagenda.',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    ],
  },
};

export default function WijkenHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-16">
      {/* 1. HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-black uppercase tracking-wider text-[#FF4F00]">
          <Compass className="w-3.5 h-3.5" />
          <span>Stadsgids Arnhem</span>
        </div>
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Overzicht</span>
            </div>
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

          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            {DISTRICTS.length} Arnhemse wijken
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
      <section className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-[#FF4F00]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF4F00]">
            <Sparkles className="w-4 h-4 fill-[#FF4F00]" />
            <span>Arnhem aan de Rijn</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            Tussen Veluwe & Rivier: de veelzijdigheid van de stad
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Geen stad in Nederland kent zulke grote hoogteverschillen, parken en
            waterlinies als Arnhem. Met de iconische John Frostbrug en Nelson
            Mandelabrug als levensaders verbinden de noordelijke heuvels en het
            weidse uiterwaardengebied van Meinerswijk elkaar dagelijks.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/agenda"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF4F00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#e04500] transition-colors shadow-sm"
            >
              <span>Bekijk complete uitagenda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/artikelen"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-700 transition-colors"
            >
              <span>Lees alle stadsverhalen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER CTA */}
      <NewsletterCta />
    </div>
  );
}
