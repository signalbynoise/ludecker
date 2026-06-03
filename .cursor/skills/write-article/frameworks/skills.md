# Framework: `skills` only

Cursor Agent Skill documentation for humans and agents. **Not** a general essay or a shell tutorial.

## Outbound links

| Rule | Minimum |
|------|---------|
| `P2` triggers | Link [Cursor skills docs](https://cursor.com/docs) or changelog |
| `P3` workflow | **2** links to related official docs |
| `R: Sources` | **3** (Cursor + one external best-practice) |
| Unique URLs | **5** |

## Body structure

```
C: <skill name>

P1: <what + when — link skill concept [Agent Skills](https://…)>

P2: <triggers — bullet list>

P3: <workflow phases — link SSOT paths in repo AND official docs where relevant>

P4: <constraints & anti-patterns>

P5: <examples — fenced; may include `/command` names without fake URLs>

R: Sources
P6: [Cursor — Skills](https://…) — …
```

## Excerpt

Third-person YAML-style description (≤ 1024 chars).

## Review checklist

- [ ] Does not duplicate an existing skill name in `.cursor/skills/`
- [ ] Official Cursor documentation linked, not guessed URLs
