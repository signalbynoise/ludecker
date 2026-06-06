import { DocsContent, DocsHero, DocsTableOfContents } from '@ludecker/ui';
import type { PageHero, PageTocItem } from '@ludecker/utils';
import type { ReactNode } from 'react';

export interface DocsPageSurfaceProps {
  hero: PageHero;
  toc: PageTocItem[];
  children: ReactNode;
}

/**
 * Server-rendered page chrome (hero + TOC) mounted per route via DocsPageShell.
 * Sidebar stays in layout; this surface updates with the active page.
 */
export function DocsPageSurface({ hero, toc, children }: DocsPageSurfaceProps) {
  return (
    <>
      <main className="docs-shell__main">
        <div className="docs-shell__page">
          <div className="docs-shell__hero">
            <DocsHero title={hero.title} description={hero.description} />
          </div>
          <div className="docs-shell__content">
            <DocsContent>{children}</DocsContent>
          </div>
        </div>
      </main>
      {toc.length > 0 ? (
        <aside className="docs-shell__toc" aria-label="On this page">
          <DocsTableOfContents items={toc} />
        </aside>
      ) : null}
    </>
  );
}
