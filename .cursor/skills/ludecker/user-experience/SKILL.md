---
name: user-experience
description: Improve editorial readability, publish feedback, fallback behavior, and navigation clarity when editing content-model docs, CMS copy, fallbacks, ISR, or public content structure.
---

# User Experience

## Instructions

1. **Reader scan** — CMS bodies (non-skill types) use labeled blocks (`C:`, `P1:`…) and short paragraphs. Links use readable anchors, not raw URLs.
2. **Skill entries** — `skills` type is a `SKILL.md` file for agents, not an essay; excerpt mirrors frontmatter `description`.
3. **Status visibility** — admin saves and publish should surface explicit success/failure; never silent CMS failures (master rules §16).
4. **Degraded read** — when Supabase is unavailable, `apps/website/lib/content/fallback.ts` logs and serves documented fallback copy.
5. **Freshness** — public pages use ISR (`revalidate = 3600`); publishing must trigger `revalidatePublicContent` so readers see updates.
6. **Heuristic pass** — for IA/copy changes, check [Nielsen heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/): system status, error recovery, consistency.

## Repo anchors

- `docs/content-model.md` — body conventions (note: enum list may lag `packages/types`)
- `apps/website/lib/content/fallback.ts`
- `apps/website/lib/content/revalidate-public.ts`
- `packages/utils/src/content-links.ts`

## Never

- Wall-of-text CMS entries without section labels (for editorial types)
- Hide publish or revalidate failures
- Break nav SSOT for a one-off link
- Optimize animation before readable structure

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [NN/g — 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [NN/g — Heuristic evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/theory-heuristic-evaluations/)
- [agentskills.io — Best practices](https://agentskills.io/skill-creation/best-practices.md)
