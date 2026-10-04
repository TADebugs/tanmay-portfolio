# Phase A — 3 execution directions for CONCEPT.md

artdirector · 2026-10-04 · branch `art/phase-a`

The premise is locked: the construct is a place, the terminal is the signature, programs are sub-worlds, max 2 easter eggs, `/blue` stays boring. These three directions differ only in the **material language** of the shared system: what the construct is *made of*. Pick one, or mix (notes on mixing at the end).

| | A — SESSION | B — OPERATOR | C — LOADING PROGRAM |
|---|---|---|---|
| lineage | DEC VT220 + dial-up BBS | ops console / telemetry / SRE on-call | printed technical manual + pen plotter |
| ground | black glass, white P4 phosphor | graphite instrument panel | the white void of the film's Construct |
| the construct is… | a session you're logged into | a console you're operating | a manual being plotted while you read it |
| signature | phosphor afterglow + baud-rate paint | a real trace of your own visit | pen-plotter line draw |
| risk | retro-terminal kitsch | looks like a SaaS dashboard | reads "minimal designer site", loses the dark |

---

## 0. What the repos actually say (research notes every direction uses)

Facts below come from reading the repos on 2026-10-04, cross-checked against `shared/cv.md` (lead, pulled after the first draft). Anything not verified is marked.

**God's Eye** (`TADebugs/Gods_Eye`, Unity 6 / URP / C#)
- Player presses **T** → `ScreenCapture.CaptureScreenshotAsTexture()` → base64 PNG → Claude Sonnet 4 vision.
- One call returns two personas as JSON: **GOD** (silent architect, never speaks, only acts: `spawn_white_angel`, `spawn_red_angel`, `spawn_fox`, `teleport_player`, each with `delay_seconds` and a `spawn_point` like `north_wall_center`, `southeast_corner`) and **LUCIFER** (cursed oracle, can *only ask questions*).
- Enemies: White Angels (max 3), Red Angel (max 1, **freeze gaze**: eye contact freezes both of you for 3s), White Fox (flees, howls a White Angel in after 60s, drops health if killed first).
- 10×10 procedural dungeon, flickering corner torches, fog density 0.05.
- Real numbers in `CLAUDE_CONTEXT.md`: T-key to response ~2–4s; continuous 60fps vision rejected because it'd cost ~$72/min. That's *why* the AI only sees what you choose to show it.
- CV adds: "5–10 timed AI actions per request", "100% non-scripted gameplay", "sub-second in-game response". ⚠ The repo measures the vision round-trip at 1–3s; "sub-second" can only mean action execution after the plan arrives. Any trace on the site uses the repo's stage ranges and must not imply a sub-second vision call.
- The repo's own prompt calls the dungeon "the Matrix" and the player "an anomaly". The concept fit is native, not imposed.

**AlgoLend AI** (`TADebugs/ALGOLEND_AI`, React + FastAPI + Algorand TypeScript contracts)
- `LendingPool` contract: `deposit`, `withdraw`, `borrow`, `repay`; rate stored in **basis points**; simple interest over `Global.latestTimestamp`.
- Three Python agents: `market_oracle.py`, `risk_analyzer.py`, `yield_optimizer.py`. Risk Analyzer scores an account with fixed weights: balance .25, account age .20, tx frequency .15, tx consistency .15, tx amounts .10, network activity .10, reputation .05 → `credit_score`, `risk_level`, `risk_factors`, `ai_confidence`.
- Seeded data in `demo-ui/App.jsx`: pools (Stable Yield 8.5% A+, High Growth 12.3% B+, Conservative 6.2% A), loan requests (Tech Startup $50k 75% funded B+, …).
- ⚠ Truth: the "94.2% / 98.7% / 91.5% accuracy" figures are hardcoded constants in the demo UI and README, not measured. **They must not appear on the site as metrics.** The CV's own claims ("90%+ risk-assessment accuracy", "roughly 3x better capital utilization than static lending models") are the citable ones, attributed as CV claims. Also the demo UI calls the second agent "Fraud Detective" while the backend calls it "Risk Analyzer"; the site should use the backend name.

