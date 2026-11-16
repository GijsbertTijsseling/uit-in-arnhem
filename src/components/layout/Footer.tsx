import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowUpRight, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#121212] text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-zinc-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative flex items-center h-12 brightness-0 invert">
              <Image
                src="/logo.png"
                alt="Uit in Arnhem"
                width={190}
                height={50}
                className="h-10 sm:h-12 w-auto max-w-[200px] object-contain object-left"
              />
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Uit in Arnhem is hét onafhankelijke cultuur-, lifestyle- en uitgaansplatform van Arnhem. Ontdek de beste concerten, theater, verborgen terrassen en creatieve hotspots in de Rijnstad.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#FF4F00] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#FF4F00] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Agenda & Cultuur */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Agenda</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/agenda" className="hover:text-white transition-colors">Volledige Agenda</Link>
              </li>
              <li>
                <Link href="/agenda?filter=vandaag" className="hover:text-white transition-colors">Vandaag te doen</Link>
              </li>
              <li>
                <Link href="/agenda?filter=weekend" className="hover:text-white transition-colors">Dit Weekend in Arnhem</Link>
              </li>
              <li>
                <Link href="/agenda?category=muziek" className="hover:text-white transition-colors">Concerten & Live</Link>
              </li>
              <li>
                <Link href="/agenda?category=theater-dans" className="hover:text-white transition-colors">Theater & Dans</Link>
              </li>
              <li>
                <Link href="/agenda?category=kunst-expo" className="hover:text-white transition-colors">Exposities & Musea</Link>
              </li>
            </ul>
          </div>

          {/* Magazine & Hotspots */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Magazine</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/artikelen?category=eten-drinken" className="hover:text-white transition-colors">Eten & Drinken</Link>
              </li>
              <li>
                <Link href="/artikelen?category=cultuur" className="hover:text-white transition-colors">Kunst & Cultuur</Link>
              </li>
              <li>
                <Link href="/artikelen?category=winkelen" className="hover:text-white transition-colors">Winkelen in Arnhem</Link>
              </li>
              <li>
                <Link href="/artikelen?category=nachtleven" className="hover:text-white transition-colors">Nachtleven & Clubs</Link>
              </li>
              <li>
                <Link href="/artikelen?category=ontdekken" className="hover:text-white transition-colors">Stadswandelingen & Parken</Link>
              </li>
            </ul>
          </div>

          {/* Arnhem Wijken & Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/over-ons" className="hover:text-white transition-colors">Over Uit in Arnhem</Link>
              </li>
              <li>
                <Link href="/admin/agenda/new" className="inline-flex items-center gap-1 text-[#FF4F00] hover:underline font-medium">
                  Evenement Insturen
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">Redactie Inloggen</Link>
              </li>
              <li>
                <Link href="/over-ons#contact" className="hover:text-white transition-colors">Contact & Adverteren</Link>
              </li>
              <li>
                <Link href="/over-ons#privacy" className="hover:text-white transition-colors">Privacy & Colofon</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Stichting Uit in Arnhem. Alle rechten voorbehouden.</p>
          <p className="flex items-center gap-1">
            Geïnspireerd op <span className="text-zinc-400">Into Nijmegen</span> • Met <Heart className="w-3.5 h-3.5 text-[#FF4F00] fill-[#FF4F00]" /> voor Arnhem
          </p>
        </div>
      </div>
    </footer>
  );
}
