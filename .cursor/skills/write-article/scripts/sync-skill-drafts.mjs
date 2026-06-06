#!/usr/bin/env node
/**
 * Build draft.json from .cursor/skills/<slug>/SKILL.md for CMS republish.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../..");
const RUNS = resolve(REPO_ROOT, ".cursor/write-article-runs");

const SKILLS = [
  { slug: "security", title: "Security" },
  { slug: "architecture", title: "Architecture" },
  { slug: "infrastructure", title: "Infrastructure" },
  { slug: "design-system", title: "Design System" },
  { slug: "user-interface", title: "User Interface" },
  { slug: "user-experience", title: "User Experience" },
  { slug: "database-schema", title: "Database Schema" },
  { slug: "api-first", title: "API First" },
];

function extractDescription(content) {
  const match = content.match(/^description:\s*(.+)$/m);
  return match?.[1]?.trim() ?? "";
}

for (const { slug, title } of SKILLS) {
  const skillPath = resolve(REPO_ROOT, ".cursor/skills", slug, "SKILL.md");
  const content = readFileSync(skillPath, "utf8");
  const description = extractDescription(content);
  const runDir = resolve(RUNS, slug);
  mkdirSync(runDir, { recursive: true });

  const draft = {
    title,
    slug,
    excerpt: description,
    content,
    status: "published",
    article_type: "skills",
    tagNames: [slug.replace(/-/g, "_"), "agent-skills"],
    seo_title: `${title} — Agent Skill`,
    seo_description: description.slice(0, 160),
    featured: false,
  };

  writeFileSync(
    resolve(runDir, "draft.json"),
    `${JSON.stringify(draft, null, 2)}\n`,
  );
  console.log(`[ok] draft.json ← ${skillPath}`);
}
