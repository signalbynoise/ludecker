import type { ReactNode } from 'react';
import './SiteLayout.css';

export interface SiteLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function SiteLayout({ sidebar, children }: SiteLayoutProps) {
  return (
    <div className="site-layout">
      <aside className="site-layout__sidebar">{sidebar}</aside>
      <main className="site-layout__main">{children}</main>
    </div>
  );
}
