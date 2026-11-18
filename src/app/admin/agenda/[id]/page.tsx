import React from 'react';
import { notFound } from 'next/navigation';
import { getAllEventsForAdmin } from '@/lib/supabase/api';
import { AgendaEditorForm } from '@/components/admin/AgendaEditorForm';

interface EditAgendaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAgendaPage({ params }: EditAgendaPageProps) {
  const { id } = await params;
  const events = await getAllEventsForAdmin();
  const event = events.find((e) => e.id === id || e.slug === id);

  if (!event) {
    notFound();
  }

  return <AgendaEditorForm initialEvent={event} isNew={false} />;
}
