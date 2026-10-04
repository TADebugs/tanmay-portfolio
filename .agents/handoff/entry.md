## entry — round 1
branch: agent/entry
route: / (gate), /blue
changes since last critique: first round
- `/` gate per DESIGN.md §7: guarded switch. Blue = one plain click to /blue. Red = lift the guard (rotateX −110°, `--t-move`, `aria-expanded="true"`), then throw the switch → /red. Esc or blur closes the guard. A mono readout under the switch (`guard closed` / `guard open · press again to throw`, aria-live) tells mouse and SR users about the second step.
- Choice in `localStorage['td.choice']` (try/catch); pre-paint redirect in `<head>`; `?reconsider` clears it and shows the gate. Going red sets `sessionStorage['td.from-gate']='1'` (the auto-redirect for repeat visitors does not, so the lamp test only runs on a real gate pass).
- Reduced motion: tokens.css already zeroes `--t-move`/`--t-quick`, so the guard swaps open instantly; still two activations. No JS needed, so no `reducedMotion` import and no `gate/_stub/`.
- No-JS: the switch is hidden and a plain `The console` link to /red shows via `<noscript>`.
- Question copy is the DESIGN.md placeholder, comment kept: `<!-- PLACEHOLDER: Tanmay approves gate copy -->`.
- `/blue`: one inline-styled HTML file, 6.6 KB raw (2.9 KB gzip), 1 request, no tokens.css, no web fonts, no JS. Order and wording per §7 from shared/cv.md; projects copied by hand from shared/projects.json (RAG has no Source link: repo is null). Print hides only the footer, shows contact URLs.
projects.json entry: n/a (reads it by hand-copy)
tested (python3 -m http.server + Playwright/Chromium): Tab order blue → red, Space/Enter lift, Esc + blur close, second Enter → /red, mouse two-click, remembered red/blue redirect, ?reconsider, reduced motion (transition 0s, still two steps), 375px no h-scroll on both pages, focus-visible (red = 2px --fault), every internal /blue link 200. No console errors.
notes for lead:
- `/resume.pdf` 404s under python http.server; on Vercel the rewrite to /resume covers it (/resume is 200).
- Per lead (DESIGN.md §5.2/§5.3 amendments): AlgoLend now names each agent module with its true wiring state (no "3 AI agents" claim); TRINITY says "Desktop app in progress", with no wake-word or voice claim. Both differ from projects.json oneLiners on purpose.
- Google Fonts fail TLS in the sandbox proxy; screenshots used ignoreHTTPSErrors to render the real fonts.
screenshots: .agents/critique/shots/entry-r1-*.png (gate-desktop, gate-guard-open, gate-focus-red, gate-reduced-open, gate-375, blue-desktop, blue-375, blue-print)

## entry — round 2
branch: agent/entry
route: / (gate), /blue
changes since last critique (.agents/critique/entry-r1.md):
- B1 /blue print: `.pdf` line hidden in print; project link lines are `.links` → print sets text to 0 and `::after` prints `tanmaydesai.xyz/<route>` for internal and the full URL for external, 9pt, one per line. `:root { color-scheme: light }` added.
- G1 throw paints: `gate.js` navigates on the lever's `transitionend` or a 300ms fallback, guarded by a `gone` flag (reset on bfcache restore); reduced motion navigates immediately. Measured: commit to /red ~200ms after the click, lever caught mid-throw in `entry-r2-gate-thrown.png`.
- N1 shared baseline: `.choices` is a 3-row grid, each `.choice` a subgrid; `.plain` and `.switch` use `align-self: last baseline` in row 1, state row 2, legends row 3. At 1280 both legends end at the same y; the two names share a baseline.
- N2 `.legend { max-inline-size: 26ch }` (with `text-wrap: balance`).
- A1 `aria-describedby` removed from `#switch`; the live region alone announces state.
- Lead: AlgoLend line on /blue now matches projects.json word for word: "DeFi lending on Algorand testnet with three AI agent modules, as a seeded demo".
tested: full r1 suite re-run (keyboard, Esc/blur, remembered choice, ?reconsider, reduced motion, 375px, links), all pass; only local misses are python's /blue→/blue/ redirect and /resume.pdf (Vercel rewrite).
screenshots: .agents/critique/shots/entry-r2-*.png (gate-desktop, gate-thrown, gate-375, blue-print)
