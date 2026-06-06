---
name: ui-inventory
description: >-
  @ludecker/ui design system: Figma tokens, CSS, presentational components,
  docs shell, theme toggle, and export surface.
argument-hint: "<change description or path under packages/ui scope>"
effort: medium
disable-model-invocation: true
---

# @ludecker/ui — Inventory

**Implementation:** [governance/implementation/SKILL.md](../../../skills/shared/governance/implementation/SKILL.md)

**Design system skill:** [ludecker/design-system/SKILL.md](../../../skills/ludecker/design-system/SKILL.md)

**Architecture:** [docs/architecture.md](../../../docs/architecture.md) § Design system

---

## 1. Module identity

| Field | Value |
|-------|-------|
| **Product name** | Lüdecker Design System |
| **Technical slug** | `ui` |
| **In one sentence** | Token-based CSS and presentational React components consumed by `apps/website`. |
| **Out of scope** | CMS logic, Supabase, route files, content queries |

---

## 2. Constraints (module-specific)

- **No fetching** — presentation only; data via props
- **No inline styles** — token-based class CSS in paired `.css` files
- **SSOT tokens** — `tokens.css`, `typography.css`, `globals.css`
- **Brand** — `constants.ts` (`BRAND_NAME`, `CONTACT_EMAIL`)
- **Exports** — public API via `index.ts` only
- **Import direction** — must not import `apps/website`

**Figma:** [LUDECKER design file](https://www.figma.com/design/yVYCZ1wlNQ0LMxL9is5lNV/LUDECKER)

---

## 3. Module inventory (auto-maintained)

> **Last synced:** 2026-06-06

### Foundation

| Path | Role |
|------|------|
| `tokens.css` | Design tokens |
| `typography.css` | Type scale |
| `globals.css` | Global resets and utilities |
| `constants.ts` | Brand constants |
| `index.ts` | Export surface |

### Layout & chrome

| Path | Role |
|------|------|
| `SiteLayout.tsx`, `SiteNav.tsx`, `Footer.tsx` | Site chrome |
| `PageShell.tsx` | Page wrapper |
| `BrandLogo.tsx` | Logo |

### Content components

| Path | Role |
|------|------|
| `ArticleBody.tsx`, `ArticleList.tsx` | Article rendering |
| `ContentSection.tsx` | Section layout |
| `SkillArticleBody.tsx` | Skill article body |
| `ArticleMermaidDiagram.tsx` | Mermaid in articles |

### Docs shell

| Path | Role |
|------|------|
| `DocsShell.tsx`, `DocsNav.tsx`, `DocsNavProvider.tsx` | Docs layout |
| `DocsHeader.tsx`, `DocsHero.tsx`, `DocsContent.tsx` | Docs regions |
| `DocsSidebarPanel.tsx`, `DocsTableOfContents.tsx` | Docs nav |
| `docs-nav-config.ts`, `docs-nav-store.ts` | Docs nav SSOT |

### Theme

| Path | Role |
|------|------|
| `ThemeProvider.tsx`, `ThemeToggle.tsx` | Light/dark theme |

### Anti-patterns

- Inline `style={{}}` or style objects
- Hardcoded colors outside tokens
- Fetching or Supabase in UI components
- Nested `@import` through package exports (styles imported from `apps/website/app/layout.tsx`)
