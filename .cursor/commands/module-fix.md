# module-fix

AAAC: `/module-fix <domain> "<intent>"`

**Layer:** code  
**Repair something broken** a **module** — full fix swarm (discovery + 7-agent investigate_swarm + root cause + gates + repro verify).

> Alias → `/fix-module`. See [fix-module.md](fix-module.md).


## Dispatch

1. [.cursor/aaac/dispatch.md](../aaac/dispatch.md)
2. [.cursor/aaac/graph.yaml](../aaac/graph.yaml) — **`fix-module`**
3. [verb-fix orchestrator](../skills/shared/verbs/fix/orchestrator/SKILL.md) — object `module`
4. [investigation/SKILL.md](../skills/shared/investigation/SKILL.md) Mode A

Domain slug optional.

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
/module-fix payments "Webhook handler drops events on retry"
/module-fix api "Auth middleware returns 500 on expired token"
```
