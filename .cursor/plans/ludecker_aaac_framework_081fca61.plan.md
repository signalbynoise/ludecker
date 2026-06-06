---
name: Ludecker AAAC Framework
overview: Port Arvid's Agentic Architecture as Code (AAAC) scaffold into Ludecker with the same rigid topology—ontology, graph.yaml SSOT, generated command matrix, shared pipeline skills, agent specs, domain orchestrators/inventories, and policies—adapted to the Lüdecker monorepo (website/cms, ui, database) and existing workflows (write-article, launch/ship).
todos:
  - id: aaac-core
    content: Create .cursor/aaac/ (ontology.json, dispatch.md, contract-schema.md, 3 generators) with Ludecker command_overrides and resolvers
    status: completed
  - id: policies-rules
    content: Add .cursor/policies/ (3 files) + deploy.mdc and supabase-mcp.mdc rules
    status: completed
  - id: shared-skills
    content: Copy Arvid skills/shared/ pipeline + verb orchestrators; wire Ludecker object skills from existing flat skills
    status: completed
  - id: agents
    content: "Create .cursor/agents/ (14 agents: discovery/plan/review/test + release-git + release-render); omit PostHog/Linear/Sentry"
    status: completed
  - id: domain-cms
    content: Create domains/cms/update/ orchestrator + inventory with apps/website file map
    status: completed
  - id: domain-ui
    content: Create domains/ui/update/ orchestrator + inventory for packages/ui
    status: completed
  - id: domain-database
    content: Create domains/database/update/ orchestrator + inventory for supabase/migrations
    status: completed
  - id: exception-orchestrators
    content: Add write-article, update-doc, review-module, review-incident, test-function, release-app orchestrators
    status: completed
  - id: generate-commands
    content: Run generate-graph.mjs + generate-commands.mjs; add manual launch/kill stubs; ship-ludecker as alias
    status: completed
  - id: docs-aaac
    content: Write docs/agentic_architecture.md and cross-link from docs/architecture.md
    status: completed
isProject: false
---

# Ludecker AAAC Framework Adaptation

## Goal

Implement the full AAAC stack from [arvid/docs/agentic_architecture.md](/Users/eriklydecker/arvid/docs/agentic_architecture.md) in Ludecker so that:

> **Commands are the public API. Skills, agents, rules, and docs are private implementation.**

User intent flows: **Intent → Command → Execution Graph → Result**, with SSOT at [`.cursor/aaac/graph.yaml`](.cursor/aaac/graph.yaml).

---

## Topology (rigid layout)

```text
.cursor/
  commands/              # thin routers (public API) — generated + manual exceptions
  aaac/
    graph.yaml           # SSOT wiring
    ontology.json        # verbs × objects × layers
    ontology.md          # human-readable ontology
    dispatch.md          # mandatory 5-step protocol
    contract-schema.md   # orchestrator/skill contracts
    generate-graph.mjs
    generate-graph-commands.mjs
    generate-commands.mjs
  domains/<slug>/update/
    orchestrator/        # phase graph + contract.yaml
    inventory/           # constraints + file map (synced after code changes)
  skills/shared/         # pipeline + verb orchestrators + object skills
  skills/write-article/  # existing content swarm (wired as exception orchestrator)
  agents/                # subagent prompt specs (no duplicated prose in orchestrators)
  policies/              # inherited by all orchestrators
  rules/                 # existing master-rules.mdc + new deploy/mcp rules
docs/
  agentic_architecture.md   # Part 1 (everyone) + Part 2 (maintainers appendix)
```

```mermaid
flowchart TD
  user[UserIntent] --> cmd[SlashCommand]
  cmd --> dispatch[dispatch.md]
  dispatch --> graph[graph.yaml]
  graph --> orch[DomainOrchestrator]
  orch --> inv[DomainInventory]
  orch --> skills[SharedPipelineSkills]
  skills --> agents[AgentSpecs]
  agents --> result[Report]
  policies[Policies] --> orch
  policies --> skills
```

---

## Phase 1 — AAAC core (copy + adapt)

Copy the Arvid generator scaffold verbatim, then retarget paths and Ludecker-specific resolvers.

