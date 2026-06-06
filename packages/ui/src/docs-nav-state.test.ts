import { describe, expect, it } from 'vitest';
import {
  bootstrapActiveSectionOnce,
  buildSectionOpenSnapshot,
  openActiveSectionForRoute,
  resolveSectionOpen,
  toggleSectionState,
} from './docs-nav-state';

describe('resolveSectionOpen', () => {
  it('defaults Getting Started to open and other sections to closed', () => {
    expect(resolveSectionOpen('Getting Started', {})).toBe(true);
    expect(resolveSectionOpen('Content', {})).toBe(false);
    expect(resolveSectionOpen('Resources', {})).toBe(false);
  });

  it('respects explicit persisted values', () => {
    const sections = { Content: true, Resources: true, Visual: false };

    expect(resolveSectionOpen('Content', sections)).toBe(true);
    expect(resolveSectionOpen('Resources', sections)).toBe(true);
    expect(resolveSectionOpen('Visual', sections)).toBe(false);
  });
});

describe('toggleSectionState', () => {
  it('opens and closes sections without affecting unrelated sections', () => {
    const opened = toggleSectionState({ Content: true }, 'Resources');
    const display = buildSectionOpenSnapshot(opened);

    expect(display.Content).toBe(true);
    expect(display.Resources).toBe(true);

    const closed = toggleSectionState(opened, 'Resources');
    expect(buildSectionOpenSnapshot(closed).Resources).toBe(false);
    expect(buildSectionOpenSnapshot(closed).Content).toBe(true);
  });
});

describe('bootstrapActiveSectionOnce', () => {
  it('opens only the first active section on cold load', () => {
    const first = bootstrapActiveSectionOnce({}, 'Content', false);

    expect(first.hasBootstrapped).toBe(true);
    expect(first.changed).toBe(true);
    expect(buildSectionOpenSnapshot(first.sections).Content).toBe(true);
    expect(buildSectionOpenSnapshot(first.sections).Resources).toBe(false);
  });

  it('does not reopen or close sections on later navigations', () => {
    const cold = bootstrapActiveSectionOnce({}, 'Content', false);
    const opened = toggleSectionState(cold.sections, 'Resources');
    const second = bootstrapActiveSectionOnce(opened, 'Resources', cold.hasBootstrapped);

    expect(second.changed).toBe(false);
    expect(buildSectionOpenSnapshot(second.sections).Content).toBe(true);
    expect(buildSectionOpenSnapshot(second.sections).Resources).toBe(true);
  });

  it('does not override an explicit user preference', () => {
    const result = bootstrapActiveSectionOnce({ Content: false }, 'Content', false);

    expect(result.changed).toBe(false);
    expect(buildSectionOpenSnapshot(result.sections).Content).toBe(false);
  });
});

describe('openActiveSectionForRoute', () => {
  it('opens the destination section without closing others', () => {
    const opened = openActiveSectionForRoute({ Content: true }, 'Resources');

    expect(opened.changed).toBe(true);
    expect(buildSectionOpenSnapshot(opened.sections).Content).toBe(true);
    expect(buildSectionOpenSnapshot(opened.sections).Resources).toBe(true);
  });

  it('skips when the user explicitly closed the destination section', () => {
    const result = openActiveSectionForRoute({ Resources: false }, 'Resources');

    expect(result.changed).toBe(false);
    expect(buildSectionOpenSnapshot(result.sections).Resources).toBe(false);
  });

  it('skips when the destination section is already open', () => {
    const result = openActiveSectionForRoute({ Resources: true }, 'Resources');

    expect(result.changed).toBe(false);
  });
});
