import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, Mail, Send, MapPin, Compass, Shield } from 'lucide-react';

export const metadata = {
  title: 'Over Uit in Arnhem | Missie & Redactie',
  description: 'Lees meer over Uit in Arnhem, het onafhankelijke platform voor cultuur, uitgaan en lifestyle in de Rijnstad.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] bg-[#FFF3ED] px-3.5 py-1.5 rounded-full">
          <Heart className="w-3.5 h-3.5 fill-[#FF4F00]" />
          <span>Trots op Arnhem</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-zinc-950 tracking-tight">
          Het kloppende culturele hart van de Rijnstad
        </h1>
        <p className="text-zinc-600 text-lg leading-relaxed">
          Arnhem is eigenzinnig, creatief, groen en rauw. Van de ateliers in het Modekwartier tot de concerten in Luxor Live en de rust van Park Sonsbeek. Uit in Arnhem brengt de stad tot leven.
        </p>
      </div>

      {/* Visual Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-xl text-zinc-900">Onafhankelijk & Lokaal</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Geen commerciële standaardlijstjes, maar echte aanbevelingen van redacteuren die dagelijks in Arnhem wonen, werken en genieten.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-xl text-zinc-900">Voor Iedereen</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Of je nu zoekt naar gratis kinderactiviteiten in Sonsbeek, een intieme jazzsessie of een nachtelijke rave in Willemeen: je vindt het hier.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-xl text-zinc-900">Modern & Open</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Gebouwd met een hypermoderne headless architectuur op Next.js en Supabase voor razendsnelle laadtijden op desktop en mobiel.
          </p>
        </div>
      </div>

      {/* Contact & Tip the Editor */}
      <section id="contact" className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact & Tips</span>
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white">
            Heb jij een gouden tip voor onze redactie?
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Organiseer je een tentoonstelling, open je een nieuwe koffiebar of heb je een verborgen parel in Arnhem ontdekt? Laat het ons weten!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/admin/agenda/new"
              className="px-6 py-3.5 rounded-full bg-[#FF4F00] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#E04500] transition-colors shadow-lg"
            >
              Evenement Direct Aanmelden
            </Link>

            <a
              href="mailto:redactie@uitinarnhem.nl"
              className="px-6 py-3.5 rounded-full bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              redactie@uitinarnhem.nl
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
