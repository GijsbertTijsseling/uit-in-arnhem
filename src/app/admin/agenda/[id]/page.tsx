import React from 'react';
import { notFound } from 'next/navigation';
import { getEventByIdOrSlugForAdminServer } from '@/lib/supabase/admin-server';
import { AgendaEditorForm } from '@/components/admin/AgendaEditorForm';

export const revalidate = 0;

interface EditAgendaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAgendaPage({ params }: EditAgendaPageProps) {
  const { id } = await params;
  const event = await getEventByIdOrSlugForAdminServer(id);

  if (!event) {
    notFound();
  }

  return <AgendaEditorForm initialEvent={event} isNew={false} />;
}
