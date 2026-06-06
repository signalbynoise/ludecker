'use client';

import { ArticleBody, ArticlePageCopyActions } from '@ludecker/ui';
import { formatArticleMarkdown } from '@ludecker/utils';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { DocsPageShell } from '@/components/DocsPageShell';
import { HomeIntroReveal } from '@/components/HomeIntroReveal';
import { SITE_CONFIG } from '@/lib/constants';
import { HOME_PATHNAME } from '@/lib/routing/pathname';

const homeRouteApi = getRouteApi('/public/');

export function HomePage() {
  const { home, pageContext } = homeRouteApi.useLoaderData();

  useEffect(() => {
    document.title = SITE_CONFIG.name;
  }, []);

  const pageUrl = `${SITE_CONFIG.url}${HOME_PATHNAME}`;
  const markdown = formatArticleMarkdown({
    title: home.title,
    excerpt: home.excerpt,
    content: home.content,
    article_type: home.article_type,
    canonicalUrl: pageUrl,
  });

  return (
    <DocsPageShell
      pageContext={pageContext}
      pageActions={
        <ArticlePageCopyActions
          markdown={markdown}
          pageUrl={pageUrl}
          markdownViewHref="/raw"
        />
      }
    >
      <HomeIntroReveal>
        <ArticleBody content={home.content} articleType={home.article_type} />
      </HomeIntroReveal>
    </DocsPageShell>
  );
}
