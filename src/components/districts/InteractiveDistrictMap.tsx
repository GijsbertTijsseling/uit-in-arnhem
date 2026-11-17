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
  subtitle = 'Klik op een wijk op de kaart om de leukste hotspots, verhalen en uitagenda te ontdekken.',
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
      className={`relative w-full bg-linear-to-b from-stone-50/60 via-white to-stone-50/60 rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden select-none p-4 sm:p-6 lg:p-8 ${className}`}
    >
      {/* Header Info (I amsterdam style clean typography) */}
      {(title || subtitle) && (
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 mb-2">
              <Compass className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Wijkengids & Kaart</span>
            </div>
            {title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-heading">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm sm:text-base text-neutral-600 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-500 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Beweeg of klik op een wijk</span>
          </div>
        </div>
      )}

      {/* Interactive SVG Canvas */}
      <div className="relative w-full aspect-960/680 max-w-5xl mx-auto">
        <svg
          viewBox="0 0 960 680"
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
            <linearGradient id="rhine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="45%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#38BDF8" />
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
          <rect width="960" height="680" fill="url(#map-grid)" rx="24" />

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
          {/* WATERWAY: Nederrijn (Duidelijk tussen de wijken) */}
          {/* ==================================================== */}
          <g className="river-group pointer-events-none">
            {/* Brede, duidelijke rivierbedding zonder stippellijn */}
            <path
              d={RHINE_RIVER.path}
              fill="url(#rhine-gradient)"
              stroke="#2563EB"
              strokeWidth="1.5"
              className="transition-opacity duration-300 shadow-inner"
            />

            {/* River Label */}
            <text
              x={RHINE_RIVER.labelPoint.x}
              y={RHINE_RIVER.labelPoint.y}
              className="text-[11px] font-bold italic fill-blue-950/80 tracking-widest pointer-events-none select-none"
              style={{ letterSpacing: '0.22em' }}
            >
              ∼ NEDERRIJN ∼
            </text>

            {/* Arnhemse Bruggen die de noord- en zuidkant overspannen */}
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
                    x={midX + 8}
                    y={midY + 3}
                    textAnchor="start"
                    className={`text-[9.5px] font-extrabold ${
                      isFrost ? 'fill-red-800' : 'fill-slate-800'
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
          {/* DISTRICTS POLYGONS (I amsterdam styling) */}
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
                {/* District Perimeter Path */}
                <path
                  d={district.svgPath}
                  fill={isHovered || isSelected ? district.hoverColor : district.color}
                  fillOpacity={isHovered || isSelected ? 0.98 : 0.88}
                  stroke={isHovered || isSelected ? '#FFFFFF' : '#1E293B'}
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

                {/* Subtiele interne stippellijnen (zoals in I amsterdam en Arnhem-Noord) */}
                {district.innerLines?.map((lineD, lIdx) => (
                  <path
                    key={lIdx}
                    d={lineD}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    strokeOpacity={isHovered ? 0.8 : 0.45}
                    className="pointer-events-none"
                  />
                ))}

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
                      fillOpacity={isHovered ? 0.98 : 0.9}
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
          {/* FLOATING PILL TOOLTIP (I amsterdam style: "Wijknaam →") */}
          {/* ==================================================== */}
          {activeDistrict && (
            <g
              transform={`translate(${activeDistrict.centerPoint.x}, ${activeDistrict.centerPoint.y})`}
              className="pointer-events-none select-none transition-transform duration-200 ease-out"
            >
              {/* Elevated floating pill badge */}
              <g transform="translate(0, -38)">
                <rect
                  x="-110"
                  y="-18"
                  width="220"
                  height="36"
                  rx="18"
                  fill="#0F172A"
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

        {/* Floating Tooltip Follower for Mouse Position (Mobile/Desktop helper) */}
        {activeDistrict && tooltipPos && (
          <div
            className="absolute pointer-events-none transition-all duration-75 z-20 hidden md:block"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 48}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-neutral-900/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2 whitespace-nowrap">
              <span className="text-base">{activeDistrict.landmarkIcon}</span>
              <div>
                <div className="text-xs font-bold leading-tight flex items-center gap-1 text-white">
                  <span>{activeDistrict.name}</span>
                  <ArrowRight className="w-3 h-3 text-[#FF4F00]" />
                </div>
                <div className="text-[10px] text-neutral-300 font-medium">
                  {activeDistrict.vibe}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* QUICK CHIP SELECTOR (Accessible & Mobile Friendly) */}
      {/* ==================================================== */}
      {showSelector && (
        <div className="mt-6 pt-6 border-t border-stone-200/80">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center justify-between">
            <span>Of kies direct een wijk van Arnhem:</span>
            <span className="text-[11px] text-neutral-400">8 wijken</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((district) => {
              const isHovered = hoveredSlug === district.slug;
              const isSelected = selectedSlug === district.slug;

              return (
                <button
                  key={district.id}
                  type="button"
                  onMouseEnter={() => handleDistrictHover(district.slug)}
                  onMouseLeave={() => handleDistrictHover(null)}
                  onClick={() => handleDistrictClick(district)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isHovered || isSelected
                      ? 'bg-neutral-900 text-white shadow-md scale-105'
                      : 'bg-white text-neutral-700 border border-stone-200 hover:border-neutral-400 hover:bg-stone-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: district.accentColor }}
                  />
                  <span>{district.shortName}</span>
                  <span className="text-[10px] opacity-60">
                    ({district.highlights.length})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SELECTED DISTRICT PREVIEW CARD (Below Map) */}
      {/* ==================================================== */}
      {showPreviewCard && activeDistrict && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeDistrict.landmarkIcon}</span>
              <h3 className="font-heading font-black text-lg text-neutral-900">
                {activeDistrict.name}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                {activeDistrict.vibe}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 max-w-2xl">
              {activeDistrict.description}
            </p>
          </div>

          <Link
            href={`/wijken/${activeDistrict.slug}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 group"
          >
            <span>Wijkpagina bekijken</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
