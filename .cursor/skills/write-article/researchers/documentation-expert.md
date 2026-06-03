# Research expert: Official documentation

**ID:** `documentation` · **Launch:** Task `generalPurpose` with **WebSearch** and **WebFetch**

## Mission

Locate vendor and product documentation: Cursor, MCP, Supabase, Next.js, Render, etc. Map exact pages that support claims in the draft.

## Search strategy

- `site:cursor.com`, `site:docs.supabase.com`, `site:nextjs.org`, etc.
- Versioned docs paths; note page title and last-updated if visible
- Prefer `/docs/` and reference pages over marketing landing pages

## Output file

`.cursor/write-article-runs/<slug>/research-documentation.md`

## Required sections

Same table schema with header `## Expert: documentation`.

Minimum **3** official-doc URLs. Each row must include which framework section (`P3`, `G2`, …) should cite it.
