'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

const HERO_BACKDROP_IMAGES = [
  {
    src: '/images/hero-focus-nacht.jpg',
    alt: 'Focus Filmtheater en Eusebiustoren in de avond tijdens Uitnacht Arnhem',
  },
  {
    src: '/images/hero-rijnkade-schemering.jpg',
    alt: 'Rijnkade en Eusebiustoren in Arnhem bij schemering vanaf de overkant van de Rijn',
  },
] as const;

export function IntoArnhemHero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [activeBackdropIdx, setActiveBackdropIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Forceer muted op het DOM-element voor betrouwbare autoplay op iOS Safari
    video.defaultMuted = true;
    video.muted = true;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      video.pause();
      setIsVideoPlaying(false);
      return;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          // Bijv. iOS Energiebesparingsmodus blokkeert autoplay: toon foto-backdrop
          setIsVideoPlaying(false);
        });
    }
  }, []);

  // Wissel rustig tussen beide Arnhem-foto's zolang de video niet draait
  useEffect(() => {
    if (hasVideoStarted && isVideoPlaying) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveBackdropIdx((prev) => (prev + 1) % HERO_BACKDROP_IMAGES.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [hasVideoStarted, isVideoPlaying]);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setHasVideoStarted(true);
          setIsVideoPlaying(true);
        })
        .catch(() => { });
    }
  };

  return (
    <div className="w-full flex flex-col relative overflow-hidden">
      <section className="relative w-full overflow-hidden bg-zinc-950 text-white min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center">
        {/* Foto-backdrop achter de video (Focus in de nacht + Rijnkade bij schemering) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {HERO_BACKDROP_IMAGES.map((img, idx) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover object-center transition-opacity duration-1000 ${
                idx === activeBackdropIdx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Background Video met soepele fade-in zodra afspelen start */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          preload="auto"
          poster="/images/hero-focus-nacht.jpg"
          onPlaying={() => {
            setHasVideoStarted(true);
            setIsVideoPlaying(true);
          }}
          className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700 ${
            hasVideoStarted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/videos/arnhem_hero.mp4" type="video/mp4" />
        </video>

        {/* Subtiel vignet aan boven- en onderrand voor tekstcontrast met behoud van helderheid */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none" />

        {/* Centered Widescreen Content Container */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center space-y-6 py-20 sm:py-28">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Ontdek wat er bruist in{' '}
              <span className="text-[#FF4F00] relative inline-block">
                Arnhem.
              </span>
            </h1>
            <p className="text-white text-base sm:text-xl max-w-xl mx-auto font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Jouw gids voor concerten, theater, exposities, verborgen terrassen en de mooiste verhalen uit de Rijnstad.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <ButtonLink href="#agenda" variant="primary" surface="dark" size="lg">
              <span>Ontdek de agenda</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>

            <ButtonLink href="/zien-en-doen" variant="secondary" surface="dark" size="lg">
              <span>Zien &amp; Doen</span>
            </ButtonLink>
          </div>
        </div>

        {/* Compacte Pause / Play knop linksonder */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20 select-none">
          <button
            type="button"
            onClick={toggleVideoPlay}
            title={isVideoPlaying ? 'Pauzeer achtergrondfilm' : 'Speel achtergrondfilm af'}
            aria-label={isVideoPlaying ? 'Pauzeer achtergrondfilm' : 'Speel achtergrondfilm af'}
            className="w-10 h-10 rounded-full bg-black/55 hover:bg-black/75 border border-white/20 backdrop-blur-md text-white inline-flex items-center justify-center transition-all active:scale-95 shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F00]"
          >
            {isVideoPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
