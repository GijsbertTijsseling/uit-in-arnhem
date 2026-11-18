import React from 'react';
import { getEvents } from '@/lib/supabase/api';
import { AgendaPageClient } from '@/components/agenda/AgendaPageClient';

export const metadata = {
  title: 'Agenda Arnhem | Concerten, Theater, Festivals & Evenementen',
  description: 'De meest complete cultuur- en uitgaansagenda van Arnhem. Filter op datum, categorie en gratis entree.',
};

export const revalidate = 60;

interface AgendaPageProps {
  searchParams: Promise<{ category?: string; filter?: string }>;
}

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  const resolvedParams = await searchParams;
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-zinc-950 tracking-tight">
          Wat is er te doen in Arnhem?
        </h1>
        <p className="text-zinc-600 text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
          Bekijk het actuele overzicht van concerten, voorstellingen, tentoonstellingen en festivals in en rondom de Gelderse hoofdstad.
        </p>
      </div>

      {/* Interactive Client Filter View */}
      <AgendaPageClient
        initialEvents={events}
        defaultCategory={resolvedParams.category || 'all'}
        defaultFilter={resolvedParams.filter || 'all'}
      />
    </div>
  );
}
