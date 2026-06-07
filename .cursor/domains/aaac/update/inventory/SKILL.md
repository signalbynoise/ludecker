---
name: aaac-inventory
description: >-
  @ludecker/aaac npm package: CLI, generic templates, generators, and publish
  workflow for the Agentic Architecture as Code framework.
argument-hint: "<change description or path under packages/aaac scope>"
effort: medium
disable-model-invocation: true
---

# @ludecker/aaac — Inventory

**Implementation:** [governance/implementation/SKILL.md](../../../skills/shared/governance/implementation/SKILL.md)

**Architecture:** [docs/agentic_architecture.md](../../../../docs/agentic_architecture.md)

**Publish guide:** [ludecker.com/guide/install-aaac](https://ludecker.com/guide/install-aaac)

---

## 1. Module identity

| Field | Value |
|-------|-------|
| **Product name** | AAAC Framework Package |
| **Technical slug** | `aaac` |
| **In one sentence** | Publishable `@ludecker/aaac` npm package — CLI, templates, and generators for generic AAAC installs. |
| **Out of scope** | Lüdecker site (`cms`), design system (`ui`), DB migrations (`database`), Lüdecker-only `.cursor/` overlay (domains/cms, skills/ludecker, write-article) |

---

## 2. Constraints (module-specific)

- **SSOT split** — generic kernel in `packages/aaac/templates/`; Lüdecker overlay stays in repo `.cursor/aaac/graph.project.yaml`, `ontology.json`, domains/cms|ui|database
- **Generators** — SSOT in `packages/aaac/src/generators/`; Lüdecker runs `pnpm aaac:generate`
- **No npm CLI** — publish with `pnpm publish` only; users install with `npx` or `pnpm dlx`
- **Template sync** — when changing `.cursor/skills/shared/`, mirror to `templates/cursor/skills/shared/` before release
- **Version** — bump `packages/aaac/package.json` before `publish-aaac`; tag `aaac-v{version}`
- **Dogfood** — init smoke test: `node packages/aaac/src/cli.mjs init --yes --dir /tmp/aaac-smoke`

**Layer map:**

| Change type | Location | Must NOT |
|-------------|----------|----------|
| CLI | `packages/aaac/src/cli.mjs`, `src/lib/` | Runtime npm dependencies |
| Generators | `packages/aaac/src/generators/` | Lüdecker-specific resolvers in generic templates |
| Generic templates | `packages/aaac/templates/cursor/` | `domains/cms`, `skills/ludecker`, `release-render` |
| Package meta | `packages/aaac/package.json`, `README.md` | Private scoped publish without `--access public` |
| Lüdecker overlay | `.cursor/aaac/graph.project.yaml` | Hand-edit `graph.yaml` (generated) |
| CI publish | `.github/workflows/publish-aaac.yml` | `npm publish` / `npm login` |

---

## 3. Module inventory (auto-maintained)

> **Last synced:** 2026-06-07 — 42 master rules, ui_design.md SSOT, project_context, mcp-and-deploy stub

### Package surface

| Path | Role |
|------|------|
| `package.json` | `@ludecker/aaac` name, bin, files, publishConfig |
| `README.md` | Install commands, publish notes |
| `src/cli.mjs` | `init`, `generate`, `log-dump`, `debug-run`, `--help` |
| `src/lib/install.mjs` | Template copy + generator run |
| `src/lib/copy.mjs` | Recursive copy + placeholder substitution |
| `src/lib/paths.mjs` | `--root`, template paths |
| `src/generators/generate-graph.mjs` | ontology + graph.project.yaml → graph.yaml |
| `src/generators/generate-commands.mjs` | ontology → .cursor/commands |
| `src/generators/generate-graph-commands.mjs` | commands block for graph |

### Templates (generic kernel)

| Path | Role |
|------|------|
| `templates/cursor/aaac/` | Generic ontology, graph.project.yaml, lifecycle, run |
| `templates/cursor/skills/shared/` | Pipeline + verb orchestrators |
| `templates/cursor/agents/` | 13 generic agent specs |
| `templates/cursor/policies/` | `master-rules`, `project-context`, `ui-design`, `implementation`, `mcp-and-deploy`, `minimal-complexity` |
| `templates/docs/` | OOTB `master_rules.md`, `ui_design.md`, `project_context.md`, `architecture.md`, `agentic_architecture.md` |

### Lüdecker wiring (repo, not in npm tarball)

| Path | Role |
|------|------|
| `.cursor/domains/aaac/` | This domain orchestrator + inventory |
| `.cursor/aaac/graph.project.yaml` | Lüdecker resolvers + orchestrators |
| `.cursor/aaac/project.config.json` | manual_commands (launch/kill) |
| `package.json` → `aaac:generate` | Regenerate graph + commands |

### Publish & registry

| Item | Value |
|------|-------|
| Registry | `https://registry.npmjs.org` |
| Package page | `https://www.npmjs.com/package/@ludecker/aaac` |
| Publish | `pnpm --filter @ludecker/aaac publish --access public --no-git-checks` |
| CI tag | `aaac-v*` → `.github/workflows/publish-aaac.yml` |

### Tests and verification

- `pnpm --filter @ludecker/aaac test` — vitest + node tests
- `node packages/aaac/src/cli.mjs init --yes --dir /tmp/aaac-smoke` → ~129 commands
- `pnpm aaac:generate` → diff-clean Lüdecker `graph.yaml`
- `npx @ludecker/aaac@latest --help` after publish (propagation delay possible)

### Anti-patterns

- Editing `packages/aaac/templates/` without syncing from Lüdecker generic shared skills when intentional
- Putting Lüdecker-only domains into generic templates
- Using `npm publish` / `npm install` in docs or CI
- Publishing without version bump or without init smoke test
