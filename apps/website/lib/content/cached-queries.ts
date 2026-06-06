import { cache } from 'react';
import { fetchPageContext } from '@/lib/content/fetch-page-context';

export {
  getContentBySlug,
  getGettingStartedEntries,
  getHomePageContent,
  getSectionEntries,
  getSectionPage,
} from '@/lib/content/query-cache';

export const getPageContext = cache(fetchPageContext);
