import type { MermaidConfig } from 'mermaid';

type MermaidApi = typeof import('mermaid').default;
export type MermaidThemeKey = 'light' | 'dark';

let mermaidModule: MermaidApi | null = null;
let initializedThemeKey: MermaidThemeKey | null = null;

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
 * themeKey must match ThemeProvider state (not inferred from DOM during toggle).
 */
function buildMermaidConfig(themeKey: MermaidThemeKey): MermaidConfig {
  const background = readColorToken('--color-bg', '#fafafa');
  const ink = readColorToken('--color-ink', '#171717');
  const body = readColorToken('--color-body', '#4d4d4d');
  const hairline = readColorToken('--color-hairline', '#ebebeb');
  const outline = readColorToken('--color-hairline-strong', '#a1a1a1');
  const isDark = themeKey === 'dark';

  return {
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      darkMode: isDark ? 'true' : 'false',
      background,
      mainBkg: background,
      primaryColor: background,
      primaryTextColor: ink,
      primaryBorderColor: outline,
      secondaryColor: background,
      secondaryTextColor: body,
      secondaryBorderColor: outline,
      tertiaryColor: background,
      tertiaryTextColor: body,
      tertiaryBorderColor: hairline,
      clusterBkg: background,
      clusterBorder: hairline,
      nodeBorder: outline,
      edgeLabelBackground: background,
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

async function ensureMermaidInitialized(
  themeKey: MermaidThemeKey,
): Promise<MermaidApi> {
  if (!mermaidModule) {
    mermaidModule = (await import('mermaid')).default;
  }

  if (initializedThemeKey !== themeKey) {
    mermaidModule.initialize(buildMermaidConfig(themeKey));
    initializedThemeKey = themeKey;
  }

  return mermaidModule;
}

export async function renderLudeckerMermaid(
  diagramId: string,
  source: string,
  themeKey: MermaidThemeKey,
): Promise<string> {
  const mermaid = await ensureMermaidInitialized(themeKey);
  const { svg } = await mermaid.render(diagramId, source);
  return svg;
}
