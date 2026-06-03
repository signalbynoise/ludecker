ALTER TABLE public.content ALTER COLUMN article_type DROP DEFAULT;

ALTER TABLE public.content
  ALTER COLUMN article_type TYPE text
  USING article_type::text;

UPDATE public.content SET article_type = 'home' WHERE article_type = 'page';

DROP TYPE IF EXISTS public.article_type;

CREATE TYPE public.article_type AS ENUM (
  'home',
  'articles',
  'guides',
  'skills',
  'tools',
  'commands',
  'subagents',
  'diagrams'
);

ALTER TABLE public.content
  ALTER COLUMN article_type TYPE public.article_type
  USING article_type::public.article_type;

ALTER TABLE public.content
  ALTER COLUMN article_type SET DEFAULT 'articles'::public.article_type;

INSERT INTO public.content (
  slug,
  title,
  excerpt,
  content,
  status,
  article_type,
  featured,
  published_at
) VALUES
  (
    'index',
    'articles',
    'Writing on design, technology, and practice.',
    E'C: articles\n\nP1: Long-form notes and essays.',
    'published',
    'articles',
    false,
    now()
  ),
  (
    'index',
    'guides',
    'Step-by-step guides and workflows.',
    E'C: guides\n\nP1: Practical walkthroughs.',
    'published',
    'guides',
    false,
    now()
  ),
  (
    'index',
    'skills',
    'Reusable agent instruction sets.',
    E'C: skills\n\nP1: Cursor skills and playbooks.',
    'published',
    'skills',
    false,
    now()
  ),
  (
    'index',
    'tools',
    'MCP servers and integrations.',
    E'C: tools\n\nP1: External services wired into the stack.',
    'published',
    'tools',
    false,
    now()
  ),
  (
    'index',
    'commands',
    'Cursor command workflows.',
    E'C: commands\n\nP1: Repeatable slash commands.',
    'published',
    'commands',
    false,
    now()
  ),
  (
    'index',
    'subagents',
    'Parallel agent exploration.',
    E'C: subagents\n\nP1: Delegated research and tasks.',
    'published',
    'subagents',
    false,
    now()
  ),
  (
    'index',
    'diagrams',
    'Architecture and system maps.',
    E'C: diagrams\n\nP1: Visual models of flows and structure.',
    'published',
    'diagrams',
    false,
    now()
  )
ON CONFLICT (article_type, slug) DO NOTHING;
