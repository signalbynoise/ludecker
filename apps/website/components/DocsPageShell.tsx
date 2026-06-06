import type { ReactNode } from 'react';
import { getPageContext } from '@/lib/content/cached-queries';
import { DocsPageSurface } from '@/components/DocsPageSurface';

export interface DocsPageShellProps {
  /** Canonical pathname from route params — not headers. */
  pathname: string;
  children: ReactNode;
}

export async function DocsPageShell({ pathname, children }: DocsPageShellProps) {
  const { hero, toc } = await getPageContext(pathname);

  return (
    <DocsPageSurface hero={hero} toc={toc}>
      {children}
    </DocsPageSurface>
  );
}
