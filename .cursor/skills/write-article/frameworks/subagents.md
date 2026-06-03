# Framework: `subagents` only

When and how to use Cursor Task subagents. **Not** a tool setup guide (that is `tools`).

## Outbound links

| Rule | Minimum |
|------|---------|
| `P2` selection table | Link Cursor docs on agents/tasks |
| `P6` examples | **2** links to doc or changelog |
| `R: Sources` | **3** |
| Unique URLs | **5** |

## Body structure

```
C: <pattern name>

P1: <problem — latency/breadth tradeoff>

P2: <subagent_type mapping — link [Task tool](https://…) docs>

P3: <launch rules — parallel vs sequential>

P4: <handoff contract>

P5: <merge strategy for parent>

P6: <examples with prompts — link doc anchors>

R: Sources
P7: [Cursor — Subagents](https://…) — …
```

## Review checklist

- [ ] Only allowed `subagent_type` values from Cursor
- [ ] Warns against citing subagent transcript IDs to users
