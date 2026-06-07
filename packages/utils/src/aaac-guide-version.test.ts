import { describe, expect, it } from 'vitest';
import {
  quickStartGuideNeedsAaacVersionSync,
  replaceAaacPackageVersionPins,
} from './aaac-guide-version';

const SAMPLE = `Pin a specific version:

\`\`\`bash
npx @ludecker/aaac@1.0.0 init
\`\`\`

Latest:

\`\`\`bash
npx @ludecker/aaac@latest init
\`\`\``;

describe('replaceAaacPackageVersionPins', () => {
  it('updates pinned semver without touching @latest', () => {
    const updated = replaceAaacPackageVersionPins(SAMPLE, '1.1.1');
    expect(updated).toContain('@ludecker/aaac@1.1.1 init');
    expect(updated).toContain('@ludecker/aaac@latest init');
    expect(updated).not.toContain('@ludecker/aaac@1.0.0');
  });

  it('rejects invalid semver', () => {
    expect(() => replaceAaacPackageVersionPins(SAMPLE, 'v1')).toThrow(
      /Invalid AAAC semver/,
    );
  });
});

describe('quickStartGuideNeedsAaacVersionSync', () => {
  it('returns false when pins already match', () => {
    const current = replaceAaacPackageVersionPins(SAMPLE, '1.1.1');
    expect(quickStartGuideNeedsAaacVersionSync(current, '1.1.1')).toBe(false);
  });

  it('returns true when pins are stale', () => {
    expect(quickStartGuideNeedsAaacVersionSync(SAMPLE, '1.1.1')).toBe(true);
  });
});
