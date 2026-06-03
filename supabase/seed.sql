-- Sample content for local development and staging
-- Run after migrations: supabase db seed

INSERT INTO public.tags (name, slug) VALUES
  ('architecture', 'architecture'),
  ('ai', 'ai'),
  ('systems', 'systems')
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
    'Personal systems for thinking in public',
    'A minimal publishing surface for articles, guides, and notes.',
    E'P1: This site is a static-first personal CMS backed by Supabase.\n\nPredicate form:\nType · page\nStatus · published',
    'published',
    'page',
    true,
    'lüdecker',
    'Personal website and publishing system',
    now()
  ),
  (
    'general-swarms',
    'General Swarms',
    'Coordinating many agents without losing the plot.',
    E'P1: Swarm architectures trade latency for breadth.\n\nPredicate form:\nType · article',
    'published',
    'article',
    false,
    'General Swarms',
    'Coordinating many agents without losing the plot.',
    now() - interval '1 day'
  ),
  (
    'neural-networks',
    'Neural Networks',
    'Notes on representation, training, and inference.',
    E'P1: Networks are functions with adjustable parameters.\n\nPredicate form:\nType · article',
    'published',
    'article',
    false,
    'Neural Networks',
    'Notes on representation, training, and inference.',
    now() - interval '2 days'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.content_tags (content_id, tag_id)
SELECT c.id, t.id
FROM public.content c
CROSS JOIN public.tags t
WHERE c.slug = 'general-swarms' AND t.slug = 'ai'
ON CONFLICT DO NOTHING;
