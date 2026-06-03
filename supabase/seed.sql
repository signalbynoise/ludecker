-- Sample content for local development and staging
-- Run after migrations: supabase db seed

INSERT INTO public.tags (name, slug) VALUES
  ('architecture', 'architecture'),
  ('ai', 'ai'),
  ('systems', 'systems'),
  ('design', 'design'),
  ('nextjs', 'nextjs')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.content (
  slug,
  title,
  excerpt,
  content,
  status,
  article_type,
  featured,
  seo_title,
  seo_description,
  published_at
) VALUES
  (
    'home',
    'Intro',
    'Erik Lüdecker.',
    E'C: Artificial Intelligence Is Being Created to Wake Us Up\n\nP1: This site is a static-first personal CMS backed by Supabase.',
    'published',
    'home',
    true,
    'lüdecker',
    'Personal website and publishing system',
    now()
  )
ON CONFLICT (article_type, slug) DO NOTHING;

INSERT INTO public.content (
  slug, title, excerpt, content, status, article_type, featured, published_at
) VALUES
  ('index', 'articles', 'Writing on design, technology, and practice.', E'C: articles\n\nP1: Long-form notes and essays.', 'published', 'articles', false, now()),
  ('index', 'guides', 'Step-by-step guides and workflows.', E'C: guides\n\nP1: Practical walkthroughs.', 'published', 'guides', false, now()),
  ('index', 'skills', 'Reusable agent instruction sets.', E'C: skills\n\nP1: Cursor skills and playbooks.', 'published', 'skills', false, now()),
  ('index', 'tools', 'MCP servers and integrations.', E'C: tools\n\nP1: External services wired into the stack.', 'published', 'tools', false, now()),
  ('index', 'commands', 'Cursor command workflows.', E'C: commands\n\nP1: Repeatable slash commands.', 'published', 'commands', false, now()),
  ('index', 'subagents', 'Parallel agent exploration.', E'C: subagents\n\nP1: Delegated research and tasks.', 'published', 'subagents', false, now()),
  ('index', 'diagrams', 'Architecture and system maps.', E'C: diagrams\n\nP1: Visual models of flows and structure.', 'published', 'diagrams', false, now())
ON CONFLICT (article_type, slug) DO NOTHING;

