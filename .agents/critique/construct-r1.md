# Critique: construct, round 1 (`/red` board, shell, terminal, eggs)

artdirector · 2026-10-04
reviewed: `agent/construct` @ 37ec694 (PR #7)
- `red/{index.html, board.css, board.js}`
- `construct/{shell.js, shell.css}`
- handoff, shots `construct-r1-*` (fallback fonts)

This is the signature page, so the bar is highest here.

**Verdict: revise.** The engineering is excellent:
- The Shell API matches §9 exactly.
- Every §4.5 behavior is there: completion, history, suggestions, bell, ARIA, focus return, Ctrl+L/U, and log persistence across pages.
- Both eggs follow §4.6 to the letter.

What holds it back is the experience of the signature, not the code. A first-time visitor sees a well-made list and may never learn the terminal exists. There are also two truth/craft defects. Five fixes. DESIGN.md is bumped to **v1.2** for two of them (§4.2, §4.4).

| check | result | notes |
|---|---|---|
| Swap test | **PASS** | Readouts, lamps, CH codes and logbook are all Tanmay's. The CH-00 origin channel is a good use of the rabbit |
| Source rule | **PASS** | Strips, not cards. The hairline board (`board.css:47`) and semantic lamps trace to physical instruments |
| Cliché scan | **PASS** | No giant name (the h1 is a 24px sentence), no hero, no rain, no green. The terminal is graphite, not hacker-green |
| Signature | **FAIL** | F1: the comms loop is only reachable through a faint `` ` terminal `` in the status line's right corner. Nothing on the board invites it. §4.4 gets a message line |
| Truth | **FAIL** | F2: the TRINITY readout says "desktop app (video)", but there's no video yet and DESIGN §5.3 is canonical. Also `logTrace` ignores the new `(timeout)` span name |
| Function | **PASS** | The on-call sentence and contact controls come first, the board loads from projects.json, Load and Source work, and there's a no-JS / offline fallback to `/blue` (`board.js:107`, `index.html:35`). The modified-click rule from §8 v1.1 is already honored (`board.js:49`) |
| Craft | **FAIL** | F3: `NOT CONNECTED` wraps in the 96px plate. F4: `help`/`ls` rows are clipped at 375px. N1: the timestamp column overflows on long sessions |
| Access | **PASS** | `role=log` + `aria-live`, a labelled input, an `aria-label`ed region, focus returns to the opener on close, and Tab on an empty line leaves the field, so the keyboard is never trapped. **Ruling:** the terminal input's focus indicator is the block caret plus the `--legend-dim` top rule (`shell.css:90, :103`) instead of the 2px outline. Accepted as an exception to §11: in a terminal, the caret *is* the focus indicator, and it's more visible than an outline |

## Fixes

**F1: the board must invite the terminal** (`construct/shell.js` :90–94, `shell.css` §status line) → DESIGN §4.4 v1.2

Add a **message line** to the status line, between the location and the spacer:
- It shows the latest log record's level code and text, e.g. `ok  board up · 5 channels`, in `--legend-faint` mono. On a fresh page, that's the board coming up.
- It's a `<button>` that opens the terminal, with `aria-label="Open terminal. Last message: …"`.
- It updates from `push()` whenever a real record is logged, and never on a timer.
- It truncates with an ellipsis (`min-inline-size: 0; overflow: hidden; text-overflow: ellipsis`).
- Hide it below 480px, where the `terminal` button already carries the job.
- When the déjà vu duplicate fires, the message line shows the duplicate too, so the glitch is visible without opening the panel.

That's the earned discovery §4.6 wants, and it makes the cat findable at all. Today the duplicate lands in a closed panel.

**F2: truth** (`red/board.js:14`, `construct/shell.js:388`)
- `:14` → `'3 personalities · per-personality tools (config) · desktop app in progress'`. DESIGN §5.3 is canonical. When Tanmay's video lands, `trinity` and I change §5.3 first.
- `:388`: treat `request (timeout)` like `(failed)`. Use `/\((failed|timeout)\)/` (§8 v1.1, ruled in motion r1).

**F3: plate width** (`red/board.css:51`) → DESIGN §4.2 v1.2

`grid-template-columns: 112px minmax(0, 1fr) auto`. At `--fs-id` mono, `NOT CONNECTED` plus its lamp needs ~106px. Never let a lamp label wrap: add `white-space: nowrap` on `.state`.

**F4: terminal rows clipped at 375** (`construct/shell.css:75`)

In the 375 shot, `help` descriptions and `ls programs` names are cut at the viewport edge ("list the channels on the", "Production RAG syst"). Add `@media (max-width: 480px) { .rec.is-pre .tx { white-space: pre-wrap; overflow-wrap: anywhere; } }`. Wrapping beats horizontal scroll in a log. Alternatively, keep `pre` but drop the description column for `help` at narrow widths. Either way: no clipped text at 375.

**N1: timestamp column** (`shell.css:67`, non-blocking)

The déjà vu shot shows `+497521:20:38.484` running over the level column. It's a fake-clock artifact, but the column has no guard. Use `grid-template-columns: 20px max-content 6ch 1fr` with `column-gap: var(--s-3)`, so long sessions push the column instead of overlapping it.

## Notes
- The AlgoLend and TRINITY one-liners in the shots are stale because they're read at runtime from projects.json. They'll update when this branch merges lead's latest. No action.
- `statusChangedAt` is already handled as the second fallback (`board.js:101`). Keep it.
- Next round, include shots of: the message line (fresh, and after déjà vu), the 375 terminal after `help`, and the plate with `NOT CONNECTED`. Also include one shot with the bell captured mid-flash if possible.
