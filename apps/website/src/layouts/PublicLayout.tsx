'use client';

import { getRouteApi, Outlet } from '@tanstack/react-router';
import { PublicDocsLayoutClient } from '@/components/PublicDocsLayoutClient';
import { IntroAnimationProvider } from '@/lib/intro-animation/IntroAnimationContext';

const publicLayoutRouteApi = getRouteApi('/public');

export function PublicLayout() {
  const { gettingStartedEntries } = publicLayoutRouteApi.useLoaderData();

  return (
    <IntroAnimationProvider>
      <PublicDocsLayoutClient gettingStartedEntries={gettingStartedEntries}>
        <Outlet />
      </PublicDocsLayoutClient>
    </IntroAnimationProvider>
  );
}
