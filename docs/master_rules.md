# Master Rules — Lüdecker

This document defines **non-negotiable architectural and implementation rules** for the **lüdecker** monorepo (`apps/website`, `packages/*`, `supabase/`).  
All decisions, implementations, and refactors must comply with these rules.  
If something conflicts with these rules, **the rules win**.

---

## Project context

| Area | Location | Responsibility |
|------|----------|----------------|
| Public site + CMS | `apps/website` | Next.js 15 App Router, routes, server actions, content queries |
| Design system | `packages/ui` | Figma tokens, CSS, presentational components |
| Shared types | `packages/types` | Content model, nav config, enums |
| Shared utilities | `packages/utils` | Slugify, dates, structured logger |
| Database | `supabase/migrations` | Schema, RLS, seeds |

**SSOT anchors (do not duplicate):**

- Site name, URL, contact email → `apps/website/lib/constants.ts` (`SITE_CONFIG`)
- Brand label in UI → `packages/ui/src/constants.ts` (`BRAND_NAME`, `CONTACT_EMAIL`)
- Design tokens → `packages/ui/src/tokens.css`
- Global + component styles → individual CSS files in `packages/ui/src/`, imported from `apps/website/app/layout.tsx` (never rely on nested `@import` through package exports)
- Nav items, article types → `packages/types/src/index.ts`
- Published content → Supabase `content` table (fallbacks in `apps/website/lib/content/fallback.ts` only when DB is unavailable)

---

## 1. Single Source of Truth (SSOT)

- Every piece of information may exist in **one and only one place**.
- There must never be duplicate representations of the same state, configuration, or data.
- Derived data must be **derived**, never stored.
- If two places need the same information, one owns it and the other consumes it.

**Anti-patterns:**

- Duplicated state in local component state and global store
- Copying server data into multiple stores
- Repeating constants across files (e.g. site name in both `constants.ts` and a page)
- Defining the same CSS token in both `tokens.css` and a component file

**Rule:**

> There can only ever be one truth.

---

## 2. Strong Separation of Concerns

Each layer has exactly one responsibility.

### UI Layer (`packages/ui`, route layouts, presentational admin components)

- Responsible only for rendering and user interaction
- No business logic
- No data fetching
- No state orchestration
- No side effects

### State Layer (React state, form state in admin)

- Owns application state and transitions
- No UI knowledge
- No rendering logic

### Domain / Logic Layer (`apps/website/lib/content`, `packages/utils`)

- Owns business rules and invariants (slug rules, content mapping, query composition)
- Stateless where possible
- Deterministic and testable

### Infrastructure Layer (`lib/supabase`, server actions, middleware, Supabase migrations)

- APIs, persistence, adapters, integrations
- No business decisions beyond boundary validation

**Rule:**

> If a file does more than one thing, it is doing too much.

---

## 3. Modular Design

- Every module must be:
  - Self-contained
  - Predictable
  - Replaceable
- Modules communicate only through explicit interfaces.
- No hidden coupling through imports, globals, or side effects.

**Good modules:**

- Can be moved without breaking unrelated code
- Have clear inputs and outputs
- Do not reach into other modules' internals

**Monorepo boundaries:**

- `packages/ui` must not import from `apps/website`
- `packages/types` and `packages/utils` must not import React or Next.js
- Public pages consume `@ludecker/ui`; they do not reimplement layout primitives

---

## 4. No Hardcoding

- No hardcoded:
  - Values
  - IDs
  - Strings
  - Sizes
  - Layout numbers
  - Feature flags
- All values must come from:
  - Configuration (`SITE_CONFIG`, env vars)
  - Constants (`packages/ui/src/constants.ts`, `packages/types`)
  - Schemas
  - State

**Rule:**

> If a value might ever change, it must not be hardcoded.

---

## 5. No Inline Styling

- No inline styles
- No style objects in components
- Styling must be:
  - Token-based (`packages/ui/src/tokens.css`)
  - Class-based (one `.css` file per component in `packages/ui/src/`)
  - Centralized (imported from `apps/website/app/layout.tsx` or route-level CSS such as `admin.css`)

**Reason:**

- Inline styles bypass the Figma design system
- Inline styles break consistency
- Inline styles are not scalable

---

## 6. No Inline Components

- No component definitions inside other components
- No anonymous JSX logic blocks acting as components

