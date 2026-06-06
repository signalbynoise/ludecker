'use client';

import type { DocsNavEntry } from '@ludecker/types';
import {
  DocsHeader,
  DocsHero,
  DocsNav,
  DocsShell,
  DocsSidebarPanel,
  DocsTableOfContents,
  ThemeToggle,
  type DocsTableOfContentsItem,
} from '@ludecker/ui';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { resolveActiveNavId, resolveHomeActive } from '@/lib/nav/resolve-active-nav-id';

export interface DocsChromeProps {
  children: ReactNode;
  heroTitle: string;
  heroDescription?: string;
  tocItems?: DocsTableOfContentsItem[];
  gettingStartedEntries?: readonly DocsNavEntry[];
}

export function DocsChrome({
  children,
  heroTitle,
  heroDescription,
  tocItems = [],
  gettingStartedEntries = [],
}: DocsChromeProps) {
  const pathname = usePathname();
  const activeNavId = resolveActiveNavId(pathname);
  const homeActive = resolveHomeActive(pathname);
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
        homeActive={homeActive}
        pathname={pathname}
        gettingStartedEntries={gettingStartedEntries}
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
      hero={
        <DocsHero title={heroTitle} description={heroDescription} />
      }
      tableOfContents={<DocsTableOfContents items={tocItems} />}
    >
      {children}
    </DocsShell>
  );
}
