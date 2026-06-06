import type { ReactNode } from 'react';
import { BRAND_NAME } from './constants';

export interface DocsHeaderProps {
  onMobileMenuClick: () => void;
  isMobileMenuOpen: boolean;
  themeToggle: ReactNode;
  brandHref?: string;
}

export function DocsHeader({
  onMobileMenuClick,
  isMobileMenuOpen,
  themeToggle,
  brandHref = '/',
}: DocsHeaderProps) {
  return (
    <header className="docs-header">
      <div className="docs-header__inner">
        <div className="docs-header__start">
          <a className="docs-header__brand text-display-md" href={brandHref}>
            {BRAND_NAME}
          </a>
        </div>
        <div className="docs-header__end">
          {themeToggle}
          <button
            type="button"
            className="docs-header__icon-btn docs-header__icon-btn--mobile"
            onClick={onMobileMenuClick}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