**TRINITY** (`TADebugs/TRINITY`, Tauri/Rust desktop app + earlier FastAPI/React web version)
- Three personalities from YAML: **ARIA** (assistant, `#4A90D9`, sarcastic, tools: web search, browser automation, smart home, calendar), **ECHO** (creative, `#9B59B6`, dad jokes, tools: brainstorm, CAD, image gen, 3D printer), **NEXUS** (developer, `#27AE60`, dry nerd humor, tools: code, terminal, git, files; *"Never execute terminal commands directly. Always propose the command and wait for user confirmation."*).
- Each has a **wake word** (its own name) and a local fallback model (`phi3:mini`, `llama3.2:3b` via Ollama); cloud provider is Gemini 2.5 Flash. Three.js orb that changes per personality.
- CV adds: Gemini 2.5 **Native Audio** streaming, **personality-specific voices (Chirp 3 HD)**, and named components `PersonalityManager`, `WakeWordDetector`, `ToolRouter`. So each personality has its own *voice*, not just its own color: every world sketch below can use that.
- Their own example lines are gold for copy: NEXUS: *"That's O(n²). We don't do that here."* ECHO: *"Let me layer on some ideas for you."*

**Sweet-Bite** (`TADebugs/Sweet-Bite`, plain HTML/CSS/JS, 4 pages)
- A restaurant site for a fictional "Sweet Bites BBQ": home, menu (brisket "slow-smoked for 14 hours", Bucket o' Biscuits, sides by pint / half-pint), reservations (indoor / outdoor / bar), contact. Hours table, placeholder address `123 Main Street, Anytown`.
- The code comments are a learner's notebook: *"this was something i learnt on my own"*, *"i learnt it partially with the help of AI and partially from W3schools and Stack overflow"*. It's Tanmay's early front-end work, and honest about it.
- ⚠ Before deploying (for `sweetbite`, not a design choice): the reservation form has a **required `Card Number` field** (it only `alert()`s, nothing is sent, but a card field on `tanmaydesai.xyz` looks like phishing; disable or remove it). `images/giftcard.jpg` is missing (broken image) and the gift-card link carries a pasted Bing ad-tracking URL. Menu copy references "SCQ" rub/wings, which looks lifted from a real restaurant <!-- PLACEHOLDER: ask Tanmay where the menu copy came from; rewrite if it's a real restaurant's -->.

**RAG** (no repo; facts from `shared/cv.md`)
- Python RAG over a ComicOracle/PokeAPI-based corpus. Pipeline: **hybrid BM25 + vector retrieval → cross-encoder reranking → citation-grounded answer**.
- Observability: **Langfuse** tracing, **p50/p95 latency and cost-per-request**.
- Quality gate: **RAGAS** evaluation in **GitHub Actions CI with regression gating** (blocks quality regressions before merge).
- Built in three phases: basic RAG → hybrid + rerank → observability + CI gating. Runs locally on Tanmay's Mac, so the site gets a recorded demo from `rag/data/qa.json`.
- Still unknown: the actual numbers (p50/p95 ms, cost, RAGAS scores, k). <!-- PLACEHOLDER: from rag/data/qa.json --> The worlds below use the real pipeline stages and leave numbers as slots.

**CV facts that feed the shared system:** SDET intern (a CI testing engine turning 500+ JSON test results into time-stamped HTML reports, failures surfaced inline per pipeline run), Data Engineering intern (a TensorFlow/Keras classifier auto-tagging feature files across 10+ repos; parsing/transform workflows), EA C++ on College Football (fixed a production performance bottleneck). Also in design: a **Desktop AI Companion driven by a sprite cat** (relevant to the déjà vu cat egg). These are why "observable, production-grade" is a legitimate material in §0, not decoration.

---

## Direction A — SESSION
*The construct is a terminal session on a DEC VT220, dialled into Tanmay's BBS. You aren't looking at a website; you're logged in.*

### Shared system
- **Grid:** the whole red side lays out on a **character cell grid**, 80 columns on desktop, reflowing to 40 on mobile (the 40-column mode was a real thing: Apple II, early BBS callers). Every element's width is a whole number of cells. No arbitrary px gaps; spacing is in `ch` and line-heights. This is the "reality is rendered" idea made literal: the construct has a resolution, and you can see it.
- **Color:** the VT100/VT220 shipped with **P4 white phosphor**, not green. Base is white phosphor `#E9EEF0` on black glass `#050607`, with *intensity* (bold/dim, the VT's real attributes) instead of a gray scale: `--hi` full, `--norm` 78%, `--dim` 45%. One chromatic color at system level: `--pill` red, used only for the cursor-when-errored and the way back to `/blue`. Programs may swap phosphor (below). Green appears nowhere in the shell.
- **Type:** one monospace for everything, at two "attributes": normal and double-height/double-width (DEC's `DECDHL`/`DECDWL` escape sequences; the VT really had a double-size line mode). Headings are double-size lines, not a display serif. Candidate: **Fragment Mono** (Google Fonts, Helvetica-derived cell font, reads like a late-80s terminal ROM without being a pixel font). No VT323, no pixel fonts: those are the kitsch version.
- **Texture:** *phosphor persistence* instead of grain. When text changes, the old glyphs decay over ~180ms (P4 has short persistence; the decay is a real property of the material, not a filter). No scanline overlay, no barrel distortion, no CRT vignette. The glass is clean; only time leaves marks.
- **Frames:** UI boxes are drawn with box-drawing characters (`┌─┐│└┘`, double-line `╔═╗` for the active window) as the BBS/ANSI tradition did. Real text, so they reflow and screen readers skip them (`aria-hidden` on the frame glyphs).
- **Source:** VT history (§0 allowed reference) + Matrix idea "the construct is rendered" (the cell grid is the render resolution) + Tanmay's actual tools (he lives in terminals: C++ at EA, NEXUS's whole job).

### The terminal
- It's not a modal over the page; it's **the 24th line**. The VT220 had a host-writable **status line** at the bottom of the screen. Press `` ` `` and the status line becomes the command line. Output scrolls the region above it, pushing the current screen up like a real scroll region (`DECSTBM`). `Esc` or `exit` gives the line back to the status bar.
- Prompt: `tanmay% ` with a block cursor that blinks at the VT's real rate (~530ms) and goes solid while typing.
- Errors don't print red text. They ring the **visual bell**: the whole screen inverts for one frame (the VT's `DECSCNM` reverse-video flash, which is how terminals did bells without sound). Then: `rnu: command not found. did you mean run?`
- `ls programs` prints a BBS-style file listing: `GODS-EYE  .EXE  unity/webgl  2025` with columns, sizes, dates. <!-- PLACEHOLDER: dates/sizes come from shared/projects.json; don't invent -->
- Status line when idle: `CONNECTED 9600 8N1 │ /red │ 5 programs │ ` + `/blue` shortcut on the right. That's the "always a way out" rule in VT clothing.

### Worlds
- **God's Eye — the security monitor.** The program switches the session into a monochrome **CCTV monitor** mode: same cell grid, but the phosphor turns to a camera's flat gray and a timecode runs in the corner (`CAM 03 · NORTH_WALL_CENTER · 00:02:14:07`). Camera IDs are the game's real spawn points. The WebGL build is the "feed"; outside it, a log scrolls GOD's plan exactly as the JSON the model returns (`+00s spawn_white_angel @north_wall_center`, `+30s spawn_red_angel @south_wall_center`). LUCIFER's lines appear *only as questions* in the status line, in dim. The REC dot is the one place the system red is used inside the world. When the player hasn't pressed T, the monitor says `NO SIGNAL — PRESS T TO BE SEEN`: the AI only watches when you let it, which is the real cost decision from the repo.
- **AlgoLend — the amber ticker.** The phosphor swaps to **P3 amber** (`#FFB000`), the color of real trading terminals of the era. The screen splits into three "desks" as fixed-width columns, one per agent (`MKT ORACLE`, `RISK ANALYZER`, `YIELD OPT`), each printing calls in a ticker cadence: `RISK  acct …7Q2F  score 742  B+  factors: account_age(.20) low`. A ticker tape on row 2 scrolls the seeded pools (`STABLE 8.50% A+ │ GROWTH 12.30% B+ │ CONSV 6.20% A`). Rates are shown in **bps** because the contract stores them that way. All seeded, labeled `TESTNET · SEEDED DEMO` in the status line.
- **TRINITY — three windows, three phosphors.** The VT screen splits into three scroll regions, one per personality, each in its own phosphor tint taken from the YAML (`#4A90D9`, `#9B59B6`, `#27AE60`), each with its own cursor. They talk to each other and to you in turn; whoever is "speaking" gets the double-height line. Typing a wake word (`aria`, `echo`, `nexus`) focuses that window. NEXUS never runs a command you give it; it prints the command and asks `[y/N]`, exactly as its YAML demands. Each window carries a voice tag in its header (the Chirp 3 HD voice per personality, from the CV) and a wake-word indicator that lights when its name is typed. The 30s video plays inside a framed region with the orb.
- **Sweet-Bite — the BBS door game.** Old BBSes had "doors": small external programs you dropped into. Sweet-Bite is presented as the first door Tanmay ever wrote: a full-screen ANSI menu board (`SPECIALITIES · SANDOS · SIDES · DESSERTS`, prices right-aligned in a dot leader), a `14:00:00` smoke timer counting the brisket's real 14 hours, and a `[L]aunch` key that opens the actual site. The learner's code comments are shown as a `README.DOC` the visitor can `cat`. Honest framing: an early program, kept.
- **RAG — the file area.** BBS file areas were searchable archives. The RAG world is a file-area search screen: you pick a recorded question at the prompt, and it prints two search passes side by side, `BM25` and `VECTOR`, each a numbered file list with scores; then a `RERANK` pass where the cross-encoder reorders the merged list (lines visibly swap rows); then the answer, with `[1][3]` references that jump to the cited chunk. The RAGAS gate is a line in the sysop's bulletin: `last CI gate: PASS · faithfulness <!-- PLACEHOLDER -->`. Latency and cost print like a modem transfer stat (`p50 <!-- PLACEHOLDER -->ms · p95 <!-- PLACEHOLDER -->ms · $<!-- PLACEHOLDER -->/req`). Clearly labeled `RECORDED`.

### Loading a program
`run gods-eye` (or a click):
1. The status line prints `ATDT GODS-EYE` and then `CONNECT`.
2. The current screen clears **top-down, one row per frame** (like a terminal receiving `ESC[2J` over a slow line).
3. The program's first screen **paints in at baud rate**: characters arrive left-to-right, row by row, as if over a 9600 baud line, but compressed to ≤ 600ms total. The world's phosphor color cross-fades in through the persistence decay.
4. Back (`exit` / Back button): `NO CARRIER`, reverse paint, and you're on the main screen.
- Reduced motion: no paint; the status line still prints `CONNECT`, the screen swaps instantly.

### Easter eggs (2)
1. **White rabbit**, in the interface: on rare idle (after 60s with no input), one line of the MOTD at the top of `/red` is rewritten in place, character by character, to `follow the white rabbit.` and then back. If you type `follow` (or `knock knock`) while it's showing, you're dropped into a hidden `~/.rabbit` directory listing with one file: the CV's leadership line (SCI-TECH VP), the one fact not shown elsewhere on `/red`. Earned, gives you something real.
2. **Spoon**, in the terminal: `bend spoon` → `there is no spoon.` and for one beat the 80-column grid itself **bends** (every row offset by a sine of its index, then snaps back). The rule of the construct, the cell grid, is the thing that breaks. Not listed in `help`.

### Swap test
Swap the name and the shell survives, but the worlds don't: CAM IDs are God's Eye's spawn points, the amber desks are AlgoLend's three agents and its basis-point contract, the three phosphors are TRINITY's YAML colors, the door's timer is Sweet-Bite's 14-hour brisket. **Weakest point:** the shell itself (a VT terminal) is the one layer another developer could also claim. It's carried by details (P4 not green, status line, visual bell) more than by Tanmay.

### Risks
- **Retro-terminal kitsch** is the nearest cliché. The guardrails: no scanlines, no curvature, no green, no pixel font. If any of those creep in during critique, it fails.
- 80-column layout on 375px: must reflow to 40 columns honestly, not shrink type.
- Monospace-only hurts long reading (case studies). TRINITY/RAG text blocks may need a wider measure exception.
- The whole site is one look, so **AlgoLend amber and TRINITY tri-color** are what keep worlds from feeling like the same screen. If they're timid, everything blurs.

### Motion API sketch (what Phase B would need to pin down)
- `loadProgram(slug, { from, onMount }) → Promise<void>`: the dial-in sequence. Needs the program's phosphor token and first-screen DOM before painting.
- `paint(el, { baud = 9600, maxMs = 600 }) → Promise<void>`: reveals text nodes char-by-char in reading order; must operate on real text (no canvas) so it stays selectable and accessible (`aria-busy` during paint).
- `clear(el, { direction: 'down' | 'up' }) → Promise<void>`.
- `persist(el)`: attaches the phosphor-decay afterimage to text replacements (MutationObserver + a cloned fading layer).
- `bell()`: one-frame reverse video, respects reduced motion (falls back to a 2px border flash).
- `bend(gridEl)`: spoon effect.
- Reduced-motion: every function resolves immediately after the end state is applied.
- Technical note: View Transitions can wrap the swap, but the paint is a JS text reveal, not a CSS transition.

---

## Direction B — OPERATOR
*In the film, the operator sits at a console and watches the people inside the construct. On `/red`, the visitor takes the operator's chair. The construct is instrumented, and every program is a channel on the board.*

### Shared system
- **Source:** this is the direction most tied to Tanmay's actual job. He's an SDET and data engineer: traces, p50/p95, CI gates, test reports, pipelines. His Medidata SDET work was literally turning 500+ raw test results into time-stamped reports with failures surfaced inline per run; the comms log below is that same idea pointed at the site itself. §0 names those as source material. The Matrix idea is **the operator** (Tank, Link): the person outside the simulation, reading it through instruments.
- **Color:** graphite instrument panel `#14171A`, panel lines `#2A2F35`, primary readout ink warm off-white `#E6E1D6` (back-lit legend, not screen white). Color is **semantic only**, from real console conventions: `--nominal` (a calm cyan-teal, `#5FC9C0`), `--caution` amber `#F2B33D`, `--fault` red (the pill red: in this direction red *means* "something left the simulation"), `--inactive` 40% ink. No decorative color anywhere. A program's identity color is allowed only on its own channel strip.
- **Type:** two families. Labels and headings in a **condensed industrial grotesk** with real panel-legend character, e.g. **Saira Condensed** or **Archivo Narrow** (labels in sentence case, not ALL-CAPS eyebrows; the banned list stays banned). All numbers in a mono with true tabular figures and a slashed zero, e.g. **Azeret Mono** or **Red Hat Mono**. Numbers are the hero of this direction; they never jitter in width.
- **Texture:** no texture. Instruments have **hairline rules, tick marks, and units**. Every number has a unit (`ms`, `bps`, `HP`, `s`). Every panel has a small ID in the corner (`CH-03`). Density is where the craft is: lots of small, perfectly aligned things on a quiet ground.
- **Layout:** the red side is a **board** of channels (one per program), each a horizontal strip with a live-ish readout, not cards. Strips are unequal height by importance. The page reads top-to-bottom like a run sheet.

### The terminal
- It's the **comms loop**: a docked panel at the bottom (or a full-height side panel on wide screens) that looks like a structured log, not a shell.
- Every line is a log record: `+00:12.408  cmd   run gods-eye` / `+00:12.409  info  loading CH-01 GODS-EYE` / `+00:12.911  ok    mounted in 502ms`. The timestamp is **real time since you arrived**.
- Prompt: `op ▸`. Tab completion prints candidates as a compact table. Errors are a `warn` line with a suggestion, not a scolding: `warn  unknown command "rnu" · did you mean run?`
- `whoami` prints *your* session, not Tanmay's: `operator · session 00:03:41 · 7 commands · 2 programs loaded`. Then Tanmay's line: `on call: Tanmay Desai · Boston · t.desai240305@gmail.com`.
- `cat resume` streams the CV as structured records (role, org, dates) and ends with `open /resume.pdf`.

### Worlds
- **God's Eye — the surveillance channel.** This is the world CONCEPT.md already describes, and it fits the operator perfectly: you are literally watching a feed being watched by a vision model. The WebGL canvas is framed as a camera feed with burnt-in timecode and camera ID (`CAM NORTH_WALL_CENTER`), REC indicator in `--fault`. Beside it, the **decision trace** of each T-press as a span waterfall: `capture <50ms` → `encode ~150ms` → `vision 1–3s` → `parse` → `execute plan` (stages and ranges from the repo's own docs). GOD's plan lands as scheduled events on a timeline (`+30s spawn_red_angel`); LUCIFER's question is the only unruly text in the panel, set apart as an incoming transmission. The `$72/min` reason for not streaming is a real, citable line on the panel.
- **AlgoLend — the trading floor.** Three **desks** as three adjacent strips (not three equal cards: widths follow how much each agent outputs). Market Oracle calls rates, Risk Analyzer calls scores, Yield Optimizer calls allocations, in a shared order-book-style tape where each line is tagged with its desk. Risk Analyzer's real weights (`balance .25 · age .20 · freq .15 …`) render as a stacked bar that *is* the score breakdown. Pool rates in bps. Status bar: `ALGORAND TESTNET · SEEDED · no live calls`. Live backend toggle is a hardware-style switch with a caution color, off by default.
- **TRINITY — the three-way call.** A comms panel with **three channels on one loop**, like a conference bridge: ARIA, ECHO, NEXUS each with their YAML color as a channel LED and a level meter. Transcript lines carry the speaker's channel tag. They hand off to each other by tool permissions (ARIA: "that's a terminal job, NEXUS"), which is the real permission table from the YAML. The orb from the app sits in the center as the "speaking" indicator. Each channel strip lists its voice (Chirp 3 HD) and lights a `WAKE` lamp when its wake word fires, which mirrors the app's real `WakeWordDetector` → `PersonalityManager` → `ToolRouter` path. The 30s demo video is a recorded channel playback (`PLAYBACK · recorded`).
- **Sweet-Bite — the kitchen pass.** A restaurant kitchen runs on its own instrument: the **ticket rail and the expo screen**. Sweet-Bite's world is a KDS-style board: menu items come in as tickets with prices, a smoker channel reads `brisket · 14:00:00 · low & slow`, reservations show as covers by section (indoor / outdoor / bar, the form's real table types). `Launch` opens the actual site. A footnote line in the log: `first program · plain HTML/CSS/JS · 2024`.
- **RAG — the trace explorer.** The most native world for this direction, because the real system *is* traced (Langfuse). A recorded query replays as a span waterfall: `query → retrieve.bm25 ∥ retrieve.vector → merge → rerank.cross_encoder → generate → cite`, the two retrievers drawn as parallel spans. Each span carries duration; the header carries **p50 / p95 / cost-per-request** <!-- PLACEHOLDER: from qa.json -->. Retrieved chunks hang off their retriever span with scores, and the rerank span shows the before/after order. Beside it, a **CI gate** strip: the RAGAS check as a GitHub Actions run, `PASS`/`BLOCKED` with the scores that gate merges <!-- PLACEHOLDER -->. Header: `RECORDED · replay of n=<!-- PLACEHOLDER --> real queries`.

