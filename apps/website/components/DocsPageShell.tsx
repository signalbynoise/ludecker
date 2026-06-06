'use client';

import type { ReactNode } from 'react';
import type { PageContext } from '@/lib/content/fetch-page-context';
import { DocsPageSurface } from '@/components/DocsPageSurface';

export interface DocsPageShellProps {
  pageContext: PageContext;
  toolbar?: ReactNode;
  pageActions?: ReactNode;
  children: ReactNode;
}

export function DocsPageShell({
  pageContext,
  toolbar,
  pageActions,
  children,
}: DocsPageShellProps) {
  return (
    <DocsPageSurface
      hero={pageContext.hero}
      toc={pageContext.toc}
      toolbar={toolbar}
      pageActions={pageActions}
    >
      {children}
    </DocsPageSurface>
  );
}
