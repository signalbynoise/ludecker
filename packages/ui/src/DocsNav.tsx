'use client';

import { createLogger } from '@ludecker/utils';
import { useLayoutEffect, useRef } from 'react';
import { NAV_ITEMS } from '@ludecker/types';
import { TEXT_BODY_SM_CLASS } from './constants';
import type { DocsNavEntry } from '@ludecker/types';
import { DOCS_NAV_GETTING_STARTED, DOCS_NAV_SECTIONS } from './docs-nav-config';
import { useDocsNav } from './DocsNavProvider';
import { DocsNavLink, type DocsNavLinkComponent } from './DocsNavLink';

export { DOCS_NAV_GETTING_STARTED, DOCS_NAV_SECTIONS, type DocsNavSection } from './docs-nav-config';

const logger = createLogger('docs-nav', 'debug');

export interface DocsNavProps {
  activeId?: string;
  /** Exact href of the active Getting Started entry, if any. */
  activeGettingStartedHref?: string;
  /** Section title for the current route (website-owned resolution). */
  activeSection?: string;
  homeActive?: boolean;
  pathname?: string;
  gettingStartedEntries?: readonly DocsNavEntry[];
  /** Pass `next/link` (or equivalent) to keep section state across client navigations. */
  linkComponent?: DocsNavLinkComponent;
}

interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function ExpandableSection({ title, isExpanded, onToggle, children }: ExpandableSectionProps) {
  return (
    <div className="docs-nav__section">
      <button
        type="button"
        className={`${TEXT_BODY_SM_CLASS} docs-nav__section-toggle`}
        onClick={onToggle}
        aria-expanded={isExpanded}
        suppressHydrationWarning
      >
        <svg
          className="docs-nav__chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="docs-nav__section-title">{title}</span>
      </button>
      <div
        className="docs-nav__section-items"
        data-state={isExpanded ? 'open' : 'closed'}
        suppressHydrationWarning
      >
        <div className="docs-nav__section-items-inner">{children}</div>
      </div>
    </div>
  );
}

export function DocsNav({
  activeId,
  activeGettingStartedHref,
  activeSection,
  homeActive = false,
  pathname = '/',
  gettingStartedEntries = [],
  linkComponent,
}: DocsNavProps) {
  const { isSectionOpen, toggleSection, bootstrapColdLoad, openActiveSectionForRoute } =
    useDocsNav();
  const introductionActive = homeActive && !activeGettingStartedHref;
  const hasBootstrappedRef = useRef(false);
  const previousActiveSectionRef = useRef<string | undefined>(undefined);

  useLayoutEffect(() => {
    if (previousActiveSectionRef.current === activeSection) {
      return;
    }

    const from = previousActiveSectionRef.current;
    previousActiveSectionRef.current = activeSection;

    if (!hasBootstrappedRef.current) {
      hasBootstrappedRef.current = true;
      bootstrapColdLoad(activeSection, { pathname, activeId, from, phase: 'bootstrap' });
      return;
    }

    logger.debug('route-change', 'active-section', {
      from,
      to: activeSection,
      pathname,
      activeId,
    });

    openActiveSectionForRoute(activeSection, { pathname, activeId, from });
  }, [activeId, activeSection, bootstrapColdLoad, openActiveSectionForRoute, pathname]);

  return (
    <nav className="docs-nav" aria-label="Documentation">
      <ExpandableSection
        title={DOCS_NAV_GETTING_STARTED}
        isExpanded={isSectionOpen(DOCS_NAV_GETTING_STARTED)}
        onToggle={() => toggleSection(DOCS_NAV_GETTING_STARTED)}
      >
        <DocsNavLink
          linkComponent={linkComponent}
          className={
            introductionActive
              ? `${TEXT_BODY_SM_CLASS} docs-nav__link docs-nav__link--active`
              : `${TEXT_BODY_SM_CLASS} docs-nav__link`
          }
          href="/"
          aria-current={introductionActive ? 'page' : undefined}
        >
          Introduction
        </DocsNavLink>
        {gettingStartedEntries.map((entry) => {
          const isActive = activeGettingStartedHref === entry.href;
          return (
            <DocsNavLink
              key={entry.slug}
              linkComponent={linkComponent}
              className={
                isActive
                  ? `${TEXT_BODY_SM_CLASS} docs-nav__link docs-nav__link--active`
                  : `${TEXT_BODY_SM_CLASS} docs-nav__link`
              }
              href={entry.href}
              aria-current={isActive ? 'page' : undefined}
            >
              {entry.label}
            </DocsNavLink>
          );
        })}
      </ExpandableSection>
      {DOCS_NAV_SECTIONS.map((section) => {
        const items = NAV_ITEMS.filter((item) => section.itemIds.includes(item.id));
        if (items.length === 0) return null;

        return (
          <ExpandableSection
            key={section.title}
            title={section.title}
            isExpanded={isSectionOpen(section.title)}
            onToggle={() => toggleSection(section.title)}
          >
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <DocsNavLink
                  key={item.id}
                  linkComponent={linkComponent}
                  className={
                    isActive
                      ? `${TEXT_BODY_SM_CLASS} docs-nav__link docs-nav__link--active`
                      : `${TEXT_BODY_SM_CLASS} docs-nav__link`
                  }
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </DocsNavLink>
              );
            })}
          </ExpandableSection>
        );
      })}
    </nav>
  );
}
