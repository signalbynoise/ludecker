import { parseContentLinkSegments } from './content-links';

export type SkillBodyBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; source: string };

const HEADING_PATTERN = /^#{1,6}\s+(.+)$/;

function appendParagraph(blocks: SkillBodyBlock[], text: string): void {
  const trimmed = text.trim();
  if (trimmed.length > 0) {
    blocks.push({ type: 'paragraph', text: trimmed });
  }
}

/**
 * Parse markdown body (after frontmatter) for public skill pages.
 */
export function parseSkillBodyBlocks(body: string): SkillBodyBlock[] {
  const lines = body.split('\n');
  const blocks: SkillBodyBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length) {
        const codeLine = lines[index] ?? '';
        if (codeLine.trim() === '```') {
          index += 1;
          break;
        }
        codeLines.push(codeLine);
        index += 1;
      }

      blocks.push({
        type: 'code',
        language,
        source: codeLines.join('\n'),
      });
      continue;
    }

    const headingMatch = trimmed.match(HEADING_PATTERN);
    if (headingMatch?.[1]) {
      blocks.push({ type: 'heading', text: headingMatch[1].trim() });
      index += 1;
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;

    while (index < lines.length) {
      const nextTrimmed = lines[index]?.trim() ?? '';
      if (
        nextTrimmed.length === 0 ||
        nextTrimmed.startsWith('```') ||
        HEADING_PATTERN.test(nextTrimmed)
      ) {
        break;
      }
      paragraphLines.push(nextTrimmed);
      index += 1;
    }

    appendParagraph(blocks, paragraphLines.join('\n'));
  }

  return blocks;
}
