'use client';

import type { ReactNode } from 'react';
import type { PageContext } from '@/lib/content/fetch-page-context';
import { DocsPageSurface } from '@/components/DocsPageSurface';

export interface DocsPageShellProps {
  pageContext: PageContext;
  toolbar?: ReactNode;
  children: ReactNode;
}

export function DocsPageShell({ pageContext, toolbar, children }: DocsPageShellProps) {
  return (
    <DocsPageSurface hero={pageContext.hero} toc={pageContext.toc} toolbar={toolbar}>
      {children}
    </DocsPageSurface>
  );
}
