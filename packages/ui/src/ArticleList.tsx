import type { Content } from '@ludecker/types';
import { getArticlePrefix, getContentPublicPath } from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';

export interface ArticleListItem {
  content: Pick<Content, 'slug' | 'title' | 'article_type'>;
  index: number;
}

export interface ArticleListProps {
  items: ArticleListItem[];
}

export function ArticleList({ items }: ArticleListProps) {
  return (
    <ul className="article-list">
      {items.map(({ content, index }) => (
        <li key={content.slug} className="article-list__item">
          <a
            className={`${TEXT_BODY_CLASS} article-list__link`}
            href={getContentPublicPath(content.article_type, content.slug)}
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
