'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DISTRICTS,
  RHINE_RIVER,
  District,
  getDistrictBySlug,
} from '@/data/districtsData';
import { ArrowRight, Compass } from 'lucide-react';

interface InteractiveDistrictMapProps {
  activeSlug?: string;
  onSelectDistrict?: (district: District) => void;
  className?: string;
  showSelector?: boolean;
  showPreviewCard?: boolean;
  title?: string;
  subtitle?: string;
}

export function InteractiveDistrictMap({
  activeSlug,
  onSelectDistrict,
  className = '',
  showSelector = true,
  showPreviewCard = true,
  title = 'Ontdek Arnhem per wijk',
  subtitle = 'Klik op een wijk op de kaart om de leukste hotspots, evenementen en verborgen parels te ontdekken.',
}: InteractiveDistrictMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(
    activeSlug || null
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    activeSlug || null
  );
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const activeDistrict =
    getDistrictBySlug(hoveredSlug || selectedSlug || '') || null;

  // Handle pointer movement over the map to update the floating pill position
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Boundary clamping for tooltip
    const clampedX = Math.max(120, Math.min(rect.width - 120, x));
    const clampedY = Math.max(40, Math.min(rect.height - 40, y));

    setTooltipPos({ x: clampedX, y: clampedY });
  }, []);

  const handleDistrictHover = (slug: string | null) => {
    setHoveredSlug(slug);
  };

  const handleDistrictClick = (district: District) => {
    setSelectedSlug(district.slug);
    if (onSelectDistrict) {
      onSelectDistrict(district);
    } else {
      router.push(`/wijken/${district.slug}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-linear-to-b from-stone-50 via-white to-stone-50 rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden select-none p-4 sm:p-6 lg:p-8 ${className}`}
    >
      {/* Header Info (I amsterdam style clean typography) */}
      {(title || subtitle) && (
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 mb-2">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Interactieve Kaart</span>
            </div>
            {title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm sm:text-base text-neutral-600 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-500 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Beweeg over de kaart of kies hieronder</span>
          </div>
        </div>
      )}

      {/* Interactive SVG Canvas */}
      <div className="relative w-full aspect-920/660 max-w-5xl mx-auto">
        <svg
          viewBox="0 0 920 660"
          className="w-full h-full drop-shadow-sm transition-all duration-300 overflow-visible"
          role="region"
          aria-label="Interactieve kaart van Arnhemse wijken"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredSlug(null);
            setTooltipPos(null);
          }}
        >
          <defs>
            {/* Filter for smooth elevation / shadow on hover */}
            <filter id="wijk-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="8"
                floodColor="#000000"
                floodOpacity="0.18"
              />
            </filter>

            {/* River water gradient */}
            <linearGradient id="rhine-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.85" />
            </linearGradient>

            {/* Subtle paper grid pattern */}
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#000000"
                strokeWidth="0.5"
                strokeOpacity="0.03"
              />
            </pattern>
          </defs>

          {/* Background Map Grid */}
          <rect width="920" height="660" fill="url(#map-grid)" rx="24" />

          {/* Compass / North indicator in top right */}
          <g transform="translate(850, 45)" className="opacity-40 pointer-events-none">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#78716C" strokeWidth="1.5" />
            <path d="M 0,-14 L 4,0 L 0,14 L -4,0 Z" fill="#78716C" />
            <path d="M 0,-14 L 4,0 L 0,0 Z" fill="#EA580C" />
            <text
              x="0"
              y="-19"
              textAnchor="middle"
              className="text-[10px] font-bold fill-stone-600"
            >
              N
            </text>
          </g>

          {/* ==================================================== */}
          {/* WATERWAY: Nederrijn (Rhine River) */}
          {/* ==================================================== */}
          <g className="river-group pointer-events-none">
            {/* River bed ribbon */}
            <path
              d={RHINE_RIVER.path}
              fill="url(#rhine-gradient)"
              stroke="#7DD3FC"
              strokeWidth="1.5"
              className="transition-opacity duration-300"
            />

            {/* River wave stream lines */}
            <path
              d="M 60,426 Q 260,414 460,422 T 860,428"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeDasharray="6 8"
              strokeOpacity="0.5"
            />

            {/* River Label */}
            <text
              x={RHINE_RIVER.labelPoint.x}
              y={RHINE_RIVER.labelPoint.y}
              className="text-[11px] font-semibold italic fill-sky-950/70 tracking-wider pointer-events-none select-none"
              style={{ letterSpacing: '0.15em' }}
            >
              ∼ NEDERRIJN ∼
            </text>

            {/* Arnhem Bridges spanning the river */}
            {RHINE_RIVER.bridges.map((bridge) => {
              const midX = (bridge.x1 + bridge.x2) / 2;
              const midY = (bridge.y1 + bridge.y2) / 2;
              const isFrost = bridge.name.includes('John Frost');

              return (
                <g key={bridge.name} className="bridge-marker">
                  {/* Bridge Line */}
                  <line
                    x1={bridge.x1}
                    y1={bridge.y1}
                    x2={bridge.x2}
                    y2={bridge.y2}
                    stroke={isFrost ? '#DC2626' : '#475569'}
                    strokeWidth={isFrost ? 4 : 3}
                    strokeLinecap="round"
                  />
                  {/* Bridge deck stripes */}
                  <line
                    x1={bridge.x1}
                    y1={bridge.y1}
                    x2={bridge.x2}
                    y2={bridge.y2}
                    stroke="#FFFFFF"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                  {/* Bridge Label */}
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    className={`text-[9px] font-bold ${
                      isFrost
                        ? 'fill-red-800 bg-white'
                        : 'fill-slate-600'
                    }`}
                  >
                    {bridge.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ==================================================== */}
          {/* DISTRICTS POLYGONS */}
          {/* ==================================================== */}
          {DISTRICTS.map((district) => {
            const isHovered = hoveredSlug === district.slug;
            const isSelected = selectedSlug === district.slug;
            const isDimmed =
              hoveredSlug !== null && !isHovered && !isSelected;

            return (
              <g
                key={district.id}
                role="link"
                tabIndex={0}
                aria-label={`Wijk ${district.name}`}
                className="cursor-pointer outline-none transition-all duration-300 focus:outline-none"
                onMouseEnter={() => handleDistrictHover(district.slug)}
                onMouseLeave={() => handleDistrictHover(null)}
                onClick={() => handleDistrictClick(district)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDistrictClick(district);
                  }
                }}
              >
                {/* District Path */}
                <path
                  d={district.svgPath}
                  fill={isHovered || isSelected ? district.hoverColor : district.color}
                  stroke={isHovered || isSelected ? '#FFFFFF' : '#FFFFFF'}
                  strokeWidth={isHovered || isSelected ? 3.5 : 2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isHovered ? 'url(#wijk-shadow)' : undefined}
                  className="transition-all duration-250 ease-out"
                  style={{
                    opacity: isDimmed ? 0.65 : 1,
                    transform: isHovered ? 'scale(1.008)' : 'scale(1)',
                    transformOrigin: `${district.centerPoint.x}px ${district.centerPoint.y}px`,
                  }}
                />

                {/* District Center Anchor & Label */}
                <g
                  transform={`translate(${district.centerPoint.x}, ${district.centerPoint.y})`}
                  className="pointer-events-none select-none transition-all duration-200"
                >
                  {/* Subtle Icon Badge */}
                  {district.landmarkIcon && (
                    <circle
                      cx="0"
                      cy="-14"
                      r="12"
                      fill="#FFFFFF"
                      fillOpacity={isHovered ? 0.95 : 0.85}
                      stroke={district.textColor}
                      strokeWidth="1.2"
                      className="shadow-xs"
                    />
                  )}
                  {district.landmarkIcon && (
                    <text
                      x="0"
                      y="-10"
                      textAnchor="middle"
                      className="text-[11px] leading-none"
                    >
                      {district.landmarkIcon}
                    </text>
                  )}

                  {/* District Short Label */}
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    className={`font-bold tracking-tight transition-all duration-200 ${
                      isHovered
                        ? 'text-[13px] fill-neutral-950 font-black'
                        : 'text-[11px] fill-neutral-800'
                    }`}
                    style={{
                      textShadow: '0 1px 3px rgba(255,255,255,0.8), 0 0 6px #FFFFFF',
                    }}
                  >
                    {district.shortName}
                  </text>

                  {/* Highlights counter mini tag */}
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-neutral-600"
                    style={{
                      textShadow: '0 1px 2px #FFFFFF',
                    }}
                  >
                    {district.highlights.length} hotspots
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* ==================================================== */}
        {/* FLOATING PILL BADGE (Inspired by I amsterdam) */}
        {/* ==================================================== */}
        {activeDistrict && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-transform duration-75 ease-out"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 12}px`,
            }}
          >
            <div className="flex items-center gap-2.5 bg-neutral-900/95 text-white px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20 animate-in fade-in zoom-in-95 duration-150">
              <span
                className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white/30"
                style={{ backgroundColor: activeDistrict.hoverColor }}
              />
              <span className="font-semibold text-sm whitespace-nowrap tracking-wide">
                {activeDistrict.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium text-white/90">
                {activeDistrict.vibe}
              </span>
              <ArrowRight className="w-4 h-4 text-orange-400 shrink-0 ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* DISTRICT QUICK CHIPS / SELECTOR (Accessible & Mobile) */}
      {/* ==================================================== */}
      {showSelector && (
        <div className="mt-6 pt-5 border-t border-stone-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Kies een Arnhemse wijk
            </span>
            <Link
              href="/wijken"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Bekijk alle wijken
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((district) => {
              const isSelected =
                (hoveredSlug || selectedSlug) === district.slug;

              return (
                <button
                  key={district.id}
                  onClick={() => handleDistrictClick(district)}
                  onMouseEnter={() => handleDistrictHover(district.slug)}
                  onMouseLeave={() => handleDistrictHover(null)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-md scale-105'
                      : 'bg-white hover:bg-stone-100 text-neutral-800 border border-stone-200 shadow-2xs'
                  }`}
                  style={{
                    borderLeftColor: district.hoverColor,
                    borderLeftWidth: isSelected ? '1px' : '4px',
                  }}
                >
                  <span className="text-sm">{district.landmarkIcon}</span>
                  <span>{district.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* PREVIEW CARD ON ACTIVE DISTRICT */}
      {/* ==================================================== */}
      {showPreviewCard && activeDistrict && (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200">
          <div className="flex items-start gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-2xs"
              style={{ backgroundColor: activeDistrict.color }}
            >
              {activeDistrict.landmarkIcon || '📍'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  {activeDistrict.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-stone-100 text-neutral-700">
                  {activeDistrict.vibe}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 mt-1">
                {activeDistrict.tagLine}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {activeDistrict.characterTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <Link
              href={`/wijken/${activeDistrict.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm transition-colors"
            >
              <span>Ontdek {activeDistrict.shortName}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
