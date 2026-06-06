-- Sample content for local development and staging
-- Run after migrations: supabase db seed

INSERT INTO public.tags (name, slug) VALUES
  ('architecture', 'architecture'),
  ('ai', 'ai'),
  ('systems', 'systems'),
  ('design', 'design'),
  ('nextjs', 'nextjs')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.content (
  slug,
  title,
  excerpt,
  content,
  status,
  article_type,
  featured,
  seo_title,
  seo_description,
  published_at
) VALUES
  (
    'home',
    'Intro',
    'Agentic OS (AAAC) — design, technology, and practice for teams running Cursor agents with architecture in git.',
    E'## Welcome to Lüdecker\n\nThis site is about Agentic OS—also called Agentic Architecture as Code (AAAC). You run slash commands; the repo owns the workflow; every chat leaves a reviewable trail.\n\nIf you build with Cursor on a shared codebase, start here. For the full story, read [Introducing Agentic OS](https://ludecker.com/articles/agentic-os).\n\n## How Agentic OS flows in one picture\n\nFollow the numbered layers top to bottom. Odd layers flow left → right; even layers flow right → left — a compact snake layout. The Run is created early (layer ③) and updated after every phase. Governance gates (⑥) sit after plan and before execute; a failed gate stops for human approval.\n\n```mermaid\nflowchart TB\n    subgraph L1["① User layer"]\n        direction LR\n        U[User] --> CMD["Slash command<br/>verb · object · domain · intent"]\n    end\n\n    subgraph L2["② Control layer"]\n        direction RL\n        DISP[Dispatch] --> POL[Policies] --> ONT[Ontology] --> GRA["Execution graph"]\n    end\n\n    subgraph L3["③ Run layer"]\n        direction LR\n        RUN["Create Run"] --> PEND["Queue pending phases<br/>lifecycle + gate stack"] --> HK["Runtime hooks<br/>block edits until execute"] --> OBS["Observability on Run<br/>decisions · log · artifacts · checkpoints"]\n    end\n\n    subgraph L4["④ Execution layer"]\n        direction RL\n        ORCH[Orchestrator] --> CAP[Capabilities] --> SK["Skills and agents"]\n    end\n\n    subgraph L5["⑤ Work lifecycle"]\n        direction LR\n        DISC[Discover] --> INV["Investigate<br/>lite or swarm"] --> RC["Root cause<br/>fix verb"] --> PLAN[Plan]\n    end\n\n    subgraph L6["⑥ Governance gates"]\n        direction RL\n        VAL[Validate] --> IMP[Impact analysis] --> DEP[Dependency graph] --> FIT[Fitness functions] --> RB[Rollback]\n    end\n\n    subgraph L7["⑦ Delivery"]\n        direction LR\n        EX[Execute] --> VER[Verify] --> REP[Report] --> DONE["Run completed"]\n    end\n\n    STOP["Stop — awaiting approval"]\n\n    CMD --> DISP\n    GRA --> RUN\n    OBS --> ORCH\n    SK --> DISC\n    PLAN --> VAL\n    RB -->|pass| EX\n    RB -->|fail| STOP\n    STOP -->|user approves| VAL\n```\n\n**Legend:** ① what you type · ② repo resolves command and routing · ③ Run manifest owns state for the whole chat · ④ who does the work · ⑤ research and planning phases · ⑥ approval checkpoints (not work) · ⑦ code changes, verification, and completion.\n\nYou type `/verb-object domain "intent"` (and flags when needed). Everything after intent is architecture in the repo—not something you improvise in chat.\n\n## What you will find here\n\nEssays, guides, skills, tools, and diagrams for people who ship with agents. Pick a section in the sidebar, or continue with [Introducing Agentic OS](https://ludecker.com/articles/agentic-os).',
    'published',
    'home',
    true,
    'lüdecker',
    'Personal website and publishing system',
    now()
  )
ON CONFLICT (article_type, slug) DO NOTHING;

INSERT INTO public.content (
  slug, title, excerpt, content, status, article_type, featured, published_at
) VALUES
  ('index', 'articles', 'Long-form essays on design, systems, and practice.', E'## Essays and notes\n\nThoughtful pieces on how we design, build, and work with AI — written in plain language.', 'published', 'articles', false, now()),
  ('index', 'guides', 'Step-by-step guides you can follow.', E'## How-to guides\n\nPractical walkthroughs with clear steps. Each guide tells you what you need first and what success looks like.', 'published', 'guides', false, now()),
  ('index', 'skills', 'Reusable instructions for AI agents.', E'## Agent skills\n\nCopy-paste playbooks that teach Cursor agents how to work in your project.', 'published', 'skills', false, now()),
  ('index', 'tools', 'Services and integrations for your stack.', E'## Tools and integrations\n\nMCP servers and external services wired into your development workflow.', 'published', 'tools', false, now()),
  ('index', 'commands', 'Repeatable slash commands.', E'## Cursor commands\n\nSaved workflows you run with a slash command — same steps every time.', 'published', 'commands', false, now()),
  ('index', 'subagents', 'When to delegate work to specialist agents.', E'## Subagents\n\nPatterns for splitting research and implementation across parallel agents.', 'published', 'subagents', false, now()),
  ('index', 'diagrams', 'Visual explainers for complex ideas.', E'## Diagrams\n\nOne diagram per piece, with short prose that helps you read it top to bottom.', 'published', 'diagrams', false, now())
ON CONFLICT (article_type, slug) DO NOTHING;

