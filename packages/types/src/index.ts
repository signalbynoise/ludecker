export type ArticleType =
  | 'article'
  | 'essay'
  | 'note'
  | 'tutorial'
  | 'guide'
  | 'project'
  | 'page';

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Content {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: ContentStatus;
  article_type: ArticleType;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ContentWithTags extends Content {
  tags: Tag[];
}

export interface ArticleTypeOption {
  value: ArticleType;
  label: string;
}

export const ARTICLE_TYPES: readonly ArticleTypeOption[] = [
  { value: 'article', label: 'Article' },
  { value: 'essay', label: 'Essay' },
  { value: 'note', label: 'Note' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'guide', label: 'Guide' },
  { value: 'project', label: 'Project' },
  { value: 'page', label: 'Page' },
] as const;

export interface NavItem {
  id: string;
  label: string;
  href: string;
  articleType: ArticleType | null;
  /** When set, lists published content tagged with this slug instead of article_type. */
  tagSlug?: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'articles', label: 'articles', href: '/articles', articleType: 'article' },
  { id: 'guides', label: 'guides', href: '/guide', articleType: 'guide' },
  { id: 'skills', label: 'skills', href: '/skills', articleType: null, tagSlug: 'skills' },
  { id: 'tools', label: 'tools', href: '/tools', articleType: null, tagSlug: 'tools' },
  { id: 'commands', label: 'commands', href: '/commands', articleType: null, tagSlug: 'commands' },
  { id: 'subagents', label: 'subagents', href: '/subagents', articleType: null, tagSlug: 'subagents' },
  { id: 'diagrams', label: 'diagrams', href: '/diagrams', articleType: null, tagSlug: 'diagrams' },
] as const;

export const NAV_SECTION_IDS = NAV_ITEMS.filter(
  (item): item is NavItem & { tagSlug: string } => Boolean(item.tagSlug),
).map((item) => item.id);

export interface CreateContentInput {
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  status?: ContentStatus;
  article_type: ArticleType;
  cover_image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  tag_ids?: string[];
}

export interface UpdateContentInput {
  slug?: string;
  title?: string;
  excerpt?: string | null;
  content?: string;
  status?: ContentStatus;
  article_type?: ArticleType;
  cover_image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  tag_ids?: string[];
}

export type { ContentFormState } from './content-form';
export { toContentFormState } from './content-form';
