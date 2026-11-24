import React from 'react';
import Image from 'next/image';
import {
  Train,
  Car,
  Bed,
  Info,
  Bike,
  ArrowRight,
  Clock,
  MapPin,
  ShoppingBag,
  Footprints,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export const metadata = {
  title: 'Plan je bezoek aan Arnhem | Uit in Arnhem',
  description: 'Handige informatie over bereikbaarheid, parkeren, openbaar vervoer, overnachten en tips voor jouw bezoek aan Arnhem.',
};

const TIPS = [
  {
    id: 'ov',
    icon: Train,
    title: 'Met de Trein & Arnhem Centraal',
    description:
      'Arnhem Centraal is een architectonisch meesterwerk van UNStudio en ligt op slechts 5 minuten lopen van de historische binnenstad. Vanaf Amsterdam, Utrecht en Nijmegen reis je razendsnel rechtstreeks met de Intercity.',
  },
  {
    id: 'trolley-fiets',
    icon: Bike,
    title: 'De Arnhemse Trolleybussen & Fietsen',
    description:
      'Arnhem beschikt als enige stad in de Benelux over een uniek elektrisch trolleynetwerk. Daarnaast huur je bij het station eenvoudig een OV-fiets om door Park Sonsbeek of naar het Modekwartier te fietsen.',
  },
  {
    id: 'parkeren',
    icon: Car,
    title: 'Parkeren & P+R',
    description:
      'Kom je met de auto? Parkeer voordelig bij P+R GelreDome en pak de bus naar de stad, of kies voor overdekte parkeergarages in het centrum zoals Centraal, Rozet of Musis.',
  },
  {
    id: 'overnachten',
    icon: Bed,
    title: 'Overnachten in Arnhem',
    description:
      'Van design boutique hotels in monumentale panden tot sfeervolle B&Bs in het creatieve Modekwartier of slapen met uitzicht over de Rijn: Arnhem heeft voor iedere reiziger een fijn adres.',
  },
];

const WALKING_TIMES = [
  { route: 'Arnhem Centraal → Binnenstad', time: '5 min. lopen' },
  { route: 'Binnenstad → Park Sonsbeek', time: '10 min. lopen' },
  { route: 'Binnenstad → Modekwartier Klarendal', time: '12 min. lopen' },
  { route: 'Binnenstad → Rijnkade & John Frostbrug', time: '8 min. lopen' },
];

export default function PlanJeBezoekPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-ink tracking-tight leading-tight">
          Plan je bezoek aan Arnhem
        </h1>
        <p className="text-ink-body text-lg sm:text-xl leading-relaxed">
          Alles wat je moet weten voor een geslaagd dagje uit, een cultureel weekend of een stedentrip naar Arnhem.
        </p>
      </div>

      {/* Visual Hero Banner */}
      <div className="relative aspect-[21/9] min-h-[300px] w-full rounded-3xl overflow-hidden shadow-card-hover bg-ink flex items-end p-8 sm:p-12 text-white">
        <Image
          src="/images/bridge_uiterwaarden.jpg"
          alt="De John Frostbrug over de Nederrijn in Arnhem"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/88 via-black/50 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white drop-shadow-xs">
            Creatief, groen en gastvrij aan de Rijn
          </h2>
          <p className="text-white/90 text-sm sm:text-base mt-2 drop-shadow-xs">
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
              id={tip.id}
              className="bg-surface border border-border-warm rounded-3xl p-8 space-y-4 shadow-card hover:shadow-card-hover transition-shadow scroll-mt-24"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-ink">
                {tip.title}
              </h3>
              <p className="text-ink-body leading-relaxed text-sm sm:text-base">
                {tip.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Marktdagen, Koopzondag & Loopafstanden */}
      <section
        id="praktisch"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24"
      >
        <div className="lg:col-span-7 bg-surface border border-border-warm rounded-3xl p-8 space-y-4 shadow-card">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4F00]">
            <ShoppingBag className="w-4 h-4" />
            <span>Winkelen &amp; Markt</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-ink">
            Marktdagen &amp; openingstijden binnenstad
          </h3>
          <p className="text-ink-body text-sm sm:text-base leading-relaxed">
            De Arnhemse binnenstad is zeven dagen per week levendig. Op vrijdag en zaterdag verandert het Kerkplein en de Markt in een grote warenmarkt met verse streekproducten, bloemen en delicatessen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-surface-subtle rounded-2xl p-4 border border-border-warm">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Warenmarkt</p>
              <p className="font-heading font-extrabold text-base text-ink mt-1">Vr &amp; Za</p>
              <p className="text-xs text-ink-body mt-0.5">Kerkplein &amp; Markt</p>
            </div>
            <div className="bg-surface-subtle rounded-2xl p-4 border border-border-warm">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Koopavond</p>
              <p className="font-heading font-extrabold text-base text-ink mt-1">Donderdag</p>
              <p className="text-xs text-ink-body mt-0.5">Tot 21:00 uur</p>
            </div>
            <div className="bg-surface-subtle rounded-2xl p-4 border border-border-warm">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Koopzondag</p>
              <p className="font-heading font-extrabold text-base text-ink mt-1">Elke zondag</p>
              <p className="text-xs text-ink-body mt-0.5">12:00 – 17:00 uur</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface border border-border-warm rounded-3xl p-8 space-y-4 shadow-card">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4F00]">
            <Footprints className="w-4 h-4" />
            <span>Compacte stad</span>
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-ink">
            Alles op loopafstand
          </h3>
          <p className="text-ink-body text-sm leading-relaxed">
            Vanaf Arnhem Centraal wandel je zo de stad in. Bagage kwijt? Op het station vind je 24/7 bagagekluizen.
          </p>
          <ul className="divide-y divide-border-warm pt-1">
            {WALKING_TIMES.map((item) => (
              <li key={item.route} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <span className="text-ink-body font-medium">{item.route}</span>
                <span className="font-bold text-ink shrink-0">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Information Point Rozet */}
      <div
        id="vvv"
        className="bg-surface-muted border border-border-warm rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24"
      >
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00]">
            <Info className="w-4 h-4" />
            <span>Toeristisch Informatiepunt</span>
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-ink">
            Bezoekerscentrum in Rozet Arnhem
          </h3>
          <p className="text-ink-body text-sm sm:text-base leading-relaxed">
            In Rozet (Kortestraat 16) vind je het centrale toeristische informatiepunt van de stad. Hier haal je gratis stadsplattegronden, wandelroutes door Sonsbeek en het Modekwartier, en krijg je persoonlijk advies van echte Arnhem-kenners.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-ink-body">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
              <span>Kortestraat 16, Arnhem</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
              <span>Ma t/m Za geopend</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-start lg:justify-end">
          <ButtonLink href="/agenda" variant="primary" size="lg">
            <span>Bekijk de Uitagenda</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

