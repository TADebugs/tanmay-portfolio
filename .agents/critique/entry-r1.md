# Critique: entry, round 1 (gate `/` + `/blue`)

artdirector · 2026-10-04
reviewed: `agent/entry` @ ee3104d (PR #4) · `index.html`, `gate/gate.css`, `gate/gate.js`, `blue/index.html`
also read: handoff, shots `entry-r1-{gate-desktop,gate-guard-open,gate-375,gate-focus-red,blue-375,blue-print}.png`
not failed on (per lead):
- gate wording, which is still a PLACEHOLDER
- the AlgoLend one-liner on `/blue`, which is pending the projects.json update

**Verdict: revise (small).** The concept is executed well. The guarded switch reads as a real avionics guard, and `/blue` is properly boring and only 6.6 KB. There is one Craft fail, made of two specific defects (B1, G1). Everything else passes. Round 2 should be quick.

| check | result | notes |
|---|---|---|
| Swap test | **PASS** | The gate's material (guard, ON/OFF housing, the `` ` `` legend) is the construct's own. `/blue` is deliberately plain, and its content is entirely CV-specific |
| Source rule | **PASS** | Guard cover with 1px hatching, hinged at the top, `--fault` outline: exactly the avionics convention §7 cites. Nothing decorative |
| Cliché scan | **PASS** | No giant name (`.who` is 13px mono), no gradients, no glow, no pills. `/blue` uses no red-side material |
| Signature | **PASS** | The lift is the one bold moment, and the rotateX −110° with `perspective: 480px` reads as a cover swinging up. See G1: the throw itself never shows |
| Truth | **PASS** | Every `/blue` fact matches `shared/cv.md` (dates, GPAs, locations, bullets verbatim). Note for lead, not entry: the TRINITY one-liner "voice desktop assistant" leans on the voice feature that decisions.md #8 says isn't in the repo. If lead edits projects.json, `/blue` :88 must follow |
| Function | **PASS** | Both choices are visible in the first viewport at 1280 and 375. Blue is one click. The remembered choice redirects before paint (`index.html:10–19`), `?reconsider` clears it, and the no-JS fallback link works |
| Craft | **FAIL** | B1: `/blue` print is cluttered with dead link labels. G1: the switch throw is invisible. Plus two nits |
| Access | **PASS** | Tab order is blue → red, the red focus ring is 2px `--fault` (`gate.css:73`), Esc and blur close the guard, the state text is announced, and both pages are clean at 375. One nit (A1) |

## Fixes

**B1: `/blue` must print as a résumé, not a web page** (`blue/index.html` :29–36 print CSS, :43, :77/83/89/95/101)

In the print shot, every project prints `Open · Source` and the header prints `Résumé (PDF)`. On paper those are dead words. CLAUDE.md §3 says `/blue` "prints cleanly".
- In print, hide the `Résumé (PDF)` line (:43). The printout *is* the résumé.
- In print, replace each project's link line with its URLs, so paper still leads somewhere:
  - Give the `<p>` at :77, :83, :89, :95 and :101 `class="links"`.
  - Add, in print only: `.links a[href^="/"]::after { content: " tanmaydesai.xyz" attr(href); }` and `.links a[href^="http"]::after { content: " " attr(href); }`.
  - Hide the link text itself with `font-size: 0` on the `a`, and reset the `::after` to `font-size: 9pt`. The result reads e.g. `tanmaydesai.xyz/gods-eye · https://github.com/TADebugs/Gods_Eye`.
  - Keep the `·` separator.
- Also set `:root { color-scheme: light; }`, so a dark-mode browser doesn't tint scrollbars or controls on this deliberately white page.

**G1: the throw is never seen** (`gate/gate.js` :15–22)

`location.assign('/red')` runs in the same tick that `.is-thrown` is added, so the lever's 120ms rotation (`gate.css:110, :123`) never paints. Throwing the switch is the payoff of the two-step choice.
- Navigate after the lever finishes: `sw.querySelector('.lever').addEventListener('transitionend', go, { once: true })`, plus a `setTimeout(go, 300)` safety net (whichever fires first; guard `go` with a flag).
- With reduced motion, `--t-quick` is 0ms and no `transitionend` fires. Call `go()` immediately when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
- Keep the state text update at :18. It's right.

## Nits (fix if cheap)

- **N1** `gate.css:33` `align-items: end`: at 1280 the `Plain résumé` button floats with ~150px of empty space above it, and its label sits 16px lower than `The console`. Try `align-items: start` on `.choices`, with the blue column offset by `margin-block-start` equal to the housing height (152px + `--s-3`), so both names and both legends share baselines. If it fights the layout, leave it; the asymmetry is acceptable.
- **N2** `gate.css:36–40`: the blue legend orphans "seconds" at 1280 in the fallback font. Add `max-inline-size: 26ch` to `.legend` so `text-wrap: balance` has a measure to work with.
- **A1** `index.html:41, :52`: the state `<p>` is both `aria-describedby` on the switch and `aria-live`, so some screen readers announce "guard open · press again to throw" twice on lift. Drop `aria-describedby` and keep the live region.
