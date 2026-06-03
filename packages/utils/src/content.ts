import type { ArticleType, Content } from '@ludecker/types';

const ARTICLE_TYPE_PREFIX: Record<ArticleType, string> = {
  article: 'A',
  essay: 'E',
  note: 'N',
  tutorial: 'T',
  guide: 'G',
  project: 'P',
  page: 'C',
};

export function getArticlePrefix(articleType: ArticleType, index: number): string {
  const letter = ARTICLE_TYPE_PREFIX[articleType];
  return `${letter}${index}:`;
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
