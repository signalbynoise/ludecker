'use client';

import type { DocsNavEntry } from '@ludecker/types';
import {
  DocsHeader,
  DocsNav,
  DocsSearch,
  DocsShell,
  DocsSidebarPanel,
  ThemeToggle,
  type DocsNavLinkComponent,
  type DocsNavLinkProps,
} from '@ludecker/ui';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { publicSearchIndexQueryOptions } from '@/src/lib/query/queries';
import { RouterLink } from '@/components/RouterLink';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
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
  const locationPathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const pathname = normalizePathname(locationPathname || '/');
  const gettingStartedHrefs = gettingStartedEntries.map((entry) => entry.href);
  const { homeActive, activeGettingStartedHref, activeNavId, activeSection } =
    resolveDocsNavActiveState(pathname, gettingStartedHrefs);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: searchItems = [] } = useQuery(publicSearchIndexQueryOptions());

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const mobileNavLinkComponent = useCallback<DocsNavLinkComponent>(
    (props: DocsNavLinkProps) => (
      <RouterLink {...props} onClick={closeMobileMenu} />
    ),
    [closeMobileMenu],
  );

  const sidebar = (
    <DocsSidebarPanel>
      <DocsNav
        activeId={activeNavId}
        activeGettingStartedHref={activeGettingStartedHref}
        activeSection={activeSection}
        homeActive={homeActive}
        pathname={pathname}
        gettingStartedEntries={gettingStartedEntries}
        linkComponent={mobileNavLinkComponent}
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
          search={
            <DocsSearch
              items={searchItems}
              onSelect={(href) => {
                setIsMobileMenuOpen(false);
                navigate({ to: href });
              }}
            />
          }
        />
      }
      sidebar={sidebar}
    >
      {children}
    </DocsShell>
  );
}
