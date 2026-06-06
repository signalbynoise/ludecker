---
name: user-interface
description: Keep presentation-only UI in packages/ui with accessible markup, NAV_ITEMS-driven nav, and ArticleBody link syntax when editing SiteNav, ArticleBody, ContentSection, or component CSS.
---

# User Interface

## Instructions

1. **Presentation only** — components accept props; no Supabase, server actions, or business rules in `packages/ui`.
2. **Navigation** — `SiteNav` consumes `NAV_ITEMS` from `@ludecker/types`. Never hardcode section hrefs in UI.
3. **Article body** — non-skill CMS content is markdown (`##` headings, paragraphs). Outbound links: `[label](https://…)` parsed by `packages/utils/src/content-links.ts`, rendered in `ArticleInlineText`.
4. **Skills pages** — `article_type: skills` stores full `SKILL.md`; rendered via `SkillArticleBody`.
5. **Accessibility** — interactive widgets follow [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) patterns; every focusable control has an accessible name.
6. **Reuse** — extend `Button`, `ContentSection`, `PageShell`, `SiteLayout` before adding one-off layout primitives.

## Repo anchors

- `packages/ui/src/ArticleBody.tsx`
- `packages/ui/src/SiteNav.tsx`
- `packages/ui/src/SkillArticleBody.tsx`
- `apps/website/app/admin/` — CMS UI stays out of `packages/ui`

## Never

- Fetch or mutate data inside UI components
- Bare URLs in CMS paragraph text
- Inline styles or style objects
- Define components inside other component files

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [APG — Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Design patterns and WCAG](https://tetralogical.com/blog/2024/08/09/design-patterns-wcag/)
