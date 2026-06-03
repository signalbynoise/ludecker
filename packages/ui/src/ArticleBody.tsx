import './ArticleBody.css';
import { ContentSection } from './ContentSection';

export interface ArticleBodyProps {
  content: string;
}

interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'predicate' | 'spacer';
  text: string;
}

const HEADING_PATTERN = /^([A-Z]+\d*:|FS:)\s*(.*)$/;
const PREDICATE_LABEL = 'Predicate form:';

function isHeadingLine(line: string): boolean {
  return HEADING_PATTERN.test(line.trim());
}

function parseContent(content: string): ParsedBlock[] {
  const lines = content.split('\n');
  const blocks: ParsedBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const trimmed = lines[index]?.trim() ?? '';

    if (trimmed.length === 0) {
      blocks.push({ type: 'spacer', text: '' });
      index += 1;
      continue;
    }

    if (trimmed.startsWith(PREDICATE_LABEL)) {
      const predicateLines = [trimmed];
      index += 1;

      while (index < lines.length) {
        const nextLine = lines[index]?.trim() ?? '';
        if (nextLine.length === 0 || isHeadingLine(nextLine)) {
          break;
        }
        predicateLines.push(nextLine);
        index += 1;
      }

      blocks.push({ type: 'predicate', text: predicateLines.join('\n') });
      continue;
    }

    const headingMatch = trimmed.match(HEADING_PATTERN);
    if (headingMatch) {
      const headingText = headingMatch[2]
        ? `${headingMatch[1]} ${headingMatch[2]}`.trim()
        : headingMatch[1];
      blocks.push({ type: 'heading', text: headingText });
      index += 1;
      continue;
    }

    blocks.push({ type: 'paragraph', text: trimmed });
    index += 1;
  }

  return blocks;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  const blocks = parseContent(content);

  return (
    <article className="article-body">
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`;

        if (block.type === 'spacer') {
          return <p key={key} className="article-body__spacer" aria-hidden="true" />;
        }

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

        if (block.type === 'predicate') {
          return (
            <p key={key} className="article-body__predicate">
              {block.text}
            </p>
          );
        }

        return (
          <p key={key} className="article-body__paragraph">
            {block.text}
          </p>
        );
      })}
    </article>
  );
}
