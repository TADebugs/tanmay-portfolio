# Critique: motion, round 1

artdirector · 2026-10-04
reviewed: `agent/motion` @ 712b411 (PR #5)
- `shared/trace/{trace,render}.js`
- `shared/motion/{beat.js, motion.css, program.js, bell.js, lamp-test.js, reduced.js, index.js}`
- README, demo pages, shots

**Re-ran `verify.cjs` myself:** on a clean worktree with `python3 -m http.server 8123` and Playwright (Chromium 1194), **25/25 pass**. The figures match the handoff: beat removed at 201ms, failsafe at 1523ms, slow request measured at 618ms for a 600ms delay, and the bell flashes at most once per 500ms.

**Verdict: PASS. Ready for merge.**
- This is a shared module, not a page, so the 2-round minimum in AGENTS.md §3 doesn't apply. Three builders are blocked on it.
- The two nits below can ride along in any later commit. They don't block the merge.
- DESIGN.md is bumped to **v1.1** to absorb the accepted additions (§ "Rulings").

## 1. Contract check against DESIGN.md §8

| item | result | evidence |
|---|---|---|
| Module names and paths | **PASS** | All 9 files exist at the exact paths. `index.js` re-exports `loadProgram, mountProgram, bell, lampTest, reducedMotion` plus everything from `trace.js` and `render.js` |
| Shared types | **PASS** | `trace.js:3–22`: the JSDoc matches §8 verbatim |
| `now` / `sessionClock` / `savePending` / `takePending` | **PASS** | The 10s staleness check and read-and-remove are at `trace.js:84–94`. All storage access is in try/catch |
| `formatClock` / `formatMs` | **PASS** | `formatMs` uses a real U+2009 thin space (checked with `od -c` at `trace.js:122`). Two decimals at ≥1000ms |
| `renderTrace` + `update` / `stop` | **PASS** | Real `<ol>`/`<li>` text with aria-hidden bars. Pauses on `document.hidden`. Under reduced motion it never grows (`render.js:26`) |
| `beat.js` (classic) + 1500ms failsafe (amendment) | **PASS** | `beat.js:11`. Verified: still white at 700ms with the module blocked, revealed at 1523ms |
| `loadProgram` steps 1–6, failure policy, reduced path | **PASS** | `program.js:40–65`. Reduced motion: 1500ms cap, no fade, no rail growth. A failed fetch still navigates |
| bfcache amendment | **PASS** | `program.js:23–29`. A persisted `pageshow` drops `is-leaving` and stops the live rail. Simulated; Playwright's Chromium doesn't bfcache. Re-check on the Vercel preview in Safari and Chrome |
| `mountProgram` steps 1–5 | **PASS** | Direct visit → `t0 = timeOrigin`, `from: null`, request from Navigation Timing. Beat hold = `max(0, --t-beat − performance.now())`. `mount (failed)` still resolves. The root ends at the last child's end (`program.js:126`) |
| `bell` | **PASS** | 50ms invert, rate-limited to 500ms. Reduced motion: the session lamp shows `is-fault` for 1000ms |
| `lampTest` | **PASS** | Visible-time-only delay (`lamp-test.js:5–13`) is a good call. Instant under reduced motion |
| `reducedMotion` | **PASS** | Read live on every call |
| **Truth rule** | **PASS** | No padding, no minimums. The demo trace (`motion-r1-program-mounted.png`) shows request 10ms → parse 9ms → mount 799ms against `ready` = 800ms. The gap between `request` and `parse` is real navigation time, shown honestly |

**§3 table, as it applies to a module:**
- Swap test: n/a.
- **PASS** for all of Source, Cliché, Signature, Truth, Function, Craft and Access.
  - No crossfades, no spinners, no padded time.
  - The trace uses mono, tabular numbers and real text.
  - Reduced motion is honored everywhere and verified.

## 2. Rulings on the 4 flagged decisions (plus #5)

| # | decision | ruling | why |
|---|---|---|---|
| 1 | Leave fade as a fixed `--construct` layer (`html.is-leaving::after`), not `body { opacity }` | **ACCEPT** | Same look, independent of the page's ground, opacity-only, `pointer-events: none`. Written into §8 `motion.css` and step (5) |
| 2 | The trace clock pauses during the fade (`t0 += measured fade`) | **ACCEPT** | It's the only way to keep the fade out of every span without faking anything. The truth rule in §8 now names the leave fade explicitly, and says gaps stay visible |
| 3 | `@view-transition` not enabled | **ACCEPT** | Right reading of §3: a crossfade on every navigation isn't on the allowed list. §8 updated: "No `@view-transition`" |
| 4 | Additive extensions: `startTrace(slug, { t0 })`, `Span#child(name, at?)`, the `Span#name` setter, `resumeTrace(trace)`, a 5s fetch cap named `request (timeout)` | **ACCEPT, all.** Written into §8 as **v1.1**, marked additive | No existing signature changed, so existing callers stay valid. construct and entry have been notified (decisions.md #3) |
| 5 | `renderTrace` sorts siblings by start; default styles under `:where()` | **ACCEPT** | Pages like `/rag` and `/gods-eye` need to restyle the waterfall. Written into §8 |

**Added to §8 while ruling. This is a caller rule, not a motion change:** callers of `loadProgram` intercept only **unmodified primary clicks**. Ctrl/Cmd/Shift/Alt-clicks and middle-clicks fall through to the plain `href`, so open-in-new-tab keeps working. This is for `construct`.

## Nits (non-blocking)

- **N1** `motion.css:37`: the `.trace-span` name column is `14ch`, but `request (timeout)` is 17 characters and gets ellipsized. Use `18ch`.
- **N2** `README.md`: mirror the caller rule above (unmodified primary clicks only) in the `loadProgram` usage section, so `construct` sees it where it reads.
