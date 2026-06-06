import type { ArticleType } from '@ludecker/types';
import { parseArticleBodyBlocks } from './content-body';
import { headingDisplayLabel } from './page-toc';
import { isSkillFileContent } from './skill-markdown';

export interface FormatArticleMarkdownInput {
  title: string;
  excerpt?: string | null;
  content: string;
  article_type: ArticleType;
  canonicalUrl?: string;
}

export function formatArticleMarkdown(input: FormatArticleMarkdownInput): string {
  const { title, excerpt, content, article_type, canonicalUrl } = input;

  if (article_type === 'skills' || isSkillFileContent(content)) {
    if (canonicalUrl) {
      return `<!-- Source: ${canonicalUrl} -->\n\n${content.trim()}\n`;
    }
    return `${content.trim()}\n`;
  }

  const lines: string[] = [`# ${title}`];

  if (excerpt?.trim()) {
    lines.push('', excerpt.trim());
  }

  if (canonicalUrl) {
    lines.push('', `Source: ${canonicalUrl}`);
  }

  lines.push('');

  const blocks = parseArticleBodyBlocks(content, {
    mermaid: article_type === 'diagrams',
  });

  for (const block of blocks) {
    if (block.type === 'heading') {
      const marker = block.level === 3 ? '###' : '##';
      lines.push(`${marker} ${headingDisplayLabel(block.text)}`, '');
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

  return `${lines.join('\n').trimEnd()}\n`;
}
