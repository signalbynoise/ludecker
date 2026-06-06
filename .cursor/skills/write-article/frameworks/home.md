# Framework: `home` (Introduction page)

The **Introduction** item in Getting Started — public route `/`, CMS row `article_type: home`, slug **`home`** (fixed).

**Not** an `articles` entry. Use `/write-article intro, …` or `home, …` — not `article, …`.

**Voice:** follow [\_voice.md](_voice.md) — short, welcoming, plain language.

## Scope

- One screenful of orientation — what the site is and where to go next
- Optional **one** ` ```mermaid ` flow diagram (same as articles with a fence)
- Link to deeper pieces with full URLs: `[Introducing Agentic OS](https://ludecker.com/articles/agentic-os)`
- No `## Sources` block required (home is a landing page, not an essay)

## Body structure

```markdown
## Welcome headline

Who this site is for + Agentic OS / AAAC in plain words (1–2 short paragraphs).

## How … works (one glance)   ← optional if diagram included

Explain the snake layout and numbered layers in one short paragraph. Add a **Legend** line after the fence.

```mermaid
flowchart TB
    subgraph L1["① User layer"]
        direction LR
        U[User] --> CMD["Slash command<br/>verb · object · domain · intent"]
    end

    subgraph L2["② Control layer"]
        direction RL
        DISP[Dispatch] --> POL[Policies] --> ONT[Ontology] --> GRA["Execution graph"]
    end

    subgraph L3["③ Run layer"]
        direction LR
        RUN["Create Run"] --> PEND["Queue pending phases<br/>lifecycle + gate stack"] --> HK["Runtime hooks<br/>block edits until execute"] --> OBS["Observability on Run<br/>decisions · log · artifacts · checkpoints"]
    end

    subgraph L4["④ Execution layer"]
        direction RL
        ORCH[Orchestrator] --> CAP[Capabilities] --> SK["Skills and agents"]
    end

    subgraph L5["⑤ Work lifecycle"]
        direction LR
        DISC[Discover] --> INV["Investigate<br/>lite or swarm"] --> RC["Root cause<br/>fix verb"] --> PLAN[Plan]
    end

    subgraph L6["⑥ Governance gates"]
        direction RL
        VAL[Validate] --> IMP[Impact analysis] --> DEP[Dependency graph] --> FIT[Fitness functions] --> RB[Rollback]
    end

    subgraph L7["⑦ Delivery"]
        direction LR
        EX[Execute] --> VER[Verify] --> REP[Report] --> DONE["Run completed"]
    end

    STOP["Stop — awaiting approval"]

    CMD --> DISP
    GRA --> RUN
    OBS --> ORCH
    SK --> DISC
    PLAN --> VAL
    RB -->|pass| EX
    RB -->|fail| STOP
    STOP -->|user approves| VAL
```

**Legend:** ① … ⑦ — one line per numbered layer.

## What you will find here

Brief map of sidebar sections + link to one flagship article.
```

## Diagram rules

- **Seven numbered subgraphs** — match AAAC responsibility layers in `docs/agentic_architecture.md`
- **Snake layout** — odd layers `direction LR`, even layers `direction RL`
- Run created in ③, not at the end; gates (⑥) after plan, before execute
- SSOT for fallback copy: `apps/website/lib/content/home-intro.ts`

## CMS fields

| Field | Rule |
|-------|------|
| `slug` | Must be `home` (persist script forces this) |
| `featured` | Always `true` |
| `excerpt` | Shown under the page title on `/` |

## Review checklist

- [ ] `article_type` is `home`, not `articles`
- [ ] At most one mermaid fence
- [ ] Links use `https://` anchors (internal paths are not parsed as links)
- [ ] Numbered layers ①–⑦ with legend
