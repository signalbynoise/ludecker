import type { ArticleType, Content } from '@ludecker/types';
import { NAV_ITEMS, SECTION_PAGE_SLUG } from '@ludecker/types';

/** Two-letter editorial code from section name, e.g. articles → AR, guides → GU. */
export function getArticleTypeCode(articleType: ArticleType): string {
  return articleType.slice(0, 2).toUpperCase();
}

export function getArticlePrefix(articleType: ArticleType, index: number): string {
  return `${getArticleTypeCode(articleType)}${index}:`;
}

export function sortContentByPublishedAt<T extends Pick<Content, 'published_at'>>(
  items: T[],
): T[] {
  return [...items].sort((left, right) => {
    const leftTime = left.published_at ? new Date(left.published_at).getTime() : 0;
    const rightTime = right.published_at ? new Date(right.published_at).getTime() : 0;

    return rightTime - leftTime;
  });
}

export function getNavHref(articleType: ArticleType): string {
  if (articleType === 'home') {
    return '/';
  }

  const navItem = NAV_ITEMS.find((item) => item.articleType === articleType);
  return navItem?.href ?? `/${articleType}`;
}

export function getContentPublicPath(
  articleType: ArticleType,
  slug: string,
): string {
  if (articleType === 'home') {
    return '/';
  }

  if (slug === SECTION_PAGE_SLUG) {
    return getNavHref(articleType);
  }

  return `${getNavHref(articleType)}/${slug}`;
}