### Loading a program
**The trace is real.** `run algolend` (or a click):
1. A span bar starts drawing across the top of the board at the moment you act, labeled with the program's channel ID.
2. It **actually measures** the load: fetch of the program's HTML/JSON, decode, first paint. Child spans appear as each stage finishes. Nothing is faked; if your connection is slow, the bar is long.
3. On mount, the board's strips slide aside along the time axis and the program fills the board; the finished trace stays docked in the program's header (`loaded in 412ms`).
4. Back: the trace collapses into its line in the comms log.
- Reduced motion: no bar animation; the log line and the final `loaded in Nms` still appear.

### Easter eggs (2)
1. **Déjà vu cat**, in the interface: once per visit, after some idle time, one row of the comms log **repeats itself verbatim** with the same timestamp. A black cat glyph appears in the gutter beside the duplicate. Click it (or type `deja vu`) and the log prints `warn  duplicate frame detected · they changed something` and highlights the one line on the board that changed (e.g. a new program status). It's the film's idea (a glitch means the system was edited) mapped onto a real ops concept (duplicate events). The cat glyph can borrow the sprite cat from Tanmay's in-design Desktop AI Companion, so even the egg traces to his work.
2. **White rabbit**, in the terminal: `follow white rabbit` (or `knock knock`) opens a **hidden channel** `CH-00` on the board labeled `unlisted`, containing the leadership/origin line (SCI-TECH VP, Golden Gate) and the earliest commit date of this portfolio. Not in `help`; `ls -a programs` hints at it.

