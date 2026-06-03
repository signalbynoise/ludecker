# Framework: `commands` only

Cursor slash command spec. Mirror [.cursor/commands/ship-ludecker.md](../../../commands/ship-ludecker.md) density.

## Outbound links

| Rule | Minimum |
|------|---------|
| `P4` phases | **1** link to related Cursor docs per major phase |
| Examples in `P6` | Link command docs if public |
| `R: Sources` | **3** |
| Unique URLs | **5** |

## Body structure

```
C: <command title>

P1: <purpose + hard rules>

P2: <parse input table as prose>

P3: <preconditions>

P4: <phases — link [Cursor commands](https://…) where relevant>

P5: <anti-patterns>

P6: <examples — fenced `/command` lines>

R: Sources
P7: [Cursor — Commands](https://…) — …
```

## Review checklist

- [ ] Runnable by an agent without ambiguous steps
- [ ] Examples match real command name
