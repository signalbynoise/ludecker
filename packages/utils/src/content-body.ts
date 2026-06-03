import { isEditorialHeadingLine } from './content-editorial';
import { splitMermaidSegments } from './content-mermaid';

export type ArticleBodyBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'mermaid'; source: string };

export interface ParseArticleBodyBlocksOptions {
  /** When true, extract ```mermaid fences as diagram blocks (diagrams section). */
  mermaid?: boolean;
}

/**
 * Drop trailing CMS metadata blocks only (`Predicate form:` + `Type ·` lines).
 * In-article predicate lines (e.g. `Predicate form: ∀x …`) must be kept.
 */
function withoutLegacyPredicateMetadataBlock(content: string): string {
  const match = content.match(/\n\nPredicate form:\s*\nType\s*·[\s\S]*$/);
  if (!match || match.index === undefined) {
    return content;
  }
  return content.slice(0, match.index).trimEnd();
}

function appendParagraphBlock(blocks: ArticleBodyBlock[], text: string): void {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return;
  }
  blocks.push({ type: 'paragraph', text: trimmed });
}

function appendMermaidFromParagraph(
  blocks: ArticleBodyBlock[],
  text: string,
  mermaid: boolean,
): void {
  if (!mermaid) {
    appendParagraphBlock(blocks, text);
    return;
  }

  const segments = splitMermaidSegments(text);
  for (const segment of segments) {
    if (segment.type === 'mermaid') {
      blocks.push({ type: 'mermaid', source: segment.value });
      continue;
    }
    appendParagraphBlock(blocks, segment.value);
  }
}

export function parseArticleBodyBlocks(
  content: string,
  options: ParseArticleBodyBlocksOptions = {},
): ArticleBodyBlock[] {
  const { mermaid = false } = options;
  const lines = withoutLegacyPredicateMetadataBlock(content).split('\n');
  const blocks: ArticleBodyBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const trimmed = lines[index]?.trim() ?? '';

    if (trimmed.length === 0) {
      index += 1;
      continue;
    }

    if (isEditorialHeadingLine(trimmed)) {
      blocks.push({ type: 'heading', text: trimmed });
      index += 1;
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (index < lines.length) {
      const nextTrimmed = lines[index]?.trim() ?? '';
      if (nextTrimmed.length === 0) {
        index += 1;
        break;
      }
      if (isEditorialHeadingLine(nextTrimmed)) {
        break;
      }
      paragraphLines.push(nextTrimmed);
      index += 1;
    }

    appendMermaidFromParagraph(blocks, paragraphLines.join('\n'), mermaid);
  }

  return blocks;
}
