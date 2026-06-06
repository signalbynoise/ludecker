import type { Content } from '@ludecker/types';

export interface PageHero {
  title: string;
  description: string;
}

type PageHeroSource = Pick<Content, 'title' | 'excerpt' | 'seo_description'>;

export function mapContentToPageHero(
  content: PageHeroSource,
  fallback?: PageHero,
): PageHero {
  const title = content.title.trim() || fallback?.title || '';
  const description =
    content.excerpt?.trim() ||
    content.seo_description?.trim() ||
    fallback?.description ||
    '';

  return { title, description };
}
