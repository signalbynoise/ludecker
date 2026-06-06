const FRONTMATTER_DELIMITER = '---';

export interface ParsedSkillFile {
  frontmatter: Record<string, string>;
  body: string;
  raw: string;
}

function parseFrontmatterBlock(block: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const line of block.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf(':');
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key.length > 0) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Parse a CMS skill entry stored as a full SKILL.md document.
 */
export function parseSkillFile(content: string): ParsedSkillFile | null {
  const trimmed = content.trim();
  if (!trimmed.startsWith(FRONTMATTER_DELIMITER)) {
    return null;
  }

  const afterOpen = trimmed.slice(FRONTMATTER_DELIMITER.length);
  const closeIndex = afterOpen.indexOf(`\n${FRONTMATTER_DELIMITER}`);
  if (closeIndex === -1) {
    return null;
  }

  const frontmatterBlock = afterOpen.slice(0, closeIndex).trim();
  const body = afterOpen.slice(closeIndex + FRONTMATTER_DELIMITER.length + 1).trim();

  return {
    frontmatter: parseFrontmatterBlock(frontmatterBlock),
    body,
    raw: trimmed,
  };
}

export function isSkillFileContent(content: string): boolean {
  return parseSkillFile(content) !== null;
}
