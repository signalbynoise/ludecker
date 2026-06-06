import type { ArticleType, Content } from '@ludecker/types';
import { parseArticleBodyBlocks } from './content-body';
import { getContentPublicPath } from './content';
import { parseSkillBodyBlocks } from './skill-body';
import { parseSkillFile } from './skill-markdown';
import { slugify } from './slug';

export interface PageTocItem {
  id: string;
  label: string;
  href?: string;
}

export function headingDisplayLabel(text: string): string {
  return text.trim();
}

export function assignHeadingAnchorId(label: string, usedIds: Set<string>): string {
  const base = slugify(label) || 'section';
  let id = base;
  let suffix = 2;

  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
}

export function extractArticleTocItems(
  content: string,
  articleType?: ArticleType,
): PageTocItem[] {
  if (articleType === 'skills') {
    const parsed = parseSkillFile(content);
    if (!parsed) {
      return [];
    }

    const usedIds = new Set<string>();
    return parseSkillBodyBlocks(parsed.body)
      .filter((block) => block.type === 'heading')
      .map((block) => {
        const label = block.text.trim();
        return {
          id: assignHeadingAnchorId(label, usedIds),
          label,
        };
      });
  }

  const usedIds = new Set<string>();
  const mermaid = articleType === 'diagrams';

  return parseArticleBodyBlocks(content, { mermaid })
    .filter(
      (block): block is Extract<typeof block, { type: 'heading' }> =>
        block.type === 'heading' && block.level === 2,
    )
    .map((block) => {
      const label = headingDisplayLabel(block.text);
      return {
        id: assignHeadingAnchorId(label, usedIds),
        label,
      };
    });
}

export function extractSectionListTocItems(
  entries: Pick<Content, 'slug' | 'title' | 'article_type'>[],
): PageTocItem[] {
  return entries.map((entry) => ({
    id: entry.slug,
    label: entry.title,
    href: getContentPublicPath(entry.article_type, entry.slug),
  }));
}
