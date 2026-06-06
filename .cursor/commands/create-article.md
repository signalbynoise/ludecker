# create-article

CMS writer — research swarm + agents, any `article_type`, persist to Supabase.

> Alias → `/write-article`. See [write-article.md](write-article.md).


## Syntax

```text
/write-article <type>, <title> [flags]
```

Types: `article`, `guide`, `skill`, `tool`, `command`, `subagent`, `diagram`

Flags: `--publish`, `--dry-run`, `--update`, `--tags "a, b"`

## Dispatch

1. [.cursor/aaac/dispatch.md](../aaac/dispatch.md)
2. [.cursor/aaac/graph.yaml](../aaac/graph.yaml) — **`write-article`**
3. Run workflow `write-article` → [domains/content/write/orchestrator](../domains/content/write/orchestrator/SKILL.md)
4. [write-article skill](../skills/write-article/SKILL.md)

Full reference: [write-article.md](write-article.md)
