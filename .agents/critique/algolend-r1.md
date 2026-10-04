# Critique: algolend, round 1 (`/algolend` program page)

artdirector · 2026-10-04
reviewed: `agent/algolend` @ a27903a (PR #6) · `algolend/index.html`
shots: `algolend-r1-{desktop,375,375-reduced}.png` (fallback fonts)
verified against the repo (`TADebugs/ALGOLEND_AI`):
- `risk_analyzer.py`: score 0–100, `_determine_risk_level` A+ ≥ 85 … D, weights .25/.20/.15/.15/.10/.10/.05. The seeded rows 86 → A+, 67 → B+ and 54 → C+ are consistent with those thresholds.
- `market_oracle.py`: the 4 inputs listed.
- `yield_optimizer.py`: 5 pools.
- `app.py`: imports Risk Analyzer and Market Oracle only, and serves `/api/analyze-account`.

**Verdict: revise (small).** This is the most honest page so far. The wiring lamps, the "a rule score, not a trained model" line and the NOT DEPLOYED tag on the contract are exactly the instrument voice. Two fixes, one in Function and one in Craft. Signature is deferred (stubs).

| check | result | notes |
|---|---|---|
| Swap test | **PASS** | Module paths, weights, seeded outputs and contract methods are AlgoLend's own |
| Source rule | **PASS** | Desks are unequal columns separated by hairlines (5fr/3fr/2fr), not cards. Every lamp is semantic |
| Cliché scan | **PASS** | No metric tiles, no dashboard furniture, no gradients |
| Signature | **DEFERRED** | The page adds no motion of its own (correct). The trace rail from the stub already shows a real measurement |
| Truth | **PASS** | All desk facts match the repo (see above). The SEEDED table is attributed to `generate_demo_seed.py` per decisions.md #10. There are no accuracy or utilization numbers and no "Fraud Detective". **Ruling: omitting CV bullet 3 (instant loan approvals, real-time portfolio analytics) is confirmed.** The app has neither, and the old demo's "real-time" numbers were `Math.random` jitter, which is banned on this site (DESIGN §3, §6) |
| Function | **FAIL** | F1: the launch control, which is this page's whole job as an external hand-off (§5.2), is the 6th section. It sits at about 1340px on desktop and 2400px at 375 |
| Craft | **FAIL** | F2: the weights bar's labels don't align with its segments. Otherwise solid: tabular numbers, the 4px rhythm, mono for code identifiers |
| Access | **PASS** | The offline launch isn't focusable, focus rings show, `dl` and `table` semantics are correct with `scope="col"`, and the bar has `role="img"` labelled by caption and list. No horizontal scroll at 375 |

## Fixes

**F1: move the hand-off up** (`algolend/index.html` :248–259)

Move the whole `Launch` section to directly after the lede at :170, as `sweet-bite` does. It becomes the second thing a visitor reads, after what this is.
- Keep the `h2` "Launch", the offline/live control and the seeded-demo note at :258.
- Drop the duplicate `Source` link at :256. The asset tag already carries `src` at :160. If you want a source control beside the launch, keep exactly one.
- Target: the launch control's top edge is above the fold at 1280×800 (y < 800) and at 375×812 (y < 812).

**F2: weights labels must sit under their segments** (:184–191)

Right now the `ol` flows inline, so "network .10" lands under the "consistency" segment. On an instrument, a legend that doesn't line up with its scale is wrong.
- Give `#w-list` the same flex row as `.bar`, using the same `flex` values (25/20/15/15/10/10/5), so each `li` sits under its segment. Show **only the value** (`.25`) in that row, left-aligned, in mono `--fs-id`.
- Put the names in a separate `ol` (or keep the current one, `display: block`) as a numbered key: `1 balance · 2 age · 3 freq · …`. Add matching index numbers `1`–`7` above each segment, in `--legend-faint` `--fs-id`.
- Alternate segment fills between `--legend-dim` and `--legend-faint`, so the 7 segments read as 7 even without the gaps.
- Keep `role="img"` and `aria-labelledby` as they are.

## Carried to stub swap

- Swap the 4 stub paths. Add the `motion.css` link. Drop the page's `.t-*` and `.status-line` CSS once the real `renderTrace` and shell land.
