# CLAUDE.md — tanmay-portfolio

Personal portfolio for **Tanmay Desai**. Matrix-themed hub on his own domain that links to every featured project, with each project openable and usable in the browser where possible.

Owner talks casual and direct. Skip intros and summaries, show code first, keep commentary minimal. Don't explain basics.

---

## 1. Source of truth: the CV

The CV facts below are the only source for facts on the site. The CV file itself is NOT committed (public repo, contains phone). Never invent metrics, dates, titles, or stack items. If something isn't in the CV or a project's repo, leave a `<!-- PLACEHOLDER: ... -->` and ask.

**Use on site**
- Name, Boston MA, email `t.desai240305@gmail.com`
- LinkedIn `https://www.linkedin.com/in/tanmaydesai2126/`, GitHub `https://github.com/TADebugs`
- Northeastern University, B.S. Information Technology, GPA 3.7, graduating May 2027
- Golden Gate University, Associate's in Computer Science, GPA 3.9 (2023–24)
- Experience:
  - Medidata Solutions, SDET Intern (Jul–Nov 2026)
  - Medidata Solutions, Data Engineering Intern (Apr–Jul 2026)
  - Electronic Arts, Software Engineering Intern (Nov 2025–Jan 2026), C++ on EA Sports College Football
- Skills and project bullets exactly as worded in the CV, tightened for the web
- Leadership: VP and Software Development Lead, SCI-TECH Club, Golden Gate University (2023–24)

**Never put on site**
- Age
- Phone number
- Home address
- The CV's "Working style" section, which is written in third person for resumes, not the web

`/resume.pdf` is the downloadable resume. Tanmay drops `resume.pdf` into the repo root (no `public/` folder; see `.agents/decisions.md`), and it's served at `/resume.pdf`. Until then a rewrite serves the `/resume` placeholder.

---

## 2. Domain + hosting

| item | value |
|---|---|
| primary | `tanmaydesai.xyz` |
| secondary | `tanmaydesai.site`, 301 → `.xyz` (already in `vercel.json`) |
| host | Vercel, auto-deploy from GitHub `TADebugs/tanmay-portfolio` on push to `main` |
| SSL | Vercel-managed and auto-renewing. The old PositiveSSL cert on `.xyz` is NOT renewed or used |
| DNS | `A @ 76.76.21.21`, `CNAME www cname.vercel-dns.com`. If Vercel shows project-specific values, use those. Remove registrar parking or URL-redirect records |

Hard rule: **no 404s.**
- Every link on the site must resolve.
- A project that isn't built yet gets a real "in progress" page at its route, not a dead link.
- Domains must stay on auto-renew.

---

## 3. Site structure

Static HTML/CSS/JS, no build step, no framework unless a project needs one. Every page is self-contained.

```
/                 gate: red pill / blue pill choice (TODO, currently redirects to /red)
/red              full portfolio (DONE, v1) → red/index.html
/blue             recruiter view: one page, fast, resume download (TODO)
/gods-eye         playable Unity WebGL build
/algolend         live demo in seeded demo mode
/trinity          case study + demo video
/sweet-bite       live site
/resume.pdf       resume.pdf (repo root)
```

**Gate**
- Matrix "choice" page, matching the vibe of the old site at `tanmay-desai-portfolio.vercel.app`.
- Blue pill → `/blue`, red pill → `/red`.
- Remember the choice in localStorage so repeat visitors skip the gate, and add a "reconsider your choice" link to get back to it.

**Red pill** v1 exists but is a **throwaway placeholder**: average, generic. Do not iterate on it; the `construct` agent replaces it per DESIGN.md. v1 had:
- code-rain hero with the name decoding out of it
- expandable "Programs" list
- experience log
- "Loaded" skills
- "Call the operator" contact
- footer link to the blue pill

**Blue pill** is for recruiters who won't sit through the bit: same content, no rain, no reveal motion, loads in under 1s, single page, prints cleanly.

`vercel.json` uses `cleanUrls: true`, so `red/index.html` is served at `/red`.

---

## 4. Projects

Each project lives at `/<slug>` and appears as a card or row on both `/red` and `/blue`. Each one has two actions: **launch** (the live thing) and **source** (the repo).

| slug | project | repo | treatment | status |
|---|---|---|---|---|
| `gods-eye` | God's Eye: AI-driven Unity dungeon crawler, dual-persona vision AI | https://github.com/TADebugs/Gods_Eye | Unity WebGL build served as static files. Vision API calls go through a Vercel serverless function (`/api/vision`) holding the key in env vars, with a per-IP rate limit and daily spend cap. The key never ships to the client | TODO |
| `algolend` | AlgoLend AI: DeFi lending, 3 AI agents, Algorand | https://github.com/TADebugs/ALGOLEND_AI | React frontend on Vercel, Algorand **testnet**. **Seeded demo mode** with canned agent outputs so it never cold-starts or 500s. Live backend is optional and behind a toggle | TODO |
| `trinity` | TRINITY: multi-personality voice desktop assistant (ARIA / ECHO / NEXUS) | https://github.com/TADebugs/TRINITY | Desktop app with paid Gemini audio, so **no public live demo**. Case study page: 30s demo video (Tanmay records it), architecture diagram, orb animation | TODO |
| `sweet-bite` | Sweet-Bite | https://github.com/TADebugs/Sweet-Bite | Not in CV. Read the repo first, then deploy as-is if it's a web app. Needs a one-liner and stack from repo/Tanmay | TODO |

