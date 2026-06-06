import type { Content } from '@ludecker/types';
import { getArticlePrefix, getContentPublicPath } from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';
import { DocsNavLink, type DocsNavLinkComponent } from './DocsNavLink';

export interface ArticleListItem {
  content: Pick<Content, 'slug' | 'title' | 'article_type'>;
  index: number;
}

export interface ArticleListProps {
  items: ArticleListItem[];
  /** Pass `next/link` to preserve docs shell state across client navigations. */
  linkComponent?: DocsNavLinkComponent;
}

export function ArticleList({ items, linkComponent }: ArticleListProps) {
  return (
    <ul className="article-list">
      {items.map(({ content, index }) => (
        <li key={content.slug} className="article-list__item">
          <DocsNavLink
            linkComponent={linkComponent}
            className={`${TEXT_BODY_CLASS} article-list__link`}
            href={getContentPublicPath(content.article_type, content.slug)}
          >
            <span className="article-list__prefix">
              {getArticlePrefix(content.article_type, index)}
            </span>{' '}
            {content.title}
          </DocsNavLink>
        </li>
      ))}
    </ul>
  );
}
