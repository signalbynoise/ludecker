-- Migrate CMS body text from editorial prefixes (C:, P1:, G1:, R:) to markdown.
-- Full conversion for all rows: node apps/website/scripts/migrate-editorial-content.mjs
-- (requires SUPABASE_SERVICE_ROLE_KEY in apps/website/.env.local)

-- Section index pages (idempotent if already migrated)
UPDATE public.content
SET content = E'## articles\n\nLong-form notes and essays.'
WHERE article_type = 'articles' AND slug = 'index'
  AND content LIKE 'C:%';

UPDATE public.content
SET content = E'## guides\n\nPractical walkthroughs.'
WHERE article_type = 'guides' AND slug = 'index'
  AND content LIKE 'C:%';

UPDATE public.content
SET content = E'## skills\n\nCursor skills and playbooks.'
WHERE article_type = 'skills' AND slug = 'index'
  AND content LIKE 'C:%';

UPDATE public.content
SET content = E'## tools\n\nExternal services wired into the stack.'
WHERE article_type = 'tools' AND slug = 'index'
  AND content LIKE 'C:%';

UPDATE public.content
SET content = E'## commands\n\nRepeatable slash commands.'
WHERE article_type = 'commands' AND slug = 'index'
  AND content LIKE 'C:%';

UPDATE public.content
SET content = E'## subagents\n\nDelegated research and tasks.'
WHERE article_type = 'subagents' AND slug = 'index'
  AND content LIKE 'C:%';

UPDATE public.content
SET content = E'## diagrams\n\nVisual models of flows and structure.'
WHERE article_type = 'diagrams' AND slug = 'index'
  AND content LIKE 'C:%';
