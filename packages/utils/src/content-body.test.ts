import { describe, expect, it } from 'vitest';
import { parseArticleBodyBlocks } from './content-body';
import { contentHasMermaidFences, splitMermaidSegments } from './content-mermaid';

const HOME_SNIPPET = `## How Agentic OS flows in one picture

Read top to bottom.

\`\`\`mermaid
flowchart TB
    Cmd["Slash command"]
    Domain["Domain slug"]
    Cmd --> Domain
\`\`\`

You type the command and domain.
`;

describe('splitMermaidSegments', () => {
  it('splits a fenced diagram from surrounding text', () => {
    const fence = '```mermaid\nflowchart TB\n  A --> B\n```';
    const segments = splitMermaidSegments(fence);
    expect(segments.some((segment) => segment.type === 'mermaid')).toBe(true);
  });

  it('splits diagram with quoted node labels', () => {
    const fence = `\`\`\`mermaid
flowchart TB
You["You say what you want"]
Command["Slash command"]
You --> Command
\`\`\``;
    const segments = splitMermaidSegments(fence);
    expect(segments.some((segment) => segment.type === 'mermaid')).toBe(true);
  });
});

describe('parseArticleBodyBlocks mermaid', () => {
  it('detects mermaid fences in home-style content', () => {
    expect(contentHasMermaidFences(HOME_SNIPPET)).toBe(true);
  });

  it('extracts mermaid after contentHasMermaidFences (no shared-regex pollution)', () => {
    expect(contentHasMermaidFences(HOME_SNIPPET)).toBe(true);
    const blocks = parseArticleBodyBlocks(HOME_SNIPPET, { mermaid: true });
    expect(blocks).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'mermaid' })]),
    );
  });

  it('keeps mermaid fence as code block when mermaid option is false', () => {
    const blocks = parseArticleBodyBlocks(HOME_SNIPPET, { mermaid: false });
    expect(blocks.some((block) => block.type === 'mermaid')).toBe(false);
    expect(blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'code', language: 'mermaid' }),
      ]),
    );
  });
});

describe('parseArticleBodyBlocks code fences', () => {
  it('extracts fenced bash blocks as code type', () => {
    const content = [
      '## Install',
      '',
      'Run:',
      '',
      '```bash',
      'npx @ludecker/aaac@latest init',
      '```',
    ].join('\n');

    const blocks = parseArticleBodyBlocks(content);
    expect(blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'code',
          language: 'bash',
          source: 'npx @ludecker/aaac@latest init',
        }),
      ]),
    );
  });

  it('parses mermaid fences as mermaid blocks when mermaid option is true', () => {
    const content = [
      '## Diagram',
      '',
      '```mermaid',
      'flowchart TB',
      '  A --> B',
      '```',
    ].join('\n');

    const blocks = parseArticleBodyBlocks(content, { mermaid: true });
    expect(blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'mermaid', source: expect.stringContaining('flowchart TB') }),
      ]),
    );
    expect(blocks.some((block) => block.type === 'code')).toBe(false);
  });
});
