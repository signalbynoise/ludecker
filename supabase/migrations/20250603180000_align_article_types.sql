-- Align article_type with site nav sections (articles, guides, skills, …)

ALTER TABLE public.content
  ALTER COLUMN article_type TYPE text
  USING article_type::text;

UPDATE public.content SET article_type = 'articles' WHERE article_type = 'article';
UPDATE public.content SET article_type = 'guides' WHERE article_type = 'guide';
UPDATE public.content SET article_type = 'skills' WHERE slug = 'agent-skills';
UPDATE public.content SET article_type = 'tools' WHERE slug = 'mcp-integrations';
UPDATE public.content SET article_type = 'commands' WHERE slug = 'ship-ludecker';
UPDATE public.content SET article_type = 'subagents' WHERE slug = 'parallel-exploration';
UPDATE public.content SET article_type = 'diagrams' WHERE slug = 'architecture-diagrams';
UPDATE public.content SET article_type = 'articles'
  WHERE article_type IN ('essay', 'note', 'tutorial', 'project');

DROP TYPE IF EXISTS public.article_type;

CREATE TYPE public.article_type AS ENUM (
  'articles',
  'guides',
  'skills',
  'tools',
  'commands',
  'subagents',
  'diagrams',
  'page'
);

ALTER TABLE public.content
  ALTER COLUMN article_type TYPE public.article_type
  USING article_type::public.article_type;

ALTER TABLE public.content
  ALTER COLUMN article_type SET DEFAULT 'articles'::public.article_type;
