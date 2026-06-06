'use client';

import type { ReactNode } from 'react';
import { TEXT_BODY_SM_CLASS } from './constants';

export interface DocsSearchFieldProps {
  children: ReactNode;
  className?: string;
}

/** Shared pill shell for Command Central trigger and modal input. */
export function DocsSearchField({ children, className }: DocsSearchFieldProps) {
  const classes = [TEXT_BODY_SM_CLASS, 'docs-search-field', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
