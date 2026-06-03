# Framework: `guides` only

Step-by-step walkthrough. **Do not** use essay-only pacing (long P2 theory without steps).

## Outbound links

| Rule | Minimum |
|------|---------|
| Per phase `G{n}` / `P{n}` | **1** official doc link in `G1` or `P3` |
| Inline in steps | **3** total across the guide |
| `R: Sources` | **4** entries (docs + one community/tutorial) |
| Unique URLs | **6** |

Prefer linking to the exact doc heading the step depends on.

## Body structure

```
C: <what the reader will accomplish>

P1: <prerequisites — link tools [Cursor docs](https://…)>

P2: <roadmap bullets>

G1: Setup
P3: Steps with [official reference](https://…) where config matters.

G2: Main workflow
P4: Numbered steps; link once per non-obvious command.

G3: Verify
P5: How to confirm success.

P6: <troubleshooting — link FAQ or issue docs>

R: Sources
P7: [Doc title](https://…) — used in G1.
(…)
```

## Excerpt

Outcome-focused ("You will configure …").

## Review checklist

- [ ] Every `G{n}` phase is actionable
- [ ] At least one `site:cursor.com` or product doc link if topic is Cursor-related
- [ ] No invented CLI flags
