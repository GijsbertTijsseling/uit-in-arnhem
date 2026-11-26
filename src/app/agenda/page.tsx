import React from 'react';
import { getEvents } from '@/lib/supabase/api';
import { AgendaPageClient } from '@/components/agenda/AgendaPageClient';
import { ButtonLink } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Agenda Arnhem | Concerten, Theater, Festivals & Evenementen',
  description: 'De meest complete cultuur- en uitgaansagenda van Arnhem. Filter op datum, categorie en gratis entree.',
};

export const revalidate = 60;

interface AgendaPageProps {
  searchParams: Promise<{ category?: string; filter?: string; page?: string }>;
}

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  const resolvedParams = await searchParams;
  const events = await getEvents();
  const parsedPage = Number(resolvedParams.page);
  const defaultPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-200/80">
        <div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-zinc-950 tracking-tight">
            Wat is er te doen in <span className="text-[#FF4F00]">Arnhem</span>?
          </h1>
          <p className="text-zinc-600 text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
            Bekijk het actuele overzicht van concerten, voorstellingen, tentoonstellingen en festivals in en rondom de Gelderse hoofdstad.
          </p>
        </div>

        <div className="shrink-0">
          <ButtonLink href="/agenda/aanmelden" variant="primary" size="md">
            <Plus className="w-4 h-4" />
            <span>Evenement aanmelden</span>
          </ButtonLink>
        </div>
      </div>

      {/* Interactive Client Filter View */}
      <AgendaPageClient
        initialEvents={events}
        defaultCategory={resolvedParams.category || 'all'}
        defaultFilter={resolvedParams.filter || 'all'}
        defaultPage={defaultPage}
      />
    </div>
  );
}