### Swap test
Strongest of the three. The board is made of Tanmay's real artifacts: God's Eye's actual latency stages and the $72/min reason, AlgoLend's risk weights and bps contract, TRINITY's permission table, the visitor's own measured load trace. A different developer can't keep the content and still have a working page; the instruments would be empty.

### Risks
- **"Dark SaaS dashboard"** is the nearest cliché (and dashboards are what people build with bento grids). Guardrails: no cards, no rounded panels, no charts that aren't real traces, strips not tiles, condensed legends not Inter.
- **Density vs. the 10-second rule:** the board can overwhelm a recruiter. The top strip must be a plain sentence (who, what, contact) before any instrument.
- Real measured timings will show ugly numbers on slow networks. That's the honest point, but the critique must check it never reads as "the site is slow".
- Least theatrical of the three; the Matrix reads through the *idea* of the operator, not the look. Some visitors won't get the reference until the terminal.

### Motion API sketch
- `loadProgram(slug, { from, onMount }) → Promise<{ trace }>`: returns the measured trace object so the page can render it.
- `trace(name) → Span` with `span.child(name)`, `span.end()`, wrapping `performance.mark/measure`. This is shared state, not just motion; Phase B must decide if it lives in `shared/motion/` or a sibling `shared/trace/` (owner: lead).
- `renderTrace(el, trace, { live: true })`: draws/updates the waterfall.
- `logLine(el, { level, text, t })`: appends a log record; also the screen-reader live region.
- `dejaVu(logEl)`: the duplicate-row effect.
- Reduced motion: bars render at final length, no slide; strips swap without translating.
- Technical note: View Transitions fits well here (`::view-transition-group` for the strip → full board morph), with a no-VT fallback that just swaps.

