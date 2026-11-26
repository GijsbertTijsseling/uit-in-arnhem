import React from 'react';
import { notFound } from 'next/navigation';
import { getArticleByIdOrSlugForAdminServer } from '@/lib/supabase/admin-server';
import { ArticleEditorForm } from '@/components/admin/ArticleEditorForm';

export const revalidate = 0;

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticleByIdOrSlugForAdminServer(id);

  if (!article) {
    notFound();
  }

  return <ArticleEditorForm initialArticle={article} isNew={false} />;
}
