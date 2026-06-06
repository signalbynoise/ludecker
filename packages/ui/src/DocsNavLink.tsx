import type { ComponentType, ReactNode } from 'react';

export interface DocsNavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-current'?: 'page' | undefined;
}

export type DocsNavLinkComponent = ComponentType<DocsNavLinkProps>;

interface DocsNavLinkRenderProps extends DocsNavLinkProps {
  linkComponent?: DocsNavLinkComponent;
}

export function DocsNavLink({
  linkComponent: LinkComponent,
  href,
  className,
  children,
  'aria-current': ariaCurrent,
}: DocsNavLinkRenderProps) {
  if (LinkComponent) {
    return (
      <LinkComponent href={href} className={className} aria-current={ariaCurrent}>
        {children}
      </LinkComponent>
    );
  }

  return (
    <a href={href} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  );
}
