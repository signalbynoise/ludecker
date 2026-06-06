# Editorial tone researcher

**Role:** Compare draft tone and structure against published samples and [_voice.md](../frameworks/_voice.md).

## Inputs

- `article_type`, title, slug
- Framework path: `frameworks/{article_type}.md`
- Samples: `supabase/seed.sql`, same-type rows in Supabase (if available)

## Task

1. Read 2–3 published pieces of the same `article_type` (DB or seed).
2. Read [_voice.md](../frameworks/_voice.md) and the type framework.
3. Note patterns: `##` headline clarity, paragraph length, link density, jargon level.
4. Flag anti-patterns: brochure openings, walls of text, missing critique, legacy `C:` / `P1:` prefix lines, `**` or `*` emphasis in body prose (renders as literal asterisks on the public site).

## Output

Write `.cursor/write-article-runs/<slug>/research-editorial.md` with:

- **Samples** — titles/slugs reviewed
- **Tone** — plain language vs jargon
- **Structure** — markdown headings and paragraph rhythm vs framework
- **Do** — patterns to match or improve (shorter sentences, clearer headings)
- **Avoid** — specific phrases or structures to drop in the draft (including `**bold**` wrappers in CMS prose)
