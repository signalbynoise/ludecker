import type { ArticleType, Content } from '@ludecker/types';
import { getArticlePrefix } from '@ludecker/utils';
export interface ArticleListItem {
  content: Pick<Content, 'slug' | 'title' | 'article_type'>;
  index: number;
}

export interface ArticleListProps {
  items: ArticleListItem[];
  baseHref?: string;
}

function buildHref(
  articleType: ArticleType,
  slug: string,
  baseHref?: string,
): string {
  if (baseHref) {
    return `${baseHref}/${slug}`;
  }

  return `/${articleType}/${slug}`;
}

export function ArticleList({ items, baseHref }: ArticleListProps) {
  return (
    <ul className="article-list">
      {items.map(({ content, index }) => (
        <li key={content.slug} className="article-list__item">
          <a
            className="article-list__link"
            href={buildHref(content.article_type, content.slug, baseHref)}
          >
            <span className="article-list__prefix">
              {getArticlePrefix(content.article_type, index)}
            </span>{' '}
            {content.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
