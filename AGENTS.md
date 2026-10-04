# AGENTS.md — multi-agent playbook for tanmay-portfolio (v2)

How to run parallel Claude Code (web, cloud) sessions on this repo. Read `CLAUDE.md` for the facts. This file covers **who does what, on which model, and how agents talk**.

**Goal: a portfolio nobody has seen before.** Not "nice," not "award-style," not "clean dark dev portfolio." Credits are not the constraint; quality is. Every agent runs on Opus (or the strongest model available) except `docs`.

---

## 0. Anti-generic doctrine (read before anything else)

The fastest way to slop is chasing what "good portfolios" look like. So we don't look at them.

**The source rule.** Every design decision must trace back to one of:
1. **Tanmay's actual work.** Observable, production-grade systems: traces, p50/p95, CI gates, test reports, vision AI watching a game, three AI personalities, risk-scoring agents.
2. **The ideas of The Matrix, not its props.** Simulation, the construct, reality as something rendered, choice, the operator, "there is no spoon." Green rain and sunglasses are props.
3. **Real content.** CV facts, repos, real metrics.

If a decision traces to "portfolios usually do this," cut it.

**The swap test.** Replace "Tanmay Desai" with any other developer's name. If the page still works unchanged, it's generic. Redo it.

**References come from outside web design only:**
- film title sequences
- ops consoles and telemetry dashboards
- terminal and BBS history
- printed technical manuals and schematics
- broadcast graphics
- game UIs

No Awwwards, Dribbble, Behance, or "best developer portfolios" lists. That's where everyone's defaults come from.

**Banned (unless DESIGN.md explicitly justifies one with the source rule):**
- **The obvious Matrix kit:** literal green code rain as decoration, generic "hacker terminal" look
- **The giant-name hero:** a big serif name hero with a mono body. That was v1; don't repeat it
- **Layout defaults:**
  - bento grids
  - three equal cards
  - glassmorphism
  - purple/blue gradients
  - Inter or Geist + slate
- **Motion defaults:**
  - custom cursor blobs or followers
  - magnetic buttons
  - smooth-scroll hijacking
  - marquee text strips
  - fade-up-on-scroll for every section
- **Decorative filler:**
  - grain overlays as decoration
  - parallax for its own sake
  - "scroll to explore" hints
- **Copy and label defaults:**
  - ALL-CAPS eyebrow labels
  - `→` on every link
  - "Hi, I'm Tanmay 👋"
  - "Passionate developer who loves building things"
  - typewriter taglines

**`/red` v1 is a throwaway placeholder.** It is not a baseline. Don't iterate on it, don't keep its tokens or fonts by default. It gets replaced by whatever DESIGN.md decides.

---

## 1. Cloud sandbox rules

- **Ephemeral disk.** Each session is a fresh clone. Push after every meaningful step; unpushed work is lost.
- **No access to Tanmay's Mac:** no Unity editor, no SSD, no local paths. Tanmay pushes those artifacts himself (§7).
- **No secrets in the sandbox.** Tanmay sets keys in Vercel env vars. Agents build against mocks (e.g. `MOCK_VISION=1`), and the real calls are verified on Vercel preview.
- **One repo per session.** `docs` runs one session per project repo.
- **Network may be restricted.**
  - Prefer zero-dependency static files.
  - If a package install fails, vendor it or write plain JS.
  - If Playwright or headless Chrome can't install, say so in your inbox and ask Tanmay for screenshots.
- **Verify in the sandbox** with `npx serve .` or `python3 -m http.server`, plus a headless screenshot where possible.
- **GitHub rejects files over 100MB.** Compress WebGL with Brotli or gzip, and keep video under 15MB.

---

## 2. The agents

| id | role | model | ~budget | branch | owns (write access) |
|---|---|---|---|---|---|
| `lead` | Scaffolds, owns shared files, merges, final gate | Opus | $10 | `lead/*` | `.agents/BOARD.md`, `shared/`, `index.html`, `vercel.json`, `public/` |
| `artdirector` | Concepts, DESIGN.md, critiques every page. Never writes product code | Opus / strongest | $16 | `art/*` | `DESIGN.md`, `.agents/critique/` |
| `construct` | The construct (replaces `/red`): shared navigation, the terminal, easter eggs. Per CONCEPT.md | Opus | $16 | `agent/construct` | `construct/`, `red/` |
| `entry` | Gate at `/` + `/blue` recruiter view | Opus | $8 | `agent/entry` | `gate/`, `blue/` |
| `motion` | The shared motion system: page transitions, signature effects | Opus | $8 | `agent/motion` | `shared/motion/` (delegated by lead) |
| `sweetbite` | `/sweet-bite` live | Opus | $5 | `agent/sweet-bite` | `sweet-bite/` |
| `algolend` | `/algolend` seeded demo | Opus | $9 | `agent/algolend` | `algolend/` |
| `godseye` | `/gods-eye` WebGL + `api/vision` proxy | Opus | $10 | `agent/gods-eye` | `gods-eye/`, `api/vision*` |
| `trinity` | `/trinity` case study | Opus | $6 | `agent/trinity` | `trinity/` |
| `rag` | `/rag` recorded demo | Opus | $7 | `agent/rag` | `rag/` |
| `docs` | READMEs for the 4 project repos | Sonnet | $5 | `docs/readme` per repo | those repos' `README.md` |

