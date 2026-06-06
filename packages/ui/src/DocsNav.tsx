'use client';

import { createLogger } from '@ludecker/utils';
import { useLayoutEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { NAV_ITEMS } from '@ludecker/types';
import { TEXT_BODY_SM_CLASS } from './constants';
import type { DocsNavEntry } from '@ludecker/types';
import {
  DOCS_NAV_ALL_SECTION_TITLES,
  DOCS_NAV_GETTING_STARTED,
  DOCS_NAV_SECTIONS,
} from './docs-nav-config';
import {
  buildOpenSnapshot,
  findCollapsedSections,
  pathnameMatchesNavEntry,
  resolveActiveSectionTitle,
} from './docs-nav-state';
import { useDocsNav } from './DocsNavProvider';

export { DOCS_NAV_GETTING_STARTED, DOCS_NAV_SECTIONS, type DocsNavSection } from './docs-nav-config';

const logger = createLogger('docs-nav', 'debug');

export interface DocsNavProps {
  activeId?: string;
  homeActive?: boolean;
  pathname?: string;
  gettingStartedEntries?: readonly DocsNavEntry[];
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
      <div className="docs-nav__section-items" data-state={isExpanded ? 'open' : 'closed'}>
        <div className="docs-nav__section-items-inner">{children}</div>
      </div>
    </div>
  );
}

export function DocsNav({
  activeId,
  homeActive = false,
  pathname = '/',
  gettingStartedEntries = [],
}: DocsNavProps) {
  const { overrides, isSectionOpen, toggleSection, persistCurrentSections, syncSectionsForRoute } =
    useDocsNav();
  const gettingStartedHrefs = gettingStartedEntries.map((entry) => entry.href);
  const activeSection = resolveActiveSectionTitle(activeId, {
    homeActive,
    pathname,
    gettingStartedHrefs,
  });
  const stableOpenRef = useRef(buildOpenSnapshot(overrides, activeSection));
  const previousActiveSectionRef = useRef<string | undefined>(activeSection);

  const renderOpenSnapshot = Object.fromEntries(
    DOCS_NAV_ALL_SECTION_TITLES.map((title) => [title, isSectionOpen(title, activeSection)]),
  );

  const renderCollapsed = findCollapsedSections(stableOpenRef.current, renderOpenSnapshot);
  if (renderCollapsed.length > 0) {
    logger.warn('render', 'transient-auto-collapse-before-sync', {
      activeSection,
      previousActiveSection: previousActiveSectionRef.current,
      collapsed: renderCollapsed,
      stableOpen: stableOpenRef.current,
      renderOpen: renderOpenSnapshot,
      overrides,
    });
  }

  useLayoutEffect(() => {
    const outgoingSection = previousActiveSectionRef.current;
    const openBeforeSync = { ...stableOpenRef.current };

    logger.debug('layout-sync', 'start', {
      outgoingSection,
      incomingSection: activeSection,
      openBeforeSync,
      overrides,
    });

    if (outgoingSection !== undefined && outgoingSection !== activeSection) {
      flushSync(() => {
        persistCurrentSections(outgoingSection);
      });
    }

    syncSectionsForRoute(activeSection);

    const openAfterSync = Object.fromEntries(
      DOCS_NAV_ALL_SECTION_TITLES.map((title) => [title, isSectionOpen(title, activeSection)]),
    );

    const collapsedAfterSync = findCollapsedSections(openBeforeSync, openAfterSync);
    if (collapsedAfterSync.length > 0) {
      logger.error('layout-sync', 'auto-collapse-after-sync', {
        outgoingSection,
        incomingSection: activeSection,
        collapsed: collapsedAfterSync,
        openBeforeSync,
        openAfterSync,
        overrides,
      });
    }

    stableOpenRef.current = openAfterSync;
    previousActiveSectionRef.current = activeSection;

    logger.debug('layout-sync', 'complete', {
      outgoingSection,
      incomingSection: activeSection,
      openAfterSync,
    });
  }, [activeSection, isSectionOpen, persistCurrentSections, syncSectionsForRoute]);

  const handleNavLinkClick = () => {
    const outgoingSection = activeSection;

    logger.debug('link-click', 'persist-before-navigation', {
      outgoingSection,
      stableOpen: stableOpenRef.current,
      overrides,
    });

    flushSync(() => {
      persistCurrentSections(outgoingSection);
    });
  };

  return (
    <nav className="docs-nav" aria-label="Documentation">
      <ExpandableSection
        title={DOCS_NAV_GETTING_STARTED}
        isExpanded={isSectionOpen(DOCS_NAV_GETTING_STARTED, activeSection)}
        onToggle={() => toggleSection(DOCS_NAV_GETTING_STARTED, activeSection)}
      >
        <a
          className={
            homeActive
              ? `${TEXT_BODY_SM_CLASS} docs-nav__link docs-nav__link--active`
              : `${TEXT_BODY_SM_CLASS} docs-nav__link`
          }
          href="/"
          aria-current={homeActive ? 'page' : undefined}
          onClick={handleNavLinkClick}
        >
          Introduction
        </a>
        {gettingStartedEntries.map((entry) => {
          const isActive = pathnameMatchesNavEntry(pathname, entry.href);
          return (
            <a
              key={entry.slug}
              className={
                isActive
                  ? `${TEXT_BODY_SM_CLASS} docs-nav__link docs-nav__link--active`
                  : `${TEXT_BODY_SM_CLASS} docs-nav__link`
              }
              href={entry.href}
              aria-current={isActive ? 'page' : undefined}
              onClick={handleNavLinkClick}
            >
              {entry.label}
            </a>
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
            isExpanded={isSectionOpen(section.title, activeSection)}
            onToggle={() => toggleSection(section.title, activeSection)}
          >
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <a
                  key={item.id}
                  className={
                    isActive
                      ? `${TEXT_BODY_SM_CLASS} docs-nav__link docs-nav__link--active`
                      : `${TEXT_BODY_SM_CLASS} docs-nav__link`
                  }
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={handleNavLinkClick}
                >
                  {item.label}
                </a>
              );
            })}
          </ExpandableSection>
        );
      })}
    </nav>
  );
}
