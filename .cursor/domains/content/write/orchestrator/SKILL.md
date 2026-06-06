---
name: write-article-orchestrator
description: AAAC orchestrator for CMS content swarm — any article_type via agent researchers. Internal only.
disable-model-invocation: true
---

# write-article orchestrator

Exception workflow — not verb×object lifecycle. Phases from [lifecycle/lifecycle.json](../../../../aaac/lifecycle/lifecycle.json) `workflows.write-article`.

## AAAC dispatch

1. [dispatch.md](../../../../aaac/dispatch.md) — create Run (`workflow: write-article`, no governance gate stack)
2. [graph.yaml](../../../../aaac/graph.yaml) — `commands.write-article` → this orchestrator
3. [run/RUN.md](../../../../aaac/run/RUN.md) — update Run after each phase

## Parse (Run phase: `parse`)

From command arguments:

```text
/write-article <type>, <title> [--publish] [--dry-run] [--update] [--tags "a, b"]
```

Type aliases and flags: [write-article/SKILL.md](../../../skills/write-article/SKILL.md) § Parse input.

**One command = one CMS row.** Do not batch multiple titles.

Record on Run: `intent` = title, `artifacts.article_type`, `artifacts.flags`.

## Phases (Run `pending` queue)

| Phase | Owner | Action |
|-------|-------|--------|
| `parse` | parent | Resolve type, slug, flags; create `write-article-runs/<slug>/` |
| `research_swarm` | parent + Task agents | 5 web experts + editorial (+ codebase except `diagrams`) |
| `write` | Task `generalPurpose` | Draft per `frameworks/{article_type}.md` → `draft.json` |
| `review` | Task `generalPurpose` | Framework checklist; max 2 revision rounds |
| `persist` | parent | `persist-content.mjs` unless `--dry-run` |
| `report` | [reporting](../../../skills/shared/reporting/SKILL.md) | Plain-language summary; set Run `status: completed` |

**Skill SSOT:** [write-article/SKILL.md](../../../skills/write-article/SKILL.md) — swarm agents, frameworks, persist, anti-patterns.

## Human approval

If review FAIL after 2 rounds → Run `status: blocked`, `awaiting_approval: true`, `blocked_reason: review failed`. Do not persist until user approves or revises intent.

## Anti-patterns

- Duplicating swarm prose here — skill owns researchers and frameworks
- Skipping parallel web research subagents
- Publishing on FAIL review
- Using domain/intent AAAC syntax — this command uses **type + title**