---

## Direction C — LOADING PROGRAM
*In the film, the Construct is a white void: "This is the Construct. It's our loading program. We can load anything." `/red` is that white room. Programs are loaded into it as plates of a technical manual, drawn by a pen plotter while you watch.*

### Shared system
- **Source:** the Matrix *idea* of the Construct itself (white, empty, anything can be loaded), not its props. Plus §0's allowed reference: **printed technical manuals and schematics** (exploded views, callouts, figure numbers, revision blocks), and the pen plotter (HP 7475-era) as the machine that turns data into drawings line by line.
- **Color:** paper-white void `#F4F3EF` (warm, not screen-white), ink near-black `#111111`, a **blueline** secondary `#2D4E9E` for leader lines and dimensions (the color of construction lines on real drawings, not a gradient), and the pill red `#D7262E` as the only accent: revision marks, the cursor, the way out. This flips the CLAUDE.md "dark is real" default, deliberately: the construct in the film *is* white, and the red pill *is* the thing that gets you there.
- **Type:** a **technical-lettering** face for labels and figure callouts, in the lineage of DIN/Leroy lettering templates, e.g. **B612** (designed for Airbus cockpit displays; on Google Fonts). Body and terminal in a plain mono like **Spline Sans Mono**. Figure numbers and part numbers everywhere: `FIG. 2 · GODS-EYE VISION LOOP`, `REV C`.
- **Texture:** **line weight** is the texture. 0.5px construction lines, 1px object lines, 2px section outlines, as drafting standards define them. Hatching for "solid" areas instead of fills. No shadows, no grain.
- **Layout:** each page is a **plate**: title block in the bottom-right corner (name, plate number, revision, date, the drafting convention), a grid of zone letters/numbers around the edge (`A–F`, `1–8`) that the terminal can reference (`goto C4`). Projects are figures on plates, not cards.

