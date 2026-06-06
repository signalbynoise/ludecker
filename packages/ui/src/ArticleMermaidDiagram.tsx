'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { TEXT_BODY_CLASS } from './constants';
import { renderLudeckerMermaid } from './mermaid-config';

export interface ArticleMermaidDiagramProps {
  source: string;
}

function normalizeMermaidSvg(svg: string): string {
  return svg
    .replace(/\swidth="100%"/g, '')
    .replace(
      /<svg([^>]*)\sstyle="([^"]*)"/,
      (_match, attrs: string, style: string) => {
        const cleanedStyle = style
          .replace(/max-width:\s*[^;]+;?/g, '')
          .replace(/width:\s*100%;?/g, '')
          .trim();
        return cleanedStyle
          ? `<svg${attrs} style="${cleanedStyle}"`
          : `<svg${attrs}`;
      },
    );
}

export function ArticleMermaidDiagram({ source }: ArticleMermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const diagramId = `ludecker-mmd-${reactId.replace(/:/g, '')}`;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      setErrorMessage(null);
      container.replaceChildren();

      try {
        const svg = await renderLudeckerMermaid(diagramId, source);
        if (cancelled) {
          return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'article-mermaid-diagram__svg';
        wrapper.innerHTML = normalizeMermaidSvg(svg);
        container.appendChild(wrapper);
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message =
          error instanceof Error ? error.message : 'Diagram failed to render';
        setErrorMessage(message);
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [diagramId, source]);

  return (
    <figure className="article-mermaid-diagram">
      <div
        ref={containerRef}
        className="article-mermaid-diagram__canvas"
        role="img"
        aria-label="Flow diagram"
      />
      {errorMessage ? (
        <figcaption className={`${TEXT_BODY_CLASS} article-mermaid-diagram__error`}>
          {errorMessage}
        </figcaption>
      ) : null}
    </figure>
  );
}
