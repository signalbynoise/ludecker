import type { MermaidConfig } from 'mermaid';

function readTypographyToken(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

/**
 * SSOT: Mermaid theme reads typography from tokens.css (dark editorial).
 */
function buildMermaidConfig(): MermaidConfig {
  return {
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      darkMode: 'true',
      background: '#000000',
      mainBkg: '#0d0d0d',
      primaryColor: '#141414',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#7a7a7a',
      secondaryColor: '#1a1a1a',
      secondaryTextColor: '#cccccc',
      secondaryBorderColor: '#7a7a7a',
      tertiaryColor: '#0a0a0a',
      tertiaryTextColor: '#cccccc',
      tertiaryBorderColor: '#4a4a4a',
      lineColor: '#cccccc',
      textColor: '#ffffff',
      fontFamily: readTypographyToken(
        '--font-family',
        "'Atkinson Hyperlegible Mono', ui-monospace, monospace",
      ),
      fontSize: readTypographyToken('--font-size-body', '13px'),
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
