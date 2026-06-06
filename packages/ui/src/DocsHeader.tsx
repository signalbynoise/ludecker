'use client';

import type { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { BrandLogo } from './BrandLogo';

export interface DocsHeaderProps {
  onMobileMenuClick: () => void;
  isMobileMenuOpen: boolean;
  themeToggle: ReactNode;
  search?: ReactNode;
  brandHref?: string;
}

export function DocsHeader({
  onMobileMenuClick,
  isMobileMenuOpen,
  themeToggle,
  search,
  brandHref = '/',
}: DocsHeaderProps) {
  return (
    <header className="docs-header">
      <div className="docs-header__inner">
        <div className="docs-header__start">
          <BrandLogo href={brandHref} className="docs-header__brand" />
        </div>
        {search ? <div className="docs-header__center">{search}</div> : null}
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
