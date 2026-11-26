import React from 'react';
import Image from 'next/image';
import { Heart, ArrowUpRight, MessageCircle } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const INSTAGRAM_POSTS = [
  {
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/eusebius-glazen-balkon.jpg',
    caption: 'Hoog boven de stad op het Glazen Balkon van de Eusebiuskerk.',
    likes: '482',
    comments: '24',
    location: 'Eusebiuskerk',
  },
  {
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/modekwartier-klarendal.jpg',
    caption: 'Struinen langs ateliers, boetiekjes en terrassen in het Modekwartier.',
    likes: '615',
    comments: '31',
    location: 'Modekwartier',
  },
  {
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/binnenstad-terras-bloemen.jpg',
    caption: 'Zonnige koffiestops en verborgen terrasjes in de Arnhemse binnenstad.',
    likes: '530',
    comments: '18',
    location: 'Arnhem Centrum',
  },
  {
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/stadsvilla-sonsbeek-winter.jpg',
    caption: 'De Witte Villa in Park Sonsbeek — elk seizoen weer een plaatje.',
    likes: '720',
    comments: '44',
    location: 'Park Sonsbeek',
  },
  {
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/rijnkade-schemering.jpg',
    caption: 'Blauw uurtje aan de Rijnkade met de Eusebiuskerk op de achtergrond.',
    likes: '894',
    comments: '37',
    location: 'Rijnkade Arnhem',
  },
  {
    image: 'https://ldvclkymaiopytbkjulp.supabase.co/storage/v1/object/public/media/editorial/museum-arnhem-tuin.jpg',
    caption: 'Kunst kijken in de beeldentuin van Museum Arnhem hoog op de stuwwal.',
    likes: '448',
    comments: '16',
    location: 'Museum Arnhem',
  },
];

const STAGGER_OFFSETS = [
  'lg:translate-y-0',
  'lg:translate-y-4',
  'lg:translate-y-1',
  'lg:translate-y-5',
  'lg:translate-y-2',
  'lg:translate-y-0',
];

export function SocialMediaBlock() {
  return (
    <section className="w-full bg-canvas text-ink py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          {/* Header with Call to Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight">
                Arnhem door jouw ogen
              </h2>
              <p className="text-ink-body text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
                Deel jouw favoriete terrassen, concerten en stadsverhalen met{' '}
                <span className="font-bold text-ink">#uitinarnhem</span> en tag{' '}
                <span className="font-bold text-[#FF4F00]">@uitinarnhem</span>.
                Wij lichten wekelijks de mooiste beelden uit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <ButtonLink href="https://www.instagram.com/uitinarnhem/" variant="primary" size="md">
                <InstagramIcon className="w-4 h-4" />
                <span>Volg @uitinarnhem</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </ButtonLink>

              <ButtonLink href="https://www.tiktok.com/@uitinarnhem" variant="secondary" size="md">
                <span>TikTok</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-75" />
              </ButtonLink>
            </div>
          </div>

          {/* Visual Instagram Feed Cards Grid met subtiele verticale verspringing op desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:pb-5">
            {INSTAGRAM_POSTS.map((post, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/uitinarnhem/"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative aspect-square rounded-2xl overflow-hidden bg-surface-accent shadow-card transition-shadow duration-300 hover:shadow-card-hover block ${STAGGER_OFFSETS[idx % STAGGER_OFFSETS.length]}`}
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover overlay with likes and location */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="bg-black/60 px-2 py-0.5 rounded-full text-stone-200 truncate">
                      {post.location}
                    </span>
                    <InstagramIcon className="w-3.5 h-3.5 text-[#FF4F00] shrink-0" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-stone-200 line-clamp-2 leading-tight">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-stone-200">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#FF4F00] fill-[#FF4F00]" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-stone-400" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
