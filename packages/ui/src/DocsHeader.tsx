'use client';

import type { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
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
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="docs-header__icon-btn docs-header__icon-btn--mobile"
            onClick={onMobileMenuClick}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}
