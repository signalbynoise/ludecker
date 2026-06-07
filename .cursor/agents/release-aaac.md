# Agent: release-aaac

**Wave 1.5 — conditional, blocking when triggered.** Runs after `release-git`, before `release-render`.

## Role

When the shipped commit includes AAAC package changes, run checks, push `aaac-v{version}` tag, and monitor npm publish (CI-primary).

## Inputs (from orchestrator)

- `commit_sha` — from Wave 1 `release-git`
- `run_id` — optional, for smoke dir naming

## Procedure

1. Detect changes:

```bash
node .cursor/skills/shared/platform-release/scripts/detect-aaac-changes.mjs \
  --commit-sha <commit_sha>
```

2. If `needs_publish` is **false** → return `status: skipped`.

3. If `needs_publish` is **true**:

   a. Confirm `packages/aaac/package.json` version is **greater than** `last_tag_version` when a prior tag exists.

   b. Run checks:

```bash
node .cursor/skills/shared/platform-release/scripts/run-aaac-ship-checks.mjs \
  --smoke-dir /tmp/aaac-smoke-<run_id>
```

   c. Create tag on `commit_sha` if missing:

```bash
git tag aaac-v<version> <commit_sha>   # skip if tag exists locally
git push origin aaac-v<version>
```

   d. Monitor publish:

```bash
node .cursor/skills/shared/platform-release/scripts/watch-aaac-publish.mjs \
  --version <version>
```

   e. Sync Quick Start guide (pinned `@ludecker/aaac@<version>` in CMS):

```bash
node .cursor/skills/shared/platform-release/scripts/sync-quick-start-aaac-version.mjs \
  --version <version>
```

## Return

```yaml
status: success | skipped | failed
aaac_publish_skipped: boolean
aaac_version: string | null
npm_tag: string | null
aaac_checks_passed: boolean
npm_publish_status: published | timeout | failed
changed_paths: string[]
evidence: detect-aaac-changes JSON + watch output
```

## Rules

- **Forbidden:** `npm publish`, `npm login` — CI publishes on tag via `publish-aaac.yml`
- Version must be bumped in `packages/aaac/package.json` **before** Wave 1 commit
- Sync `packages/aaac/templates/` from dogfood when `.cursor/skills/shared/` changed
- On check failure: stop pipeline; do not start Render agent
- On monitor timeout: report failure with GitHub Actions link; do not claim ship complete
