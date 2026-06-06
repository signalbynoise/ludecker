import type { ContentWithTags } from "@ludecker/types";
import { formatArticleMarkdown } from "@ludecker/utils";
import { SITE_CONFIG } from "@/lib/constants";
import {
  buildContentPathname,
  HOME_PATHNAME,
} from "@/lib/routing/pathname";

export interface ArticleMarkdownExport {
  title: string;
  markdown: string;
}

export function buildArticleMarkdownExport(
  item: ContentWithTags,
  typeSegment: string,
  slug: string,
): ArticleMarkdownExport {
  const pagePath = buildContentPathname(typeSegment, slug);
  const pageUrl = `${SITE_CONFIG.url}${pagePath}`;
  const markdown = formatArticleMarkdown({
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    article_type: item.article_type,
    canonicalUrl: pageUrl,
  });

  return {
    title: item.title,
    markdown,
  };
}

export function buildHomeMarkdownExport(
  item: ContentWithTags,
): ArticleMarkdownExport {
  const pageUrl = `${SITE_CONFIG.url}${HOME_PATHNAME}`;
  const markdown = formatArticleMarkdown({
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    article_type: item.article_type,
    canonicalUrl: pageUrl,
  });

  return {
    title: item.title,
    markdown,
  };
}
