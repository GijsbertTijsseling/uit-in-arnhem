import React from 'react';
import { getAllEventsForAdmin } from '@/lib/supabase/api';
import { getEntityViewCounts } from '@/lib/analytics';
import { AdminAgendaManager } from '@/components/admin/AdminAgendaManager';

export const revalidate = 0;

export default async function AdminAgendaListPage() {
  const [events, viewCounts] = await Promise.all([
    getAllEventsForAdmin(),
    getEntityViewCounts('event', 30),
  ]);

  return <AdminAgendaManager initialEvents={events} viewCounts={viewCounts} />;
}
