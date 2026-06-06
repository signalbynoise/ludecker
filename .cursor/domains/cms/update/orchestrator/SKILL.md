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
| `fix_mode` | fix | fix lifecycle (deep investigation) |

## Phases

Follow [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md) for the mode's verb. Domain-specific additions:

1. `load_inventory` — read inventory constraints first
2. Run lifecycle phases in order — **no skipping validate, impact_analysis, dependency_graph, fitness_functions**
3. `rollback` mandatory for auth/revalidation/API plan touches
4. `sync_inventory` — **mandatory** after execute
5. `report` — include confidence, impact, fitness scores

## Docs

- [docs/architecture.md](../../../../../docs/architecture.md)
- [docs/content-model.md](../../../../../docs/content-model.md)

## Dependencies

[cms depends_on ui, database](../../../../aaac/dependencies.yaml)
