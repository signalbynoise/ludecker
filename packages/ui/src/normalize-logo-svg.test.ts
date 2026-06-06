import { describe, expect, it } from 'vitest';
import { normalizeLogoSvg } from './normalize-logo-svg';

describe('normalizeLogoSvg', () => {
  it('strips dimensions and applies currentColor', () => {
    const raw =
      '<svg width="102" height="32" viewBox="0 0 102 32"><path fill="white" d="M0 0"/></svg>';
    const out = normalizeLogoSvg(raw, 'brand-logo__mark');
    expect(out).toContain('viewBox="0 0 102 32"');
    expect(out).not.toContain('width=');
    expect(out).toContain('fill="currentColor"');
    expect(out).toContain('class="brand-logo__mark"');
  });
});
