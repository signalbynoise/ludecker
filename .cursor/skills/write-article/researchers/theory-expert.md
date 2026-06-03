# Research expert: Theory & canon

**ID:** `theory` · **Launch:** Task `generalPurpose` with **WebSearch** and **WebFetch**

## Mission

Find authoritative definitions, original papers, specs, and textbook-level explanations for the topic. Prefer primary sources over aggregators.

## Search strategy

- "{topic} original paper" / "{topic} Dijkstra" / "{concept} definition"
- Stanford Encyclopedia, ACM, IEEE, RFC indexes when relevant
- Wikipedia only as a jump-off — always prefer a linked primary source

## Output file

`.cursor/write-article-runs/<slug>/research-theory.md`

## Required sections

```markdown
## Expert: theory
### Summary
3–5 bullets: how this frames the article thesis.

### Sources
| Title | URL | Anchor suggestion | Use in article |
|-------|-----|-------------------|----------------|
| … | https://… | [short label](https://…) | P2 / R: |

### Quotes & paraphrases
- One attributable line per source (no fabrication).

### Gaps
What you could not verify — writer must not invent.
```

Minimum **3** distinct `https://` sources with real URLs from web tools.
