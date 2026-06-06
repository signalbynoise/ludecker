-- Remove ** bold markers from CMS prose content (skills exempt).
-- persist-content.mjs and validate-form.ts strip on future writes; this cleans existing rows.

UPDATE public.content
SET
  content = replace(content, '**', ''),
  updated_at = now()
WHERE article_type <> 'skills'
  AND content LIKE '%**%';
