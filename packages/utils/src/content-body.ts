import { normalizeMermaidVertical, splitMermaidSegments } from './content-mermaid';

export type ArticleBodyBlock =
  | { type: 'heading'; text: string; level: 2 | 3 }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; source: string }
  | { type: 'mermaid'; source: string };

export interface ParseArticleBodyBlocksOptions {
  /** When true, extract ```mermaid fences as diagram blocks (diagrams section). */
  mermaid?: boolean;
}

const MARKDOWN_H2 = /^##\s+(.+)$/;
const MARKDOWN_H3 = /^###\s+(.+)$/;

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

export function parseMarkdownHeadingLine(
  line: string,
): { level: 2 | 3; text: string } | null {
  const trimmed = line.trim();
  const h3 = MARKDOWN_H3.exec(trimmed);
  if (h3?.[1]) {
    return { level: 3, text: h3[1].trim() };
  }
  const h2 = MARKDOWN_H2.exec(trimmed);
  if (h2?.[1]) {
    return { level: 2, text: h2[1].trim() };
  }
  return null;
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

function parseFencedBlock(
  lines: string[],
  startIndex: number,
  mermaid: boolean,
): { block: ArticleBodyBlock; nextIndex: number } | null {
  const openLine = lines[startIndex]?.trim() ?? '';
  if (!openLine.startsWith('```')) {
    return null;
  }

  const language = openLine.slice(3).trim();
  const codeLines: string[] = [];
  let index = startIndex + 1;

  while (index < lines.length) {
    const codeLine = lines[index] ?? '';
    if (codeLine.trim() === '```') {
      index += 1;
      break;
    }
    codeLines.push(codeLine);
    index += 1;
  }

  const source = codeLines.join('\n');

  if (mermaid && language === 'mermaid') {
    return {
      block: {
        type: 'mermaid',
        source: normalizeMermaidVertical(source),
      },
      nextIndex: index,
    };
  }

  return {
    block: {
      type: 'code',
      language,
      source,
    },
    nextIndex: index,
  };
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

    const fenced = parseFencedBlock(lines, index, mermaid);
    if (fenced) {
      blocks.push(fenced.block);
      index = fenced.nextIndex;
      continue;
    }

    const heading = parseMarkdownHeadingLine(trimmed);
    if (heading) {
      blocks.push({ type: 'heading', text: heading.text, level: heading.level });
      index += 1;
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index] ?? '';
      const nextTrimmed = nextLine.trim();
      if (nextTrimmed.length === 0) {
        index += 1;
        break;
      }
      if (nextTrimmed.startsWith('```') || parseMarkdownHeadingLine(nextTrimmed)) {
        break;
      }
      paragraphLines.push(nextTrimmed);
      index += 1;
    }

    appendMermaidFromParagraph(blocks, paragraphLines.join('\n'), mermaid);
  }

  return blocks;
}
