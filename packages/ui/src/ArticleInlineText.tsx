import { parseContentLinkSegments } from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';

export interface ArticleInlineTextProps {
  text: string;
  className?: string;
}

function joinClasses(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function ArticleInlineText({ text, className }: ArticleInlineTextProps) {
  const segments = parseContentLinkSegments(text);

  return (
    <span className={joinClasses(TEXT_BODY_CLASS, className)}>
      {segments.map((segment, index) => {
        const key = `segment-${index}`;

        if (segment.type === 'link') {
          return (
            <a
              key={key}
              className="article-inline-text__link"
              href={segment.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {segment.label}
            </a>
          );
        }

        return <span key={key}>{segment.value}</span>;
      })}
    </span>
  );
}
