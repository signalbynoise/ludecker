import { BRAND_NAME, TEXT_BODY_CLASS } from './constants';
export function BrandLogo() {
  return (
    <div className="brand-logo">
      <span className={`${TEXT_BODY_CLASS} brand-logo__text`}>{BRAND_NAME}</span>
    </div>
  );
}
