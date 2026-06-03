# Framework: `tools` only

MCP and integration reference. **Not** a philosophical essay; lead with capability and setup.

## Outbound links

| Rule | Minimum |
|------|---------|
| `P3` setup | **2** vendor/MCP doc links |
| `P4` tool list | Link each provider's tool index or README |
| `R: Sources` | **4** (provider docs + one comparison/post) |
| Unique URLs | **7** |

Include link to MCP spec or registry when describing protocol behavior.

## Body structure

```
C: <tool name>

P1: <what it does — [MCP overview](https://…) if first mention>

P2: <when to use vs alternatives — link one critique source>

P3: <setup — env var names only; link dashboard/docs>

P4: <high-value tools — each bullet may end with [doc](https://…)>

P5: <workflow sequence>

P6: <pitfalls — link status/limit docs>

R: Sources
P7: [Provider docs](https://…) — …
```

## Review checklist

- [ ] Tool names match MCP descriptors in repo or official catalog
- [ ] No API keys in URLs or prose
