import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Train, Car, Bed, Info, Bike, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const metadata = {
  title: 'Plan je bezoek aan Arnhem | Uit in Arnhem',
  description: 'Handige informatie over bereikbaarheid, parkeren, openbaar vervoer, overnachten en tips voor jouw bezoek aan Arnhem.',
};

const TIPS = [
  {
    icon: Train,
    title: 'Met de Trein & Arnhem Centraal',
    description:
      'Arnhem Centraal is een architectonisch meesterwerk van UNStudio en ligt op slechts 5 minuten lopen van de historische binnenstad. Vanaf Amsterdam, Utrecht en Nijmegen reis je razendsnel rechtstreeks met de Intercity.',
  },
  {
    icon: Bike,
    title: 'De Arnhemse Trolleybussen & Fietsen',
    description:
      'Arnhem beschikt als enige stad in de Benelux over een uniek elektrisch trolleynetwerk. Daarnaast huur je bij het station eenvoudig een OV-fiets om door Park Sonsbeek of naar het Modekwartier te fietsen.',
  },
  {
    icon: Car,
    title: 'Parkeren & P+R',
    description:
      'Kom je met de auto? Parkeer voordelig bij P+R GelreDome en pak de bus naar de stad, of kies voor overdekte parkeergarages in het centrum zoals Centraal, Rozet of Musis.',
  },
  {
    icon: Bed,
    title: 'Overnachten in Arnhem',
    description:
      'Van design boutique hotels in monumentale panden tot sfeervolle B&Bs in het creatieve Modekwartier of slapen met uitzicht over de Rijn: Arnhem heeft voor iedere reiziger een fijn adres.',
  },
];

export default function PlanJeBezoekPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-zinc-950 tracking-tight leading-tight">
          Plan je bezoek aan Arnhem
        </h1>
        <p className="text-zinc-600 text-lg sm:text-xl leading-relaxed">
          Alles wat je moet weten voor een geslaagd dagje uit, een cultureel weekend of een stedentrip naar Arnhem.
        </p>
      </div>

      {/* Visual Hero Banner */}
      <div className="relative aspect-[21/9] min-h-[300px] w-full rounded-3xl overflow-hidden shadow-xl bg-zinc-900 flex items-end p-8 sm:p-12 text-white">
        <Image
          src="/images/bridge_uiterwaarden.jpg"
          alt="De John Frostbrug over de Nederrijn in Arnhem"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white">
            Creatief, groen en gastvrij aan de Rijn
          </h2>
          <p className="text-zinc-200 text-sm sm:text-base mt-2">
            De historische binnenstad, de groene heuvels van Sonsbeek en de culturele hotspots liggen allemaal op loopafstand van elkaar.
          </p>
        </div>
      </div>

      {/* 4 Practical Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TIPS.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              className="bg-white border border-zinc-200/90 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-xl text-zinc-950">
                {tip.title}
              </h3>
              <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">
                {tip.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Information Point Rozet */}
      <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00]">
            <Info className="w-4 h-4" />
            <span>Toeristisch Informatiepunt</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-zinc-900">
            Bezoekerscentrum in Rozet Arnhem
          </h3>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            In Rozet (Kortestraat 16) vind je het centrale toeristische informatiepunt van de stad. Hier haal je gratis stadsplattegronden, wandelroutes door Sonsbeek en het Modekwartier, en krijg je persoonlijk advies van echte Arnhem-kenners.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-zinc-700">
            <span className="flex items-center gap-1">📍 Kortestraat 16, Arnhem</span>
            <span className="flex items-center gap-1">🕒 Ma t/m Za geopend</span>
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-start lg:justify-end">
          <Link
            href="/agenda"
            className="px-6 py-3.5 rounded-full bg-[#FF4F00] hover:bg-[#E04500] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <span>Bekijk de Uitagenda</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

