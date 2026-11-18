import React from 'react';
import { getAllEventsForAdmin } from '@/lib/supabase/api';
import { AdminAgendaManager } from '@/components/admin/AdminAgendaManager';

export const revalidate = 0;

export default async function AdminAgendaListPage() {
  const events = await getAllEventsForAdmin();

  return <AdminAgendaManager initialEvents={events} />;
}
