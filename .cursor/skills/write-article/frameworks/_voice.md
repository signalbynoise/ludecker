# Plain language voice (all CMS body types)

Apply to every `article_type` except **`skills`** (which uses `SKILL.md` markdown).

Reference this file from every per-type framework. Body text uses a small markdown subset: `##` headings, blank-line paragraphs, optional `###` subsections, and `[anchor](https://…)` links.

## Formatting

- Do not use `*` or `**` for emphasis in CMS body prose — the public site does not render bold or italic.
- Use clear headings and plain sentences instead of wrapping words in asterisks.
- Fenced code blocks may contain `*` (for example glob patterns like `lib/**/*.ts`).
- `article_type: skills` is exempt — those rows store full `SKILL.md` files for agents.

## Audience and opening

- The **first paragraph** names who the piece is for and why it matters in the **first two sentences**.
- Lead with the benefit or problem, not “This article discusses…”
- **`##` headings** are scan-friendly headlines in everyday words — not category labels like “Setup” or “Introduction”.

## Sentences and paragraphs

- Average **15–20 words** per sentence; hard cap ~25 words.
- **One idea** per sentence; **2–4 sentences** per paragraph.
- **Active voice** — “You run the command” not “The command should be run”.
- Vary rhythm with occasional short lines; avoid multi-clause jargon stacks.

## Word choice

| Avoid | Prefer |
|-------|--------|
| utilize, leverage | use |
| facilitate | help, enable |
| implement, configure | set up, build |
| initiate | start |
| paradigm | approach, method |
| functionality | feature, what it does |
| prerequisite | what you need first |

Define technical terms on first use in plain language. Spell out acronyms once.

## Links

- Use `[readable anchor](https://…)` — never bare URLs.
- Link when it helps the reader; do not pad prose to hit URL quotas.
- Keep anchor text human-written (`[Stripe docs](…)` not `[click here](…)`).

## Honesty and critique

- Name at least **one limitation or alternative** in the body (not only under `## Sources`).
- Use “usually”, “may”, “in most cases” when behavior varies.
- No brochure tone — if research found pushback, say so in plain words.

## Excerpt

One sentence, under 160 characters, stating outcome or thesis in language a non-expert understands.

## Review (voice)

- [ ] No `*` or `**` emphasis markers in body prose (outside code fences)
- [ ] Non-expert understands the opening paragraph without prior context
- [ ] Every `##` headline scans without reading the paragraph below
- [ ] No paragraph longer than four sentences
- [ ] Active voice dominates
- [ ] Critique or tradeoff appears before `## Sources`