Possible later additions, from the CV only:
- Production RAG system (demo mode with cached answers)
- SpeakEasy
- Desktop AI Companion
- BRAIN

**"Openable" means**
- Static or frontend projects run for real in the browser.
- Anything needing paid APIs or a backend gets demo mode with seeded data.
- Desktop or native apps get a case study with video.

Never ship a launch button that leads to a broken or sleeping app.

---

## 5. Design system — PROVISIONAL

**`DESIGN.md` (owned by the artdirector agent) supersedes this whole section once it exists.** The tokens below are v1's and are not binding. See AGENTS.md §0 for the anti-generic doctrine.


Direction: matrix / CRT phosphor terminal. Dark is the real look; light mode is a "green-on-paper printout."

| token | dark | light |
|---|---|---|
| `--bg` | `#000A03` | `#EEF3EC` |
| `--ink` | `#9BFFB4` | `#0D3B1E` |
| `--dim` | `#3E8A55` | `#4F7A5C` |
| `--line` | `#0E3A1C` | `#C5D6C6` |
| `--pill` (red, used sparingly) | `#FF2A33` | `#C81E25` |
| `--rain` | `#22C55E` | `#0D3B1E` |

- **Type:** Instrument Serif for display and headings, IBM Plex Mono for body and UI. Both come from Google Fonts with real fallback stacks.
- **Motion:** spend boldness in one place per page (on `/red` it's the hero decode).
  - Other motion only responds to user actions, like expanding a project.
  - Respect `prefers-reduced-motion`.
  - Pause canvas animations when offscreen.
- **Avoid:**
  - purple gradients
  - three identical rounded cards
  - ALL-CAPS eyebrow labels on every heading
  - `→` appended to every link
  - fade-up on every section
  - glassmorphism
  - Inter + slate
- **Quality floor:**
  - responsive to mobile
  - visible `:focus-visible`
  - semantic HTML (`<details>` for expandables)
  - contrast passes AA
  - `viewport-fit=cover` + safe-area padding

---

## 6. Skills — when to use which

These are the skills installed in the cloud sessions. Use the right one for the task, not all of them.

| skill | use it for | don't use it for |
|---|---|---|
| `design-taste-frontend` | **primary design skill**, but its suggestions never override DESIGN.md or AGENTS.md §0. Any new page (gate, `/blue`, project pages). Start with its one-line "design read" and dials (portfolio ≈ variance 8 / motion 7 / density 4) | backend or deploy work |
| `theme-factory` | only if we try an alternate theme. The current tokens are the theme | |
| `web-artifacts-builder` | only if a project demo genuinely needs React + shadcn state complexity | the portfolio pages (stay static) |
| `ponytail` | any code: simplest thing that works, native platform before deps, no framework unless needed | |
| `imagegen-frontend-web` / `canvas-design` | optional: OG images, project thumbnails. Not needed for v1 | |

---

## 7. Connectors / tools

| tool | what it does here | notes |
|---|---|---|
| **GitHub** | repo `TADebugs/tanmay-portfolio`, plus the 4 project repos | Claude Code works on the repo directly. `gh` is authed as TADebugs on his Mac |
| **Vercel** | hosting, domains, env vars, serverless functions | GitHub integration auto-deploys on push. The Vercel MCP connector exists in claude.ai chat, not necessarily in Claude Code. Use the dashboard or `vercel` CLI otherwise |
| **Control your Mac** (claude.ai chat only) | ran shell on his Mac to create `~/tanmay-portfolio` | not available in Claude Code web; the cloud env can't touch his Mac |

**Secrets**
- API keys (vision API, Gemini, etc.) go in **Vercel env vars only**, never committed.
- Claude never types credentials or tokens. Tanmay sets them.

**Local paths on his Mac** (not reachable from Claude Code web)
- repo: `/Users/tanmaydesai/tanmay-portfolio`
- old template: `/Users/tanmaydesai/Downloads/portfolio1-main`. Only useful if pushed to a repo; it's a template, so borrow sections, not the base

---

## 8. Reference sites (for borrowing only)

- `https://tanmay-desai-portfolio.vercel.app`: the original red/blue pill gate. Keep the concept, rebuild the execution
- `https://my-portfolio-rho-blush-81.vercel.app`: older portfolio 1
- `https://my-portfolio-c33x.vercel.app`: older portfolio 2

---

## 9. Build order (superseded by AGENTS.md §5)

1. Gate at `/` (replace the redirect)
2. `/blue` recruiter view + `resume.pdf`
3. `/sweet-bite`, the easiest live deploy
4. `/algolend` demo mode
5. `/gods-eye` WebGL + `/api/vision` proxy
6. `/trinity` case study (waiting on video)
7. READMEs for all 4 repos (`docs` agent, checklist in AGENTS.md §6)
8. Attach domains in Vercel and verify no route 404s

Commit small, one feature per commit. Push to `main` deploys to production, so check locally first with `npx serve .`
