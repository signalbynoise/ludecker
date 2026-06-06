'use client';

import type { DocsNavEntry } from '@ludecker/types';
import {
  DocsHeader,
  DocsNav,
  DocsShell,
  DocsSidebarPanel,
  ThemeToggle,
} from '@ludecker/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { resolveDocsNavActiveState } from '@/lib/nav/resolve-docs-nav-active-state';
import { normalizePathname } from '@/lib/routing/pathname';

export interface DocsChromeProps {
  children: ReactNode;
  gettingStartedEntries?: readonly DocsNavEntry[];
}

export function DocsChrome({
  children,
  gettingStartedEntries = [],
}: DocsChromeProps) {
  const pathname = normalizePathname(usePathname() || '/');
  const gettingStartedHrefs = gettingStartedEntries.map((entry) => entry.href);
  const { homeActive, activeGettingStartedHref, activeNavId, activeSection } =
    resolveDocsNavActiveState(pathname, gettingStartedHrefs);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen || !sidebarScrollRef.current) {
      return;
    }

    sidebarScrollRef.current.scrollTop = 0;
  }, [isMobileMenuOpen]);

  const sidebar = (
    <DocsSidebarPanel>
      <DocsNav
        activeId={activeNavId}
        activeGettingStartedHref={activeGettingStartedHref}
        activeSection={activeSection}
        homeActive={homeActive}
        pathname={pathname}
        gettingStartedEntries={gettingStartedEntries}
        linkComponent={Link}
      />
    </DocsSidebarPanel>
  );

  return (
    <DocsShell
      isMobileMenuOpen={isMobileMenuOpen}
      onMobileOverlayClick={() => setIsMobileMenuOpen(false)}
      sidebarScrollRef={sidebarScrollRef}
      header={
        <DocsHeader
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClick={() => setIsMobileMenuOpen((open) => !open)}
          themeToggle={<ThemeToggle />}
        />
      }
      sidebar={sidebar}
    >
      {children}
    </DocsShell>
  );
}
