---
name: cms-update-orchestrator
description: Orchestrates update-module cms and related graph resolvers for Lüdecker website/CMS domain. Internal only.
disable-model-invocation: true
---

# cms-update-orchestrator

## Load first

- [inventory/SKILL.md](../inventory/SKILL.md)
- [graph.yaml](../../../../aaac/graph.yaml) orchestrator entry for this mode
- [dispatch.md](../../../../aaac/dispatch.md)
- [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md)

## Modes (from graph flags)

| Flag | Lifecycle verb | Behavior |
|------|----------------|----------|
| default | update | Full update lifecycle |
| `test_only` | — | testing → verification → report |
| `design_mode` | update | + design_system fitness emphasis |
| `create_mode` | create | create lifecycle + module-authoring |
| `fix_mode` | fix | fix lifecycle — discovery (4–6) + investigate_swarm (7) + root_cause + gates + fix verify swarm (3) |

## fix_mode (mandatory)

When graph sets `fix_mode: true`:

1. Read [investigation/SKILL.md](../../../skills/shared/investigation/SKILL.md) Mode A — **do not skip swarms**
2. Store artifacts on Run: `investigation.md`, `root_cause.yaml`, `testing` with `repro_status`
3. **plan** — `complexity_score` ≤ 5; cite `fix_strategy` from root cause
4. **rollback** mandatory for auth, revalidation, RLS, public API touches
5. **verify** — fail if `repro_status: not_fixed`
6. **sync_inventory** — mandatory after execute

## Phases

Follow [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md) for the mode's verb. Domain-specific additions:

1. `load_inventory` — read inventory constraints first
2. Run lifecycle phases in order — **no skipping validate, impact_analysis, dependency_graph, fitness_functions** (includes `minimal_complexity` on create/update/fix)
3. **plan** must include `requirement_map` + `complexity_score` per [minimal-complexity.md](../../../../policies/minimal-complexity.md)
4. `rollback` mandatory for auth/revalidation/API plan touches
5. `sync_inventory` — **mandatory** after execute
6. `report` — include confidence, complexity score, impact, fitness scores

## Docs

- [docs/architecture.md](../../../../../docs/architecture.md)
- [docs/content-model.md](../../../../../docs/content-model.md)

## Dependencies

[cms depends_on ui, database](../../../../aaac/dependencies.yaml)
