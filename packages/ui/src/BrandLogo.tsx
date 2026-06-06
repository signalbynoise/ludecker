import { BRAND_NAME } from './constants';
import { BrandLogoMark } from './BrandLogoMark';
import { cn } from './lib/utils';

export interface BrandLogoProps {
  href?: string;
  className?: string;
}

export function BrandLogo({ href, className }: BrandLogoProps) {
  const mark = <BrandLogoMark />;

  if (href) {
    return (
      <a className={cn('brand-logo', className)} href={href}>
        {mark}
        <span className="brand-logo__sr-only">{BRAND_NAME}</span>
      </a>
    );
  }

  return (
    <div className={cn('brand-logo', className)} role="img" aria-label={BRAND_NAME}>
      {mark}
    </div>
  );
}
