import './ContentSection.css';

export interface ContentSectionProps {
  heading: string;
  body: string;
  headingOnly?: boolean;
}

export function ContentSection({ heading, body, headingOnly = false }: ContentSectionProps) {
  return (
    <section className="content-section">
      <h2 className="content-section__heading">{heading}</h2>
      {!headingOnly && body.length > 0 ? (
        <p className="content-section__body">{body}</p>
      ) : null}
    </section>
  );
}
