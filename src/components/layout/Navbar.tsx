'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, PlusCircle, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { NAVIGATION_MENU, NavMenuSection } from '@/data/navigationMenu';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({
    'Zien en doen': true,
  });

  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeDropdown]);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const toggleMobileSection = (label: string) => {
    setExpandedMobileSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const currentSection = NAVIGATION_MENU.find((s) => s.label === activeDropdown);
  const isDropdownOpen = !!(currentSection && currentSection.columns && currentSection.columns.length > 0);

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            onClick={() => setActiveDropdown(null)}
          >
            <div className="relative flex items-center h-10 sm:h-12">
              <Image
                src="/logo.png"
                alt="Uit in Arnhem Logo"
                width={150}
                height={40}
                priority
                className="h-8 sm:h-10 w-auto max-w-[140px] sm:max-w-[190px] object-contain object-left transition-transform group-hover:scale-[1.02]"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links with Mega-Menu Trigger */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAVIGATION_MENU.map((section) => {
              const isCurrentPage =
                pathname === section.href ||
                (section.href !== '/' && pathname.startsWith(section.href) && !section.href.includes('?'));
              const isDropdownActive = activeDropdown === section.label;

              return (
                <div
                  key={section.label}
                  className="relative py-6"
                  onMouseEnter={() => handleMouseEnter(section.label)}
                >
                  <div className="inline-flex items-center">
                    <Link
                      href={section.href}
                      onClick={() => setActiveDropdown(null)}
                      className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold tracking-tight transition-colors ${
                        isCurrentPage || isDropdownActive
                          ? 'text-[#FF4F00] bg-[#FFF3ED]'
                          : 'text-zinc-700 hover:text-[#FF4F00] hover:bg-zinc-100'
                      }`}
                    >
                      <span>{section.label}</span>
                    </Link>
                    {section.columns && section.columns.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(isDropdownActive ? null : section.label);
                        }}
                        className={`p-1.5 -ml-1 rounded-full transition-colors hover:bg-zinc-100 ${
                          isDropdownActive ? 'text-[#FF4F00]' : 'text-zinc-400 hover:text-zinc-700'
                        }`}
                        aria-label={`Open ${section.label} submenu`}
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isDropdownActive ? 'rotate-180 text-[#FF4F00]' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/agenda/aanmelden"
              onClick={() => setActiveDropdown(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF4F00] text-white hover:bg-[#E04500] transition-all shadow-sm hover:shadow-md transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Evenement Aanmelden</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/agenda/aanmelden"
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

      {/* Desktop Mega Menu Dropdown */}
      {currentSection && currentSection.columns && currentSection.columns.length > 0 && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={handleMouseLeave}
          className="hidden md:block absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Columns container */}
              <div
                className={`grid gap-6 ${
                  currentSection.featuredCta
                    ? 'col-span-12 lg:col-span-9 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5'
                    : 'col-span-12 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                }`}
              >
                {currentSection.columns.map((col) => (
                  <div key={col.title} className="space-y-3">
                    <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#FF4F00]">
                      {col.title}
                    </h4>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="text-sm font-medium text-zinc-700 hover:text-[#FF4F00] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 py-0.5 group"
                          >
                            <span className="group-hover:text-[#FF4F00]">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Featured Card (Right side of Mega Menu) */}
              {currentSection.featuredCta && (
                <div className="col-span-4 lg:col-span-3">
                  <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white p-6 flex flex-col justify-end min-h-[260px] shadow-lg border border-zinc-800 group">
                    {currentSection.featuredCta.imageUrl && (
                      <Image
                        src={currentSection.featuredCta.imageUrl}
                        alt={currentSection.featuredCta.title}
                        fill
                        className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none" />

                    <div className="relative z-10 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FF4F00] text-white inline-block shadow">
                        Uitgelicht
                      </span>
                      <h4 className="font-heading font-black text-lg text-white leading-tight">
                        {currentSection.featuredCta.title}
                      </h4>
                      <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed">
                        {currentSection.featuredCta.description}
                      </p>
                      <Link
                        href={currentSection.featuredCta.href}
                        onClick={() => setActiveDropdown(null)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#FF4F00] hover:underline pt-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>{currentSection.featuredCta.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (Accordion Style for Submenus) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-8 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="divide-y divide-zinc-100">
            {NAVIGATION_MENU.map((section) => {
              const isExpanded = !!expandedMobileSections[section.label];
              const hasSubmenu = section.columns && section.columns.length > 0;

              return (
                <div key={section.label} className="py-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={section.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-2 py-2 text-base font-bold text-zinc-900 hover:text-[#FF4F00]"
                    >
                      {section.label}
                    </Link>
                    {hasSubmenu && (
                      <button
                        onClick={() => toggleMobileSection(section.label)}
                        className="p-2 text-zinc-400 hover:text-zinc-800"
                        aria-label={`Toggle ${section.label} submenu`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#FF4F00]' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Submenu Accordion Items */}
                  {hasSubmenu && isExpanded && (
                    <div className="pl-4 pr-2 pt-2 pb-3 space-y-4 bg-zinc-50/80 rounded-2xl mt-1 border border-zinc-100">
                      {section.columns?.map((col) => (
                        <div key={col.title} className="space-y-1.5">
                          <div className="text-[11px] font-black uppercase tracking-wider text-[#FF4F00]">
                            {col.title}
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {col.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 py-1 pl-1 flex items-center justify-between"
                              >
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
            <Link
              href="/agenda/aanmelden"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#FF4F00] text-white text-center shadow"
            >
              <PlusCircle className="w-4 h-4" />
              Evenement Aanmelden
            </Link>
          </div>
        </div>
      )}
    </header>

    {/* Subtle backdrop blur over the rest of the site when dropdown or mobile menu is open */}
    <div
      className={`fixed inset-0 top-20 bg-black/20 backdrop-blur-xs z-40 transition-opacity duration-200 ${
        isDropdownOpen || mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }}
      aria-hidden="true"
    />
  </>
);
}
