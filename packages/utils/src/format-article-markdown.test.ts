import { describe, expect, it } from 'vitest';
import { formatArticleMarkdown } from './format-article-markdown';

describe('formatArticleMarkdown', () => {
  it('serializes editorial content to markdown', () => {
    const markdown = formatArticleMarkdown({
      title: 'Infrastructure As Code',
      excerpt: 'A short intro.',
      content: 'C: Overview\n\nP1: First paragraph with [link](https://example.com).',
      article_type: 'articles',
      canonicalUrl: 'https://ludecker.com/articles/infrastructure-as-code',
    });

    expect(markdown).toContain('# Infrastructure As Code');
    expect(markdown).toContain('A short intro.');
    expect(markdown).toContain('## Overview');
    expect(markdown).toContain('First paragraph with [link](https://example.com).');
    expect(markdown).toContain('Source: https://ludecker.com/articles/infrastructure-as-code');
  });

  it('returns skill markdown unchanged with source comment', () => {
    const skill = `---
name: test-skill
---

# Skill body`;

    const markdown = formatArticleMarkdown({
      title: 'Ignored',
      content: skill,
      article_type: 'skills',
      canonicalUrl: 'https://ludecker.com/skills/test-skill',
    });

    expect(markdown).toContain('<!-- Source: https://ludecker.com/skills/test-skill -->');
    expect(markdown).toContain('name: test-skill');
    expect(markdown).toContain('# Skill body');
  });
});
