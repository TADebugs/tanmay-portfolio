# Critique: sweetbite, round 2

artdirector · 2026-10-04
reviewed: `agent/sweet-bite` @ 2279b93 (PR #3), diffed against r1 (b7d3724)
shots: `sweetbite-r2-{1280,375}.png` (fallback fonts)

**Verdict: conditional pass.** All r1 fixes land. One accessibility defect was introduced by the fix (A1). It's a few lines. **Once A1 is in, this is `ready for merge` with no round 3.** `lead` verifies A1 in the diff. The signature check stays deferred until the stubs are swapped. That's a mechanical change and doesn't need a critique round.

| check | r1 | r2 | notes |
|---|---|---|---|
| Swap test | PASS | **PASS** | |
| Source rule | PASS | **PASS** | Station codes are real kitchen practice. The covers readout now matches the smoker rows |
| Cliché scan | FAIL | **PASS** | It reads as one rail of paper tickets with uneven heights (1280 shot), not a card grid |
| Signature | DEFERRED | **DEFERRED** | Trace and beat come from `motion` at stub swap |
| Truth | PASS | **PASS** | Copy is verbatim. The "first program" PLACEHOLDER comment is in place (:234) |
| Function | PASS | **PASS** | |
| Craft | FAIL | **PASS** | Rail section is 625px at 1280 (target ≤700) and 268px at 375 (target ≤420). Page height at 375 went from 3137px to 1613px. Prices break only at ` / `. Spacing stays on the 4px scale |
| Access | PASS | **FAIL** | A1 below. Otherwise good: rail focusable only where it scrolls (nice touch with the `matchMedia` sync), ArrowRight scrolls it, focus ring shows, no page h-scroll |

## A1: `role="region"` on the `<ul>` strips its list semantics (`sweet-bite/index.html` :189)

An explicit role replaces the implicit `list` role, so the 12 `<li>` become list items without a list. That's an axe `listitem` violation, and screen readers lose "list, 12 items".

Fix: wrap the list instead of re-roling it. Move `id`, `role`, `aria-label` and `tabindex` to the wrapper, and keep the `<ul>` a plain list.

```html
<div class="rail-scroll" id="ticket-rail" role="region" aria-label="Ticket rail, 12 items" tabindex="0">
  <ul class="rail"> …12 tickets… </ul>
</div>
```

The overflow CSS moves with it:
- At ≤640px, `.rail-scroll` gets `overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;`.
- `.rail` keeps `display: flex; flex-wrap: nowrap`.
- Move the `:focus-visible` rule to `.rail-scroll`.

The `syncRail` code at :262–267 keeps working unchanged, because it targets `#ticket-rail`.

## Carried to stub swap (no critique needed)

- Swap the 4 stub paths when `motion` and `construct` merge. Drop "Back to the board" (:235) in the same commit.
- Tanmay still has to answer the open items in the app repo, the email address and the Reservation pane link, plus "first program".
