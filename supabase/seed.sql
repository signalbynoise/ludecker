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
    'Agentic OS (AAAC) — design, technology, and practice for teams running Cursor agents with architecture in git.',
    E'## Welcome to Lüdecker\n\nThis site is about **Agentic OS**—also called **Agentic Architecture as Code (AAAC)**. You run slash commands; the repo owns the workflow; every chat leaves a reviewable trail.\n\nIf you build with Cursor on a shared codebase, start here. For the full story, read [Introducing Agentic OS](https://ludecker.com/articles/agentic-os).',
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
  ('index', 'articles', 'Long-form essays on design, systems, and practice.', E'## Essays and notes\n\nThoughtful pieces on how we design, build, and work with AI — written in plain language.', 'published', 'articles', false, now()),
  ('index', 'guides', 'Step-by-step guides you can follow.', E'## How-to guides\n\nPractical walkthroughs with clear steps. Each guide tells you what you need first and what success looks like.', 'published', 'guides', false, now()),
  ('index', 'skills', 'Reusable instructions for AI agents.', E'## Agent skills\n\nCopy-paste playbooks that teach Cursor agents how to work in your project.', 'published', 'skills', false, now()),
  ('index', 'tools', 'Services and integrations for your stack.', E'## Tools and integrations\n\nMCP servers and external services wired into your development workflow.', 'published', 'tools', false, now()),
  ('index', 'commands', 'Repeatable slash commands.', E'## Cursor commands\n\nSaved workflows you run with a slash command — same steps every time.', 'published', 'commands', false, now()),
  ('index', 'subagents', 'When to delegate work to specialist agents.', E'## Subagents\n\nPatterns for splitting research and implementation across parallel agents.', 'published', 'subagents', false, now()),
  ('index', 'diagrams', 'Visual explainers for complex ideas.', E'## Diagrams\n\nOne diagram per piece, with short prose that helps you read it top to bottom.', 'published', 'diagrams', false, now())
ON CONFLICT (article_type, slug) DO NOTHING;

