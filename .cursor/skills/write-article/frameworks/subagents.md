# Framework: `subagents` only

When and how to use Cursor Task subagents. **Not** a tool setup guide (that is `tools`).

**Voice:** follow [\_voice.md](_voice.md).

## Outbound links

| Rule | Minimum |
|------|---------|
| Selection section | Link Cursor docs on agents/tasks |
| Examples | **2** links to doc or changelog |
| `## Sources` | **3** |
| Unique URLs | **5** |

## Body structure

```markdown
## <pattern name — plain benefit headline>

<problem in everyday words — speed vs quality tradeoff>

<which subagent_type to pick — link [Task tool](https://…) docs>

<when to run in parallel vs one at a time>

<what the subagent must return to the parent>

<how the parent merges results>

<short examples with prompts — link doc anchors>

## Sources

[Cursor — Subagents](https://…) — …
```

## Review checklist

- [ ] [_voice.md](_voice.md) voice checks pass
- [ ] Only allowed `subagent_type` values from Cursor
- [ ] Warns against citing subagent transcript IDs to users