| File | Adaptation |
|------|------------|
| [`aaac/dispatch.md`](/Users/eriklydecker/arvid/.cursor/aaac/dispatch.md) | Copy as-is (path conventions unchanged) |
| [`aaac/contract-schema.md`](/Users/eriklydecker/arvid/.cursor/aaac/contract-schema.md) | Copy as-is |
| [`aaac/generate-*.mjs`](/Users/eriklydecker/arvid/.cursor/aaac/) | Copy; edit static tail in `generate-graph.mjs` for Ludecker resolvers/orchestrators/agents |
| [`aaac/ontology.json`](/Users/eriklydecker/arvid/.cursor/aaac/ontology.json) | Same 8 verbs × 12 objects matrix and `invalid_pairs`; replace `command_overrides` aliases for Ludecker |
| [`aaac/ontology.md`](/Users/eriklydecker/arvid/.cursor/aaac/ontology.md) | Regenerate from ontology.json with Ludecker examples |
| [`aaac/graph.yaml`](/Users/eriklydecker/arvid/.cursor/aaac/graph.yaml) | Generated — do not hand-edit long-term |

### Ludecker command overrides (aliases)

| Alias | Canonical | Notes |
|-------|-----------|-------|
| `ship-ludecker` | `release-app` | Migrate existing [`ship-ludecker.md`](.cursor/commands/ship-ludecker.md) body into release agents |
| `module-update` | `update-module` | Arvid parity |
| `architecture`, `update-doc` | `update-architecture` | Points to doc orchestrator |
| `swarm-check` | `review-incident` | Arvid parity |
| `refactor` | `review-module` | Arvid parity |
| `update-design` | `update-component` | Resolver with design emphasis |

