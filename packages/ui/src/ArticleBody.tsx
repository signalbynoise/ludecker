import type { ArticleType } from '@ludecker/types';
import { extractArticleTocItems, parseArticleBodyBlocks, splitEditorialLine } from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';
import { ArticleInlineText } from './ArticleInlineText';
import { ArticleMermaidDiagram } from './ArticleMermaidDiagram';
import { ContentSection } from './ContentSection';
import { SkillArticleBody } from './SkillArticleBody';

export interface ArticleBodyProps {
  content: string;
  articleType?: ArticleType;
}

function isChapterHeading(text: string): boolean {
  return splitEditorialLine(text)?.prefix === 'C:';
}

export function ArticleBody({ content, articleType }: ArticleBodyProps) {
  if (articleType === 'skills') {
    return <SkillArticleBody content={content} />;
  }

  const mermaid = articleType === 'diagrams';
  const blocks = parseArticleBodyBlocks(content, { mermaid });
  const tocItems = extractArticleTocItems(content, articleType);
  let chapterIndex = 0;

  return (
    <article className={`${TEXT_BODY_CLASS} article-body`} data-article-type={articleType}>
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`;

        if (block.type === 'heading') {
          const anchorId = isChapterHeading(block.text)
            ? tocItems[chapterIndex++]?.id
            : undefined;

          return (
            <ContentSection
              key={key}
              heading={block.text}
              body=""
              headingOnly
              anchorId={anchorId}
            />
          );
        }

        if (block.type === 'mermaid') {
          return (
            <ArticleMermaidDiagram key={key} source={block.source} />
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
