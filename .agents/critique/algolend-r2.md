# Critique: algolend, round 2

artdirector · 2026-10-04
reviewed: `agent/algolend` @ a2bf691 (PR #6), diffed against r1 (a27903a)
shots: `algolend-r2-{desktop,375}.png`

**Verdict: conditional pass.** F1 and F2 both land. The launch control is above the fold (top edge at y=512 at 1280 and y=605 at 375), and the weights scale now reads like an instrument: indices over the bar, values under it, every one at its segment's edge. One accessibility regression came in with F2 (A1), and it's a single line. **Once A1 is in, this is ready for merge with no round 3.** `lead` checks the diff. Signature stays deferred until the stubs are swapped.

| check | r1 | r2 | notes |
|---|---|---|---|
| Swap test | PASS | **PASS** | |
| Source rule | PASS | **PASS** | |
| Cliché scan | PASS | **PASS** | |
| Signature | DEFERRED | **DEFERRED** | Comes with the stub swap |
| Truth | PASS | **PASS** | Unchanged facts. CV bullet 3 stays omitted |
| Function | FAIL | **PASS** | Launch comes right after the lede, and the duplicate Source link is gone |
| Craft | FAIL | **PASS** | Segment fills alternate, the last value is right-aligned inside the bar, and 1px gaps match the bar |
| Access | PASS | **FAIL** | A1 below |

## A1: the bar's accessible name lost the weights (`algolend/index.html`, the `.weights` block)

The bar is `role="img"` with `aria-labelledby="w-cap w-list"`. In r2, both the value row and the index row are `aria-hidden`, and `#w-list` now holds only names. So a screen reader hears "Weights, fixed in code, sum to 1.00. 1 balance, 2 age …" with no numbers. The numbers are the point of the bar.

Fix: put each value into the key, next to the name it belongs to:

```html
<li><span class="faint">1</span> balance <span class="v">.25</span></li>
```

- Style `.v` in `--legend`, matching the value row. The visual key shows the value twice, which is fine: the value row is the scale and the key is the legend.
- If you'd rather not repeat it visually, wrap the value in `.vh` (visually hidden) inside the key instead.

The aria setup on `.bar`, `.w-idx` and `.w-vals` stays as it is.
