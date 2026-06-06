import { extractArticleTocItems, parseContentLinkSegments, parseSkillBodyBlocks, parseSkillFile } from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';
import { ContentSection } from './ContentSection';
import { ArticleInlineText } from './ArticleInlineText';
import './SkillArticleBody.css';

export interface SkillArticleBodyProps {
  content: string;
}

function SkillParagraph({ text }: { text: string }) {
  const segments = parseContentLinkSegments(text);

  return (
    <p className={`${TEXT_BODY_CLASS} skill-article-body__paragraph`}>
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
    </p>
  );
}

export function SkillArticleBody({ content }: SkillArticleBodyProps) {
  const parsed = parseSkillFile(content);

  if (!parsed) {
    return (
      <article className="skill-article-body">
        <pre className="skill-article-body__source">{content}</pre>
      </article>
    );
  }

  const { frontmatter, body, raw } = parsed;
  const blocks = parseSkillBodyBlocks(body);
  const tocItems = extractArticleTocItems(content, 'skills');
  let headingIndex = 0;
  const displayName = frontmatter.name ?? 'skill';
  const description = frontmatter.description ?? '';

  return (
    <article className="skill-article-body" data-skill-name={displayName}>
      <header className="skill-article-body__meta">
        <p className="skill-article-body__label">Agent Skill</p>
        <p className="skill-article-body__name">{displayName}</p>
        {description.length > 0 ? (
          <p className={`${TEXT_BODY_CLASS} skill-article-body__description`}>
            {description}
          </p>
        ) : null}
      </header>

      <details className="skill-article-body__source-wrap">
        <summary className="skill-article-body__source-summary">SKILL.md source</summary>
        <pre className="skill-article-body__source">{raw}</pre>
      </details>

      <div className="skill-article-body__instructions">
        {blocks.map((block, blockIndex) => {
          const key = `${block.type}-${blockIndex}`;

          if (block.type === 'heading') {
            return (
              <ContentSection
                key={key}
                heading={block.text}
                body=""
                headingOnly
                anchorId={tocItems[headingIndex++]?.id}
              />
            );
          }

          if (block.type === 'code') {
            return (
              <pre key={key} className="skill-article-body__code">
                <code>{block.source}</code>
              </pre>
            );
          }

          return <SkillParagraph key={key} text={block.text} />;
        })}
      </div>
    </article>
  );
}
