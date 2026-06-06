# write-article

CMS writer — research swarm + agents, any `article_type`, persist to Supabase.

## Syntax

```text
/write-article <type>, <title> [flags]
/write-article <type> <title> [flags]
```

| Flag | Effect |
|------|--------|
| `--publish` | Published + `published_at` now (default: draft) |
| `--dry-run` | Full swarm; skip DB persist |
| `--update` | Upsert when `(article_type, slug)` exists |
| `--tags "a, b"` | Comma-separated tag names |

## Types (aliases → CMS `article_type`)

| You type | CMS type | Framework |
|----------|----------|-----------|
| `article` | `articles` | editorial essays |
| `guide` | `guides` | how-to |
| `skill` | `skills` | copyable `SKILL.md` body |
| `tool` | `tools` | tool write-ups |
| `command` | `commands` | slash-command docs |
| `subagent` | `subagents` | subagent specs |
| `diagram` | `diagrams` | single mermaid diagram piece |

SSOT: `packages/types/src/article-type.ts`

## Aliases

Same swarm, same orchestrator:

- `/write-content` → this command
- `/cms-write` → this command
- `/create-article` → this command
- `/publish-article` → this command

## AAAC dispatch

1. [.cursor/aaac/dispatch.md](../aaac/dispatch.md)
2. [.cursor/aaac/graph.yaml](../aaac/graph.yaml) — **`write-article`**
3. Create **Run** — workflow `write-article` (no pre-execute gate stack)
4. Orchestrator [`domains/content/write/orchestrator`](../domains/content/write/orchestrator/SKILL.md)
5. Skill [`write-article`](../skills/write-article/SKILL.md) — 7 parallel research agents, write, review, persist

## Examples

```text
/write-article article, Separation of Concerns
/write-article guide, How to build Commands in Cursor --publish
/write-article skill, api-first --tags "cms, agents"
/write-article diagram, OAuth authorization code flow --dry-run
/write-article command, write-article --update
```
