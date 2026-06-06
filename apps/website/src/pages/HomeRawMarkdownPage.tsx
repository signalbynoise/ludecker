'use client';

import { RawMarkdownView } from '@ludecker/ui';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';

const homeRawMarkdownRouteApi = getRouteApi('/raw');

export function HomeRawMarkdownPage() {
  const { title, markdown } = homeRawMarkdownRouteApi.useLoaderData();

  useEffect(() => {
    document.title = `${title} · Markdown · Lüdecker`;
  }, [title]);

  return <RawMarkdownView title={title} markdown={markdown} />;
}
