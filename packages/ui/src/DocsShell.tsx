import type { ReactNode, Ref } from 'react';

export interface DocsShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  hero?: ReactNode;
  tableOfContents?: ReactNode;
  children: ReactNode;
  isMobileMenuOpen: boolean;
  onMobileOverlayClick: () => void;
  sidebarScrollRef?: Ref<HTMLDivElement>;
}

export function DocsShell({
  header,
  sidebar,
  hero,
  tableOfContents,
  children,
  isMobileMenuOpen,
  onMobileOverlayClick,
  sidebarScrollRef,
}: DocsShellProps) {
  const sidebarClassName = isMobileMenuOpen
    ? 'docs-shell__sidebar docs-shell__sidebar--mobile-open'
    : 'docs-shell__sidebar';

  return (
    <div className="docs-shell">
      {header}
      <div className="docs-shell__body">
        {isMobileMenuOpen ? (
          <button
            type="button"
            className="docs-shell__overlay"
            aria-label="Close menu"
            onClick={onMobileOverlayClick}
          />
        ) : null}
        <div className="docs-shell__stage">
          <div className="docs-shell__frame">
            <aside className={sidebarClassName} aria-hidden={false}>
              <div ref={sidebarScrollRef} className="docs-shell__sidebar-scroll">
                {sidebar}
              </div>
            </aside>
            <main className="docs-shell__main">
              <div className="docs-shell__page">
                {hero ? <div className="docs-shell__hero">{hero}</div> : null}
                <div className="docs-shell__content">{children}</div>
              </div>
            </main>
            {tableOfContents ? (
              <aside className="docs-shell__toc" aria-label="On this page">
                {tableOfContents}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
