'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DISTRICTS,
  RHINE_RIVER,
  District,
  getDistrictBySlug,
} from '@/data/districtsData';

interface InteractiveDistrictMapProps {
  activeSlug?: string;
  onSelectDistrict?: (district: District) => void;
  className?: string;
  showSelector?: boolean;
  title?: string;
  subtitle?: string;
}

export function InteractiveDistrictMap({
  activeSlug,
  onSelectDistrict,
  className = '',
  showSelector = true,
  title = 'Ontdek Arnhem per wijk',
  subtitle = 'Klik op een wijk op de kaart om de leukste hotspots, verhalen en uitagenda te ontdekken.',
}: InteractiveDistrictMapProps) {
  const router = useRouter();

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(
    activeSlug || null
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    activeSlug || null
  );

  const activeDistrict =
    getDistrictBySlug(hoveredSlug || selectedSlug || '') || null;

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

  const pillWidth = activeDistrict
    ? Math.max(150, Math.round(activeDistrict.name.length * 7.8 + 44))
    : 200;

  return (
    <div
      className={`relative w-full bg-surface-subtle rounded-3xl border border-border-warm overflow-hidden select-none p-3 sm:p-5 lg:p-6 ${className}`}
    >
      {/* Header Info */}
      {(title || subtitle) && (
        <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-heading">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm sm:text-base text-ink-body max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Interactive SVG Canvas */}
      <div className="relative w-full aspect-960/720 max-w-4xl mx-auto">
        <svg
          viewBox="0 0 960 720"
          className="w-full h-full drop-shadow-sm transition-all duration-300 overflow-visible"
          role="region"
          aria-label="Interactieve kaart van Arnhemse wijken"
          onMouseLeave={() => {
            setHoveredSlug(null);
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
            <linearGradient id="rhine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#7DD3FC" stopOpacity="0.95" />
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
          <rect width="960" height="720" fill="url(#map-grid)" rx="24" />

          {/* Compass / North indicator in top right */}
          <g transform="translate(900, 45)" className="opacity-40 pointer-events-none">
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
          {/* WATERWAY BED: Nederrijn (Organische wijk-polygon)    */}
          {/* ==================================================== */}
          <g className="river-bed pointer-events-none">
            {/* Rivierbedding als een wijk-vlak die perfect tussen noord en zuid ligt */}
            <path
              d={RHINE_RIVER.path}
              fill="url(#rhine-gradient)"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="transition-opacity duration-300"
            />
          </g>

          {/* ==================================================== */}
          {/* DISTRICTS POLYGONS (Organische, speelse CBS-vormen) */}
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
                className="cursor-pointer outline-none transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FF4F00]"
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
                {/* District Perimeter & Multi-Polygon Path (donkere lijnen die wit oplichten bij hover) */}
                <path
                  d={district.svgPath}
                  fill={isHovered || isSelected ? district.hoverColor : district.color}
                  fillOpacity={isHovered || isSelected ? 0.98 : 0.88}
                  stroke={isHovered || isSelected ? '#FFFFFF' : district.accentColor}
                  strokeWidth={isHovered || isSelected ? 3.5 : 1.8}
                  strokeDasharray={isHovered || isSelected ? undefined : '5 3'}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isHovered ? 'url(#wijk-shadow)' : undefined}
                  className="transition-all duration-250 ease-out"
                  style={{
                    opacity: isDimmed ? 0.45 : 1,
                    transform: isHovered ? 'scale(1.008)' : 'scale(1)',
                    transformOrigin: `${district.centerPoint.x}px ${district.centerPoint.y}px`,
                  }}
                />

                {/* District Center Anchor & Label */}
                <g
                  transform={`translate(${district.centerPoint.x}, ${district.centerPoint.y})`}
                  className="pointer-events-none select-none transition-all duration-200"
                >
                  {/* Minimal Anchor Marker (no emojis) */}
                  <circle
                    cx="0"
                    cy="-11"
                    r={isHovered || isSelected ? '6' : '4.5'}
                    fill={isHovered || isSelected ? '#FF4F00' : '#FFFFFF'}
                    stroke={isHovered || isSelected ? '#FFFFFF' : district.textColor}
                    strokeWidth="1.8"
                    className="transition-all duration-200"
                  />

                  {/* District Short Label */}
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    className={`font-bold tracking-tight transition-all duration-200 ${isHovered
                      ? 'text-[13px] fill-neutral-950 font-black'
                      : 'text-[11px] fill-neutral-900 font-extrabold'
                      }`}
                    style={{
                      textShadow:
                        '0 1px 3px rgba(255,255,255,0.9), 0 0 6px #FFFFFF',
                    }}
                  >
                    {district.shortName}
                  </text>

                  {/* Highlights counter mini tag */}
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    className="text-[9px] font-semibold fill-neutral-700"
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

          {/* ==================================================== */}
          {/* RIVER OVERLAYS: Label & Bruggen over de Nederrijn    */}
          {/* ==================================================== */}
          <g className="river-overlays pointer-events-none">
            {/* River Label */}
            <text
              x={RHINE_RIVER.labelPoint.x}
              y={RHINE_RIVER.labelPoint.y}
              className="text-[11px] font-extrabold italic fill-blue-950/80 tracking-widest pointer-events-none select-none"
              style={{ letterSpacing: '0.22em' }}
            >
              ∼ NEDERRIJN ∼
            </text>

            {/* Arnhemse Bruggen die de noord- en zuidkant overspannen */}
            {RHINE_RIVER.bridges.map((bridge) => {
              const midX = (bridge.x1 + bridge.x2) / 2;
              const midY = (bridge.y1 + bridge.y2) / 2;
              const isFrost = bridge.name.includes('John Frost');
              const isLeft = bridge.labelAlign === 'left';
              const labelX = isLeft ? midX - 8 : midX + 8;
              const labelY = midY + (bridge.labelOffsetY ?? 3);
              const textAnchor = isLeft ? 'end' : 'start';

              return (
                <g key={bridge.name} className="bridge-marker">
                  {/* Bridge Line */}
                  <line
                    x1={bridge.x1}
                    y1={bridge.y1}
                    x2={bridge.x2}
                    y2={bridge.y2}
                    stroke={isFrost ? '#DC2626' : '#1E293B'}
                    strokeWidth={isFrost ? 5 : 4}
                    strokeLinecap="round"
                  />
                  {/* Bridge deck stripes */}
                  <line
                    x1={bridge.x1}
                    y1={bridge.y1}
                    x2={bridge.x2}
                    y2={bridge.y2}
                    stroke="#FFFFFF"
                    strokeWidth={1.2}
                    strokeDasharray="2 2"
                  />
                  {/* Bridge Label */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={textAnchor}
                    className={`text-[9.5px] font-extrabold ${isFrost ? 'fill-red-800' : 'fill-slate-800'
                      }`}
                    style={{ textShadow: '0 1px 3px rgba(255,255,255,0.95), 0 0 6px #FFFFFF' }}
                  >
                    {bridge.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ==================================================== */}
          {/* SINGLE FLOATING PILL TOOLTIP ("Wijknaam →")          */}
          {/* ==================================================== */}
          {activeDistrict && (
            <g
              transform={`translate(${activeDistrict.centerPoint.x}, ${activeDistrict.centerPoint.y})`}
              className="pointer-events-none select-none transition-transform duration-200 ease-out"
            >
              {/* Elevated floating pill badge */}
              <g transform="translate(0, -38)">
                <rect
                  x={-pillWidth / 2}
                  y="-18"
                  width={pillWidth}
                  height="36"
                  rx="18"
                  fill="#121212"
                  className="shadow-2xl"
                  filter="url(#wijk-shadow)"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className="text-[12px] font-bold fill-white tracking-wide"
                >
                  {activeDistrict.name} →
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* ==================================================== */}
      {/* QUICK CHIP SELECTOR (Accessible & Mobile Friendly) */}
      {/* ==================================================== */}
      {showSelector && (
        <div className="mt-4 pt-4 border-t border-border-warm">
          <div className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2.5 flex items-center justify-between">
            <span>Of kies direct een wijk van Arnhem:</span>
            <span className="text-[11px] text-ink-muted">{DISTRICTS.length} wijken</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((district) => {
              const isSelected = selectedSlug === district.slug;

              return (
                <button
                  key={district.id}
                  type="button"
                  onMouseEnter={() => handleDistrictHover(district.slug)}
                  onMouseLeave={() => handleDistrictHover(null)}
                  onClick={() => handleDistrictClick(district)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${isSelected
                    ? 'bg-ink text-white shadow-xs'
                    : 'bg-surface text-ink-body border border-border-warm hover:border-ink hover:bg-ink hover:text-white'
                    }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: district.accentColor }}
                  />
                  <span>{district.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
