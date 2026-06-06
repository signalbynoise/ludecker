'use client';

import { ArticleBody } from '@ludecker/ui';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { DocsPageShell } from '@/components/DocsPageShell';
import { HomeIntroReveal } from '@/components/HomeIntroReveal';
import { SITE_CONFIG } from '@/lib/constants';

const homeRouteApi = getRouteApi('/public/');

export function HomePage() {
  const { home, pageContext } = homeRouteApi.useLoaderData();

  useEffect(() => {
    document.title = SITE_CONFIG.name;
  }, []);

  return (
    <DocsPageShell pageContext={pageContext}>
      <HomeIntroReveal>
        <ArticleBody content={home.content} articleType={home.article_type} />
      </HomeIntroReveal>
    </DocsPageShell>
  );
}
