# Framework: `home` (Introduction page)

The **Introduction** item in Getting Started — public route `/`, CMS row `article_type: home`, slug **`home`** (fixed).

**Not** an `articles` entry. Use `/write-article intro, …` or `home, …` — not `article, …`.

**Voice:** follow [\_voice.md](_voice.md) — short, welcoming, plain language.

## Scope

- One screenful of orientation — what the site is and where to go next
- Optional **one** ` ```mermaid ` flow diagram (same as articles with a fence)
- Link to deeper pieces with full URLs: `[Introducing Agentic OS](https://ludecker.com/articles/agentic-os)`
- No `## Sources` block required (home is a landing page, not an essay)

## Body structure

```markdown
## Welcome headline

Who this site is for + Agentic OS / AAAC in plain words (1–2 short paragraphs).

## How … works (one glance)   ← optional if diagram included

One sentence: read the chart top to bottom.

```mermaid
flowchart TB
  ...
```

## What you will find here

Brief map of sidebar sections + link to one flagship article.
```

## CMS fields

| Field | Rule |
|-------|------|
| `slug` | Must be `home` (persist script forces this) |
| `featured` | Always `true` |
| `excerpt` | Shown under the page title on `/` |

## Review checklist

- [ ] `article_type` is `home`, not `articles`
- [ ] At most one mermaid fence
- [ ] Links use `https://` anchors (internal paths are not parsed as links)