**Why:**

- Causes unnecessary re-renders
- Breaks memoization
- Makes debugging harder
- Hides responsibilities

**Rule:**

> Every component must live in its own file and have a name.

---

## 7. Reusable by Default

- Components must be reusable unless explicitly proven otherwise.
- Components should:
  - Accept data via props
  - Avoid assumptions about context
  - Avoid hardcoded behavior

If a component is not reusable:

- Document why
- Restrict it intentionally

---

## 8. Logical Direction of Flow

Data and control flow must always be **unidirectional**.

### Flow direction:

- Input → State → Logic → Output
- User Action → Event → State Transition → Render
- CMS: Form → Server action → Supabase → `revalidatePath` → ISR refresh

**Forbidden:**

- Circular dependencies
- UI mutating state indirectly
- Side effects triggered during render

**Rule:**

> Nothing should ever feel "magical".

---

## 9. Explicit State Machines

- All complex state must be modeled explicitly (auth session, form submit, upload progress).
- States must be finite and named.
- Transitions must be explicit and deterministic.

**State machines must define:**

- Valid states
- Valid transitions
- Invalid transitions (and how they are prevented)

**Benefits:**

- Prevents impossible states
- Prevents race conditions
- Makes logic debuggable

---

## 10. Race Condition Avoidance

- All async logic must be:
  - Cancellable
  - Idempotent where possible
  - Scoped to lifecycle
- Never assume execution order.
- Never rely on timing.

**Rules:**

- No shared mutable async state
- No overlapping requests without coordination
- No effects that depend on stale closures

---

## 11. Render Discipline

- Avoid unnecessary re-renders.
- Components must render only when their inputs change.
- Memoization is a tool, not a crutch.

**Rules:**

- Stable references
- No derived data inside render if it can be computed earlier
- No side effects in render
- Prefer Server Components for data fetching on public pages

---

## 12. Predictable State Ownership

- Each piece of state has exactly one owner.
- Ownership hierarchy must be obvious.
- Passing state downward is preferred.
- Pulling state upward is deliberate.

**Never:**

- Mutate state outside its owner
- Mirror state across layers

---

## 13. Validation at Boundaries

- Validate data at system boundaries.
- Never trust:
  - User input (CMS forms)
  - API responses (Supabase rows)
  - External systems

Schemas must:

- Be centralized (`packages/types`, mappers in `lib/content/map-content.ts`)
- Be reusable
- Define invariants clearly

---

## 14. No Hidden Side Effects

- Side effects must be:
  - Explicit
  - Isolated
  - Predictable
- No side effects during render.
- No side effects hidden inside utility functions.

Server actions and `revalidatePath` are side effects — keep them in `apps/website/app/admin/actions/`, not in UI components.

---

## 15. Determinism Over Convenience

- The same input must always produce the same output.
- Avoid randomness unless explicitly required.
- Avoid time-based logic unless explicitly modeled.

Public pages must remain SSG/ISR-deterministic; avoid `Date.now()` in render paths that affect static output.

---

## 16. Explicit Errors, Never Silent Failures

- Errors must be:
  - Visible
  - Traceable
  - Actionable
- Never swallow errors.
- Never fail silently.

Query helpers may return fallbacks only when documented (e.g. missing Supabase env in local dev); log before falling back.

---

## 17. Naming Is Architecture

- Names must describe intent, not implementation.
- Avoid vague names.
- Avoid abbreviations unless universally obvious.

Bad names hide bugs.  
Good names prevent them.

Use lowercase nav labels and editorial prefixes (`C:`, `P1:`, `A1:`) consistently with existing content patterns.

---

## 18. Scalability Is a First-Class Concern

- Design for:
  - Growth
  - Change
  - Replacement
- Avoid cleverness.
- Favor clarity over brevity.

---

## 19. Module Size Budgets

Rules 2 and 18 are qualitative. This rule makes them **measurable** so features do not accumulate inside one file.

### Hard limits (new code must comply)

| Unit | Max lines | Max cognitive complexity (per function) |
|------|-----------|----------------------------------------|
| React component / hook file | 250 | 15 |
| Next.js route file (`page.tsx`, `layout.tsx`) | 200 | — (pages delegate) |
| Server action module | 250 | 20 |
| Domain / lib module (`lib/content/*`, `packages/utils`) | 300 | 20 |
| UI package component + CSS pair | 250 | 15 |

