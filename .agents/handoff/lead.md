## lead — setup
branch: claude/hopeful-cray-ccs8q9
changes:
- .agents/ scaffold: status/<id>.md + inbox/<id>/ for all 11 agents, handoff/, critique/, decisions.md
- shared/projects.json (5 projects incl. rag; unknown facts = null), shared/motion/README.md
- "in progress" placeholders: /blue /gods-eye /algolend /trinity /sweet-bite /rag /resume
- vercel.json: rewrite /resume.pdf → /resume until resume.pdf exists at repo root
- AGENTS.md: wave 1/2 instead of days, Oct 8 deadline, per-agent files, Motion API contract, PR-only merges, uninstalled skills removed
- CLAUDE.md: resume at repo root (no public/), skills table trimmed to installed ones
tested: every internal href resolves to a file; JSON valid
needs on preview: /resume.pdf serves the placeholder; all routes 200
