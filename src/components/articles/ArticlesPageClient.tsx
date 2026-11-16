'use client';

import React, { useState, useMemo } from 'react';
import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ARTICLE_CATEGORIES } from '@/data/mockData';
import { Search, X, BookOpen } from 'lucide-react';

interface ArticlesPageClientProps {
  initialArticles: Article[];
  defaultCategory?: string;
  defaultTag?: string;
}

export function ArticlesPageClient({
  initialArticles,
  defaultCategory = 'all',
  defaultTag,
}: ArticlesPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(defaultTag || '');

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (activeTag) {
        const matchesTag = item.tags?.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()));
        if (!matchesTag) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesExcerpt = item.excerpt.toLowerCase().includes(q);
        const matchesContent = item.content.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt && !matchesContent) return false;
      }

      return true;
    });
  }, [initialArticles, selectedCategory, activeTag, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Search */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {ARTICLE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveTag('');
                  }}
                  type="button"
                  className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FF4F00] text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek artikelen & tips..."
              className="w-full pl-10 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {activeTag && (
          <div className="flex items-center gap-2 pt-2 text-xs text-zinc-600">
            <span>Filter op tag:</span>
            <span className="bg-[#FFF3ED] text-[#FF4F00] px-3 py-1 rounded-full font-bold">
              #{activeTag}
            </span>
            <button
              onClick={() => setActiveTag('')}
              className="text-zinc-400 hover:text-zinc-700 underline"
            >
              Wis tag
            </button>
          </div>
        )}
      </div>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
        <span>{filteredArticles.length} verhalen gevonden</span>
        {(selectedCategory !== 'all' || searchQuery || activeTag) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setActiveTag('');
            }}
            className="text-[#FF4F00] hover:underline"
          >
            Filters wissen
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-zinc-50 rounded-3xl border border-zinc-200 px-4">
          <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-zinc-800">
            Geen artikelen gevonden
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
            Probeer een andere categorie of zoekterm.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setActiveTag('');
            }}
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#FF4F00] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E04500] cursor-pointer"
          >
            Toon alle artikelen
          </button>
        </div>
      )}
    </div>
  );
}
