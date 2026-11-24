import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

const DISTRICTS = [
  {
    name: 'Modekwartier',
    tagline: 'Creatieve ateliers, vintage & design in Klarendal',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/05/Street-Art-Tour-20230804_105441-scaled.jpg',
    slug: 'modekwartier',
  },
  {
    name: 'Centrum & Binnenstad',
    tagline: 'Historische 7straatjes, boetieks, terrassen & Korenmarkt',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/01/juune1-c-jonas-de-witte-vierkant-2959072273_2734816142.jpg',
    slug: 'centrum',
  },
  {
    name: 'Sonsbeek & Parken',
    tagline: 'Watervallen, Witte Villa, Zypendaal & glooiende velden',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/Sonsbeekmarkt.jpg',
    slug: 'sonsbeek',
  },
  {
    name: 'Spijkerkwartier',
    tagline: 'Statige 19e-eeuwse herenhuizen, binnentuinen & fijne horeca',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/AM_VerlatenVrouwen_03-1-LRG-CROP.jpg',
    slug: 'spijkerkwartier',
  },
];

export function HotspotHighlights() {
  return (
    <section id="buurten" className="my-16 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-2">
            <Compass className="w-4 h-4" />
            <span>Wijken in de kijker</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
            Verken de sfeer van de stad
          </h2>
          <p className="text-ink-body text-sm mt-1">
            Ontdek de karakteristieke buurten en duik direct in de lokale gidsen.
          </p>
        </div>

        <ButtonLink
          href="/wijken"
          variant="secondary"
          size="md"
          className="self-start sm:self-auto shrink-0"
        >
          <span>Alle 8 wijken bekijken</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </ButtonLink>
      </div>

      {/* Puur redactioneel: 100% heldere foto boven, witte kaart eronder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DISTRICTS.map((item) => (
          <Link
            key={item.slug}
            href={`/wijken/${item.slug}`}
            className="group flex flex-col bg-surface rounded-2xl overflow-hidden border border-border-warm shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-muted">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-ink group-hover:text-[#FF4F00] transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-ink-body mt-1.5 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-warm inline-flex items-center gap-1.5 text-[11px] font-bold text-ink uppercase tracking-wider">
                <span>Verken wijk</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF4F00] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
