import {
  resolveContentSectionVariant,
  splitEditorialLine,
  type ContentSectionVariant,
} from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';
import { ArticleInlineText } from './ArticleInlineText';

export interface ContentSectionProps {
  heading: string;
  body: string;
  headingOnly?: boolean;
}

function sectionClassName(variant: ContentSectionVariant): string {
  return `content-section content-section--${variant}`;
}

export function ContentSection({
  heading,
  body,
  headingOnly = false,
}: ContentSectionProps) {
  const parts = splitEditorialLine(heading);
  const variant = parts
    ? resolveContentSectionVariant(parts.prefix)
    : 'default';

  return (
    <section className={sectionClassName(variant)}>
      <h2 className={`${TEXT_BODY_CLASS} content-section__heading`}>
        {parts ? (
          <>
            <span className="content-section__prefix">{parts.prefix}</span>
            {parts.body.length > 0 ? (
              <>
                {' '}
                <ArticleInlineText
                  className="content-section__heading-text"
                  text={parts.body}
                />
              </>
            ) : null}
          </>
        ) : (
          <ArticleInlineText
            className="content-section__heading-text"
            text={heading}
          />
        )}
      </h2>
      {!headingOnly && body.length > 0 ? (
        <p className={`${TEXT_BODY_CLASS} content-section__body`}>
          <ArticleInlineText text={body} />
        </p>
      ) : null}
    </section>
  );
}
