'use client';

import { DOCS_NAV_OVERRIDES_COOKIE } from '@ludecker/ui';
import { Outlet } from '@tanstack/react-router';
import { AppProviders } from '@/components/AppProviders';
import { parseDocsNavOverridesCookie } from '@/lib/nav/parse-docs-nav-overrides-cookie';

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function RootLayout() {
  const initialNavOverrides = parseDocsNavOverridesCookie(
    readCookie(DOCS_NAV_OVERRIDES_COOKIE),
  );

  return (
    <AppProviders initialNavOverrides={initialNavOverrides}>
      <Outlet />
    </AppProviders>
  );
}
