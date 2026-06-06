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
| `fix_mode` | fix | fix lifecycle — see [cms orchestrator fix_mode](../../cms/update/orchestrator/SKILL.md#fix_mode-mandatory) | fix lifecycle — see [cms orchestrator fix_mode](../cms/update/orchestrator/SKILL.md#fix_mode-mandatory) (same swarm rules) |

## Phases

Follow [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md). Emphasize [fitness-functions](../../../skills/shared/fitness-functions/SKILL.md) `design_system`, `accessibility`, and **`minimal_complexity`** on create/update/fix.

**Plan gate:** `requirement_map` + `complexity_score` per [minimal-complexity.md](../../../../policies/minimal-complexity.md).

`sync_inventory` mandatory after execute.
