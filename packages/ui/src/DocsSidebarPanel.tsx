import { forwardRef, type ReactNode } from 'react';

export interface DocsSidebarPanelProps {
  children: ReactNode;
}

export const DocsSidebarPanel = forwardRef<HTMLDivElement, DocsSidebarPanelProps>(
  function DocsSidebarPanel({ children }, ref) {
    return (
      <div ref={ref} className="docs-sidebar-panel">
        {children}
      </div>
    );
  },
);
