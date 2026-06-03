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
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'articles', label: 'articles', href: '/articles', articleType: 'article' },
  { id: 'guides', label: 'guides', href: '/guides', articleType: 'guide' },
  { id: 'skills', label: 'skills', href: '/skills', articleType: null },
  { id: 'tools', label: 'tools', href: '/tools', articleType: null },
  { id: 'commands', label: 'commands', href: '/commands', articleType: null },
  { id: 'subagents', label: 'subagents', href: '/subagents', articleType: null },
  { id: 'diagrams', label: 'diagrams', href: '/diagrams', articleType: null },
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
