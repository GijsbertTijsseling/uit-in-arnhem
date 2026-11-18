'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Location } from '@/types';
import { Search, MapPin, X, Check, ChevronDown, Building2 } from 'lucide-react';

interface LocationComboboxProps {
  locations: Location[];
  selectedSlug?: string;
  onSelect: (location: Location | null) => void;
  placeholder?: string;
  label?: string;
  helpText?: string;
}

export function LocationCombobox({
  locations,
  selectedSlug = '',
  onSelect,
  placeholder = 'Zoek op naam of adres (bijv. Luxor, Molenplaats)...',
  label = 'Kies een vaste locatie',
  helpText,
}: LocationComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Find currently selected location object
  const selectedLocation = useMemo(() => {
    if (!selectedSlug) return null;
    return locations.find((l) => l.slug === selectedSlug) || null;
  }, [locations, selectedSlug]);

  // Filter locations by search query (name, address, city, slug)
  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return locations;

    return locations.filter((loc) => {
      const nameMatch = (loc.name || '').toLowerCase().includes(q);
      const addressMatch = (loc.address || '').toLowerCase().includes(q);
      const cityMatch = (loc.city || '').toLowerCase().includes(q);
      const slugMatch = (loc.slug || '').toLowerCase().includes(q);
      return nameMatch || addressMatch || cityMatch || slugMatch;
    });
  }, [locations, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Scroll active item into view when navigating with keyboard
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (loc: Location | null) => {
    onSelect(loc);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredLocations.length ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex === 0 && !filteredLocations[0]) {
        handleSelect(null);
      } else if (filteredLocations[highlightedIndex]) {
        handleSelect(filteredLocations[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-zinc-950 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
          {label}
        </label>
      )}

      {/* Selected location display (clean single-line input style) */}
      {selectedLocation && !isOpen ? (
        <div
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 hover:border-zinc-300 rounded-2xl transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="w-4 h-4 text-[#FF4F00] shrink-0" />
            <div className="min-w-0 flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 truncate">
                {selectedLocation.name}
              </span>
              {selectedLocation.address && (
                <span className="text-[11px] text-zinc-400 truncate hidden sm:inline">
                  • {selectedLocation.address}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(null);
            }}
            title="Locatie wissen"
            className="p-1 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Search Combobox Input */
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={selectedLocation ? `Geselecteerd: ${selectedLocation.name}` : placeholder}
              className="w-full pl-10 pr-20 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  if (!isOpen) setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-md cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Floating Dropdown Results Menu */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
              <ul
                ref={listRef}
                className="max-h-64 overflow-y-auto divide-y divide-zinc-100 p-1 focus:outline-none"
                role="listbox"
              >
                {/* Option to clear selection or manual input */}
                <li
                  onClick={() => handleSelect(null)}
                  className={`px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    !selectedSlug ? 'bg-zinc-100 text-zinc-900 font-bold' : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <span className="italic text-zinc-500">-- Handmatige invoer (geen vaste locatie) --</span>
                  {!selectedSlug && <Check className="w-3.5 h-3.5 text-zinc-700" />}
                </li>

                {filteredLocations.length === 0 ? (
                  <li className="px-4 py-5 text-center text-xs text-zinc-400">
                    Geen vaste locatie gevonden voor &ldquo;<strong>{searchQuery}</strong>&rdquo;.
                  </li>
                ) : (
                  filteredLocations.map((loc, idx) => {
                    const isSelected = selectedSlug === loc.slug;
                    const isHighlighted = highlightedIndex === idx;

                    return (
                      <li
                        key={loc.slug}
                        onClick={() => handleSelect(loc)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#FFF3ED] text-[#FF4F00] font-bold'
                            : isHighlighted
                            ? 'bg-zinc-100/80 text-zinc-900'
                            : 'text-zinc-800 hover:bg-zinc-50'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 truncate">
                              {highlightMatch(loc.name, searchQuery)}
                            </span>
                            {loc.city && loc.city.toLowerCase() !== 'arnhem' && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-zinc-200/70 text-zinc-600 rounded font-medium">
                                {loc.city}
                              </span>
                            )}
                          </div>
                          {loc.address && (
                            <p className="text-[11px] text-zinc-500 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                              <span>{highlightMatch(loc.address, searchQuery)}</span>
                            </p>
                          )}
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-[#FF4F00] shrink-0" />}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {helpText && <p className="text-[11px] text-zinc-400">{helpText}</p>}
    </div>
  );
}
