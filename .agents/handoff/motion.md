## motion — round 1
branch: agent/motion
route: /shared/motion/demo.html → /shared/motion/demo-program.html (demo only, not linked from the site)
changes since last critique: first round. DESIGN.md §8 implemented as written, plus both amendments:
- beat.js: 1500 ms failsafe removes `is-beat` on its own (verified with index.js blocked: removed at 1515 ms)
- program.js: `pageshow` + `event.persisted` drops the leave fade and stops the live rail
files: shared/trace/{trace,render}.js · shared/motion/{beat.js,motion.css,program.js,bell.js,lamp-test.js,reduced.js,index.js,README.md,demo.html,demo-program.html,verify.cjs}
projects.json entry: n/a
decisions for artdirector (all inside the contract, flagged for review):
1. Leave fade = a fixed `--construct` layer fading in over the body (`html.is-leaving::after`, opacity only), not `body { opacity }`. Same look, and it works whatever the page paints its ground on.
2. The trace clock pauses during the leave fade: `t0` shifts by the measured fade, so no span includes it (§8: "beat and fade excluded from all spans").
3. `@view-transition` NOT enabled. The beat already gives white → white. Cross-doc VT would add a crossfade to every other red-side navigation, which isn't on §3's allowed list. A comment in motion.css says why.
4. Additive extensions, no contract signature changed: `startTrace(slug, { t0 })`, `Span#child(name, at?)`, `Span#name` setter, `resumeTrace(trace)`. loadProgram also caps a hung fetch at 5 s and names it `request (timeout)` (never block navigation).
5. renderTrace orders siblings by start time, and its default styles are `:where()` (zero specificity) in motion.css so pages can restyle the rail.
tested (Playwright, Chromium, `node shared/motion/verify.cjs`, 25/25 pass):
- trace across loadProgram → mountProgram
- beat is the first class html gets; removed at 200 ms; reveal clean by 370 ms
- direct visit, mount (failed), request (failed), slow request measured (609 ms for a 600 ms delay)
- failsafe with the module blocked
- bell: 10 clicks → 1 flash, gaps ≥ 500 ms
- reduced motion: bell lamp instead of invert, lampTest instant, no beat/reveal, trace still recorded
- lampTest lights and restores; bfcache restore (simulated persisted pageshow: Playwright's Chromium didn't bfcache-restore)
- 375 px no horizontal scroll; console clean
screenshots: .agents/critique/shots/motion-r1-*.png
