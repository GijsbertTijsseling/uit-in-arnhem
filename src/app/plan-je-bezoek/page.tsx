import React from 'react';
import Image from 'next/image';
import {
  Train,
  Car,
  Bike,
  Info,
  ArrowRight,
  Clock,
  MapPin,
  Footprints,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export const metadata = {
  title: 'Plan je bezoek aan Arnhem | Uit in Arnhem',
  description:
    'Handige informatie over bereikbaarheid, parkeren, openbaar vervoer, overnachten, marktdagen en Citystore Arnhem.',
};

const PARKING_SPOTS = [
  { name: 'P+R GelreDome', note: 'Voordelig buiten evenementen, direct met de bus naar het centrum' },
  { name: 'P+R Station Arnhem Zuid', note: 'Gratis parkeren en direct overstappen op de trein' },
  { name: 'Centraal, Musis & Rozet', note: 'Overdekte centrumgarages direct aan de centrumring' },
  { name: 'Q-Park Broerenstraat & Velperpoort', note: 'Dicht bij winkels, horeca en de Eusebiuskerk' },
];

const WALKING_TIMES = [
  { route: 'Arnhem Centraal → Binnenstad', time: '5 min.' },
  { route: 'Binnenstad → Rijnkade & John Frostbrug', time: '8 min.' },
  { route: 'Binnenstad → Park Sonsbeek', time: '10 min.' },
  { route: 'Binnenstad → Modekwartier Klarendal', time: '12 min.' },
];

export default function PlanJeBezoekPage() {
  return (
    <div className="w-full">
      {/* 1. HEADER & VISUAL HERO (#FDFCFA canvas) */}
      <section className="bg-canvas pt-10 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-4 max-w-3xl">
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-ink tracking-tight leading-tight">
              Plan je bezoek aan <span className="text-[#FF4F00]">Arnhem</span>
            </h1>
            <p className="text-ink-body text-lg sm:text-xl leading-relaxed">
              Alles wat je wilt weten voor een ontspannen dagje uit, een cultureel weekend of een stedentrip naar Arnhem.
            </p>
          </div>

          {/* Visual Hero Banner */}
          <div className="relative aspect-[21/9] min-h-[300px] w-full rounded-3xl overflow-hidden bg-ink flex items-end p-8 sm:p-12 text-white">
            <Image
              src="https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/john-frostbrug-luchtfoto.jpg"
              alt="De John Frostbrug over de Nederrijn in Arnhem"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
                Creatief, groen en gastvrij aan de Rijn
              </h2>
              <p className="text-white/90 text-sm sm:text-base mt-2">
                De historische binnenstad, de groene heuvels van Sonsbeek en de culturele hotspots liggen allemaal op loopafstand van elkaar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEREIKBAARHEID: OV, FIETS & PARKEREN (#FAF9F6 subtle band, open redactioneel) */}
      <section className="bg-surface-subtle py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF4F00] mb-2">
              Vervoer &amp; bereikbaarheid
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight">
              Zo reis je naar en door Arnhem
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Links: OV, Trein & Fiets */}
            <div className="space-y-8">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-muted">
                <Image
                  src="https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/trolleybus-arnhem.jpg"
                  alt="De iconische Arnhemse trolleybus in de stad"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_65%]"
                />
              </div>

              <div id="ov" className="space-y-2.5 scroll-mt-24">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FF4F00]">
                  <Train className="w-4 h-4" />
                  <span>Trein &amp; Arnhem Centraal</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">
                  Rechtstreeks met de Intercity het centrum in
                </h3>
                <p className="text-ink-body text-sm sm:text-base leading-relaxed">
                  Arnhem Centraal is een architectonisch knooppunt van UNStudio op 5 minuten lopen van de historische binnenstad. Vanaf Amsterdam, Utrecht en Nijmegen reis je rechtstreeks met de Intercity; in de hele stad check je contactloos in met OVpay.
                </p>
              </div>

              <div id="trolley-fiets" className="pt-6 border-t border-border-warm space-y-2.5 scroll-mt-24">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FF4F00]">
                  <Bike className="w-4 h-4" />
                  <span>Trolleybus &amp; Fiets</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">
                  Elektrische trolleybussen &amp; bewaakte stallingen
                </h3>
                <p className="text-ink-body text-sm sm:text-base leading-relaxed">
                  Arnhem heeft als enige stad in de Benelux een elektrisch trolleynetwerk. Kom je met de fiets? Stal de eerste 24 uur gratis bij Arnhem Centraal of bewaakt bij het Gele Rijdersplein en het Musiskwartier (incl. e-bike laadpunten), of huur een OV-fiets op het station.
                </p>
              </div>
            </div>

            {/* Rechts: Auto, Parkeren & P+R */}
            <div id="parkeren" className="space-y-8 scroll-mt-24">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-muted">
                <Image
                  src="https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/rijnkade-schemering.jpg"
                  alt="De Rijnkade en binnenstad van Arnhem bij schemering"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FF4F00]">
                  <Car className="w-4 h-4" />
                  <span>Auto &amp; P+R</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">
                  Slim parkeren rond de centrumring
                </h3>
                <p className="text-ink-body text-sm sm:text-base leading-relaxed">
                  Vanaf de snelwegen rijd je vanzelf de eenrichtings-centrumring op. Digitale borden langs de ring tonen direct waar vrije plekken zijn in de overdekte garages, of kies voor een P+R aan de rand van de stad.
                </p>
              </div>

              <dl className="divide-y divide-border-warm border-t border-b border-border-warm">
                {PARKING_SPOTS.map((spot) => (
                  <div key={spot.name} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                    <dt className="font-heading font-bold text-sm sm:text-base text-ink shrink-0">
                      {spot.name}
                    </dt>
                    <dd className="text-xs sm:text-sm text-ink-body sm:text-right">
                      {spot.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OVERNACHTEN IN ARNHEM (#FDFCFA canvas, open 16:10 split) */}
      <section id="overnachten" className="bg-canvas py-14 sm:py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-muted">
              <Image
                src="https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/wp-migrated/2024/04/Ketelhuis-Sonsbeek-6.jpg"
                alt="Sfeervol overnachten en ontspannen nabij Park Sonsbeek in Arnhem"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF4F00] mb-2">
                  Weekendje weg
                </p>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight">
                  Blijf een nachtje slapen
                </h2>
              </div>
              <p className="text-ink-body text-sm sm:text-base leading-relaxed">
                Arnhem beleef je het best als je geen laatste trein hoeft te halen. Kies voor een design boutique hotel in een monumentaal pand in de binnenstad, een kleinschalige B&amp;B in het Modekwartier of een kamer met uitzicht op de Rijn en het groen van Sonsbeek.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border-warm">
                <div className="pt-3">
                  <p className="font-heading font-bold text-sm text-ink">Binnenstad</p>
                  <p className="text-xs text-ink-body mt-0.5">Op steenworp van theaters, musea en de 7straatjes</p>
                </div>
                <div className="pt-3">
                  <p className="font-heading font-bold text-sm text-ink">Modekwartier</p>
                  <p className="text-xs text-ink-body mt-0.5">Creatieve B&amp;B&apos;s tussen ateliers en koffietentjes</p>
                </div>
                <div className="pt-3">
                  <p className="font-heading font-bold text-sm text-ink">Sonsbeek &amp; Rijn</p>
                  <p className="text-xs text-ink-body mt-0.5">Wakker worden aan de rand van park en uiterwaarden</p>
                </div>
              </div>

              <div className="pt-2">
                <ButtonLink href="/wijken" variant="secondary" size="md">
                  <span>Ontdek de wijken van Arnhem</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MARKTDAGEN, OPENINGSTIJDEN & LOOPAFSTANDEN (#FAF9F6 subtle band) */}
      <section id="praktisch" className="bg-surface-subtle py-14 sm:py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Gebalanceerde 2-koloms tekstrij zonder scheve witruimte */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Links: Winkelen & Markt */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF4F00] mb-2">
                  Winkelen &amp; markt
                </p>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight">
                  Marktdagen &amp; openingstijden binnenstad
                </h2>
                <p className="text-ink-body text-sm sm:text-base leading-relaxed mt-3 max-w-2xl">
                  De Arnhemse binnenstad is zeven dagen per week levendig. Op vrijdag en zaterdag verandert het Kerkplein in een grote warenmarkt met verse streekproducten, bloemen, kaas en delicatessen.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="border-t-2 border-border-warm pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Warenmarkt</p>
                  <p className="font-heading font-extrabold text-lg text-ink mt-1">Vrijdag &amp; Zaterdag</p>
                  <p className="text-xs text-ink-body mt-0.5">Kerkplein · Vr tot 13:00, Za tot 17:00</p>
                </div>
                <div className="border-t-2 border-border-warm pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Koopavond</p>
                  <p className="font-heading font-extrabold text-lg text-ink mt-1">Donderdag</p>
                  <p className="text-xs text-ink-body mt-0.5">Winkels open tot 21:00 uur</p>
                </div>
                <div className="border-t-2 border-border-warm pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Koopzondag</p>
                  <p className="font-heading font-extrabold text-lg text-ink mt-1">Elke zondag</p>
                  <p className="text-xs text-ink-body mt-0.5">12:00 – 17:00 uur</p>
                </div>
              </div>
            </div>

            {/* Rechts: Alles op loopafstand */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FF4F00] mb-2">
                  <Footprints className="w-4 h-4" />
                  <span>Compacte stad</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
                  Alles op loopafstand
                </h3>
                <p className="text-ink-body text-sm sm:text-base leading-relaxed mt-3">
                  Vanaf Arnhem Centraal wandel je zo de stad in. Reis je met een tas of koffer? Op het station vind je 24/7 bagagekluizen.
                </p>
              </div>

              <ul className="divide-y divide-border-warm border-t border-b border-border-warm">
                {WALKING_TIMES.map((item) => (
                  <li key={item.route} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink-body font-medium">{item.route}</span>
                    <span className="font-heading font-extrabold text-ink shrink-0">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Volle breedte 2-koloms fotostrip (binnenstad & Kerkplein) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <figure className="space-y-2">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-muted">
                <Image
                  src="https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/zevenstraatjes-eusebius.jpg"
                  alt="Winkelen en struinen door De 7straatjes met uitzicht op de Eusebiuskerk"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-xs text-ink-muted">
                Boetiekjes en terrassen in De 7straatjes, hartje binnenstad.
              </figcaption>
            </figure>

            <figure className="space-y-2">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-muted">
                <Image
                  src="https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/eusebiuskerk-kerkplein.jpg"
                  alt="Het Kerkplein bij de Eusebiuskerk, decor van de wekelijkse warenmarkt"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-xs text-ink-muted">
                Het Kerkplein bij de Eusebiuskerk — op vrijdag en zaterdag het decor van de warenmarkt.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 5. CITYSTORE ARNHEM IN DE EUSEBIUSKERK (#FDFCFA canvas, warm highlight-blok met foto) */}
      <section id="vvv" className="bg-canvas py-14 sm:py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-cta-tint border border-cta-border rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-surface-muted">
              <Image
                src="https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/eusebiuskerk-bloemen.jpg"
                alt="Citystore Arnhem in de Eusebiuskerk aan het Kerkplein"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12 space-y-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FF4F00]">
                <Info className="w-4 h-4" />
                <span>Officieel VVV / Tourist Information Point</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
                Citystore Arnhem in de Eusebiuskerk
              </h2>
              <p className="text-ink-body text-sm sm:text-base leading-relaxed">
                In de Eusebiuskerk (naast de glazen lift) vind je Citystore Arnhem: het officiële toeristische informatiepunt van de stad. Hier haal je stadsplattegronden, wandel- en fietsroutes, boek je stadswandelingen met gids en vind je cadeaus van Arnhemse makers.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-ink">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF4F00] shrink-0" />
                  <span>Kerkplein 1 (Eusebiuskerk), Arnhem</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF4F00] shrink-0" />
                  <span>Di t/m za 10:00–17:00 · Zo 12:00–17:00 (ma gesloten)</span>
                </span>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <ButtonLink
                  href="https://eusebius.nl/over-de-eusebius/citystore-arnhem/"
                  variant="primary"
                  size="md"
                >
                  <span>Meer over Citystore Arnhem</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </ButtonLink>
                <ButtonLink href="/agenda" variant="secondary" size="md">
                  <span>Bekijk de Uitagenda</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
