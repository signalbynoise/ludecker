import { DocsContent, DocsHero, DocsTableOfContents } from '@ludecker/ui';
import type { PageHero, PageTocItem } from '@ludecker/utils';
import type { ReactNode } from 'react';

export interface DocsPageSurfaceProps {
  hero: PageHero;
  toc: PageTocItem[];
  toolbar?: ReactNode;
  pageActions?: ReactNode;
  children: ReactNode;
}

/**
 * Server-rendered page chrome (hero + TOC) mounted per route via DocsPageShell.
 * Sidebar stays in layout; this surface updates with the active page.
 */
export function DocsPageSurface({
  hero,
  toc,
  toolbar,
  pageActions,
  children,
}: DocsPageSurfaceProps) {
  const showAside = toc.length > 0 || Boolean(pageActions);

  return (
    <>
      <main className="docs-shell__main">
        <div className="docs-shell__page">
          {toolbar ? <div className="docs-shell__toolbar">{toolbar}</div> : null}
          <div className="docs-shell__hero">
            <DocsHero title={hero.title} description={hero.description} />
          </div>
          <div className="docs-shell__content">
            <DocsContent>{children}</DocsContent>
          </div>
        </div>
      </main>
      {showAside ? (
        <aside className="docs-shell__toc" aria-label="On this page">
          {toc.length > 0 ? <DocsTableOfContents items={toc} /> : null}
          {pageActions}
        </aside>
      ) : null}
    </>
  );
}
