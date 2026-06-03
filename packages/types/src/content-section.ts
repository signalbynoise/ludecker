import { ARTICLE_TYPES, type ArticleType, type Content } from './article-type';

export const SECTION_PAGE_SLUG = 'index' as const;

export type ContentKind = 'page' | 'entry';

export function isSectionPage(
  content: Pick<Content, 'article_type' | 'slug'>,
): boolean {
  if (content.article_type === 'home') {
    return true;
  }

  return content.slug === SECTION_PAGE_SLUG;
}

export function getContentKind(
  content: Pick<Content, 'article_type' | 'slug'>,
): ContentKind {
  return isSectionPage(content) ? 'page' : 'entry';
}

export function getSectionLabel(articleType: ArticleType): string {
  const option = ARTICLE_TYPES.find((entry) => entry.value === articleType);
  return option?.label ?? articleType;
}

export function compareContentForAdmin(
  left: Pick<Content, 'article_type' | 'slug' | 'updated_at'>,
  right: Pick<Content, 'article_type' | 'slug' | 'updated_at'>,
): number {
  const leftIsPage = isSectionPage(left) ? 0 : 1;
  const rightIsPage = isSectionPage(right) ? 0 : 1;

  if (leftIsPage !== rightIsPage) {
    return leftIsPage - rightIsPage;
  }

  return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
}
