-- Section index pages share slug "index" per article_type

ALTER TABLE public.content DROP CONSTRAINT IF EXISTS content_slug_key;

ALTER TABLE public.content
  ADD CONSTRAINT content_article_type_slug_key UNIQUE (article_type, slug);
