'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Article } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import { ARTICLE_CATEGORIES } from '@/data/mockData';
import { Search, X, BookOpen } from 'lucide-react';

const ARTICLES_PER_PAGE = 12;

interface ArticlesPageClientProps {
  initialArticles: Article[];
  defaultCategory?: string;
  defaultTag?: string;
  defaultPage?: number;
}

export function ArticlesPageClient({
  initialArticles,
  defaultCategory = 'all',
  defaultTag,
  defaultPage = 1,
}: ArticlesPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(defaultTag || '');
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const resultsTopRef = useRef<HTMLDivElement>(null);

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

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedArticles = useMemo(() => {
    const startIndex = (safePage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  }, [filteredArticles, safePage]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (safePage > 1) {
      url.searchParams.set('page', String(safePage));
    } else {
      url.searchParams.delete('page');
    }
    window.history.replaceState(null, '', url.toString());
  }, [safePage]);

  const handlePageChange = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveTag('');
    setCurrentPage(1);
  };

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
                    setCurrentPage(1);
                  }}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${active
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Zoek artikelen & tips..."
              className="w-full pl-10 pr-9 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Wis zoekopdracht"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
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
              type="button"
              onClick={() => {
                setActiveTag('');
                setCurrentPage(1);
              }}
              className="text-zinc-400 hover:text-zinc-700 underline cursor-pointer"
            >
              Wis tag
            </button>
          </div>
        )}
      </div>

      {/* Results Count & Clear */}
      <div
        ref={resultsTopRef}
        className="scroll-mt-24 flex items-center justify-between text-xs text-zinc-500 font-semibold"
      >
        <span>
          {filteredArticles.length}{' '}
          {filteredArticles.length === 1 ? 'verhaal gevonden' : 'verhalen gevonden'}
          {totalPages > 1 && (
            <span className="text-zinc-400 font-medium">
              {' '}· Pagina {safePage} van {totalPages}
            </span>
          )}
        </span>
        {(selectedCategory !== 'all' || searchQuery || activeTag) && (
          <button
            onClick={resetFilters}
            className="text-[#FF4F00] hover:underline cursor-pointer"
          >
            Filters wissen
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredArticles.length}
            itemsPerPage={ARTICLES_PER_PAGE}
            itemLabel="verhalen"
          />
        </>
      ) : (
        <div className="py-20 text-center bg-zinc-50 rounded-3xl border border-zinc-200 px-4">
          <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-zinc-800">
            Geen artikelen gevonden
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
            Probeer een andere categorie of zoekterm.
          </p>
          <Button onClick={resetFilters} variant="primary" size="md">
            Toon alle artikelen
          </Button>
        </div>
      )}
    </div>
  );
}
