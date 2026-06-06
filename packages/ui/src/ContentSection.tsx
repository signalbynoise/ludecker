import { TEXT_BODY_CLASS } from './constants';
import { ArticleInlineText } from './ArticleInlineText';

export interface ContentSectionProps {
  heading: string;
  body: string;
  headingOnly?: boolean;
  anchorId?: string;
}

export function ContentSection({
  heading,
  body,
  headingOnly = false,
  anchorId,
}: ContentSectionProps) {
  return (
    <section className="content-section">
      <h2
        id={anchorId}
        className={`${TEXT_BODY_CLASS} content-section__heading`}
      >
        <ArticleInlineText
          className="content-section__heading-text"
          text={heading}
        />
      </h2>
      {!headingOnly && body.length > 0 ? (
        <p className={`${TEXT_BODY_CLASS} content-section__body`}>
          <ArticleInlineText text={body} />
        </p>
      ) : null}
    </section>
  );
}
