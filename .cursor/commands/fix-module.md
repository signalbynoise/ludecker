# fix-module

AAAC: `/fix-module <domain> "<intent>"`

**Layer:** code  
**Repair something broken** a **module** — full fix swarm (discovery + 7-agent investigate_swarm + root cause + gates + repro verify).

Aliases: `/module-fix` → same command.


## Dispatch

1. [.cursor/aaac/dispatch.md](../aaac/dispatch.md)
2. [.cursor/aaac/graph.yaml](../aaac/graph.yaml) — **`fix-module`**
3. resolver **`fix-domain-by-slug`** (project overlay in `graph.project.yaml`)
4. [investigation/SKILL.md](../skills/shared/investigation/SKILL.md) Mode A + domain `fix_mode` when resolver routes to a domain orchestrator

Domain slug **recommended** when your project overlay defines domain resolvers (see `graph.project.yaml`).

## Swarm (mandatory)

| Phase | Agents | Parallel |
|-------|--------|----------|
| discover | discovery-inventory, discovery-boundaries, discovery-ssot | 4–6 |
| investigate_swarm | fix-repro, fix-code-path, fix-recent-changes, fix-test-failures, fix-regression-scope, fix-runtime-evidence, fix-inventory-confirm | **7** |
| root_cause | parent + optional fix-hypothesis-validate | 0–1 |
| verify | fix-repro-verify, unit-test-run, fallow-check-changed | **3** |

Contract: [fix-module.yaml](../aaac/contracts/commands/fix-module.yaml)

## Example

```text
/fix-module payments "Webhook handler drops events on retry"
/fix-module api "Auth middleware returns 500 on expired token"
```
