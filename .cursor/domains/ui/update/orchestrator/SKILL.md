---
name: ui-update-orchestrator
description: Orchestrates update-module ui and related graph resolvers for @ludecker/ui. Internal only.
disable-model-invocation: true
---

# ui-update-orchestrator

## Load first

- [inventory/SKILL.md](../inventory/SKILL.md)
- [graph.yaml](../../../../aaac/graph.yaml)
- [dispatch.md](../../../../aaac/dispatch.md)
- [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md)

## Modes

| Flag | Lifecycle verb |
|------|----------------|
| default | update |
| `test_only` | — |
| `design_mode` | update |
| `fix_mode` | fix |

## Phases

Follow [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md). Emphasize [fitness-functions](../../../skills/shared/fitness-functions/SKILL.md) `design_system` and `accessibility` on execute-bound phases.

`sync_inventory` mandatory after execute.
