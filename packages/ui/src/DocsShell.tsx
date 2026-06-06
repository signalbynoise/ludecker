'use client';

import type { ReactNode, Ref } from 'react';
import { Button } from './components/ui/button';

export interface DocsShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  isMobileMenuOpen: boolean;
  onMobileOverlayClick: () => void;
  sidebarScrollRef?: Ref<HTMLDivElement>;
}

export function DocsShell({
  header,
  sidebar,
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
          <Button
            type="button"
            variant="ghost"
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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