Budgets are rough. If quality needs more rounds, spend it. Tanmay watches the meter.

---

## 3. The artdirector loop (this is what prevents slop)

### Phase A — develop the locked concept (Sat, before any page is built)

The premise is **locked in `CONCEPT.md`**: the construct as a place, the terminal, programs as sub-worlds, max 2 easter eggs, and the boring blue pill. Do not pitch new premises.

1. Read `CONCEPT.md`, `CLAUDE.md`, the CV facts, and every project repo's README and code summary.
2. Write `.agents/critique/concepts.md` with **3 execution directions for that concept**. They should differ in the visual and material language of the shared system, e.g. a VT100/phosphor lineage vs. an ops-console/telemetry lineage vs. a technical-manual/schematic lineage.

   Each direction covers:
   - what the shared system looks like (type, color, texture), with the reason it traces to the source rule
   - what the terminal looks and feels like
   - one paragraph per world: God's Eye, AlgoLend, TRINITY, plus Sweet-Bite and RAG derived from their repos
   - the "loading a program" transition
   - which 2 easter eggs, and where they hide
   - a swap-test argument and risks
3. **Stop. Tanmay picks one direction, or mixes them.**

### Phase B — DESIGN.md

The chosen concept becomes `DESIGN.md`, the contract every builder follows:
- concept + signature moment
- tokens (color, type scale, spacing, radii if any)
- motion rules and what's banned
- copy voice with 5 example lines
- how each project's page differs inside the shared system
- the `/blue` contrast rule (plain, fast, printable)

### Phase C — critique rounds (every page)

After a builder hands off, artdirector writes `.agents/critique/<id>-r<n>.md` scoring:

| check | pass when |
|---|---|
| Swap test | can't swap in another dev's name |
| Source rule | every visible decision traces to work, concept, or content |
| Cliché scan | nothing from §0's banned list |
| Signature | one memorable moment, everything else quiet |
| Truth | every claim matches the CV or repo |
| Function | a recruiter finds the projects and contact in under 10s; the `/blue` path is obvious |
| Craft | type scale, spacing rhythm, alignment, states (hover, focus, empty, error) |
| Access | keyboard, focus, reduced motion, contrast AA, works at 375px |

- Output is **pass/fail per check**, plus specific fixes ("the 48px gap under the header breaks the 8px rhythm; use 40"), not vibes.
- **Minimum 2 rounds per page, max 4.** If round 4 still fails, escalate to Tanmay.

---

## 4. Communication protocol

The repo is the only channel between sessions.

```
.agents/
  BOARD.md              status, one row per agent; each agent edits only its row
  inbox/<id>.md         requests TO an agent (append-only)
  handoff/<id>.md       builder → lead + artdirector when a round is done
  critique/             artdirector's concepts and critiques
  decisions.md          lead-only rules everyone follows
DESIGN.md               artdirector-owned contract
shared/                 lead-owned: tokens.css, projects.json, motion/ (delegated to motion)
```

**Status values:** `not started` · `running` · `blocked` · `in critique` · `revising` · `ready for merge` · `merged`

**Inbox message format:**
```
## Sat 15:02 — from: godseye — to: motion
need: transition hook that fires before the WebGL canvas mounts
why: the jack-in effect flashes over a black frame
blocking: no
```

**Handoff format:**
```
## algolend — round 2
branch: agent/algolend
route: /algolend
changes since last critique: [list, each mapped to a critique item]
projects.json entry: {...}
tested: cold load, 375px, keyboard, reduced motion, console clean
screenshots: .agents/critique/shots/algolend-r2-*.png (or "need Tanmay")
```

**Rules**
- **Never edit outside your folders.** Need a change elsewhere? Write in that agent's inbox.
- **Builders never touch other pages.** `construct` and `entry` read `shared/projects.json` at runtime, so new projects appear without anyone editing those pages.
- **Before every commit:** `git pull origin main`, then re-read `DESIGN.md` and `decisions.md`.
- **Conflicts between agents** go to `lead`. Design disputes go to `artdirector`, whose call is final unless Tanmay overrides.

---

## 5. Order of operations

