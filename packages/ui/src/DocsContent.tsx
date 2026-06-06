import type { ReactNode } from 'react';

export interface DocsContentProps {
  children: ReactNode;
}

export function DocsContent({ children }: DocsContentProps) {
  return <div className="docs-content">{children}</div>;
}
