import type { ReactNode } from 'react';
import './PageShell.css';

export interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return <div className="page-shell">{children}</div>;
}
