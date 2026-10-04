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
- AlgoLend one-liner "DeFi lending, 3 AI agents, Algorand" is copied verbatim from projects.json. decisions.md #8 says don't imply three *live* agents; if you change the one-liner, /blue needs the same edit (hand-copied, no JS).
- Google Fonts fail TLS in the sandbox proxy; screenshots used ignoreHTTPSErrors to render the real fonts.
screenshots: .agents/critique/shots/entry-r1-*.png (gate-desktop, gate-guard-open, gate-focus-red, gate-reduced-open, gate-375, blue-desktop, blue-375, blue-print)
