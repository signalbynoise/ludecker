export interface DocsHeroProps {
  title: string;
  description?: string;
}

export function DocsHero({ title, description }: DocsHeroProps) {
  return (
    <section className="docs-hero">
      <div className="docs-hero__inner">
        <h1 className="docs-hero__title text-display-xl">{title}</h1>
        {description ? (
          <p className="docs-hero__description text-body">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
