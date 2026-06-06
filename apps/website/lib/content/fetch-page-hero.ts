import { createLogger, type PageHero } from '@ludecker/utils';
import { fetchPageContext } from '@/lib/content/fetch-page-context';

const log = createLogger('content:page-hero');

export async function fetchPageHero(pathname: string): Promise<PageHero> {
  log.debug('fetchPageHero', 'start', { pathname });
  const { hero } = await fetchPageContext(pathname);
  log.debug('fetchPageHero', 'success', { pathname });
  return hero;
}
