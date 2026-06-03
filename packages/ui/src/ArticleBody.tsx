import type { ArticleType } from '@ludecker/types';
import { parseArticleBodyBlocks } from '@ludecker/utils';
import { TEXT_BODY_CLASS } from './constants';
import { ArticleInlineText } from './ArticleInlineText';
import { ArticleMermaidDiagram } from './ArticleMermaidDiagram';
import { ContentSection } from './ContentSection';

export interface ArticleBodyProps {
  content: string;
  articleType?: ArticleType;
}

export function ArticleBody({ content, articleType }: ArticleBodyProps) {
  const mermaid = articleType === 'diagrams';
  const blocks = parseArticleBodyBlocks(content, { mermaid });

  return (
    <article className={`${TEXT_BODY_CLASS} article-body`} data-article-type={articleType}>
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`;

        if (block.type === 'heading') {
          return (
            <ContentSection
              key={key}
              heading={block.text}
              body=""
              headingOnly
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
