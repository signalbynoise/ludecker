# Framework: `commands` only

Cursor slash command spec. Mirror [.cursor/commands/ship-ludecker.md](../../../commands/ship-ludecker.md) density for agents; add a plain-language layer for human skimmers.

**Voice:** follow [\_voice.md](_voice.md).

## Outbound links

| Rule | Minimum |
|------|---------|
| Phase sections | **1** link to related Cursor docs per major phase |
| Examples section | Link command docs if public |
| `## Sources` | **3** |
| Unique URLs | **5** |

## Body structure

```markdown
## <command title — what it does in plain words>

<one plain sentence for humans, then purpose + hard rules>

<parse input as short prose — who passes what>

<preconditions in plain language>

<phases — verb-led bullets; link [Cursor commands](https://…) where relevant>

<anti-patterns — “don’t do X because…” in plain words>

<examples — one-line context before each fenced `/command` line>

## Sources

[Cursor — Commands](https://…) — …
```

## Review checklist

- [ ] [_voice.md](_voice.md) voice checks pass
- [ ] Runnable by an agent without ambiguous steps
- [ ] Human can skim the opening and understand the command
- [ ] Examples match real command name
