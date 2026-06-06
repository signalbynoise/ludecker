import { describe, expect, it } from 'vitest';
import {
  buildContentPathname,
  buildSectionPathname,
  HOME_PATHNAME,
  normalizePathname,
} from './pathname';

describe('normalizePathname', () => {
  it('strips trailing slashes except root', () => {
    expect(normalizePathname('/guide/')).toBe('/guide');
    expect(normalizePathname('/')).toBe('/');
  });
});

describe('buildSectionPathname', () => {
  it('builds section index paths from route segments', () => {
    expect(buildSectionPathname('guide')).toBe('/guide');
    expect(buildSectionPathname('commands')).toBe('/commands');
  });
});

describe('buildContentPathname', () => {
  it('builds article paths from route segments', () => {
    expect(buildContentPathname('guide', 'quick-start')).toBe('/guide/quick-start');
  });
});

describe('HOME_PATHNAME', () => {
  it('is root', () => {
    expect(HOME_PATHNAME).toBe('/');
  });
});
