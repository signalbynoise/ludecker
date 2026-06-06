import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  applyOutlineDiagramStyle,
  normalizeMermaidSvg,
  repairFlowchartNodeLabels,
} from './article-mermaid-svg';

const SAMPLE_SVG = `<svg width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244.09375 734" role="img"><rect width="10" height="10"/></svg>`;

describe('normalizeMermaidSvg', () => {
  it('removes responsive width="100%" and pins viewBox dimensions', () => {
    const normalized = normalizeMermaidSvg(SAMPLE_SVG);

    expect(normalized).not.toContain('width="100%"');
    expect(normalized).toContain('width="244.09375"');
    expect(normalized).toContain('height="734"');
    expect(normalized).toContain('viewBox="0 0 244.09375 734"');
  });

  it('strips width: 100% from inline svg style', () => {
    const svg = `<svg width="100%" style="max-width: 520px; width: 100%;" viewBox="0 0 120 80"><g/></svg>`;
    const normalized = normalizeMermaidSvg(svg);

    expect(normalized).not.toContain('width="100%"');
    expect(normalized).not.toContain('width: 100%');
    expect(normalized).toContain('width="120"');
    expect(normalized).toContain('height="80"');
  });
});

describe('applyOutlineDiagramStyle', () => {
  it('strips fills from cluster, node, and edge-label shapes', () => {
    const dom = new JSDOM(
      `<div id="root"><g class="cluster"><rect fill="#333333" style="fill:#333333"/></g><g class="node"><rect fill="#000000" stroke="#ffffff"/></g><g class="edgeLabel"><rect fill="#222222"/></g></div>`,
    );
    const root = dom.window.document.getElementById('root');
    expect(root).not.toBeNull();

    applyOutlineDiagramStyle(root!);

    expect(root!.querySelector('g.cluster rect')?.getAttribute('fill')).toBe('none');
    expect(root!.querySelector('g.node rect')?.getAttribute('fill')).toBe('none');
    expect(root!.querySelector('g.edgeLabel rect')?.getAttribute('fill')).toBe('none');
    expect(root!.querySelector('g.node rect')?.getAttribute('stroke-width')).toBe('1');
  });
});

describe('repairFlowchartNodeLabels', () => {
  it('matches foreignObject width to node rect and clears clipping styles', () => {
    const dom = new JSDOM(
      `<div id="root"><g class="node"><rect width="208.5" height="58"/><foreignObject width="128" height="18"><div style="max-width: 200px; white-space: nowrap;">You say what you want</div></foreignObject></g></div>`,
    );
    const root = dom.window.document.getElementById('root');
    expect(root).not.toBeNull();

    repairFlowchartNodeLabels(root!);

    const foreignObject = root!.querySelector('foreignObject');
    const div = root!.querySelector('foreignObject div');
    expect(foreignObject?.getAttribute('width')).toBe('208.5');
    expect(foreignObject?.getAttribute('overflow')).toBe('visible');
    expect(div?.getAttribute('style')).not.toContain('max-width');
    expect((div as HTMLElement | null)?.style.whiteSpace).toBe('normal');
  });
});
