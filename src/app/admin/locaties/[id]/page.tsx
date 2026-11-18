import React from 'react';
import { notFound } from 'next/navigation';
import { getLocationBySlug } from '@/lib/supabase/api';
import { LocationEditorForm } from '@/components/admin/LocationEditorForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: PageProps) {
  const { id } = await params;
  const location = await getLocationBySlug(id);

  if (!location) {
    notFound();
  }

  return <LocationEditorForm initialLocation={location} isNew={false} />;
}

