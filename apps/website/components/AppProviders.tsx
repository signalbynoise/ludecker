'use client';

import {
  DocsNavProvider,
  ThemeProvider,
  Toaster,
  TooltipProvider,
  type DocsNavSectionOverrides,
} from '@ludecker/ui';
import type { ReactNode } from 'react';

export interface AppProvidersProps {
  children: ReactNode;
  initialNavOverrides?: DocsNavSectionOverrides;
}

export function AppProviders({ children, initialNavOverrides }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <DocsNavProvider initialOverrides={initialNavOverrides}>
          {children}
        </DocsNavProvider>
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
