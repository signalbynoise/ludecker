function readViewBoxSize(svg: string): { width: number; height: number } | null {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) {
    return null;
  }

  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts[2] <= 0 || parts[3] <= 0) {
    return null;
  }

  return { width: parts[2], height: parts[3] };
}

/**
 * Strip Mermaid's responsive width="100%" and pin intrinsic viewBox dimensions
 * so layout CSS only scales diagrams down, never up.
 */
export function normalizeMermaidSvg(svg: string): string {
  let normalized = svg
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

  const viewBox = readViewBoxSize(normalized);
  if (viewBox) {
    normalized = normalized.replace(
      /<svg\b/,
      `<svg width="${viewBox.width}" height="${viewBox.height}"`,
    );
  }

  return normalized;
}

function readCssToken(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

/** Strip node/subgraph fills — outline-only diagram chrome. */
export function applyOutlineDiagramStyle(root: ParentNode): void {
  const nodeStroke = readCssToken('--color-hairline-strong', '#a1a1a1');
  const clusterStroke = readCssToken('--color-hairline', '#ebebeb');

  const outlineShape = (shape: Element, stroke: string) => {
    shape.setAttribute('fill', 'none');
    shape.setAttribute('stroke', stroke);
    shape.setAttribute('stroke-width', '1');
    (shape as SVGElement).style.removeProperty('fill');
  };

  root.querySelectorAll('g.cluster > rect').forEach((rect) => {
    outlineShape(rect, clusterStroke);
  });

  root.querySelectorAll('g.node > rect, g.node > polygon, g.node > circle').forEach(
    (shape) => {
      outlineShape(shape, nodeStroke);
    },
  );

  root.querySelectorAll('.edgeLabel rect, g.edgeLabel rect').forEach((rect) => {
    rect.setAttribute('fill', 'none');
    (rect as SVGElement).style.removeProperty('fill');
  });
}

/** Widen html label foreignObjects to match node rects so caption text is not clipped. */
export function repairFlowchartNodeLabels(root: ParentNode): void {
  root.querySelectorAll('g.node').forEach((group) => {
    const rect = group.querySelector(':scope > rect');
    const foreignObject = group.querySelector('foreignObject');
    const labelDiv = foreignObject?.querySelector('div');
    if (!rect || !foreignObject || !labelDiv) {
      return;
    }

    const rectWidth = rect.getAttribute('width');
    if (rectWidth) {
      foreignObject.setAttribute('width', rectWidth);
    }

    labelDiv.style.removeProperty('max-width');
    labelDiv.style.whiteSpace = 'normal';
    foreignObject.setAttribute('overflow', 'visible');
  });
}
