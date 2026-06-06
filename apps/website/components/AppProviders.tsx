'use client';

import { DocsNavProvider, ThemeProvider, type DocsNavSectionOverrides } from '@ludecker/ui';
import type { ReactNode } from 'react';

export interface AppProvidersProps {
  children: ReactNode;
  initialNavOverrides?: DocsNavSectionOverrides;
}

export function AppProviders({ children, initialNavOverrides }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <DocsNavProvider initialOverrides={initialNavOverrides}>{children}</DocsNavProvider>
    </ThemeProvider>
  );
}
