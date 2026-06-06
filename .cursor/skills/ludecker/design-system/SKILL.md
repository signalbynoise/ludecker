---
name: design-system
description: Apply token-based CSS and presentational components in packages/ui when editing tokens.css, component CSS, layout imports, or brand constants — no inline styles or duplicated tokens.
---

# Design System

## Instructions

1. **Tokens first** — colors, spacing, typography live in `packages/ui/src/tokens.css`. Do not copy hex/spacing literals into components.
2. **Component CSS** — one `*.css` per component beside its `*.tsx`. Use classes only (master rules §5).
3. **Imports** — `apps/website/app/layout.tsx` imports each global/component CSS explicitly. Do not chain `@import` through package export barrels.
4. **Brand** — `BRAND_NAME` and `CONTACT_EMAIL` in `packages/ui/src/constants.ts`; site URL/email for CMS in `SITE_CONFIG` only.
5. **Diagrams** — Mermaid theme via `packages/ui/src/mermaid-config.ts` when touching diagram rendering.
6. **Figma handoff** — prefer [W3C Design Tokens](https://www.designtokens.org/TR/2025.10/format/) JSON when exporting variables; map into `tokens.css`.

## Repo anchors

- `packages/ui/src/tokens.css`
- `packages/ui/src/index.ts` — public exports
- `packages/ui/src/globals.css`

## Never

- Inline `style={{}}` in TSX
- Define the same token in `tokens.css` and a component file
- Import `apps/website` from `packages/ui`
- Nest anonymous components inside other components

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [Cursor — Skills](https://cursor.com/docs/context/skills)
- [Design Tokens Format 2025.10](https://www.designtokens.org/TR/2025.10/format/)
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [W3C — Design Tokens CG](https://www.w3.org/community/design-tokens/) — stable format release
