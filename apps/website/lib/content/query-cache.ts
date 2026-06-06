import { cache } from 'react';
import {
  fetchContentBySlug,
  fetchGettingStartedEntries,
  fetchHomePageContent,
  fetchSectionEntries,
  fetchSectionPage,
} from '@/lib/content/queries';

export const getGettingStartedEntries = cache(fetchGettingStartedEntries);
export const getHomePageContent = cache(fetchHomePageContent);
export const getContentBySlug = cache(fetchContentBySlug);
export const getSectionPage = cache(fetchSectionPage);
export const getSectionEntries = cache(fetchSectionEntries);