**Manual commands (outside graph, like Arvid's `ship-arvid-mac`):**

- [`launch-ludecker.md`](.cursor/commands/launch-ludecker.md) — keep current full procedure
- [`kill-ludecker.md`](.cursor/commands/kill-ludecker.md) — keep current procedure
- `write-article` — exception orchestrator (see Phase 4)

Run generators after scaffold:

```bash
node .cursor/aaac/generate-graph.mjs && node .cursor/aaac/generate-commands.mjs
```

This produces the full **96 verb×object commands** plus resolver/alias stubs (~120+ files), matching Arvid's rigid matrix.

---

## Phase 2 — Policies and rules

Create [`.cursor/policies/`](.cursor/policies/) (3 files, Arvid pattern):

| Policy | Points to |
|--------|-----------|
| `master-rules.md` | [`docs/master_rules.md`](docs/master_rules.md) + [`.cursor/rules/master-rules.mdc`](.cursor/rules/master-rules.mdc) |
| `implementation.md` | `skills/shared/governance/implementation/SKILL.md` + [`docs/architecture.md`](docs/architecture.md) + [`docs/content-model.md`](docs/content-model.md) |
| `mcp-and-deploy.md` | New [`.cursor/rules/deploy.mdc`](.cursor/rules/deploy.mdc) + [`.cursor/rules/supabase-mcp.mdc`](.cursor/rules/supabase-mcp.mdc) summarizing Render MCP (`user-render`, service `ludecker-website`), Supabase MCP for migrations, no secrets in commits |

Add `.cursor/rules/deploy.mdc` and `.cursor/rules/supabase-mcp.mdc` — distilled from [`docs/deployment.md`](docs/deployment.md) and existing ship/launch commands.

---

## Phase 3 — Shared pipeline skills (copy from Arvid)

Copy entire [`.cursor/skills/shared/`](/Users/eriklydecker/arvid/.cursor/skills/shared/) tree (~51 files):

**Pipeline:** `discovery`, `planning`, `execution`, `testing`, `verification`, `reporting`, `investigation`, `check`, `remove`, `module-authoring`, `documentation`, `architecture`

**Verb orchestrators:** `verbs/{create,update,fix,review,check,test,release,remove}/orchestrator/` each with `SKILL.md` + `contract.yaml`

**Object skills:** `component`, `schema`, `model`, `migration`, `workflow`, `integration`, `domain`

**Governance:** `governance/implementation/SKILL.md` — mandatory on all code-changing execution phases

**Utilities:** `verbs/_dispatch-utils.md`, `verbs/_object-skills.md`

### Wire Ludecker domain skills into `object_skills`

Retire flat root skills as the routing layer; **relocate content** into graph-referenced skills (keep filenames stable where possible):

| Current skill | New location / graph binding |
|---------------|------------------------------|
| [`architecture/SKILL.md`](.cursor/skills/architecture/SKILL.md) | `skills/shared/architecture/` + `object_skills.module`, `object_skills.component` |
| [`design-system/SKILL.md`](.cursor/skills/design-system/SKILL.md) | `skills/shared/component/ludecker-design-system.md` or subfolder; loaded on `update-component` / `update-design` |
| [`user-interface/SKILL.md`](.cursor/skills/user-interface/SKILL.md) | Merge into component skill |
| [`user-experience/SKILL.md`](.cursor/skills/user-experience/SKILL.md) | `object_skills.feature`, `object_skills.workflow` |
| [`api-first/SKILL.md`](.cursor/skills/api-first/SKILL.md) | `object_skills.integration` |
| [`database-schema/SKILL.md`](.cursor/skills/database-schema/SKILL.md) | `object_skills.schema`, `object_skills.migration` |
| [`security/SKILL.md`](.cursor/skills/security/SKILL.md) | Loaded by `execution` + `database-*` commands |
| [`infrastructure/SKILL.md`](.cursor/skills/infrastructure/SKILL.md) | `release-app`, `review-incident` optional skill |

Leave stub redirects at old paths for one release (Arvid pattern: `implementation/SKILL.md` → governance).

---

## Phase 4 — Agent specs (16 agents)

Copy from Arvid [`.cursor/agents/`](/Users/eriklydecker/arvid/.cursor/agents/) and adapt release agents:

| Agent | Ludecker adaptation |
|-------|---------------------|
| `discovery-inventory`, `discovery-boundaries`, `discovery-ssot` | Copy; inventory paths point to Ludecker domains |
| `plan-layer-map`, `plan-state-machines` | Copy |
| `boundary-review`, `dependency-analysis`, `system-decomposition` | Copy; layer map uses `apps/website`, `packages/ui`, `packages/types`, `packages/utils`, `supabase/` |
| `unit-test-run`, `fallow-check-changed` | Copy; test commands = `pnpm typecheck`, package filters from root |
| `check-capability-trace` | Copy |
| **`release-git`** | Port Phase 1–3 from [`ship-ludecker.md`](.cursor/commands/ship-ludecker.md) |
| **`release-render`** | Port Phase 4; service SSOT `ludecker-website`, MCP `user-render`, smoke URL from `render.yaml` |
| ~~`release-posthog`~~ | **Omit** — not in Ludecker stack |
| ~~`release-linear`~~ | **Omit** |
| ~~`release-sentry`~~ | **Omit** |

Update [`platform-release/orchestrator/SKILL.md`](/Users/eriklydecker/arvid/.cursor/skills/shared/platform-release/orchestrator/SKILL.md) copy: Wave 2 = **Render only** (single parallel slot, not three). Wave 0 preflight optional from intent ("with tests" → typecheck).

---

## Phase 5 — Ludecker domains (orchestrator + inventory)

Three bounded contexts (simpler than Arvid's six):

### Domain: `cms`

**Scope:** [`apps/website`](apps/website) — public routes, admin CMS, middleware, server actions, `lib/content`, `lib/supabase`, nav.

| Graph orchestrator IDs | Modes |
|------------------------|-------|
| `cms-update` | default, test_only, design_mode, create_mode, fix_mode |
| `cms-design-update` | design_mode (emphasize `@ludecker/ui` integration in site) |
| `cms-create-feature` | create_mode |
| `cms-fix-bug` | fix_mode |
| `cms-test-module` | test_only |

**Inventory anchors:** [`docs/architecture.md`](docs/architecture.md), [`docs/content-model.md`](docs/content-model.md), `apps/website/lib/constants.ts` (`SITE_CONFIG`), `lib/content/queries.ts`, `app/admin/actions/`.

Standard 9-phase pipeline (from Arvid cms-update):

`load_inventory → investigate (fix) → discovery_swarm → plan → execute → test → verify → sync_inventory → report`

### Domain: `ui`

**Scope:** [`packages/ui`](packages/ui) — tokens, components, CSS, docs shell components.

| Graph orchestrator IDs | Modes |
|------------------------|-------|
| `ui-update` | default, test_only, design_mode, fix_mode |
| `ui-design-update` | design_mode |
| `ui-fix-bug` | fix_mode |
| `ui-test-module` | test_only |

**Inventory anchors:** `tokens.css`, `globals.css`, Figma link from architecture doc, export surface `packages/ui/src/index.ts`.

### Domain: `database`

**Scope:** [`supabase/migrations`](supabase/migrations), RLS, seeds, type mirrors in [`packages/types`](packages/types), mappers in `lib/content/map-content.ts`.

| Graph orchestrator IDs | Modes |
|------------------------|-------|
| `database-update` | default, test_only, fix_mode |
| `database-fix-bug` | fix_mode |
| `database-test-module` | test_only |

**Inventory anchors:** Supabase project ref from deployment doc, migration naming conventions, RLS requirements from security skill.

### Resolvers in `graph.yaml`

```yaml
update-module-by-slug:
  map: { cms, ui, database }
  default: cms-update  # or verb-update + module

update-component-by-scope:
  map: { cms: cms-design-update, ui: ui-design-update }

create-feature-by-slug:
  map: { cms: cms-create-feature }

fix-bug-by-slug:
  map: { cms: cms-fix-bug, ui: ui-fix-bug, database: database-fix-bug }
  default: verb-fix
  default_object: feature

test-module-by-slug:
  map: { cms: cms-test-module, ui: ui-test-module, database: database-test-module }
```

Each domain gets [`orchestrator/SKILL.md`](/Users/eriklydecker/arvid/.cursor/domains/cms/update/orchestrator/SKILL.md) + [`contract.yaml`](/Users/eriklydecker/arvid/.cursor/domains/cms/update/orchestrator/contract.yaml) and [`inventory/SKILL.md`](/Users/eriklydecker/arvid/.cursor/domains/cms/update/inventory/SKILL.md) with Section 3 file tables populated from current repo layout (including in-progress docs shell work from git status).

---

## Phase 6 — Exception orchestrators

### `write-article` (content swarm)

Add graph entry:

```yaml
commands:
  write-article:
    orchestrator: write-article
orchestrators:
  write-article:
    path: domains/content/write/orchestrator
    requires: [reporting]
```

Create `domains/content/write/orchestrator/SKILL.md` that **delegates to existing** [`skills/write-article/SKILL.md`](.cursor/skills/write-article/SKILL.md) — research swarm, frameworks, persist script. Thin wrapper only; no duplication of swarm prose.

Replace [`write-article.md`](.cursor/commands/write-article.md) stub with AAAC dispatch pointer + link to orchestrator.

### Dedicated orchestrators (copy from Arvid, adapt paths)

- `update-doc` — architecture documentation updates ([`docs/architecture.md`](docs/architecture.md), domain inventories, AAAC doc itself)
- `review-module` — readonly architecture review using `architecture` skill + boundary agents
- `review-incident` — production/deploy/content incident investigation
- `test-function` — user journey tests (e.g. CMS publish → ISR refresh)
- `release-app` — platform-release orchestrator

---

## Phase 7 — Documentation

Create [`docs/agentic_architecture.md`](docs/agentic_architecture.md):

**Part 1 (everyone):** Adapt Arvid's one-sentence thesis, command syntax `/<verb>-<object> <domain> "<intent>"`, Ludecker command table with domain examples (`cms`, `ui`, `database`), deprecated aliases (`ship-ludecker` → `release-app`).

**Part 2 (maintainers):** Execution graph, directory layout, orchestrator vs inventory, governance skill, adding domains procedure, contract schema link, release wave diagram (git → Render only).

Cross-link from [`docs/architecture.md`](docs/architecture.md) § Principles or new "Agent workflows" subsection.

---

## Phase 8 — Verification and migration hygiene

1. Run generators; confirm ~120 command stubs exist and each points to `dispatch.md`.
2. Spot-check routing: `/update-module cms "…"`, `/fix-bug ui "…"`, `/release-app production "…"`, `/write-article article, …`.
3. Confirm `ship-ludecker` alias resolves to `release-app` and release-git/release-render agents contain ship-ludecker logic.
4. Confirm existing flat skills either redirect or are referenced from `object_skills` — no duplicate routing.
5. Update [`launch-ludecker.md`](.cursor/commands/launch-ludecker.md) header to note it is a **manual local-dev command** (not AAAC-routed), same as Arvid's mac ship command.
6. Optional: run `fallow check_changed` if configured (referenced in master rules).

---

## What stays unchanged

- [`docs/master_rules.md`](docs/master_rules.md) — canonical rules (policies point here)
- [`skills/write-article/`](/Users/eriklydecker/ludecker/.cursor/skills/write-article/) tree — frameworks, researchers, scripts
- Application code — this is agent infrastructure only

---

## Implementation order (recommended)

Strict dependency order: core → policies → shared skills → agents → domains → generators → docs → alias migration.

Estimated footprint: **~180–220 new/relocated files** under `.cursor/` plus one doc — comparable to Arvid's AAAC install.
