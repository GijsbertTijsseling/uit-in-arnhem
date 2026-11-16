'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, PlusCircle, Search, Calendar, BookOpen, Compass, Shield } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If in admin dashboard, we can display admin navbar or keep standard
  const isAdmin = pathname.startsWith('/admin');

  const navLinks = [
    { href: '/agenda', label: 'Agenda', icon: Calendar },
    { href: '/artikelen', label: 'Artikelen', icon: BookOpen },
    { href: '/artikelen?category=ontdekken', label: 'Hotspots', icon: Compass },
    { href: '/over-ons', label: 'Over Arnhem' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-40 sm:w-48">
              <Image
                src="/logo.png"
                alt="Uit in Arnhem Logo"
                fill
                priority
                className="object-contain object-left transition-transform group-hover:scale-[1.02]"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('?'));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-full text-sm font-semibold tracking-tight transition-colors ${
                    isActive
                      ? 'text-[#FF4F00] bg-[#FFF3ED]'
                      : 'text-zinc-700 hover:text-[#FF4F00] hover:bg-zinc-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/admin/agenda/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF4F00] text-white hover:bg-[#E04500] transition-all shadow-sm hover:shadow-md transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Evenement Aanmelden</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors border border-zinc-200"
              title="Redactie Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <span>Redactie</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/admin/agenda/new"
              className="inline-flex items-center justify-center p-2 rounded-full bg-[#FF4F00] text-white"
              title="Evenement Aanmelden"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-zinc-800 hover:bg-zinc-50 hover:text-[#FF4F00]"
              >
                {link.icon && <link.icon className="w-5 h-5 text-zinc-400" />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <Link
              href="/admin/agenda/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#FF4F00] text-white text-center shadow"
            >
              <PlusCircle className="w-4 h-4" />
              Evenement Aanmelden
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-600 bg-zinc-100 text-center hover:bg-zinc-200"
            >
              <Shield className="w-4 h-4 text-zinc-500" />
              Redactie CMS Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
