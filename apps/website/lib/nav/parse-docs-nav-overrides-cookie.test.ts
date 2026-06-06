import { describe, expect, it } from 'vitest';
import { parseDocsNavOverridesCookie } from './parse-docs-nav-overrides-cookie';

describe('parseDocsNavOverridesCookie', () => {
  it('returns empty overrides when cookie is missing', () => {
    expect(parseDocsNavOverridesCookie(undefined)).toEqual({});
  });

  it('parses encoded JSON cookie values', () => {
    const raw = encodeURIComponent(
      JSON.stringify({ Content: true, Resources: true, Visual: false }),
    );

    expect(parseDocsNavOverridesCookie(raw)).toEqual({
      Content: true,
      Resources: true,
      Visual: false,
    });
  });

  it('returns empty overrides for invalid JSON', () => {
    expect(parseDocsNavOverridesCookie('%7Bnot-json')).toEqual({});
  });
});
