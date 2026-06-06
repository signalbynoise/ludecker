import { describe, expect, it } from 'vitest';
import { stripMarkdownEmphasisFromProse } from './content-emphasis';

describe('stripMarkdownEmphasisFromProse', () => {
  it('removes ** from prose paragraphs', () => {
    const input = '## Welcome\n\nThis is about **Agentic OS** and **AAAC**.';
    const output = stripMarkdownEmphasisFromProse(input, {
      articleType: 'home',
    });
    expect(output).toBe('## Welcome\n\nThis is about Agentic OS and AAAC.');
  });

  it('preserves ** inside fenced code blocks', () => {
    const input = [
      '## Globs',
      '',
      '```text',
      'lib/**/*.test.ts',
      '```',
    ].join('\n');
    const output = stripMarkdownEmphasisFromProse(input, {
      articleType: 'guides',
    });
    expect(output).toContain('lib/**/*.test.ts');
  });

  it('preserves mermaid fence content', () => {
    const input = [
      '## Diagram',
      '',
      '```mermaid',
      'flowchart TB',
      '  A["Node"] --> B',
      '```',
      '',
      '**You** type the command.',
    ].join('\n');
    const output = stripMarkdownEmphasisFromProse(input, {
      articleType: 'home',
    });
    expect(output).toContain('flowchart TB');
    expect(output).toContain('You type the command.');
    expect(output).not.toContain('**');
  });

  it('leaves skills content unchanged', () => {
    const input = '---\nname: test\n---\n\n**Bold** instruction.';
    const output = stripMarkdownEmphasisFromProse(input, {
      articleType: 'skills',
    });
    expect(output).toBe(input);
  });
});
