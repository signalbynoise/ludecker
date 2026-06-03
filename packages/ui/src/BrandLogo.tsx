import { BRAND_NAME } from './constants';
export function BrandLogo() {
  return (
    <div className="brand-logo">
      <span className="brand-logo__text">{BRAND_NAME}</span>
    </div>
  );
}
