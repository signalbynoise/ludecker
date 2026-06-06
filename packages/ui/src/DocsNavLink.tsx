import type { ComponentType, MouseEventHandler, ReactNode } from 'react';

export interface DocsNavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-current'?: 'page' | undefined;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
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
  onClick,
}: DocsNavLinkRenderProps) {
  if (LinkComponent) {
    return (
      <LinkComponent
        href={href}
        className={className}
        aria-current={ariaCurrent}
        onClick={onClick}
      >
        {children}
      </LinkComponent>
    );
  }

  return (
    <a href={href} className={className} aria-current={ariaCurrent} onClick={onClick}>
      {children}
    </a>
  );
}
