export const DOCS_NAV_GETTING_STARTED = 'Getting Started';

export interface DocsNavSection {
  title: string;
  itemIds: readonly string[];
}

export const DOCS_NAV_SECTIONS: readonly DocsNavSection[] = [
  {
    title: 'Content',
    itemIds: ['articles', 'guides'],
  },
  {
    title: 'Resources',
    itemIds: ['skills', 'tools', 'commands', 'subagents'],
  },
  {
    title: 'Visual',
    itemIds: ['diagrams'],
  },
] as const;

export const DOCS_NAV_ALL_SECTION_TITLES = [
  DOCS_NAV_GETTING_STARTED,
  ...DOCS_NAV_SECTIONS.map((section) => section.title),
] as const;

export function sectionTitleForActiveId(activeId?: string): string | undefined {
  if (!activeId) return undefined;

  return DOCS_NAV_SECTIONS.find((section) => section.itemIds.includes(activeId))?.title;
}