**Saturday**
1. `lead` setup: scaffold `.agents/`, `shared/projects.json`, placeholder pages so no route 404s. Merge.
2. `artdirector` Phase A: 3 concepts. **Tanmay picks.**
3. `artdirector` Phase B: `DESIGN.md`. `lead` derives `shared/tokens.css` from it. Merge.
4. Parallel wave: `construct`, `entry`, `motion`, `sweetbite`, `algolend`, plus `docs` (one session per repo).
5. `artdirector` critiques each handoff → builders revise → repeat.
6. `lead` merges everything marked `ready for merge`.

**Tuesday**
1. Parallel: `godseye`, `trinity`, `rag`, plus any Saturday page still in critique.
2. Critique rounds.
3. Final gate: `lead` + `artdirector` together.
   - full crawl, zero 404s
   - every page re-run through the §3 table
   - Lighthouse ≥ 90 on `/` and `/blue`
   - one last swap test on the whole site

---

## 6. Prompts

**Preamble (paste first in every session):**
> You are agent `<id>` in a multi-agent setup, running in a cloud sandbox. Push after every meaningful step; unpushed work is lost. Read `CLAUDE.md`, `CONCEPT.md`, `AGENTS.md` (especially §0, the anti-generic doctrine), and `DESIGN.md` if it exists. Then pull `main` and read everything in `.agents/`. Write only to folders you own (§2), on branch `<branch>`. Update your BOARD row on start, blocked, and done. Finish by writing your handoff (§4) and stop. If the same error fails 3 times, mark `blocked` with the error and stop.

**`lead` — setup**
> - Scaffold `.agents/` per §4, with BOARD rows for all 11 agents.
> - Create `shared/projects.json` from CLAUDE.md §4, plus `rag` (status `todo`).
> - Put a minimal "in progress" page in every project route so nothing 404s.
> - Don't design anything. Merge to `main` and stop.

**`artdirector` — Phase A**
> Do Phase A from §3. Research only the reference sources allowed in §0; no web design galleries. Write `.agents/critique/concepts.md` and stop for Tanmay's pick.

**`artdirector` — Phase B / C**
> Phase B: turn concept `<X>` (+ Tanmay's notes) into `DESIGN.md`.
> Phase C: critique `<id>` round `<n>` using the §3 table. Be specific and ruthless; cite file and line.

**`construct`**
> Build the main experience per DESIGN.md. It replaces `red/`; delete v1 entirely.
> - Include the in-site terminal: opens with `` ` ``, supports `help`, `ls`, `open <project>`, `cat resume`, `contact`, fully keyboard-driven, screen-reader friendly.
> - Read projects from `shared/projects.json`.
> - Use `shared/motion/` for transitions; don't write your own.

**`entry`**
> - Build the gate at `/` per DESIGN.md's signature for the choice moment.
> - Build `/blue` as the deliberate plain contrast: fast, printable, no canvas.
> - Remember the choice; include a way back.

**`motion`**
> Build `shared/motion/` per DESIGN.md: the page-transition system (View Transitions API with fallback) plus the signature effect(s) DESIGN.md names, as small importable modules.
> - Respect reduced motion.
> - Publish usage docs in `shared/motion/README.md`.

**Project agents** (`sweetbite` / `algolend` / `godseye` / `trinity` / `rag`)
> Build `/<slug>` per CLAUDE.md §4 and DESIGN.md's per-project direction.

| agent | specifics |
|---|---|
| `algolend` | seeded demo, no backend, never errors |
| `godseye` | wrap `gods-eye/build/`; `api/vision` proxy with `VISION_API_KEY`, per-IP rate limit, daily cap, `MOCK_VISION=1` for sandbox |
| `trinity` | case study with committed video + architecture |
| `rag` | recorded Q&A from `rag/data/qa.json`, labeled as recorded |
| `sweetbite` | read repo, deploy, real one-liner |

**`docs`**
> Use github-portfolio-builder. Rewrite this repo's README: pitch, live link `https://tanmaydesai.xyz/<slug>`, stack, run steps, architecture, license. Only verifiable claims. PR it.

---

## 7. Tanmay's prereqs

**Before Sat**
- Push `CLAUDE.md` + `AGENTS.md`.
- `public/resume.pdf`. Strip the phone number from that copy; it's public.
- Connect the repo to Vercel and attach both domains.

**Sat midday**
- Pick a concept from `concepts.md`.

**Before Tue**
- God's Eye WebGL build (Brotli) in `gods-eye/build/`
- 30s TRINITY mp4 under 15MB in `trinity/`
- `rag/data/qa.json` with 10–20 real Q&As + metrics
- `VISION_API_KEY` in Vercel env vars

---

## 8. Kill rules

- **Same error 3x,** or a session going in circles: stop it. Start fresh with the error and the latest critique pasted in.
- **A page failing critique round 4:** Tanmay decides. Usually that means the concept doesn't fit that page, not that the builder failed.
- **Leftover credit Tue night:** a `tests` agent (Opus) adds CI + tests to the 4 project repos.
