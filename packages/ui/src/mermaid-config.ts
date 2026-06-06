import type { MermaidConfig } from 'mermaid';

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
  const background = readToken('--color-bg', '#fafafa');
  const surface = readToken('--color-bg-card', '#ffffff');
  const ink = readToken('--color-ink', '#171717');
  const body = readToken('--color-body', '#4d4d4d');
  const hairline = readToken('--color-hairline', '#ebebeb');

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
      secondaryColor: readToken('--color-bg-muted', '#f5f5f5'),
      secondaryTextColor: body,
      secondaryBorderColor: hairline,
      tertiaryColor: readToken('--color-bg-accent', '#e9ebef'),
      tertiaryTextColor: body,
      tertiaryBorderColor: hairline,
      lineColor: body,
      textColor: ink,
      fontFamily: readToken(
        '--font-family',
        "Inter, system-ui, -apple-system, sans-serif",
      ),
      fontSize: readToken('--font-size-body-sm', '14px'),
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
      nodeSpacing: 44,
      rankSpacing: 52,
    },
    sequence: {
      diagramMarginX: 24,
      diagramMarginY: 16,
      actorMargin: 48,
      width: 150,
    },
  };
}

let mermaidInitialized = false;

export async function renderLudeckerMermaid(
  diagramId: string,
  source: string,
): Promise<string> {
  const mermaid = (await import('mermaid')).default;

  if (!mermaidInitialized) {
    mermaid.initialize(buildMermaidConfig());
    mermaidInitialized = true;
  }

  const { svg } = await mermaid.render(diagramId, source);
  return svg;
}
