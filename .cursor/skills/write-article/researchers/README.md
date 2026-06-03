# Web research experts (mandatory swarm)

The parent agent launches **all five** experts **in parallel** in Phase 1, in addition to codebase and editorial researchers.

| ID | File | Focus |
|----|------|--------|
| `theory` | [theory-expert.md](theory-expert.md) | Canon, papers, definitions |
| `practice` | [practice-expert.md](practice-expert.md) | Engineering blogs, case studies |
| `documentation` | [documentation-expert.md](documentation-expert.md) | Official product docs |
| `current` | [current-events-expert.md](current-events-expert.md) | Recent releases & trends |
| `critique` | [critique-expert.md](critique-expert.md) | Limits & alternatives |

Each expert **must** use web tools (not training memory alone) and write its own `research-<id>.md` under the run folder.

Parent merges into:

- `research.md` — narrative synthesis
- `sources.json` — machine-readable catalog (see SKILL.md)
