import { describe, expect, it } from 'vitest';
import { resolveActiveNavId } from './resolve-active-nav-id';

describe('resolveActiveNavId', () => {
  it('returns undefined on home', () => {
    expect(resolveActiveNavId('/')).toBeUndefined();
  });

  it('matches section index routes', () => {
    expect(resolveActiveNavId('/commands')).toBe('commands');
  });

  it('matches nested content under section href prefix', () => {
    expect(resolveActiveNavId('/guide/my-guide')).toBe('guides');
  });

  it('does not match articleType path when href prefix differs', () => {
    expect(resolveActiveNavId('/guides/my-guide')).toBeUndefined();
  });
});
