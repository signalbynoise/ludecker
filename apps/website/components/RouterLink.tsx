import type { DocsNavLinkProps } from '@ludecker/ui';
import { Link } from '@tanstack/react-router';

export function RouterLink({
  href,
  className,
  children,
  'aria-current': ariaCurrent,
}: DocsNavLinkProps) {
  return (
    <Link to={href} className={className} aria-current={ariaCurrent}>
      {children}
    </Link>
  );
}
