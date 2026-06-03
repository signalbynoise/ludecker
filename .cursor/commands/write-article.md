# Write Article

Spawn a **research swarm → write → review → persist** pipeline for the Lüdecker CMS.

**Load skill:** [write-article](../skills/write-article/SKILL.md) — follow it completely.

---

## Parse input

```
/write-article <type>, <title>
```

| Flag | Effect |
|------|--------|
| `--publish` | Save as published |
| `--dry-run` | No DB write |
| `--update` | Upsert existing slug |
| `--tags "a, b"` | Tags |

Type aliases: `article`→`articles`, `guide`→`guides`, etc. (full table in skill).

---

## Research swarm

**Default (most types):** 7 parallel agents — 5 web experts + codebase + editorial.

**`diagrams` only:** 6 parallel agents — 5 web experts + editorial. **No codebase agent.** Articles are **global** (one diagram, topic-first), not Lüdecker/repo docs.

---

## Write & persist

1. Writer uses **only** [frameworks/{type}.md](../skills/write-article/frameworks/) for that `article_type`.
2. **`diagrams`:** one ` ```mermaid ` block in P3; no repo paths in prose.
3. Reviewer checks framework + link rules.
4. `node .cursor/skills/write-article/scripts/persist-content.mjs` unless `--dry-run`.

---

## Multiple articles (same type)

One command per article — not comma-separated titles in one line.

## Examples

```
/write-article diagram, State Machines
/write-article article, Separation of Concerns
/write-article guide, How to build Commands in Cursor
```
