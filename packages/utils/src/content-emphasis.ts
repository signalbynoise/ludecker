import type { ArticleType } from '@ludecker/types';
import { parseArticleBodyBlocks, type ArticleBodyBlock } from './content-body';
import { contentHasMermaidFences } from './content-mermaid';

export interface StripMarkdownEmphasisOptions {
  articleType: ArticleType;
}

function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*/g, '');
}

function stripEmphasisFromBlocks(blocks: ArticleBodyBlock[]): ArticleBodyBlock[] {
  return blocks.map((block) => {
    if (block.type === 'heading') {
      return { ...block, text: stripBoldMarkers(block.text) };
    }
    if (block.type === 'paragraph') {
      return { ...block, text: stripBoldMarkers(block.text) };
    }
    return block;
  });
}

function serializeArticleBodyBlocks(blocks: ArticleBodyBlock[]): string {
  const lines: string[] = [];

  for (const block of blocks) {
    if (block.type === 'heading') {
      const marker = block.level === 3 ? '###' : '##';
      lines.push(`${marker} ${block.text}`, '');
      continue;
    }

    if (block.type === 'mermaid') {
      lines.push('```mermaid', block.source, '```', '');
      continue;
    }

    if (block.type === 'code') {
      const fence = block.language.length > 0 ? block.language : 'text';
      lines.push(`\`\`\`${fence}`, block.source, '```', '');
      continue;
    }

    lines.push(block.text, '');
  }

  return lines.join('\n').trimEnd();
}

/**
 * Remove `**` bold markers from CMS prose blocks. Fenced code and mermaid are
 * preserved. Skills entries are exempt (byte-for-byte SKILL.md sync).
 */
export function stripMarkdownEmphasisFromProse(
  content: string,
  options: StripMarkdownEmphasisOptions,
): string {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }

  if (options.articleType === 'skills') {
    return trimmed;
  }

  const mermaid =
    options.articleType === 'diagrams' || contentHasMermaidFences(trimmed);
  const blocks = parseArticleBodyBlocks(trimmed, { mermaid });
  const stripped = stripEmphasisFromBlocks(blocks);

  return serializeArticleBodyBlocks(stripped);
}
