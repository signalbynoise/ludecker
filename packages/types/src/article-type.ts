export type ArticleType =
  | 'home'
  | 'articles'
  | 'guides'
  | 'skills'
  | 'tools'
  | 'commands'
  | 'subagents'
  | 'diagrams';

export type ContentStatus = 'draft' | 'published' | 'archived';

export const CONTENT_STATUS_VALUES: readonly ContentStatus[] = [
  'draft',
  'published',
  'archived',
] as const;

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
  { value: 'home', label: 'home' },
  { value: 'articles', label: 'articles' },
  { value: 'guides', label: 'guides' },
  { value: 'skills', label: 'skills' },
  { value: 'tools', label: 'tools' },
  { value: 'commands', label: 'commands' },
  { value: 'subagents', label: 'subagents' },
  { value: 'diagrams', label: 'diagrams' },
] as const;

export interface NavItem {
  id: string;
  label: string;
  href: string;
  articleType: ArticleType;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'articles', label: 'articles', href: '/articles', articleType: 'articles' },
  { id: 'guides', label: 'guides', href: '/guide', articleType: 'guides' },
  { id: 'skills', label: 'skills', href: '/skills', articleType: 'skills' },
  { id: 'tools', label: 'tools', href: '/tools', articleType: 'tools' },
  { id: 'commands', label: 'commands', href: '/commands', articleType: 'commands' },
  { id: 'subagents', label: 'subagents', href: '/subagents', articleType: 'subagents' },
  { id: 'diagrams', label: 'diagrams', href: '/diagrams', articleType: 'diagrams' },
] as const;

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
