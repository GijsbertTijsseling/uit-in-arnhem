import React from 'react';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/supabase/api';
import { ArticleEditorForm } from '@/components/admin/ArticleEditorForm';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticleBySlug(id);

  if (!article) {
    notFound();
  }

  return <ArticleEditorForm initialArticle={article} isNew={false} />;
}
