import logoSvg from './logo.svg?raw';
import { normalizeLogoSvg } from './normalize-logo-svg';
import { cn } from './lib/utils';

export interface BrandLogoMarkProps {
  className?: string;
}

export function BrandLogoMark({ className }: BrandLogoMarkProps) {
  return (
    <span
      className="brand-logo__mark-host"
      dangerouslySetInnerHTML={{
        __html: normalizeLogoSvg(logoSvg, cn('brand-logo__mark', className)),
      }}
    />
  );
}
