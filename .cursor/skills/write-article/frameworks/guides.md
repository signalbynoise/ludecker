# Framework: `guides` only

Step-by-step walkthrough. **Do not** use essay-only pacing (long theory without steps).

**Voice:** follow [\_voice.md](_voice.md) — verb-led steps, plain prerequisites.

## Outbound links

| Rule | Minimum |
|------|---------|
| Opening / setup sections | **1** official doc link |
| Inline in steps | **3** total across the guide |
| `## Sources` | **4** entries (docs + one community/tutorial) |
| Unique URLs | **6** |

Prefer linking to the exact doc heading the step depends on.

## Body structure

```markdown
## <what the reader will accomplish — outcome headline>

<what you need first — link tools [Cursor docs](https://…)>

<short roadmap in plain bullets>

### Setup

Steps start with verbs (Open, Run, Click). Link [official reference](https://…) where config matters. Use fenced code blocks for shell commands and file paths:

```markdown
```bash
npx @ludecker/aaac@latest init
```
```

### Main workflow

Numbered steps; one action per step; link once per non-obvious command.

### Verify

How you know it worked — what success looks like.

<top 2–3 problems in plain language — link FAQ or docs>

## Sources

[Doc title](https://…) — used in Setup.

(…)
```

## Excerpt

Outcome-focused (“You will set up …”) in everyday words.

## Review checklist

- [ ] [_voice.md](_voice.md) voice checks pass
- [ ] Every `###` phase is actionable
- [ ] Steps use active verbs
- [ ] At least one `site:cursor.com` or product doc link if topic is Cursor-related
- [ ] No invented CLI flags
