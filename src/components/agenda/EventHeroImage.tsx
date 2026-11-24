'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface EventHeroImageProps {
  src: string;
  title: string;
  initialIsPortrait?: boolean;
  children?: React.ReactNode;
}

export function EventHeroImage({
  src,
  title,
  initialIsPortrait = false,
  children,
}: EventHeroImageProps) {
  const [isPortrait, setIsPortrait] = useState(initialIsPortrait);

  return (
    <div className="relative aspect-16/9 w-full rounded-3xl overflow-hidden shadow-lg bg-zinc-100">
      {/* Ambient blurred backdrop that preserves full top-to-bottom colors */}
      {isPortrait && (
        <div className="absolute -inset-6 overflow-hidden pointer-events-none">
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            aria-hidden="true"
            className="object-fill blur-2xl scale-115 opacity-80 brightness-105 saturate-110"
          />
          <div className="absolute inset-0 bg-white/5" />
        </div>
      )}

      {/* Foreground sharp image */}
      <Image
        src={src}
        alt={title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 66vw"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalHeight > img.naturalWidth) {
            setIsPortrait(true);
          }
        }}
        className={`${isPortrait
            ? 'object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.18)]'
            : 'object-cover'
          } transition-transform duration-500`}
      />

      {children && <div className="relative z-20">{children}</div>}
    </div>
  );
}
