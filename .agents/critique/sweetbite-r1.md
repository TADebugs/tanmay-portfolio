# Critique: sweetbite, round 1

artdirector · 2026-10-04
reviewed: `agent/sweet-bite` @ b7d3724 (PR #3) · `sweet-bite/index.html`
also read: handoff, shots `sweetbite-r1-{1280,375,1280-live-sim}.png`, Sweet-Bite PR #2 (app repo)
caveats:
- Google Fonts are blocked in the sandbox, so type was judged on fallback fonts.
- The `_stub/` modules are expected, so the trace, status line and white beat are **deferred**, not failed.

**Verdict: revise.** 2 fails (Cliché, Craft), both caused by the same thing: the ticket rail. Everything else passes. Fix F1–F3, then send round 2.

| check | result | notes |
|---|---|---|
| Swap test | **PASS** | Menu, smoke times and table types are Sweet-Bite's own. It doesn't survive a name swap |
| Source rule | **PASS** | Ticket rail, smoker channel and covers all trace to the app's real content. The covers boxes are weak (F3) |
| Cliché scan | **FAIL** | At 1280px the ticket rail renders as rows of 2–3 identical equal-height tiles: three equal cards, five times over (F1) |
| Signature | **DEFERRED** | Trace rail and white beat come from `motion`. The page correctly adds no motion of its own |
| Truth | **PASS** | Verified against the repo: Chart.js on the about page (`contact.html`), four pages, alert-only form, © 2024. The facts at :258–260 describe Sweet-Bite PR #2 (card field removed); they're true once it merges. "first program" is still open for Tanmay |
| Function | **PASS** | Name, one-liner and launch state are visible in the first viewport. The offline launch is a non-focusable `<p>` exactly per §5.6, and the live swap was verified in your sim shot |
| Craft | **FAIL** | The page is 3137px tall at 375px, and ~1800px of that is 12 stacked full-width tickets. Prices wrap mid-phrase (F2). Equal row heights look like a grid, not a rail |
| Access | **PASS** | Heading order h1 > h2 > h3 > h4 is correct, focus outlines show, contrast passes, no horizontal scroll at 375. Re-check after F1 adds a scroll region |

## Fixes

**F1: one rail, station codes, real ticket behavior** (`sweet-bite/index.html` :93–123 CSS, :190–229 markup)

A kitchen rail is one line of tickets, each stamped with its station, not five sections of tiles.
- Collapse the five `.rail` blocks into **one** `<ul class="rail">` with all 12 tickets in menu order.
- Each ticket gets a station code above its `h4`, in mono, `--fs-id`, `--legend-dim`:
  - `APP` for Apps to Share
  - `TRAY` for Trays & Sandwiches
  - `SANDO` for Specialty Sandos
  - `SIDE` for Sides
  - `DESSERT` for Desserts
  
  These are codes of 8 characters or fewer, so CAPS are allowed (DESIGN §2).
- Delete the five `h3`s (:193, :201, :209, :216, :223). Keep Tanmay's category names in **one key line** under the rail, replacing the note at :229 or placed above it, in `--fs-small` `--legend-faint`:
  `APP apps to share (or not) · TRAY trays & sandwiches · SANDO specialty sandos · SIDE sides · DESSERT desserts — items and prices as written on the menu page.`
  The `h4` stays the item name, so the heading order is h2 > h4. Change the `h4`s to `h3`.
- `.ticket`: `width: 176px` (was 220). Set `align-items: flex-start` on the `ul`, so each ticket is only as tall as its text. Uneven heights are what make it read as paper on a rail rather than a grid.
- **≤640px:** the rail becomes a horizontal strip, not a stack:
  - on the `ul`: `flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;`
  - on `.ticket`: `flex: 0 0 72%; scroll-snap-align: start;`
  - the `ul` gets `tabindex="0"`, `role="region"` and `aria-label="Ticket rail, 12 items"`, plus a `:focus-visible` outline (2px `--legend`), so keyboard users can scroll it
  - No "scroll" hint text (§0 ban). The partly visible next ticket is the affordance.
  - The page itself must still have zero horizontal scroll. Check `scrollWidth == innerWidth` at 375 again.
- Delete the `@media (max-width:640px) .ticket { width:100% }` rule at :159.

Target: the rail section is ≤ 700px tall at 1280 and ≤ 420px at 375.

**F2: prices wrap mid-phrase** (:118–123, every `.price`)

`$24 Tray / $16.50 Half Bird` breaks inside "Half Bird" at the new 176px width. Wrap each part in its own `<span>` with `white-space: nowrap`, so lines can only break at ` / `:
`<span class="price"><span>$24 Tray</span> / <span>$16.50 Half Bird</span></span>`. Keep the copy verbatim, including `$16.5`.

**F3: the covers look like buttons** (:139–146 CSS, :249–251 markup)

Three bordered boxes with button padding read as tabs or controls, but they do nothing. Render them as a readout line instead, matching the rest of the system:
- `<p class="readout mono">indoor · outdoor · bar</p>` in `--fs-small` `--legend`, inside the same `--rule` bottom-bordered row style as `.smoker li`.
- Keep the note at :252.

**Not required, but do these while you're in there:**
- :262 `first program · plain HTML/CSS/JS`: keep it, but add `<!-- PLACEHOLDER: Tanmay confirms "first program" -->` beside it so it can't ship unconfirmed.
- :263 "Back to the board" duplicates what the status line will do. Keep it until `construct` merges, then drop it in the stub-swap commit.

## App repo (Sweet-Bite PR #2): not part of this page's score

- `contact.html:83` has `mailto:tanmaydesai2126@gmail.com`. That is a **different address from the CV's public email** (`t.desai240305@gmail.com`). Ask Tanmay which one should be public. Don't change it without his answer.
- `index.html:61`: the "Reservation" pane links to `contact.html`. It should be `reservation.html`.
- Correction to my Phase A note: `images/giftcard.jpg` **does** exist. My earlier file listing filtered out images. No action needed.
