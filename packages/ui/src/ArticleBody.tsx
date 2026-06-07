'use client';

import type { ReactNode } from 'react';
import type { ArticleType } from '@ludecker/types';
import {
  contentHasMermaidFences,
  extractArticleTocItems,
  parseArticleBodyBlocks,
} from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';
import { ArticleInlineText } from './ArticleInlineText';
import { ArticleMermaidDiagram } from './ArticleMermaidDiagram';
import { SkillArticleBody } from './SkillArticleBody';

export interface ArticleBodyProps {
  content: string;
  articleType?: ArticleType;
  /** When false, Mermaid blocks defer client render until true. Default true. */
  diagramReady?: boolean;
}

function renderHeading(
  text: string,
  level: 2 | 3,
  anchorId?: string,
): ReactNode {
  const className = `${TEXT_BODY_CLASS} article-body__heading article-body__heading--h${level}`;

  if (level === 3) {
    return (
      <h3 id={anchorId} className={className}>
        <ArticleInlineText text={text} />
      </h3>
    );
  }

  return (
    <h2 id={anchorId} className={className}>
      <ArticleInlineText text={text} />
    </h2>
  );
}

export function ArticleBody({
  content,
  articleType,
  diagramReady = true,
}: ArticleBodyProps) {
  if (articleType === 'skills') {
    return <SkillArticleBody content={content} />;
  }

  const mermaid =
    articleType === 'diagrams' || contentHasMermaidFences(content);
  const blocks = parseArticleBodyBlocks(content, { mermaid });
  const tocItems = extractArticleTocItems(content, articleType);
  let chapterIndex = 0;

  return (
    <article className={`${TEXT_BODY_CLASS} article-body`} data-article-type={articleType}>
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`;

        if (block.type === 'heading') {
          const anchorId =
            block.level === 2 ? tocItems[chapterIndex++]?.id : undefined;

          return (
            <div key={key}>{renderHeading(block.text, block.level, anchorId)}</div>
          );
        }

        if (block.type === 'mermaid') {
          return (
            <ArticleMermaidDiagram
              key={key}
              source={block.source}
              diagramReady={diagramReady}
            />
          );
        }

        if (block.type === 'code') {
          return (
            <pre key={key} className="article-body__code">
              <code>{block.source}</code>
            </pre>
          );
        }

        return (
          <p key={key} className={`${TEXT_BODY_CLASS} article-body__paragraph`}>
            <ArticleInlineText text={block.text} />
          </p>
        );
      })}
    </article>
  );
}
