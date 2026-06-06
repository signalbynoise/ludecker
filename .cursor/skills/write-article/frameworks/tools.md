# Framework: `tools` only

MCP and integration reference. **Not** a philosophical essay; lead with capability and setup.

**Voice:** follow [\_voice.md](_voice.md).

## Outbound links

| Rule | Minimum |
|------|---------|
| Setup section | **2** vendor/MCP doc links |
| Tool list | Link each provider's tool index or README |
| `## Sources` | **4** (provider docs + one comparison/post) |
| Unique URLs | **7** |

Include link to MCP spec or registry when describing protocol behavior.

## Body structure

```markdown
## <tool name — what it helps you do>

<plain summary — [MCP overview](https://…) if first mention>

<when to use vs alternatives — one limitation; link one critique source>

<setup in plain steps — env var names only; link dashboard/docs>

<high-value tools — short bullets with [doc](https://…) links>

<typical workflow in plain sequence>

<common mistakes — link status/limit docs>

## Sources

[Provider docs](https://…) — …
```

## Review checklist

- [ ] [_voice.md](_voice.md) voice checks pass
- [ ] Tool names match MCP descriptors in repo or official catalog
- [ ] No API keys in URLs or prose
