'use client';

import type { DocsNavEntry } from '@ludecker/types';
import type { DocsTableOfContentsItem } from '@ludecker/ui';
import type { ReactNode } from 'react';
import { DocsChrome } from '@/components/DocsChrome';
import { DocsIntroBridge } from '@/components/DocsIntroBridge';

export interface DocsLayoutClientProps {
  children: ReactNode;
  heroTitle: string;
  heroDescription?: string;
  tocItems?: DocsTableOfContentsItem[];
  gettingStartedEntries?: readonly DocsNavEntry[];
}

export function DocsLayoutClient({
  children,
  heroTitle,
  heroDescription,
  tocItems = [],
  gettingStartedEntries = [],
}: DocsLayoutClientProps) {
  return (
    <>
      <DocsIntroBridge />
      <DocsChrome
        heroTitle={heroTitle}
        heroDescription={heroDescription}
        tocItems={tocItems}
        gettingStartedEntries={gettingStartedEntries}
      >
        {children}
      </DocsChrome>
    </>
  );
}
