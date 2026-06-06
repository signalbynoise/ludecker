import type { MermaidConfig } from 'mermaid';

function rgbStringToHex(rgb: string): string | null {
  const match = rgb.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) {
    return null;
  }

  const [, red, green, blue] = match;
  return `#${[red, green, blue]
    .map((channel) => Number(channel).toString(16).padStart(2, '0'))
    .join('')}`;
}

/**
 * Mermaid only accepts hex/rgb/hsl — dark-mode tokens resolve to OKLCH.
 */
function toMermaidColor(cssColor: string, fallback: string): string {
  const trimmed = cssColor.trim();
  if (!trimmed) {
    return fallback;
  }

  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('rgb')) {
    return rgbStringToHex(trimmed) ?? fallback;
  }

  if (typeof document === 'undefined') {
    return fallback;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d');
  if (!context) {
    return fallback;
  }

  try {
    context.fillStyle = trimmed;
  } catch {
    return fallback;
  }

  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

function readColorToken(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return toMermaidColor(value, fallback);
}

function readToken(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

/**
 * SSOT: Mermaid theme reads colors and typography from tokens.css.
 */
function buildMermaidConfig(): MermaidConfig {
  const background = readColorToken('--color-bg', '#fafafa');
  const surface = readColorToken('--color-bg-card', '#ffffff');
  const ink = readColorToken('--color-ink', '#171717');
  const body = readColorToken('--color-body', '#4d4d4d');
  const hairline = readColorToken('--color-hairline', '#ebebeb');

  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  return {
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      darkMode: isDark ? 'true' : 'false',
      background,
      mainBkg: surface,
      primaryColor: surface,
      primaryTextColor: ink,
      primaryBorderColor: hairline,
      secondaryColor: readColorToken('--color-bg-muted', '#f5f5f5'),
      secondaryTextColor: body,
      secondaryBorderColor: hairline,
      tertiaryColor: readColorToken('--color-bg-accent', '#e9ebef'),
      tertiaryTextColor: body,
      tertiaryBorderColor: hairline,
      lineColor: body,
      textColor: ink,
      fontFamily: readToken(
        '--font-family',
        "Inter, system-ui, -apple-system, sans-serif",
      ),
      fontSize: readToken('--font-size-caption', '12px'),
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
      padding: 20,
      nodeSpacing: 44,
      rankSpacing: 52,
    },
    state: {
      nodeSpacing: 48,
      rankSpacing: 56,
      padding: 16,
    },
    sequence: {
      diagramMarginX: 24,
      diagramMarginY: 16,
      actorMargin: 48,
      width: 150,
    },
  };
}

export async function renderLudeckerMermaid(
  diagramId: string,
  source: string,
): Promise<string> {
  const mermaid = (await import('mermaid')).default;
  mermaid.initialize(buildMermaidConfig());

  const { svg } = await mermaid.render(diagramId, source);
  return svg;
}
