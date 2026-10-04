# DESIGN.md: the contract

Owner: `artdirector`. Status: **v1.2, 2026-10-04** (v1.1: §8 additions ruled in motion r1; v1.2: §4.2 plate width, §4.4 message line, ruled in construct r1. All additive). This file supersedes CLAUDE.md §5. Builders follow it literally. To change anything here, write to `.agents/inbox/artdirector/`. To change a **Motion API** or **Shell API** signature, artdirector must also notify `construct`, `entry` and `motion` (decisions.md #3).

Source of the decisions: `CONCEPT.md` (locked premise), Tanmay's pick in `.agents/decisions.md` #7–8, and the research in `.agents/critique/concepts.md` §0.

---

## 1. Concept: OPERATOR

> In the film, the operator sits outside the simulation and reads it through instruments. On the red side, **the visitor takes the operator's chair.** The construct is instrumented. Every program is a **channel** on the board. The terminal is the **comms loop**.

The concept traces to two sources:
- **Tanmay's work.** He is an SDET and data engineer. His Medidata engine turned 500+ raw test results into time-stamped reports with failures inline per run. Traces, p50/p95 and CI gates are his materials.
- **The Matrix idea of the operator** (not its props).

It is decided by three rules, in this order:
1. **References are physical instruments only:** oscilloscopes, mission-control consoles, avionics, hardware panel labels and legends, equipment asset tags. **Never web dashboards** (hard rule, §6).
2. **Every readout is true.** A number on screen is measured, from the CV or a repo, or labeled `SEEDED` / `RECORDED`. Nothing on the red side changes value unless real data drove the change.
3. **Color is semantic.** Nothing is colored for decoration.

### Signature moments: one bold thing per page

| page | its one bold moment | everything else |
|---|---|---|
| `/` gate | the **guarded switch**: you lift the red guard cover before you can throw it | still |
| `/red` board | the **comms loop** terminal (CONCEPT §1), plus a one-time **lamp test** on arrival from the gate | still |
| program pages | the **measured load trace**, with one **white Construct beat** when you arrive from the board | quiet; the world's own content |
| `/blue` | none, on purpose | — |

---

## 2. Tokens

Copy the block below verbatim into `shared/tokens.css` (lead commits it). Every red-side page links it.

The red side is **dark only**: an instrument panel has no light theme. Red-side pages set `color-scheme: dark` and ignore `prefers-color-scheme`. The light, printable view is `/blue`.

```css
/* shared/tokens.css — derived from DESIGN.md §2. Do not edit without changing DESIGN.md. */
:root {
  color-scheme: dark;

  /* panel */
  --panel:        #121518;  /* page ground: graphite panel */
  --strip:        #191D21;  /* channel strip / raised panel */
  --rule:         #2A2F35;  /* hairlines, 1px */
  --rule-strong:  #3A4148;  /* active hairline, plate edges */

  /* legend ink (contrast on --strip, AA) */
  --legend:       #E6E1D6;  /* 13.0:1  primary text */
  --legend-dim:   #A39E94;  /*  6.4:1  secondary text, units */
  --legend-faint: #8E8A82;  /*  4.9:1  timestamps, IDs (smallest legal text tone) */
  --inactive:     #6E6B65;  /*  3.2:1  NON-TEXT ONLY: off lamps, disabled outlines */

  /* semantic lamps (the only chromatic colors in the shell) */
  --nominal:      #5FC9C0;  /* ok / live / connected */
  --caution:      #F2B33D;  /* warn / seeded / recorded / pending */
  --fault:        #FF3B3F;  /* error / REC / the red pill. 4.8:1 on --strip */

  /* the white Construct: used ONLY inside the program-load beat */
  --construct:    #F4F3EF;
  --construct-ink:#111111;

  /* TRINITY voice lamps: from the repo's YAML. NON-TEXT ONLY (lamps, meters) */
  --voice-aria:   #4A90D9;
  --voice-echo:   #9B59B6;
  --voice-nexus:  #27AE60;

  /* type */
  --font-ui:   "Archivo", "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "Azeret Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --wdth-legend: 75;   /* font-variation-settings "wdth" for labels */
  --wdth-body:   100;

  --fs-id:    0.6875rem; /* 11px  IDs, units, timestamps (mono) */
  --fs-small: 0.8125rem; /* 13px  legends, status line, log */
  --fs-body:  0.9375rem; /* 15px  body */
  --fs-read:  1.0625rem; /* 17px  long-form reading (case studies) */
  --fs-h3:    1.125rem;  /* 18px */
  --fs-h2:    1.5rem;    /* 24px */
  --fs-h1:    2rem;      /* 32px  page title. Nothing on the site is larger, except the gate's 44px question */
  --fs-gate:  2.75rem;   /* 44px  gate only */
  --lh-tight: 1.15;
  --lh-ui:    1.35;
  --lh-read:  1.6;

  /* space: 4px base. Use only these. */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;
  --gutter: max(16px, env(safe-area-inset-left));
  --measure: 68ch;

  /* shape */
  --radius: 0;           /* everything */
  --radius-plate: 2px;   /* asset tag plates only */
  --hair: 1px;
  --lamp: 8px;           /* status lamp diameter */

  /* motion */
  --t-quick: 120ms;   /* hover/focus/press feedback */
  --t-move:  180ms;   /* guard cover, panel open */
  --t-beat:  200ms;   /* white Construct hold (min) */
  --ease:    cubic-bezier(.2, 0, 0, 1);  /* instrument settle: fast in, no overshoot */
  --blink:   1000ms;  /* REC lamp period. Real CCTV rate */
  --caret:   1060ms;  /* terminal caret period */
}

@media (prefers-reduced-motion: reduce) {
  :root { --t-quick: 0ms; --t-move: 0ms; --t-beat: 0ms; }
}
```

**Fonts** (Google Fonts, one request, two families):
`https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..600&family=Azeret+Mono:wght@400;500&display=swap`

- **Archivo**, with its width axis. At `wdth 75` it's the **panel legend** face: condensed, like stamped hardware labels. Use it for labels, headings and buttons. At `wdth 100` it's the body face.
- **Azeret Mono**, drawn after digital instrument displays. Use it for every number, ID, timestamp, unit, and the terminal. Always set `font-variant-numeric: tabular-nums slashed-zero`. If the font has no `zero` feature, accept its default zero; don't swap fonts.

**Type rules**
- Headings are Archivo `wdth 75`, weight 600, **sentence case**.
- CAPS are allowed **only for codes**: tokens of 8 characters or fewer that are identifiers, like `CH-01`, `REC`, `TESTNET`, `SEEDED`, `OK`, `WARN`. Never for a heading or eyebrow (§0 ban).
- Every number carries a unit, set in `--legend-dim`, with a thin space: `412 ms`, `1–3 s`, `14 h`.

**Hairlines and plates**
- Structure comes from 1px `--rule` lines and `--strip` panels on `--panel`.
- No shadows, no gradients, no blur, no glow, no texture.
- The only "physical" detail is the **asset tag** (§4.3).

---

## 3. Motion rules

**Allowed motion (complete list)**
1. Feedback to input (hover, press, focus), `--t-quick`.
2. Gate guard cover lift (`--t-move`).
3. Terminal panel open/close (`--t-move`, slide from the status line).
4. Lamp test on `/red`, once per session, on arrival from the gate.
5. Program load: the measured trace bar plus the white beat.
6. Visual bell on a terminal error.
7. Things that tick because time really passes: the session clock (text, 1/s), the REC lamp (`--blink`), the terminal caret (`--caret`, steady while typing).

**Banned motion**
- Everything in AGENTS.md §0.
- Looping ambient animation, random-walk numbers (e.g. the AlgoLend demo's `Math.random` jitter: never on this site), spinners (use the trace), scroll-triggered reveals, parallax, typewriter text, glitch effects outside the déjà vu egg.
- Easing with overshoot or bounce.

**Rules**
- Animate `transform` and `opacity` only, except the trace bar, which animates `inline-size` (it's a real measurement and must stay legible).
- Pause anything time-based when `document.hidden`.
- **Reduced motion:** every effect jumps to its end state. Information is never lost; only the movement goes. Each effect's fallback is in §8.

---

## 4. Shared components (red side)

### 4.1 Layout of `/red` (the board)

Top to bottom, single column, max width `1120px`, `--gutter` sides:

1. **On-call plate.** The first thing on the page, and it passes the 10-second rule on its own. One plain sentence:
   > **Tanmay Desai** · software engineer, test and data infrastructure · Boston · B.S. IT, Northeastern, May 2027
   
   Then a row of controls: `email` · `LinkedIn` · `GitHub` · `résumé (PDF)` · `plain version`.
   - The text sits in `--fs-h2` Archivo `wdth 75`. **No giant name hero.**
   - The role wording is a CV paraphrase; Tanmay approves it. <!-- PLACEHOLDER: approve "software engineer, test and data infrastructure" -->
2. **The board.** One **channel strip** per entry in `shared/projects.json`, in file order, IDs `CH-01`…`CH-0n`. Strips are full-width horizontal bands, never cards in a grid. Heights are unequal (content-driven). §4.2.
3. **Logbook.**
   - Experience as log records, newest first, one row each: `Jul–Nov 2026 · Medidata Solutions · SDET intern` plus the CV bullets in `--fs-body`.
   - Education and leadership in the same format.
   - Skills as a **loaded-modules table** (category → items, from `shared/cv.md`), not tag pills.
4. **Status line** (§4.4), fixed to the bottom.

### 4.2 Channel strip

Grid: `[ID plate 112px] [body 1fr] [controls auto]` *(v1.2: was 96px; `NOT CONNECTED` must fit on one line)*. Below 640px it stacks: plate row, then body, then controls.

- **ID plate:** `CH-02` in mono `--fs-id`, plus the status lamp.
- **Body:**
  - name (`--fs-h3`)
  - `oneLiner` from projects.json
  - **one readout line** of true facts, in mono: God's Eye `5–10 timed actions / vision plan · round-trip 1–3 s`; RAG `BM25 ∥ vector → rerank → cite · CI-gated`. Each world's readout is in §5.
- **Controls:** `Load` (primary: opens the program page through `loadProgram`) and `Source` (repo link; hidden when `repo` is null).

**Lamp states**, from projects.json `status`. They're dots of `--lamp` size, with the text label always beside them (color is never the only signal):

| status | lamp | label |
|---|---|---|
| `live` | `--nominal`, solid | `LIVE` |
| `in-progress` / `todo` | `--caution`, solid | `IN PROGRESS` |
| treatment `recorded-demo` | `--caution`, solid | `RECORDED` |
| launch target not live (§5.2, §5.4) | `--inactive` outline | `NOT CONNECTED` |

**Interaction:**
- Hover or focus on a strip brightens its left hairline from `--rule` to `--rule-strong` in `--t-quick`. Nothing else moves.
- The whole strip is not a link. Only the controls are, so there are no nested-interactive problems.

### 4.3 Asset tag (program page header)

Every program page opens with an **asset tag**: the riveted ID plate screwed onto physical equipment. Not a drafting title block.

```
┌──────────────────────────────────────────────┐
│ •                                          • │
│   CH-01   God's Eye                           │
│   unity 6 · c# · claude vision    2024–25    │   ← stack + year: from repo/CV only
│   src  github.com/TADebugs/Gods_Eye           │
│ •                                          • │
└──────────────────────────────────────────────┘
```

- **Plate:** `--strip` background, 1px `--rule-strong` border, `--radius-plate`, and four 3px "rivets" (`--rule-strong` dots) inset 6px from the corners.
- **Content:** `CH-nn` (mono), name (Archivo `wdth 75`, `--fs-h1`), stack (mono, lowercase, `·`-separated), year, source link. Max 4 lines.
- **Year:** if it isn't in the CV or the repo, omit it. Don't guess.
- **Trace rail:** directly under the plate, full width. It holds this page's load trace (§8, `renderTrace`).
- **Banned on the plate:** zone grids, revision boxes, "sheet 1 of 1", drafting borders. If it starts to look like an engineering drawing, it has failed.

### 4.4 Status line (from Direction A)

- **Placement:** fixed to the bottom on every red-side page (the board and all program pages). One line, height `32px` plus `env(safe-area-inset-bottom)`, `--panel` background, 1px `--rule` top border, `--fs-small`.
- **Content, left to right:**
  - session lamp (`--nominal`) and `op 00:03:41`: session clock, mono, ticks 1/s
  - location: `/red` or `/red › CH-02 AlgoLend`
  - **message line** *(v1.2)*: the latest comms-log record's level code and text (`ok board up · 5 channels`), in `--legend-faint`. It truncates with an ellipsis, and it updates only when a real record is logged. It's a button that opens the terminal. This is how a first-time visitor learns the log exists, the way a real console's annunciator line does. Hidden below 480px.
  - spacer
  - **terminal control**: a button labelled `` ` terminal `` on desktop, `terminal` on touch. Phones have no backtick key, so this button is how the terminal opens on mobile.
  - **`plain version`**: link to `/blue`
  - **`reconsider`**: link to `/?reconsider` (§7)
- **Why it's always there:** it is the "never a gate" guarantee. Every page always shows the way out (`plain version`) and the way in (terminal).
- **Print:** the status line is hidden in print. A red-side page printed gets a one-line note at the top: "Printable version: tanmaydesai.xyz/blue".

### 4.5 The terminal: comms loop

Owned by `construct`. Mounted on every red-side page via the **Shell API** (§9).

- **Open:**
  - `` ` `` anywhere (unless focus is in a text field other than the terminal), or the status-line control.
  - It rises from the status line as a panel: `40vh` on desktop, full screen below 640px.
  - `Esc` or `exit` closes it and returns focus to the element that opened it.
- **Look:**
  - `--panel` background, 1px `--rule-strong` top border.
  - Log records in mono `--fs-small`, one per line: `+00:12.408  cmd   run gods-eye`. The timestamp is `--legend-faint`, the level is a fixed-width code colored by level (`ok` `--nominal`, `warn` `--caution`, `fault` `--fault`, `cmd`/`info` `--legend-dim`), and the text is `--legend`.
  - Timestamps are **real time since the session started** (`sessionClock()`).
- **Prompt:** `op ▸ ` then the input, with a block caret blinking at `--caret` (solid while typing).
- **Behavior** (CONCEPT §1, all required):
  - Tab completion: single match completes; several print as a compact table.
  - ↑/↓ history, kept in sessionStorage, last 50 entries.
  - Instant response: no fake delays, except `run`, which takes as long as the load really takes.
  - Errors are a `warn` record plus a suggestion (Levenshtein ≤ 2): `warn  unknown command "rnu" · did you mean run?`, plus the **visual bell** (§8 `bell`).

**Commands** (exact output shapes; all content from projects.json / cv.md):

| command | does |
|---|---|
| `help` | lists the visible commands below, one line each |
| `ls programs` | table: `CH-01  gods-eye    God's Eye      IN PROGRESS`… (from projects.json) |
| `run <slug>` | `info loading CH-0n <name>`, then `loadProgram(slug)`. Unknown slug → `warn` + suggestion |
| `cat resume` | streams the CV as records (role · org · dates), ends `ok  open /resume.pdf` with a link |
| `contact` | email, LinkedIn, GitHub as links |
| `whoami` | **your** session first: `operator · session 00:03:41 · 7 commands · 2 programs loaded`, then `on call: Tanmay Desai · Boston · t.desai240305@gmail.com` |
| `clear` | clears the log |
| `exit` | closes the panel |
| hidden: `follow white rabbit`, `knock knock`, `ls -a programs`, `deja vu` | easter eggs §4.6 |

**Accessibility:**
- The output is `role="log"` with `aria-live="polite"`.
- The input is labelled "Terminal command" (visually hidden).
- The panel is a non-modal region with `aria-label="Terminal"`.
- Everything the terminal reaches is also a visible link somewhere on the page.

### 4.6 Easter eggs (exactly 2)

1. **Déjà vu cat** (interface)
   - **Trigger:** once per session, after 45s idle on `/red`.
   - **What happens:** the last record in the comms log repeats verbatim, with the same timestamp. A small black-cat glyph appears in the log gutter beside the duplicate. Its design borrows the sprite cat from Tanmay's Desktop AI Companion, which is in `shared/cv.md`.
   - **Payoff:** click the cat or type `deja vu`. The log prints `warn  duplicate frame · they changed something`, and the one strip whose status changed most recently gets a 2s `--rule-strong` outline.
   - **Visibility:** the duplicate also appears in the panel's history the next time it opens, even if the terminal was closed.
2. **White rabbit** (terminal)
   - **Trigger:** `follow white rabbit` or `knock knock`.
   - **What happens:** opens a hidden channel `CH-00 · unlisted` at the top of the board. It holds the origin story from the CV: VP and Software Development Lead, SCI-TECH Club, Golden Gate University (2023–24), plus the Golden Gate Associate's.
   - **Hint:** `ls -a programs` lists `CH-00` dimmed.
   - **Help:** `help` never mentions either egg.

---

## 5. Worlds (program pages)

Every program page has the same skeleton:
- asset tag + trace rail (§4.3)
- **the world** (below)
- facts block: CV bullets for this project, tightened, no new claims
- `Source` link
- status line + terminal (§9)

The world changes what's **inside the board**, never the shell: same tokens, same fonts, same status line. A world gets *one* extra visual material, named below, and no more.

### 5.1 CH-01 God's Eye: the surveillance channel (`/gods-eye`, owner `godseye`)

**Extra material:** a **camera feed frame**:
- A 1px `--rule-strong` bezel around the WebGL canvas.
- Burnt-in overlays in mono `--fs-id`, `--legend` on 60% `--panel` plates: camera ID from the game's real spawn points (`CAM NORTH_WALL_CENTER`), a running timecode `00:02:14:07` that counts only while the game runs, and the `REC` lamp (`--fault`, blinking at `--blink`).
- **No fake grain, no scanlines, no green tint.** The game's own lighting is the look.

**Panels beside or below the feed:**
- **Decision trace.** One row per T-press, using the repo's real stages: `capture` → `encode` → `vision` → `parse` → `execute`. Durations are measured in the browser for the parts it can see (request to `/api/vision` → response).
  - Copy: **"executes 5–10 timed AI actions per vision plan"**.
  - Latency appears only as the real measured value, or the repo's `1–3 s` range. **Never "sub-second"** (decisions.md #8).
  - Under `MOCK_VISION=1` the row is labeled `MOCK`.
- **GOD's plan** as scheduled events on a time axis: `+00 s spawn_white_angel @ north_wall_center`, `+30 s spawn_red_angel`. Rendered from the actual JSON.
- **LUCIFER.** His question is the only text on the page that isn't a readout: Archivo `wdth 100` italic, `--fs-read`, in an "incoming" plate. It's always a question, because that's his curse in the code.
- **Why the AI only sees on T:** a one-line note citing the repo's cost reasoning: continuous vision was rejected at ~$72/min, so the AI only sees what you choose to show it.

**Before the WebGL build lands:**
- The feed frame shows `NO SIGNAL · build not deployed`, lamp `--inactive`.
- The `Launch` state is not linked (no broken launches).

**Readout on the board strip:** `5–10 timed actions / vision plan · round-trip 1–3 s · press T to be seen`

### 5.2 CH-02 AlgoLend AI: the trading floor (`/algolend` program page, owner `algolend`; app at `algolend.tanmaydesai.xyz`)

This page is a **channel that hands off to an external app**. It is the intro to the world, not the app.

**Extra material:** the **desk call**. Three desks side by side as columns of unequal width, never three equal cards:
- Columns are sized by how much each agent's code outputs: Risk Analyzer widest, then Market Oracle, then Yield Optimizer.
- Each desk shows what the agent **reads** and what it **calls**, taken from the Python modules in the repo. Examples:
  - Risk Analyzer reads balance, account age, tx frequency, tx consistency, tx amounts, network activity, reputation, and calls `credit_score · risk_level · risk_factors`.
  - Market Oracle and Yield Optimizer: the same treatment, from their modules.
- **Each desk carries its true wiring state as a lamp** (decisions.md #8, verified in the repo). The page must not imply three live agents:

  | desk | lamp | label | why |
  |---|---|---|---|
  | Risk Analyzer | `--nominal` | `WIRED` | imported and served by `backend/app.py` |
  | Market Oracle | `--caution` | `SIMULATED` | imported by `app.py`, but its market data is generated (`random`) |
  | Yield Optimizer | `--inactive` outline | `NOT WIRED` | module exists; `app.py` doesn't use it |

  If `algolend` changes the wiring in the app repo, it updates these lamps in its handoff. The lamp is the truth, not the design.
- **No accuracy or utilization numbers anywhere** (decisions.md #8). The desks work without them: the content is *what each desk does*, not how well.
- Name the second agent **Risk Analyzer**, never "Fraud Detective".

**Readouts that are code facts, not performance claims (allowed):**
- The Risk Analyzer's **weights bar** (`balance .25 · age .20 · freq .15 · consistency .15 · amounts .10 · network .10 · reputation .05`, summing to 1.00), drawn as a segmented bar with labels.
- The LendingPool contract's four methods (`deposit · withdraw · borrow · repay`), with rate stored in **basis points**.
- The network tag `ALGORAND TESTNET`.

**Launch control** (shared rule for every external hand-off, §5.6): `Launch · algolend.tanmaydesai.xyz`.

**Readout on the board strip:** `3 agent modules · LendingPool on Algorand testnet · seeded demo`

### 5.3 CH-03 TRINITY: the three-way call (`/trinity`, owner `trinity`)

**Truth first** (decisions.md #8, verified in the repo): the desktop app is a **scaffold**; `chat_stream` / `send_message` are TODO stubs. `WakeWordDetector` and the Chirp 3 HD voices exist only in the CV, not in code. So this world shows the three personalities **as configured**, not as a running conversation. The board lamp is `IN PROGRESS`.

**Extra material:** a **conference bridge** wired but not yet carrying audio. Three channel rows on one loop: ARIA, ECHO, NEXUS. Each row has:
- a personality lamp (`--voice-*`), solid: it marks identity, not activity
- the tagline from the YAML (`Assistant Mode` / `Creative Mode` / `Developer Mode`)
- the YAML's config fields as a mono readout: `humor: sarcastic · local model: phi3:mini`, etc.
- **No level meters, no WAKE lamps, no per-voice channels.** If wake words or voices are mentioned at all, it's as a single line under the bridge: `planned (CV): wake-word detection, per-personality voices`, in `--legend-faint`, with no lamp

**Content:**
- **Idents.** Each channel row carries its personality's own example line from the YAML system prompt, labeled `ident (from config)`: NEXUS "That's O(n²). We don't do that here.", ECHO "Let me layer on some ideas for you.", ARIA "Believe it or not, I don't have that one memorized. Searching now..." These are quotes from config, not a recorded conversation.
- **Video.** Only if Tanmay records it: `PLAYBACK · RECORDED`, framed like a monitor (1px bezel), native controls, captions required. Until then the frame reads `NO SIGNAL · video pending`, lamp `--inactive`. <!-- PLACEHOLDER: Tanmay's 30s video -->
- **Permission matrix.** A table of personality × tool (`●` enabled / `○` disabled), straight from the YAML `tools.enabled` / `tools.disabled`. Label it `config`.
- **Architecture.** A plain block diagram in hairlines of what exists in the repo: `Tauri (Rust) shell → personality YAML → provider: Gemini 2.5 Flash / Ollama local fallback`. Stubbed stages (`chat_stream`, `send_message`) are drawn with a dashed 1px `--inactive` outline and labeled `TODO in repo`.
- **Orb.** The app's orb appears as a still or the video. No new Three.js on this site unless `trinity` justifies it in a critique round.

**Voice colors are for lamps and meters only.** `--voice-echo` fails AA as text. Text stays `--legend`.

**Readout on the board strip:** `3 personalities · per-personality tools (config) · desktop app in progress`

### 5.4 CH-04 Sweet-Bite: the kitchen pass (`/sweet-bite` program page, owner `sweetbite`; app at `sweetbite.tanmaydesai.xyz`)

**Extra material:** the **ticket rail**, the kitchen's own instrument. Tickets are narrow `--strip` plates clipped to a rail (a 2px `--rule-strong` line). Each ticket carries a menu item in Tanmay's own copy and its price.

**Content:**
- **Smoker channel.** `brisket · 14 h` and `pulled pork · 14 h` as long bars, `chicken · 3 h` as a short one, on one hour axis. These are the menu's own smoke times.
- **Covers by section.** `indoor · outdoor · bar`: the reservation form's real table types, shown as three labels, no fake counts.
- **Origin note.** One line: `first program · plain HTML/CSS/JS`. Honest and kept.
- **Launch control:** `Launch · sweetbite.tanmaydesai.xyz` (§5.6).

**Readout on the board strip:** `menu · hours · reservations · plain HTML/CSS/JS`

### 5.5 CH-05 Production RAG: the trace explorer (`/rag`, owner `rag`)

**Extra material:** **this page is a trace.** It is the most native world for the shared system.

**Content:**
- **Recorded queries.** Each one is chosen from a list and replays as a span waterfall: `query → retrieve.bm25 ∥ retrieve.vector → merge → rerank.cross_encoder → generate → cite`. The two retrievers are drawn as parallel spans. Durations come from `rag/data/qa.json`.
- **Retrieved chunks** hang off their retriever span with scores. The rerank span shows the before/after order as two short ranked lists.
- **Citations.** Answer sentences carry `[n]` links to the chunk they cite.
- **Header readouts.** `p50 · p95 · cost / request` from `qa.json`. <!-- PLACEHOLDER: numbers from rag/data/qa.json -->
- **CI gate strip.** The RAGAS check styled as a run record: `RAGAS gate · PASS` / `BLOCKED`, with the gated scores. <!-- PLACEHOLDER: scores from qa.json -->
- **Labeling.** Everything is labeled `RECORDED`, and the header says `replay of n real queries`. No live calls.
- **Shared code.** Use `renderTrace` from `shared/trace/` (§8) so this page and the load trace are the same instrument.

**Readout on the board strip:** `BM25 ∥ vector → rerank → cite · Langfuse p50/p95 · RAGAS-gated CI`

### 5.6 External hand-off: the launch control (AlgoLend, Sweet-Bite, any future subdomain)

This is the rule for every external hand-off. **No broken launches** (decisions.md #7).

The page decides the state from `shared/projects.json` only, with no runtime probing:

| `status` | control | markup |
|---|---|---|
| `live` | Primary button, `--nominal` lamp: **Launch · algolend.tanmaydesai.xyz**. Same tab. The host is always visible, so the visitor knows they're leaving the construct | `<a href="https://algolend.tanmaydesai.xyz">` |
| anything else | Same footprint, `--inactive` outline lamp, `--legend-faint` text: **Not connected yet · algolend.tanmaydesai.xyz**, with a second line `the app is being deployed; source is live`. Not focusable, not a link | `<p class="launch is-offline">`, no `href`, no `aria-disabled` button |

`lead` flips `status` to `live` only after verifying the subdomain serves the app. The `Source` link is always live.

---

## 6. Banned (in addition to AGENTS.md §0, which applies in full)

**Hard rule (Tanmay):** references come from **physical instruments only**: oscilloscopes, mission-control consoles, avionics, hardware panel labels and legends, equipment asset tags. **Never web dashboards.** If a component looks like it came from a SaaS admin, analytics product or monitoring web app, it fails the source rule. This includes:
- KPI tiles
- donut charts
- metric cards
- sidebars of nav icons
- rounded "widgets"
- chart libraries' default styling

**Also banned on the red side:**
- **Cards.** Rounded panels; any `border-radius` > 0 except `--radius-plate` and lamp dots; drop shadows; glows or neon `text-shadow`; gradients of any kind; blur and backdrop filters.
- **Skeuomorphic texture.** Photographic brushed metal, screws, rendered knobs. The instrument is drawn flat: hairlines and legends.
- **Numbers that move without data.** Random jitter, counters that tick up for effect, "live" values that are canned but unlabeled.
- **Metrics not traceable to a measurement, the CV or a repo** (decisions.md #8). Specifically: the AlgoLend accuracy and utilization numbers, and "sub-second" for God's Eye.
- **The white Construct anywhere except the program-load beat.**
- **ALL-CAPS outside codes** (§2 type rules). Emoji. `→` appended to links. "Hi, I'm Tanmay".
- **Green-on-black terminal.** Green appears only as `--voice-nexus` on TRINITY's lamp.
- **Spinners.** Loading is always the measured trace.

---

## 7. The gate (`/`, owner `entry`) and `/blue` (owner `entry`)

### Gate: the guarded switch

The choice from the film, built from avionics: critical switches sit under a **spring-loaded guard cover** you must lift before you can throw them. Choosing red takes two deliberate actions. Choosing blue takes one plain click. The asymmetry is the point.

**Layout:**
- `--panel` ground, centered column, max 560px.
- Question in Archivo `wdth 75`, `--fs-gate`: **"Plain résumé, or the console?"** <!-- PLACEHOLDER: Tanmay approves gate copy -->
- Two controls side by side, stacked below 480px:
  - **Blue: `Plain résumé`**. A plain bordered button: 1px `--legend-dim` border, `--legend` text. One click → `/blue`. No guard, no animation. Label underneath: `fast · printable · everything in 10 seconds`.
  - **Red: `The console`**. A switch under a red guard. The guard is a `--fault`-outlined plate with diagonal hatching drawn as 1px lines (the real convention on guard covers), hinged at the top.
    - First activation (click / Space / Enter) **lifts the guard**: `rotateX` from 0 to −110° around the top edge, `--t-move`, `--ease`, and sets `aria-expanded="true"`.
    - Second activation **throws the switch** → `/red`.
    - Label underneath: `the full thing · keyboard friendly · press ` + "`" + ` for the terminal`.
- Focus order: blue first, red second. The guard closes again on `Esc` or blur.
- **Reduced motion:** the guard swaps to its open state instantly. Still two activations.

**Remembering the choice:**
- Store it as `localStorage['td.choice'] = 'red' | 'blue'`, wrapped in try/catch.
- An inline `<head>` script redirects before first paint if a choice exists, unless the URL has `?reconsider`.
- `?reconsider` clears the key and shows the gate.
- `/red`'s status line and `/blue`'s footer both link `reconsider` → `/?reconsider`.
- `/red` runs the **lamp test** (§8) once per session when arriving from the gate (`sessionStorage['td.from-gate']`).

### `/blue`: boring on purpose

The contrast is the joke. **`/blue` uses none of the red side's materials**: no `tokens.css`, no web fonts, no JS, no lamps, no mono display, no motion.

- **Look:** white `#FFFFFF`, ink `#111111`, links `#1A44C2` underlined (7.9:1). Font stack `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. One column, `max-width: 68ch`, `16px` gutters.
- **Order:**
  1. name + contact
  2. résumé PDF link
  3. experience
  4. projects (name, one-liner, `Open` → the program route, `Source`)
  5. skills
  6. education
  7. leadership
  8. footer: `Prefer the console? /red` · `reconsider`
- **Performance:** total under 30KB, no render-blocking requests, loads under 1s on 3G Fast. A print stylesheet hides only the footer links.
- **Content:** all from `shared/cv.md`, no paraphrase drift.

---

## 8. Motion API: `shared/motion/` + `shared/trace/` (owner `motion`)

This is a contract. `construct`, `entry`, `motion` and every program-page owner code against it in parallel. All modules are native ES modules, with no dependencies and no build step, imported by absolute path.

> **Can every signature be pinned now? Yes, with one stated risk.** The cross-page white beat must be painted before the new page's first frame. That requires one tiny **classic** (blocking) script in each program page's `<head>`: `shared/motion/beat.js`. If `motion` finds that cross-document View Transitions make it unnecessary in all target browsers, it may make `beat.js` a no-op, but the file **must keep existing** so the include contract never 404s. No other part is uncertain; `motion` does not need to go first.

### Shared types (JSDoc, in `shared/trace/trace.js`)

```js
/** Epoch milliseconds with sub-ms precision: performance.timeOrigin + performance.now(). */
/** @typedef {number} EpochMs */

/**
 * @typedef {Object} SpanRecord
 * @property {string} name          stage name, e.g. "request", "parse", "mount"
 * @property {number} start         ms relative to the trace's t0
 * @property {number|null} end      ms relative to t0; null while open
 * @property {SpanRecord[]} children
 */

/**
 * @typedef {Object} Trace
 * @property {string} id            random 8-char hex
 * @property {string} slug          program slug, or "board"
 * @property {string|null} from     slug or "board" the visitor came from; null on direct visit
 * @property {EpochMs} t0
 * @property {SpanRecord} root
 * @property {number|null} total    root duration in ms (null while open)
 */
```

### `shared/trace/trace.js`

| export | signature | does |
|---|---|---|
| `now` | `() => EpochMs` | `performance.timeOrigin + performance.now()` |
| `startTrace` | `(slug: string, opts?: { from?: string\|null, t0?: EpochMs }) => Span` | creates a Trace with t0 = `opts.t0 ?? now()` and an open root span named `"load"`, and returns the root `Span`. *(v1.1: `t0` added; mountProgram uses `performance.timeOrigin` for direct visits)* |
| `resumeTrace` | `(trace: Trace) => Span` | wraps an existing Trace (e.g. from `takePending`) and returns its root `Span`, so spans can be added to it. *(v1.1)* |
| `Span#child` | `(name: string, at?: EpochMs) => Span` | opens a child span at `at ?? now()`. *(v1.1: `at` added, for spans read from Navigation Timing)* |
| `Span#end` | `(at?: EpochMs) => number` | closes the span (at `at` or `now()`) and returns its duration in ms. Idempotent |
| `Span#trace` | `Trace` (getter) | the live Trace object |
| `Span#name` | `string` (getter/setter) | the span's name; set it to rename (e.g. `"request (failed)"`). *(v1.1)* |
| `savePending` | `(trace: Trace) => void` | `sessionStorage['td.trace.pending'] = JSON` (try/catch; silent on failure) |
| `takePending` | `() => Trace\|null` | reads and **removes** the pending trace; null if none, unparseable, or older than 10s |
| `sessionClock` | `() => number` | ms since the first red-side page view this session. Sets `sessionStorage['td.session.t0']` on first call |
| `formatClock` | `(ms: number) => string` | `+03:41.208`; at 1h or more, `+1:03:41.208` |
| `formatMs` | `(ms: number) => string` | under 1000: `412 ms`; otherwise `1.84 s` (two decimals). Thin space (U+2009) before the unit |

Pure data. No DOM, no motion, no reduced-motion behavior.

### `shared/trace/render.js`

| export | signature | does |
|---|---|---|
| `renderTrace` | `(el: HTMLElement, trace: Trace, opts?: { live?: boolean, label?: string }) => TraceView` | Renders a span waterfall into `el` as an `<ol>`: one `<li>` per span (depth-first), each with the name, a bar (`aria-hidden`, `inline-size` as a percent of the total) and its `formatMs` duration as text. With `live: true`, open spans grow every animation frame until ended. `label` is the caption (default `"loaded in {total}"`) |
| `TraceView#update` | `(trace: Trace) => void` | re-renders with new data (used by `/rag` to switch queries) |
| `TraceView#stop` | `() => void` | stops rAF; bars freeze at their current value |

Reduced motion: `live` is ignored. Bars render at the final length once spans end, and nothing grows. Pauses while `document.hidden`. Used by: every program page (trace rail), `/rag` (main world), `/gods-eye` (decision trace rows).

### `shared/motion/beat.js`: classic script, NOT a module

Include it as `<script src="/shared/motion/beat.js"></script>` in `<head>` of every **program page**, before any stylesheet that paints the body.

Behavior:
- If `sessionStorage['td.trace.pending']` exists **and** reduced motion is off, it adds `class="is-beat"` to `<html>`.
- `motion.css` makes `html.is-beat` paint `--construct` full-bleed with the body hidden (`visibility: hidden`), so the new page's first frame is the white Construct.
- **Failsafe:** beat.js schedules its own `setTimeout(() => html.classList.remove('is-beat'), 1500)`. If `mountProgram` never runs (module error, offline, blocked script), the page still reveals itself after 1500ms. `mountProgram` removing it earlier is the normal path; removing it twice is harmless.
- No exports.
- Reduced motion: does nothing.

### `shared/motion/motion.css`

Linked on every red-side page (after `tokens.css`). It holds:
- the `.is-beat` rule
- the bell's `.is-bell` rule
- the lamp-test `[data-lamp].is-test` rule
- **No `@view-transition`** (ruled in motion r1). The beat already gives a white last frame → white first frame, and cross-document View Transitions would add a crossfade to every other red-side navigation, which §3 doesn't allow.
- The leave fade, implemented as a fixed `--construct` layer (`html.is-leaving::after`, opacity only, `pointer-events: none`) over the page. It is not `body { opacity }`, so it works whatever a page paints its ground on.
- Default trace waterfall styles under `:where()` (zero specificity). Pages may restyle `.trace*` freely. All the other selectors in this file are not to be overridden.

It defines no layout. Builders don't override its selectors.

### `shared/motion/program.js`

| export | signature | does | reduced motion | called by |
|---|---|---|---|---|
| `loadProgram` | `(slug: string, opts: { href: string, from?: string, rail?: HTMLElement\|null }) => Promise<void>` | Board side. (1) `startTrace(slug, { from: opts.from ?? 'board' })`, child span `"request"`. (2) If `rail` is given, `renderTrace(rail, …, { live: true })` so the bar grows while the request runs. (3) `fetch(href, { credentials: 'same-origin' })` to measure the request and warm the HTTP cache; ends `"request"` on response. (4) `savePending(trace)`. (5) Fades the page to `--construct` over `--t-quick` with the `is-leaving` layer (the white beat starts on this side); **the trace clock pauses for the fade**: `t0` is shifted forward by the measured fade duration, so no span includes it. (6) `location.assign(href)`. The promise resolves just before step 6. **bfcache:** on import, program.js adds one `pageshow` listener. When `event.persisted` is true (the board was restored with the browser Back button), it removes the `is-leaving` layer instantly (no transition back) and stops any live rail render, so the restored board is never stuck faded. **Hung fetch:** capped at 5000ms; the span is ended and named `"request (timeout)"`, and navigation proceeds. **Callers** intercept only unmodified primary clicks (no Ctrl/Cmd/Shift/Alt, `button === 0`). Modified clicks fall through to the plain `href` so open-in-new-tab keeps working. **Repeat calls** while one is in flight return the same promise. **Failure policy:** if the fetch rejects or the response isn't `ok`, still `savePending` (with `"request"` ended and named `"request (failed)"`) and navigate anyway. Never block navigation; a 404 page is the server's honest answer | no rail growth, no fade; trace still recorded; navigates immediately after the fetch resolves or 1500ms, whichever is first | `construct` (Load buttons, `run <slug>`) |
| `mountProgram` | `(slug: string, opts?: { ready?: Promise<unknown>, rail?: HTMLElement\|null }) => Promise<Trace>` | Program side. Call once, as early as the module runs. (1) `takePending()`; if none, this is a direct visit: start a new trace with `t0 = performance.timeOrigin` and `from: null`, and add a `"request"` span from Navigation Timing (`requestStart` → `responseEnd`). (2) Add a `"parse"` span from Navigation Timing (`responseEnd` → `domContentLoadedEventEnd`). (3) If `html.is-beat`, hold the white for `max(0, --t-beat − elapsed since navigation start)` (the beat is ≥ 200ms in total, **never counted in the trace**), then remove `is-beat` and reveal the body (opacity 0 → 1, `--t-quick`). (4) Child span `"mount"`: ends when `opts.ready` settles. Default: immediately. If it **rejects**, the span is named `"mount (failed)"` and the promise still resolves. (5) End the root, `renderTrace(rail)` if given, and resolve with the Trace | no beat (beat.js never set it), no reveal fade; trace identical | every program page |

Truth rule: `Trace.total` and every span are measured. Nothing pads, rounds up or fakes a minimum. The board-side leave fade, the white beat and the reveal fade are **excluded** from all spans. Gaps between spans (e.g. the browser's own navigation between `request` and `parse`) are real time and stay visible as gaps; the root ends at the last child's end.

### `shared/motion/bell.js`

| export | signature | does | reduced motion | called by |
|---|---|---|---|---|
| `bell` | `() => void` | Visual bell: adds `.is-bell` to `<html>` for one frame (≈ 50ms), which applies `filter: invert(1)` (the terminal reverse-video flash). Rate-limited to once per 500ms (never more than 2 flashes/s: photosensitivity) | no inversion; instead the status-line session lamp shows `--fault` for 1000ms (`[data-lamp="session"]` gets `.is-fault`) | `construct` (terminal errors) |

### `shared/motion/lamp-test.js`

| export | signature | does | reduced motion | called by |
|---|---|---|---|---|
| `lampTest` | `(root?: ParentNode, opts?: { ms?: number }) => Promise<void>` | Lights every `[data-lamp]` in `root` (default `document`) at full `--legend` for `ms` (default 400), then restores each one's real state. Resolves when restored. Run once per session on gate arrival | resolves immediately, no change | `construct` (`/red` on load when `sessionStorage['td.from-gate']` is set; construct clears the flag) |

### `shared/motion/reduced.js`

| export | signature | does |
|---|---|---|
| `reducedMotion` | `() => boolean` | `matchMedia('(prefers-reduced-motion: reduce)').matches`, read live on every call |

### `shared/motion/index.js`

Re-exports `loadProgram`, `mountProgram`, `bell`, `lampTest` and `reducedMotion`, plus everything from `shared/trace/trace.js` and `shared/trace/render.js`. Builders import from here:

```js
import { loadProgram, mountProgram, bell, lampTest, renderTrace, sessionClock } from '/shared/motion/index.js';
```

`motion` also writes `shared/motion/README.md`, with usage and a demo page at `shared/motion/demo.html` (not linked from the site).

---

## 9. Shell API: `construct/shell.js` (owner `construct`)

Every red-side page needs the status line and terminal, but program pages are owned by other agents. So the shell is a contract too.

| export | signature | does |
|---|---|---|
| `mountShell` | `(opts: { channel: string\|null }) => Shell` | Injects the status line (§4.4) and the terminal (§4.5) into `document.body`, binds `` ` ``, and starts the session clock. `channel` is the program slug, or `null` on the board. Idempotent per page |
| `Shell#log` | `(rec: { level: 'cmd'\|'info'\|'ok'\|'warn'\|'fault', text: string }) => void` | Appends a record (timestamp = `sessionClock()`), even while the panel is closed |
| `Shell#logTrace` | `(trace: Trace) => void` | Logs `ok  CH-0n <name> loaded in 412 ms` (or `warn … mount (failed)`) |
| `Shell#register` | `(name: string, cmd: { help?: string, hidden?: boolean, run: (args: string[], shell: Shell) => void \| Promise<void> }) => void` | Adds a page-specific command (e.g. `/rag`: `replay <n>`). Names must not collide with §4.5 |
| `Shell#open` / `Shell#close` | `() => void` | Programmatic open/close |

**Program page boilerplate** (every program page, exactly this order):

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <script src="/shared/motion/beat.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..600&family=Azeret+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="/shared/tokens.css">
  <link rel="stylesheet" href="/shared/motion/motion.css">
  <!-- page css -->
</head>
<body>
  <header class="asset-tag">…</header>
  <div class="trace-rail" id="rail"></div>
  <main>…</main>
  <script type="module">
    import { mountProgram } from '/shared/motion/index.js';
    import { mountShell } from '/construct/shell.js';
    const shell = mountShell({ channel: 'gods-eye' });
    mountProgram('gods-eye', { ready: window.gameReady, rail: document.getElementById('rail') })
      .then(trace => shell.logTrace(trace));
  </script>
</body>
```

**Stubs while dependencies aren't merged:** builders create the stubs **inside their own folder** (e.g. `algolend/_stub/shell.js`) exporting the same signatures as no-ops, and switch the import path when the real module merges (AGENTS.md §6). Never create files under `shared/` or `construct/` you don't own.

---

## 10. Copy voice

Operator radio procedure:
- terse, factual, sentence case, units on every number
- second person when addressing the visitor; never first-person hype
- no exclamation marks, no "passionate", no "journey"
- proper nouns keep their case
- error copy says what happened and what to do

**Five example lines:**
1. `on call: Tanmay Desai · Boston · test and data infrastructure`
2. `CH-01 God's Eye — a vision model watches you play. It only sees what you send it: press T.`
3. `unknown command "rnu" · did you mean run?`
4. `Not connected yet · sweetbite.tanmaydesai.xyz — the app is being deployed; source is live.`
5. `loaded in 412 ms. That number is real: slow network, long bar.`

---

## 11. Quality floor (critique checks against this)

- AA contrast. Token pairs are pre-checked in §2; don't introduce new pairs without checking.
- `:focus-visible` on every control: 2px solid `--legend`, offset 2px. On the gate's red guard, 2px `--fault`.
- Works at 375px with no horizontal scroll. Respects `viewport-fit=cover` + safe areas. The status line respects `safe-area-inset-bottom`.
- Semantic HTML: `<details>` for expandables, real `<a>`/`<button>`, the terminal ARIA in §4.5.
- Reduced motion per §3 and §8.
- Lighthouse ≥ 90 on `/` and `/blue`.
- Every link resolves (no 404s), and every launch follows §5.6.
- Swap test: replace "Tanmay Desai". If the board, the asset tags and the worlds still work unchanged, it fails.