**Per-function:** no exported function or component body over **80 lines**. Nested arrow callbacks over **40 lines** must be named and extracted.

### Soft limits (split before adding)

If a file is **already at or above 80% of its budget**, do **not** append the next feature inline. Extract first, then implement.

Examples:

- `queries.ts` at 240 lines → new query in `lib/content/queries/<topic>.ts`
- Admin page at 160 lines → new UI in `app/admin/components/`
- `ContentForm.tsx` at 200 lines → extract field groups or hooks
- UI component at 200 lines → split into named subcomponents in separate files

### Layer-specific caps

| Layer | One file must NOT |
|-------|-------------------|
| `apps/website/app/**/page.tsx` | Contain Supabase client setup, raw SQL-shaped mapping, or multi-step publish workflows |
| `apps/website/app/admin/actions/` | Render UI or import CSS |
| `apps/website/lib/content/` | Import React components or `@ludecker/ui` |
| `packages/ui/src/` | Fetch data, call Supabase, or import from `apps/website` |
| `packages/types/` | Contain runtime logic, fetch, or side effects |
| `packages/utils/` | Import React, Next.js, or Supabase |
| `supabase/migrations/` | Mix unrelated schema concerns in one migration without comment |

### When limits may be exceeded

Document in the PR or file header (Rule 22): why split is unsafe now, planned follow-up, and which budget is exceeded.

### Enforcement

Run `fallow check_changed` (or `check_health --changed-since HEAD`) after implementation when Fallow is configured. Any **new** budget violation in touched files is a blocking defect — fix by extraction before finishing.

---

## 20. Debug Logging

- All modules must include structured debug logging.
- Logs must be:
  - Leveled (`debug`, `info`, `warn`, `error`)
  - Contextual (include module name, operation, relevant IDs)
  - Conditional (disabled in production unless explicitly enabled)
  - Non-breaking (logging failures must never crash the application)

**Rules:**

- Every async operation must log its start, success, and failure
- Every state transition must be loggable at `debug` level
- Every error path must log the error with full context before propagating
- Never log sensitive data (tokens, passwords, PII, service role keys)
- Use `@ludecker/utils` logger — no scattered `console.log` in production code

**Format:**

```
[level] [module:operation] message { context }
```

**Anti-patterns:**

- Bare `console.log` with no context
- Logging inside tight loops without throttling
- Swallowing errors without logging
- Logging after throwing (let the caller log)

---

## 21. Testing

Every feature and module must have appropriate test coverage across three levels.

### Unit Tests

- Test individual functions, utilities, and domain logic in isolation
- Must be:
  - Fast (< 50ms per test)
  - Deterministic (no network, no timers, no randomness)
  - Focused (one assertion per behavior)
- Mock external dependencies at module boundaries
- Cover: happy path, edge cases, error cases

### Integration Tests

- Test interactions between modules and layers
- Must verify:
  - Data flows correctly between layers
  - State transitions produce expected side effects
  - API contracts are honored
  - Components render correctly with real (mocked) data
- Allowed to use real state management, fake APIs

### End-to-End Tests

- Test critical user flows from UI to backend
- Must cover:
  - Core user journeys (create, read, update, delete content)
  - Authentication and authorization flows (`/admin/*`)
  - Error recovery paths
- Must be:
  - Stable (no flaky selectors, no timing hacks)
  - Independent (no shared state between tests)
  - Repeatable (deterministic test data)

**Rules:**

- No feature is complete without tests at the appropriate level
- Tests must run in CI on every PR
- Test names must describe the behavior, not the implementation
- Tests must fail for the right reason — never pass by accident
- Prefer testing behavior over implementation details

**Anti-patterns:**

- Testing implementation details (internal state, private methods)
- Tests that pass when the code is broken
- Tests coupled to other tests via shared state
- Snapshot tests as a substitute for behavioral assertions

---

## 22. No Exceptions Without Documentation

If a rule must be broken:

- Document why
- Document alternatives considered
- Document why this is safe

No undocumented exceptions.

---

## 23. The Prime Directive

> **Clarity beats cleverness.  
Predictability beats shortcuts.  
One truth beats convenience.**

If something feels confusing, it is wrong.
