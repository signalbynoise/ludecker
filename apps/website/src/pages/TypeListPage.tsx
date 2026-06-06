'use client';

import { ARTICLE_TYPES } from '@ludecker/types';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AnimatedArticleList } from '@/components/AnimatedArticleList';
import { DocsPageShell } from '@/components/DocsPageShell';

const sectionRouteApi = getRouteApi('/public/$type');

export function TypeListPage() {
  const { articleType, typeSegment, rows, pageContext } =
    sectionRouteApi.useLoaderData();

  useEffect(() => {
    const label =
      ARTICLE_TYPES.find((option) => option.value === articleType)?.label ??
      articleType;
    document.title = `${label} · Lüdecker`;
  }, [articleType]);

  return (
    <DocsPageShell pageContext={pageContext}>
      <AnimatedArticleList
        items={rows.map((content, index) => ({
          content,
          index: index + 1,
        }))}
      />
    </DocsPageShell>
  );
}