### The terminal
- It's a **teletype**: output prints onto a strip of continuous paper that feeds up from the bottom edge of the viewport, with tractor-feed holes in the margins. Press `` ` `` and the paper feeds out; `exit` tears it off (the strip slides away with a torn edge).
- Typed characters strike in with a hard, instant appearance (no fade): a typebar, not a screen.
- Prompt `>`; errors are struck through and annotated in red in the margin, like a proofreader: ~~`rnu gods-eye`~~ `did you mean run?`
- `ls programs` prints a **parts list** (item no., part name, qty, notes) as manuals do.
- Every output line is real text in a `role="log"` region; the paper is just CSS.

### Worlds
- **God's Eye — the surveillance plate.** A plan view of the 10×10 dungeon as an architectural drawing, with the eight spawn points as **camera symbols** (cone of view drawn in blueline), labeled with their real names. The WebGL feed sits in a frame on the plate as "FIG. 1 — LIVE FEED", with timecode and REC in red. Each T-press draws GOD's plan as dimensioned arrows on the plan (`spawn_red_angel · +30s`), and LUCIFER's question is a handwritten-style margin note ending in a question mark (the only non-technical lettering on the whole site, because he's the only one breaking the rules).
- **AlgoLend — the trading-floor plate.** An exploded view of the lending pool: the contract's four methods as labeled parts, the three agent desks as callouts feeding it. The ticker tape is a **paper tape** strip running along the top of the plate, printing seeded calls. Risk Analyzer's weights are a dimensioned bar (`.25 | .20 | .15 | .15 | .10 | .10 | .05`) that adds up to 1.00 on the drawing. Rate in bps with a tolerance note: `±0 · seeded`.
- **TRINITY — the three-voice score.** Like an orchestral or broadcast cue sheet: three staves, one per personality (ARIA, ECHO, NEXUS), each in its YAML color, with their dialogue placed on a shared time axis so you can see who interrupts whom. The orb is a schematic of concentric rings that the plotter redraws in the speaking voice's color. Tool permissions are a matrix table (personality × tool, ● / ○) taken straight from the YAML. Each staff's clef position carries the voice name (Chirp 3 HD per personality).
- **Sweet-Bite — the recipe card / kitchen drawing.** A kitchen floor plan from the reservation form (indoor / outdoor / bar zones), a menu laid out as a **bill of materials** with prices as unit costs, and a smoker timing diagram (`0h → 14h`, brisket and pork bars on one axis, chicken at 3h). Title block notes: `REV A · first program · HTML/CSS/JS`. Launch opens the site.
- **RAG — the cross-reference index.** The back-of-manual index is a retrieval system. The plate is a **block diagram** of the real pipeline (BM25 and vector retrievers in parallel → cross-encoder reranker → generator), and the recorded question flows through it: retrieved chunks appear as numbered **excerpts with section references**, the rerank shown as two ranked columns with crossing leader lines (before → after), and leader lines from each answer sentence to the excerpt it cites. A spec table in the title block holds p50 / p95 / cost-per-request and the RAGAS gate <!-- PLACEHOLDER: from qa.json -->. Header: `RECORDED`.

