import React from 'react';
import Link from 'next/link';
import { InteractiveDistrictMap } from '@/components/districts/InteractiveDistrictMap';
import { Compass, ArrowRight, MapPin, Sparkles } from 'lucide-react';

export function WijkMapSection() {
  return (
    <section id="wijken" className="my-16 sm:my-20 scroll-mt-24 space-y-8">
      {/* Section Header inspired by I amsterdam */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-zinc-900 tracking-tight leading-tight">
            Zoek wat er te doen is in jouw buurt of ontdek Arnhem per wijk
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            Iedere wijk in Arnhem heeft een eigen energie, unieke hotspots en verborgen verhalen.
            Klik op een wijk op de interactieve kaart om direct de leukste cafés, winkels, wandelroutes en
            actuele wijkagenda te verkennen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/wijken"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FF4F00] text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#E04500] transition-colors shadow-md hover:shadow-lg group"
          >
            <span>Ontdek alle 8 wijken</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Interactive Map Embed */}
      <div className="relative">
        <InteractiveDistrictMap
          title=""
          subtitle=""
          className="border-zinc-200/90 shadow-sm"
          showSelector={true}
          showPreviewCard={true}
        />
      </div>

      {/* Quick Discovery Cards / Footer note */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-orange-100 text-[#FF4F00] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Lokale hotspots & parels</h4>
            <p className="text-xs text-zinc-600 mt-0.5">
              Van boetieks in het Modekwartier tot koffiebars in de 7straatjes.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Uitagenda per stadsdeel</h4>
            <p className="text-xs text-zinc-600 mt-0.5">
              Bekijk concerten, markten en theater direct gefilterd op jouw wijk.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Bereikbaarheid & OV</h4>
            <p className="text-xs text-zinc-600 mt-0.5">
              Trolleybussen, NS-stations, deelfietsen en parkeertips per buurt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
