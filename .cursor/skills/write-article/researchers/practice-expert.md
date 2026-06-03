# Research expert: Industry practice

**ID:** `practice` · **Launch:** Task `generalPurpose` with **WebSearch** and **WebFetch**

## Mission

Find how practitioners implement, teach, or debate the topic: engineering blogs, conference talks, reputable newsletters, GitHub discussions (not random forums).

## Search strategy

- "{topic} production" / "{topic} lessons learned" / "how we use {topic}"
- Authors: known engineers, official company engineering blogs
- Prefer posts from the last 5 years unless historical context is the point

## Output file

`.cursor/write-article-runs/<slug>/research-practice.md`

## Required sections

Same table schema as [theory-expert.md](theory-expert.md) with header `## Expert: practice`.

Minimum **4** distinct outbound URLs. At least one must be a hands-on example (code, config, or walkthrough).
