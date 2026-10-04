# Critique: construct, round 2

artdirector · 2026-10-04
reviewed: `agent/construct` @ a6b024e (PR #7), diffed against r1 (37ec694). Main is merged in, on DESIGN v1.2.
shots: `construct-r2-{msgline-fresh,msgline-dejavu,bell-flash,terminal-help-375,plate-not-connected,board-1280,board-375}`

**Verdict: conditional pass.** Every r1 item landed:
- **F1:** the message line (`shell.js` `annunciate`) updates only from `push()`. It's a real button with `aria-controls="td-term"` and a "Last message" label, and the déjà vu duplicate shows on it with the cat. That makes the egg discoverable with the panel closed.
- **F2:** TRINITY now reads per §5.3. `(failed|timeout)` is handled.
- **F3:** the 112px plate shows `NOT CONNECTED` on one line.
- **F4:** `help` and `ls` wrap at 375 with no clipping.
- **N1:** the timestamp column is `max-content` with a gap.

The real `shared/motion` is wired in, and `construct/_stub/` is gone.

One regression is left at 375 (C1). **Once C1 is in, this is ready for merge with no round 3.** `lead` checks the diff.

| check | r1 | r2 | notes |
|---|---|---|---|
| Swap test | PASS | **PASS** | |
| Source rule | PASS | **PASS** | The message line is an annunciator, which is the right lineage |
| Cliché scan | PASS | **PASS** | |
| Signature | FAIL | **PASS** | The board now announces the comms loop. The bell flash is captured. The terminal is the one bold thing; everything else stays still |
| Truth | FAIL | **PASS** | |
| Function | PASS | **PASS** | |
| Craft | FAIL | **FAIL** | C1 below. Everything else passes |
| Access | PASS | **PASS** | |

## C1: `reconsider` is clipped at 375 (`construct/shell.css`, the `@media (max-width: 480px)` status-line rule)

In `construct-r2-terminal-help-375.png` the status line ends in `reconside`, cut off at the viewport edge. Hiding the backtick glyph wasn't enough with the fallback faces, and real Azeret may be wider still. The status line's job (§4.4) is to *always* show the way out, so no control may clip.
- At `max-width: 400px`, hide the clock text (`.sl-clock`) and keep the session lamp. The clock is still in `whoami`.
- Add `.sl { overflow: hidden }` as a guard. Then check at 360 and 375 that `plain version` and `reconsider` both fit fully, measuring `getBoundingClientRect().right <= innerWidth` for every `.sl-btn` in the test suite.
- Re-shoot `board-375` with the status line visible.

## Notes
- The `497521:…` clock in the déjà vu shot is the fake-clock artifact. N1 makes it harmless.
- After merge, `algolend` and `sweetbite` can swap their `shell.js` stubs.
