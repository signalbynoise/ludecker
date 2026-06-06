import { getSectionLabel, type ArticleType } from '@ludecker/types';
import {
  createLogger,
  extractArticleTocItems,
  extractSectionListTocItems,
  mapContentToPageHero,
  type PageHero,
  type PageTocItem,
} from '@ludecker/utils';
import { resolveArticleTypeFromRouteSegment } from '@/lib/content/article-types';
import { FALLBACK_ARTICLES, FALLBACK_HOME } from '@/lib/content/fallback';
import {
  fetchContentBySlug,
  fetchHomePageContent,
  fetchSectionEntries,
  fetchSectionPage,
} from '@/lib/content/queries';
import { SITE_CONFIG } from '@/lib/constants';
import { normalizePathname } from '@/lib/routing/pathname';

const log = createLogger('content:page-context');

export interface PageContext {
  hero: PageHero;
  toc: PageTocItem[];
}

function siteFallback(): PageHero {
  return {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  };
}

function sectionFallback(articleType: Exclude<ArticleType, 'home'>): PageHero {
  const label = getSectionLabel(articleType);
  return {
    title: label,
    description: SITE_CONFIG.description,
  };
}

export async function fetchPageContext(pathname: string): Promise<PageContext> {
  const normalized = normalizePathname(pathname);

  log.debug('fetchPageContext', 'start', { pathname: normalized });

  if (normalized === '/') {
    const home = await fetchHomePageContent();
    const content = home ?? FALLBACK_HOME;
    const context = {
      hero: mapContentToPageHero(content, siteFallback()),
      toc: extractArticleTocItems(content.content, content.article_type),
    };
    log.debug('fetchPageContext', 'success', { pathname: normalized, source: 'home' });
    return context;
  }

  const segments = normalized.slice(1).split('/').filter(Boolean);
  const typeSegment = segments[0];
  const articleType = resolveArticleTypeFromRouteSegment(typeSegment ?? '');

  if (!articleType || articleType === 'home') {
    log.debug('fetchPageContext', 'success', { pathname: normalized, source: 'fallback' });
    return { hero: siteFallback(), toc: [] };
  }

  if (segments.length === 1) {
    const [section, items] = await Promise.all([
      fetchSectionPage(articleType),
      fetchSectionEntries(articleType),
    ]);

    const rows =
      items.length > 0
        ? items
        : FALLBACK_ARTICLES.filter((entry) => entry.article_type === articleType);

    const context = {
      hero: mapContentToPageHero(
        section ?? {
          title: getSectionLabel(articleType),
          excerpt: null,
          seo_description: null,
        },
        sectionFallback(articleType),
      ),
      toc: extractSectionListTocItems(rows),
    };

    log.debug('fetchPageContext', 'success', {
      pathname: normalized,
      source: 'section',
      articleType,
    });
    return context;
  }

  if (segments.length >= 2) {
    const slug = segments[1] ?? '';
    const content = await fetchContentBySlug(articleType, slug);
    if (content) {
      const context = {
        hero: mapContentToPageHero(content, {
          title: content.title,
          description: SITE_CONFIG.description,
        }),
        toc: extractArticleTocItems(content.content, content.article_type),
      };
      log.debug('fetchPageContext', 'success', {
        pathname: normalized,
        source: 'entry',
        articleType,
        slug,
      });
      return context;
    }
  }

  log.debug('fetchPageContext', 'success', { pathname: normalized, source: 'fallback' });
  return { hero: siteFallback(), toc: [] };
}
