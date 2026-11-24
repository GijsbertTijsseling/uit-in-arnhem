'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemLabel?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push('ellipsis');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemLabel = 'resultaten',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);
  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <nav
      aria-label="Paginanavigatie"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200/80"
    >
      {startItem !== null && endItem !== null && totalItems !== undefined ? (
        <p className="text-xs font-medium text-zinc-500 order-2 sm:order-1">
          Toont <span className="font-semibold text-zinc-800">{startItem}–{endItem}</span> van{' '}
          <span className="font-semibold text-zinc-800">{totalItems}</span> {itemLabel}
        </p>
      ) : (
        <div className="hidden sm:block" />
      )}

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Vorige pagina"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Vorige</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-9 h-9 inline-flex items-center justify-center text-xs font-semibold text-zinc-400 select-none"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Pagina ${page}`}
                className={`w-9 h-9 inline-flex items-center justify-center rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Volgende pagina"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Volgende</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}

