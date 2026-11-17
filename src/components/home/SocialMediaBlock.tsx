import React from 'react';
import Image from 'next/image';
import { Heart, ArrowUpRight, MessageCircle } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`${className} fill-currentColor`} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const INSTAGRAM_POSTS = [
  {
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/Sonsbeekmarkt.jpg',
    caption: 'Zondagen in het Sonsbeekpark zijn nergens lekkerder dan hier. 🌿🥞',
    likes: '482',
    comments: '24',
    location: 'Park Sonsbeek',
  },
  {
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/05/Street-Art-Tour-20230804_105441-scaled.jpg',
    caption: 'Creatieve street art ontdekken in het Modekwartier Klarendal. 🎨',
    likes: '615',
    comments: '31',
    location: 'Modekwartier',
  },
  {
    image: 'https://uitinarnhem.nl/wp-content/uploads/2026/11/55002413960_8f66c3aa22_o-2-1.jpg',
    caption: 'Het Glazen Huis komt naar Arnhem! 3FM Serious Request op het plein. 📻✨',
    likes: '1.240',
    comments: '89',
    location: 'Arnhem Centrum',
  },
  {
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/01/juune1-c-jonas-de-witte-vierkant-2959072273_2734816142.jpg',
    caption: 'Verdwalen in de historische boetiekjes van De 7straatjes. 🛍️☕',
    likes: '530',
    comments: '18',
    location: 'De 7straatjes',
  },
  {
    image: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/AM_VerlatenVrouwen_03-1-LRG-CROP.jpg',
    caption: 'Zwoele zomeravonden, dans en theater met uitzicht op de Rijn. 🌅',
    likes: '394',
    comments: '12',
    location: 'Rijnkade Arnhem',
  },
  {
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/03/Sonsbeek-Lentefestival.jpg',
    caption: 'Lentevibes en live muziek tussen de oude beukenbomen. 🎶🌸',
    likes: '720',
    comments: '44',
    location: 'Witte Villa Sonsbeek',
  },
];

export function SocialMediaBlock() {
  return (
    <section className="my-16 sm:my-20">
      <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-2xl border border-zinc-800">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4F00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF4F00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Call to Action */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/90 text-[#FF4F00] text-xs font-bold uppercase tracking-wider mb-3 border border-zinc-700">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Volg de community</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Arnhem door jouw ogen
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg mt-2 max-w-xl leading-relaxed">
              Deel jouw favoriete terrassen, concerten en stadsverhalen met{' '}
              <span className="text-white font-bold">#uitinarnhem</span> en tag{' '}
              <span className="text-[#FF4F00] font-bold">@uitinarnhem</span>. Wij lichten wekelijks de mooiste beelden uit!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FF4F00] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#E04500] transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Volg @uitinarnhem</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700 cursor-pointer"
            >
              <span>TikTok</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>
        </div>

        {/* Visual Instagram Feed Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-10">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover overlay with likes and location */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="bg-black/60 px-2 py-0.5 rounded-full text-zinc-300">
                    📍 {post.location}
                  </span>
                  <InstagramIcon className="w-3.5 h-3.5 text-[#FF4F00]" />
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] text-zinc-200 line-clamp-2 leading-tight">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-zinc-300">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#FF4F00] fill-[#FF4F00]" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-zinc-400" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}