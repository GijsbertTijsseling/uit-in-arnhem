import React from 'react';
import { Metadata } from 'next';
import { PublicEventSubmissionForm } from '@/components/agenda/PublicEventSubmissionForm';

export const metadata: Metadata = {
  title: 'Evenement Aanmelden | Uit in Arnhem',
  description: 'Meld jouw culturele evenement, concert, festival of voorstelling gratis aan voor de Uit in Arnhem cultuur- en uitgaansagenda.',
};

export default function PublicEventSubmissionPage() {
  return (
    <div className="min-h-screen bg-zinc-50/60 pb-20">
      {/* Hero Banner */}
      <section className="bg-white border-b border-zinc-200/80 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-zinc-950 tracking-tight">
            Meld jouw evenement aan voor de Arnhemse agenda
          </h1>

          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Organiseer je een concert, theatervoorstelling, expositie, festival of workshop in Arnhem? 
            Meld je evenement hier gratis aan. Onze redactie bekijkt elke inzending zorgvuldig en plaatst goedgekeurde evenementen in de officiële culturele agenda.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <PublicEventSubmissionForm />
      </main>
    </div>
  );
}

