'use client';

import { RawMarkdownView } from '@ludecker/ui';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';

const rawMarkdownRouteApi = getRouteApi('/$type/$slug/raw');

export function RawMarkdownPage() {
  const { title, markdown } = rawMarkdownRouteApi.useLoaderData();

  useEffect(() => {
    document.title = `${title} · Markdown · Lüdecker`;
  }, [title]);

  return <RawMarkdownView title={title} markdown={markdown} />;
}
