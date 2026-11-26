import React from 'react';
import { getAllEventsForAdminServer } from '@/lib/supabase/admin-server';
import { getEntityViewCounts } from '@/lib/analytics';
import { AdminAgendaManager } from '@/components/admin/AdminAgendaManager';

export const revalidate = 0;

export default async function AdminAgendaListPage() {
  const [events, viewCounts] = await Promise.all([
    getAllEventsForAdminServer(),
    getEntityViewCounts('event', 30),
  ]);

  return <AdminAgendaManager initialEvents={events} viewCounts={viewCounts} />;
}
