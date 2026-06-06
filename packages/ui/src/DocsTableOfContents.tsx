import { TEXT_BODY_SM_CLASS } from './constants';

export interface DocsTableOfContentsItem {
  id: string;
  label: string;
  href?: string;
}

export interface DocsTableOfContentsProps {
  items: DocsTableOfContentsItem[];
  title?: string;
}

export function DocsTableOfContents({
  items,
  title = 'On this page',
}: DocsTableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="docs-toc" aria-label={title}>
      <p className="docs-toc__title">{title}</p>
      <ul className="docs-toc__list">
        {items.map((item) => (
          <li key={item.id} className="docs-toc__item">
            <a
              className={`${TEXT_BODY_SM_CLASS} docs-toc__link`}
              href={item.href ?? `#${item.id}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
