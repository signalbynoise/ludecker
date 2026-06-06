---
name: aaac-update-orchestrator
description: Orchestrates update-module aaac, publish-aaac, and related graph resolvers for @ludecker/aaac npm package. Internal only.
disable-model-invocation: true
---

# aaac-update-orchestrator

## Load first

- [inventory/SKILL.md](../inventory/SKILL.md)
- [graph.yaml](../../../../aaac/graph.yaml) orchestrator entry for this mode
- [dispatch.md](../../../../aaac/dispatch.md)
- [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md)

## Modes (from graph flags)

| Flag | Lifecycle verb | Behavior |
|------|----------------|----------|
| default | update | Change CLI, templates, generators, package meta |
| `test_only` | — | init smoke + aaac:generate diff check → report |
| `create_mode` | create | Scaffold new npm package under `packages/` via module-authoring |
| `fix_mode` | fix | fix lifecycle — see [cms orchestrator fix_mode](../../cms/update/orchestrator/SKILL.md#fix_mode-mandatory) |
| `publish_mode` | release | Version bump, smoke test, pnpm publish, git tag |

## Phases

Follow [_lifecycle.md](../../../skills/shared/verbs/_lifecycle.md) for the mode's verb. Domain-specific additions:

1. `load_inventory` — read inventory constraints first
2. Run lifecycle phases in order — **no skipping validate, impact_analysis, dependency_graph, fitness_functions** (includes `minimal_complexity` on create/update/fix)
3. **plan** must include `requirement_map` + `complexity_score` — extra scrutiny for new ontology entities / commands (YAGNI)
4. `sync_inventory` — **mandatory** after execute; update Section 3 file map if paths changed
5. `report` — include complexity score, version, registry URL, install command

## publish_mode procedure

1. Confirm intent includes target version (e.g. `1.0.1`) or bump `packages/aaac/package.json`
2. Run init smoke: `node packages/aaac/src/cli.mjs init --yes --dir /tmp/aaac-smoke-{run_id}`
3. `pnpm --filter @ludecker/aaac publish --access public --no-git-checks`
4. `git tag aaac-v{version}` and `git push origin aaac-v{version}` when user requested ship
5. Report: [npm package page](https://www.npmjs.com/package/@ludecker/aaac), install `npx @ludecker/aaac@latest init`

**Forbidden:** `npm publish`, `npm login`, `npm install`

## Docs

- [docs/agentic_architecture.md](../../../../../docs/agentic_architecture.md)
- [packages/aaac/README.md](../../../../../packages/aaac/README.md)

## Dependencies

[aaac standalone — no domain deps](../../../../aaac/dependencies.yaml)
