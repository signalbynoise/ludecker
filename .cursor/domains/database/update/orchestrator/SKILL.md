---
name: database-update-orchestrator
description: Orchestrates update-module database for Supabase schema and RLS. Internal only.
disable-model-invocation: true
---

# database-update-orchestrator

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
| `fix_mode` | fix |

## Phases

Follow [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md).

**Protected maturity:** schema/migration objects — **rollback phase mandatory** before execute. Never skip impact_analysis or dependency_graph.

Apply migrations via Supabase MCP per policies.

## Docs

- [docs/content-model.md](../../../../../docs/content-model.md)
- [docs/deployment.md](../../../../../docs/deployment.md)
