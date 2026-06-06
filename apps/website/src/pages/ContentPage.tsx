'use client';

import { getSectionLabel } from '@ludecker/types';
import { ArticlePageToolbar } from '@ludecker/ui';
import { formatArticleMarkdown, getNavHref } from '@ludecker/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AnimatedArticleBody } from '@/components/AnimatedArticleBody';
import { DocsPageShell } from '@/components/DocsPageShell';
import { SITE_CONFIG } from '@/lib/constants';

const articleRouteApi = getRouteApi('/public/$type/$slug');

export function ContentPage() {
  const { articleType, item, pageContext, pathname } =
    articleRouteApi.useLoaderData();

  useEffect(() => {
    document.title = `${item.seo_title ?? item.title} · Lüdecker`;
  }, [item.seo_title, item.title]);

  const pageUrl = `${SITE_CONFIG.url}${pathname}`;
  const markdown = formatArticleMarkdown({
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    article_type: item.article_type,
    canonicalUrl: pageUrl,
  });

  return (
    <DocsPageShell
      pageContext={pageContext}
      toolbar={
        <ArticlePageToolbar
          backHref={getNavHref(articleType)}
          backLabel={getSectionLabel(articleType)}
          pageTitle={item.title}
          markdown={markdown}
          pageUrl={pageUrl}
          markdownViewHref={`${pathname}/raw`}
        />
      }
    >
      <AnimatedArticleBody content={item.content} articleType={item.article_type} />
    </DocsPageShell>
  );
}
