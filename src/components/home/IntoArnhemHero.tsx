import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Compass, BookOpen, MapPin, Sparkles } from 'lucide-react';

export function IntoArnhemHero() {
  const quickLinks = [
    { label: 'Uitagenda', href: '#agenda', icon: Calendar },
    { label: 'Zien & Doen', href: '/zien-en-doen', icon: Sparkles },
    { label: 'Verhalen', href: '#verhalen', icon: BookOpen },
    { label: 'Wijken & Sfeer', href: '#wijken', icon: Compass },
    { label: 'Plan je bezoek', href: '/plan-je-bezoek', icon: MapPin },
  ];

  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 text-white min-h-[520px] sm:min-h-[580px] flex items-end p-6 sm:p-12 lg:p-16 border border-zinc-800">
      {/* Background Image: Iconic John Frostbrug over the Rhine */}
      <Image
        src="/images/bridge_uiterwaarden.jpg"
        alt="De iconische John Frostbrug over de Nederrijn in Arnhem"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-70"
      />

      {/* Atmospheric dark gradient overlays for maximum contrast and elegance */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-zinc-950/25 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-zinc-950/50 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl space-y-6">
        <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.06]">
          Ontdek wat er bruist in{' '}
          <span className="text-[#FF4F00] relative inline-block">
            Arnhem.
            <span className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-1.5 sm:h-2 bg-[#FF4F00]/30 rounded-full" />
          </span>
        </h1>

        <p className="text-zinc-200 text-base sm:text-xl font-normal leading-relaxed max-w-2xl">
          Jouw gids voor concerten, theater, exposities, verborgen terrassen en de mooiste verhalen uit de Rijnstad.
        </p>

        {/* Calm, uniform quick-links */}
        <div className="pt-2 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Snel navigeren naar:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-[#FF4F00] hover:border-[#FF4F00] border border-white/20 backdrop-blur-md transition-all shadow-sm active:scale-95"
                >
                  <Icon className="w-4 h-4 text-white/90 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
