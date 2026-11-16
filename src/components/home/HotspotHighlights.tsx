import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ArrowRight } from 'lucide-react';

const DISTRICTS = [
  {
    name: 'Modekwartier',
    tagline: 'Creatieve ateliers, vintage & design in Klarendal',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/05/Street-Art-Tour-20230804_105441-scaled.jpg',
    slug: 'modekwartier',
  },
  {
    name: 'De 7straatjes',
    tagline: 'Historische straatjes vol unieke boetieks & proeverijen',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/01/juune1-c-jonas-de-witte-vierkant-2959072273_2734816142.jpg',
    slug: '7straatjes',
  },
  {
    name: 'Park Sonsbeek',
    tagline: 'Watervallen, Witte Villa & weidse vergezichten',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/Sonsbeekmarkt.jpg',
    slug: 'sonsbeek',
  },
  {
    name: 'De Rijnkade',
    tagline: 'Zwoele terrassen & culinair genieten aan het water',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/AM_VerlatenVrouwen_03-1-LRG-CROP.jpg',
    slug: 'rijnkade',
  },
];

export function HotspotHighlights() {
  return (
    <section id="wijken" className="my-16 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] mb-2">
            <Compass className="w-4 h-4" />
            <span>Wijken & Sfeer</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
            Ontdek Arnhem per wijk
          </h2>
          <p className="text-zinc-600 text-sm mt-1">
            Iedere buurt in Arnhem heeft zijn eigen karakter, verhalen en verborgen favorieten.
          </p>
        </div>

        <Link
          href="/artikelen?category=ontdekken"
          className="text-xs font-bold text-[#FF4F00] hover:text-[#E04500] uppercase tracking-wider inline-flex items-center gap-1 group"
        >
          Bekijk alle wijktips <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DISTRICTS.map((item) => (
          <Link
            key={item.slug}
            href={`/artikelen?tag=${item.slug}`}
            className="group relative rounded-2xl overflow-hidden aspect-4/5 flex flex-col justify-end p-6 bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent pointer-events-none" />

            <div className="relative z-10 text-white">
              <h3 className="font-heading font-black text-xl text-white group-hover:text-[#FF4F00] transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                {item.tagline}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#FF4F00] uppercase tracking-wider">
                Verken wijk →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