### Loading a program
**The plotter draws it.**
1. The current plate whites out to the empty Construct (≤150ms). For one beat there is nothing on screen but the paper and the title block.
2. The new plate's **line work draws itself** in pen order, the way a plotter does: frame and zone grid first, then construction lines (blueline), then object lines (ink), then lettering last. Implemented with SVG stroke-dashoffset on the plate's vector layer; HTML content fades in only after its outline is drawn.
3. Capped at ~900ms total for the heaviest plate; lighter plates are faster because they have less to draw. The pen's speed is constant, so the time is honest.
- Reduced motion: whiteout skipped; the plate appears complete.

### Easter eggs (2)
1. **Spoon**, in the terminal: `bend spoon` prints `there is no spoon.` and the **straight edge of the page frame** (the one thing a technical drawing promises is straight) bends for a beat, then is redrawn by the plotter. Not in `help`.
2. **White rabbit**, in the interface: in the title block of the home plate, the drafter's initials field reads `TD`; on one plate, a tiny rabbit is drawn in the zone grid margin (drafters really did hide marks in drawings). Clicking it opens a hidden plate, `PLATE 0 · ORIGIN`: the leadership line (SCI-TECH VP, Golden Gate) and the earliest date in the CV.

### Swap test
Medium-strong. The plates' content is Tanmay-specific (dungeon plan with real spawn points, AlgoLend's weights adding to 1.00, TRINITY's permission matrix from the YAML, the 14-hour smoker diagram). **Weakest point:** "white technical drawing" is a style a designer could apply to anyone; it lives or dies on the *drawings being of real things*. Generic diagrams = fail.

