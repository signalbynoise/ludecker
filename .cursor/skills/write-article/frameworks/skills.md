# Framework: `skills` only

CMS `skills` entries are **published Agent Skill files** — the same artifact Cursor loads from `.cursor/skills/<name>/SKILL.md`. Format: [Agent Skills specification](https://agentskills.io/specification.md). Overview: [agentskills.io](https://agentskills.io/home).

**Not** a guide, essay, or legacy prefix-line article. **Not** meta-documentation about skills.

## What gets stored

| CMS field | Maps to |
|-----------|---------|
| `title` | Display title (match skill `name`, title case) |
| `slug` | URL slug = skill `name` (lowercase, hyphens) |
| `excerpt` | Copy of frontmatter `description` (≤ 1024 chars) |
| `content` | **Entire `SKILL.md`** — YAML frontmatter + markdown body |

Repo SSOT for agents: `.cursor/skills/<name>/SKILL.md`. After publish, CMS `content` must match that file byte-for-byte (or generate one from the other in the same change).

## Required `SKILL.md` shape

```markdown
---
name: skill-name
description: What this skill does and when the agent must load it. Include trigger keywords.
---

# Skill Title

## Instructions

Step-by-step procedures the agent follows after activation.

## Repo anchors

Paths in this monorepo (no invented files).

## Never

Hard constraints and anti-patterns.

## References

Optional. Markdown links only — [label](https://…).
```

### Frontmatter (required)

| Field | Rule |
|-------|------|
| `name` | 1–64 chars; `a-z`, `0-9`, `-` only; matches `slug` and folder name |
| `description` | 1–1024 chars; **what** + **when** (discovery string) |

Optional: `license`, `compatibility`, `metadata`, `disable-model-invocation`, `paths` (Cursor — scope to globs). See [Cursor skills](https://cursor.com/docs/context/skills).

### Body

- Use `##` sections — standard markdown only
- Project-specific steps only ([best practices](https://agentskills.io/skill-creation/best-practices.md))
- Keep `SKILL.md` under ~500 lines; move deep reference to `references/` if needed
- Code fences for commands, YAML, SQL — not fake examples

## Outbound links

| Rule | Minimum |
|------|---------|
| In body (`## References` or inline) | **3** markdown links |
| Must include | [Agent Skills spec](https://agentskills.io/specification.md) or [Cursor skills](https://cursor.com/docs/context/skills) |
| Unique URLs | **5** |

No bare URLs in prose.

## Excerpt

Duplicate frontmatter `description` exactly (or trim only for length).

## Review checklist

- [ ] `content` parses as valid skill file (opening `---`, `name`, `description`, closing `---`)
- [ ] `slug` === frontmatter `name`
- [ ] `excerpt` === `description` (or justified truncation)
- [ ] Body is executable instructions, not a how-to essay about the topic
- [ ] Matching `.cursor/skills/<name>/SKILL.md` updated in same change when repo skills are used
- [ ] Does not duplicate another skill `name` in `.cursor/skills/`
- [ ] No legacy `C:` / `P1:` prefix lines in body

## Anti-patterns

- Essay structure with numbered pseudo-labels for `skills` type
- Publishing only a YAML snippet inside `P5`
- Generic LLM filler ("follow best practices") without Lüdecker paths
- Skill name `PDF-Processing` (uppercase) or slug mismatch
