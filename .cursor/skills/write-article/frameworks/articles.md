# Framework: `articles` only

Essays and long-form argument. **Do not** use guide-style `###` phase headings or command flag tables.

**Voice:** follow [\_voice.md](_voice.md) — plain language, reader-first, short paragraphs.

## Outbound links

| Rule | Minimum |
|------|---------|
| Inline citations in body paragraphs | **4** `[anchor](https://…)` |
| `## Sources` section | **5** linked entries (one line each) |
| Unique URLs total | **8** |
| Expert mix | ≥1 theory, ≥1 practice, ≥1 critique |

Anchor style: `[Dijkstra (1974)](https://…)` or `[Stripe engineering blog](https://…)`.

## Body structure

```markdown
## <plain-language headline — the main takeaway>

<who this is for + why it matters — one link if helpful>

<simple context — 2+ outbound links; define terms in plain words>

<evidence and tradeoffs — include one limitation; 2+ links>

<what to do differently — 1+ link; concrete for builders>

<one-sentence takeaway — no “In conclusion”>

## Sources

[Author — Title](https://…) — one line why it helped.

[Next source](https://…) — …

(continue until all major sources listed)
```

## Excerpt

Thesis in one plain sentence (&lt; 160 chars) a non-expert understands.

## Review checklist

- [ ] [_voice.md](_voice.md) voice checks pass
- [ ] Reads as a conversation, not a thesis template
- [ ] Link minimums met; anchors are human-written
- [ ] Critique expert represented in body or Sources
- [ ] Unique URL count meets framework minimum
