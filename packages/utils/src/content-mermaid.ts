/** Fenced mermaid blocks in CMS body: ```mermaid … ``` */
export const MERMAID_FENCE_PATTERN = /```mermaid\s*\n([\s\S]*?)```/g;

export type MermaidSegment =
  | { type: 'text'; value: string }
  | { type: 'mermaid'; value: string };

/**
 * Prefer top-to-bottom layout for flow-style diagrams (vertical on the page).
 */
export function normalizeMermaidVertical(source: string): string {
  const trimmed = source.trim();
  if (trimmed.length === 0) {
    return 'flowchart TB\n  A[Empty]';
  }

  const firstLine = trimmed.split('\n')[0]?.trim() ?? '';

  if (/^flowchart\s+LR\b/i.test(firstLine)) {
    return trimmed.replace(/^flowchart\s+LR\b/i, 'flowchart TB');
  }

  if (/^graph\s+LR\b/i.test(firstLine)) {
    return trimmed.replace(/^graph\s+LR\b/i, 'graph TB');
  }

  if (/^flowchart\s+(TB|BT|RL)\b/i.test(firstLine) || /^graph\s+(TB|BT|RL)\b/i.test(firstLine)) {
    return trimmed;
  }

  if (/^flowchart\b/i.test(firstLine) || /^graph\b/i.test(firstLine)) {
    const lines = trimmed.split('\n');
    const head = lines[0] ?? '';
    if (!/\b(TB|BT|LR|RL)\b/i.test(head)) {
      lines[0] = `${head} TB`.trim();
    }
    return lines.join('\n');
  }

  if (
    /^(sequenceDiagram|stateDiagram|erDiagram|classDiagram|gantt|pie|gitGraph|C4Context)/i.test(
      firstLine,
    )
  ) {
    return trimmed;
  }

  return `flowchart TB\n${trimmed}`;
}

/** Split paragraph text into prose and mermaid segments. */
export function splitMermaidSegments(text: string): MermaidSegment[] {
  const segments: MermaidSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(MERMAID_FENCE_PATTERN)) {
    const matchIndex = match.index ?? 0;
    const before = text.slice(lastIndex, matchIndex).trim();

    if (before.length > 0) {
      segments.push({ type: 'text', value: before });
    }

    const diagram = match[1]?.trim() ?? '';
    if (diagram.length > 0) {
      segments.push({
        type: 'mermaid',
        value: normalizeMermaidVertical(diagram),
      });
    }

    lastIndex = matchIndex + match[0].length;
  }

  const tail = text.slice(lastIndex).trim();
  if (tail.length > 0) {
    segments.push({ type: 'text', value: tail });
  }

  if (segments.length === 0 && text.trim().length > 0) {
    segments.push({ type: 'text', value: text.trim() });
  }

  return segments;
}

export function contentHasMermaidFences(text: string): boolean {
  MERMAID_FENCE_PATTERN.lastIndex = 0;
  return MERMAID_FENCE_PATTERN.test(text);
}
