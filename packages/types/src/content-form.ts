import type { ArticleType, ContentStatus, Tag } from './article-type';

export interface ContentFormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: ContentStatus;
  article_type: ArticleType;
  tagNames: string[];
  cover_image: string;
  seo_title: string;
  seo_description: string;
  featured: boolean;
}

export interface ContentFormSource {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: ContentStatus;
  article_type: ArticleType;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  tags: Pick<Tag, 'name'>[];
}

export function toContentFormState(content?: ContentFormSource): ContentFormState {
  const articleType = content?.article_type ?? 'articles';
  const slug = content?.slug ?? '';
  const isHomeIntro = articleType === 'home' && slug === 'home';

  return {
    title: content?.title ?? '',
    slug,
    excerpt: content?.excerpt ?? '',
    content: content?.content ?? '',
    status: content?.status ?? 'draft',
    article_type: articleType,
    tagNames: content?.tags.map((tag) => tag.name) ?? [],
    cover_image: content?.cover_image ?? '',
    seo_title: content?.seo_title ?? '',
    seo_description: content?.seo_description ?? '',
    featured: isHomeIntro ? true : (content?.featured ?? false),
  };
}