### Risks
- **Reads as a minimal design-studio site.** White + mono + blueprint lines is close to a known "architect portfolio" look. The plates must be dense with real, specific drawing, not elegant emptiness.
- **Loses the dark.** CLAUDE.md §5 (provisional) said dark is the real look; this direction overrides it. The red/blue gate contrast also changes: `/blue` is plain white too, so the difference must come from *motion and density*, not color.
- Drawing real schematics for 5 worlds is the **most labor** of the three directions (SVG per plate). With the Oct 8 deadline, plates must be simple and few.
- Pen-plotter draw-ons are a known motion trick; it's earned only if the drawings are honest data.

### Motion API sketch
- `loadProgram(slug, { from, onMount }) → Promise<void>`: whiteout → plot → content.
- `plot(svgEl, { order: ['frame','construction','object','lettering'], penSpeed }) → Promise<void>`: draw-on by layer class; speed in px/ms so duration follows the drawing.
- `whiteout(ms) → Promise<void>`.
- `feedPaper(termEl, { lines })` / `tearOff(termEl)`: the teletype.
- `bendFrame(frameEl)`: spoon effect.
- Reduced motion: `plot` sets all strokes to drawn and resolves; `feedPaper` jumps.
- Technical note: requires every plate to ship an SVG line layer with layer classes. That's a contract for every world builder, not just `motion`.

---

## Recommendation

**B — OPERATOR**, with two borrowings:
- from **A**: the terminal's *visual bell* for errors and the **status line** as the always-visible way out (it's better than a docked log for the "never a gate" rule on mobile).
- from **C**: the **title-block** idea for each program header (plate number, revision, date, stack) as the honest metadata strip.

Why: it's the only direction where the shared system itself is made of Tanmay's work (SDET/data engineering → traces, logs, units, measured timings) instead of a historical aesthetic he happens to like. It passes the swap test at the shell level, not just in the worlds. It also makes God's Eye's world (a monitored feed) and RAG's (a trace) native instead of themed. Its main risk (dashboard slop) is a craft problem the critique table can police, while A's (kitsch) and C's (generic minimalism) are taste problems that are much harder to catch line by line.

**Mixing notes for Tanmay:** A's per-world phosphor swap (white → amber for AlgoLend) works inside B as the channel's identity color. C's white Construct could be used **only for the loading transition** inside B (the board whites out for one beat before the program mounts), which would put the film's actual Construct moment into B without making the whole site white.

**Pick one:** reply with `A`, `B`, `C`, or a mix (e.g. "B + C's whiteout"). Phase B then writes DESIGN.md and the exact Motion API.

## Flags for other agents (not design decisions)
- `sweetbite`: remove/disable the required card-number field, fix missing `images/giftcard.jpg`, strip the Bing tracking URL, confirm the menu copy's origin (see §0).
- `algolend`: don't show the hardcoded accuracy percentages as metrics; name the agent "Risk Analyzer" consistently.
- `rag`: pipeline stages now come from `shared/cv.md`; every *number* (p50/p95, cost, RAGAS scores, k) is still a slot until `rag/data/qa.json` lands.
- `godseye`: CV says "sub-second in-game response", repo measures 1–3s vision round-trip. Don't label the vision call as sub-second.
- `lead`: `shared/projects.json` Sweet-Bite one-liner could be: "Restaurant site for a fictional BBQ spot; menu, hours and a reservation form in plain HTML/CSS/JS." (verified from the repo; Tanmay to approve).
