'use client';

import type { DocsNavEntry } from '@ludecker/types';
import type { ReactNode } from 'react';
import { DocsIntroBridge } from '@/components/DocsIntroBridge';
import { DocsChrome } from '@/components/DocsChrome';

export interface PublicDocsLayoutClientProps {
  children: ReactNode;
  gettingStartedEntries: readonly DocsNavEntry[];
}

/**
 * Persistent docs shell — sidebar and header stay mounted across client navigations.
 * Hero and TOC live in DocsPageShell (per-route server) and remount with each page.
 */
export function PublicDocsLayoutClient({
  children,
  gettingStartedEntries,
}: PublicDocsLayoutClientProps) {
  return (
    <>
      <DocsIntroBridge />
      <DocsChrome gettingStartedEntries={gettingStartedEntries}>
        {children}
      </DocsChrome>
    </>
  );
}
