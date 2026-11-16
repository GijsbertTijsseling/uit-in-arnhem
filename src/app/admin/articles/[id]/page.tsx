import React from 'react';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/supabase/api';
import { ArticleEditorForm } from '@/components/admin/ArticleEditorForm';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.id === id || a.slug === id);

  if (!article) {
    notFound();
  }

  return <ArticleEditorForm initialArticle={article} isNew={false} />;
}
