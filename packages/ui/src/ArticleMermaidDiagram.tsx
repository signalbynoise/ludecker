'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  applyOutlineDiagramStyle,
  normalizeMermaidSvg,
  repairFlowchartNodeLabels,
} from './article-mermaid-svg';
import { TEXT_BODY_CLASS } from './constants';
import { renderLudeckerMermaid } from './mermaid-config';
import { useTheme } from './ThemeProvider';

export interface ArticleMermaidDiagramProps {
  source: string;
  /** When false, defer client render (e.g. home intro pending). Default true. */
  diagramReady?: boolean;
}

type DiagramStatus = 'idle' | 'loading' | 'ready' | 'error';

function buildSvgWrapper(svg: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'article-mermaid-diagram__svg';
  wrapper.innerHTML = normalizeMermaidSvg(svg);
  applyOutlineDiagramStyle(wrapper);
  repairFlowchartNodeLabels(wrapper);
  return wrapper;
}

export function ArticleMermaidDiagram({
  source,
  diagramReady = true,
}: ArticleMermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderGenerationRef = useRef(0);
  const reactId = useId();
  const { theme } = useTheme();
  const diagramId = `ludecker-mmd-${reactId.replace(/:/g, '')}`;
  const [status, setStatus] = useState<DiagramStatus>(
    diagramReady ? 'loading' : 'idle',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!diagramReady) {
      return;
    }

    const generation = ++renderGenerationRef.current;
    const hasExistingDiagram =
      containerRef.current?.querySelector('.article-mermaid-diagram__svg') !==
      null;

    setErrorMessage(null);
    setStatus(hasExistingDiagram ? 'ready' : 'loading');

    async function renderDiagram() {
      try {
        const renderId = `${diagramId}-g${generation}`;
        const svg = await renderLudeckerMermaid(renderId, source, theme);

        if (generation !== renderGenerationRef.current) {
          return;
        }

        const container = containerRef.current;
        if (!container) {
          return;
        }

        container.replaceChildren(buildSvgWrapper(svg));
        setStatus('ready');
      } catch (error) {
        if (generation !== renderGenerationRef.current) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Diagram failed to render';
        setErrorMessage(message);
        setStatus('error');
      }
    }

    void renderDiagram();
  }, [diagramId, source, diagramReady, theme]);

  const isLoading = status === 'loading';
  const isReady = status === 'ready';

  return (
    <figure className="article-mermaid-diagram">
      <div
        ref={containerRef}
        className="article-mermaid-diagram__canvas"
        aria-busy={isLoading || undefined}
        {...(isReady
          ? { role: 'img' as const, 'aria-label': 'Flow diagram' }
          : {})}
      />
      {isLoading ? (
        <figcaption
          className={`${TEXT_BODY_CLASS} article-mermaid-diagram__loading`}
          aria-live="polite"
        >
          Rendering diagram…
        </figcaption>
      ) : null}
      {errorMessage ? (
        <figcaption className={`${TEXT_BODY_CLASS} article-mermaid-diagram__error`}>
          {errorMessage}
        </figcaption>
      ) : null}
    </figure>
  );
}
