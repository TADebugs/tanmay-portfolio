## sweetbite: /sweet-bite program page (r1)
branch: agent/sweet-bite
changes:
- sweet-bite/index.html: program page per DESIGN §5.4. Asset tag CH-04 (html · css · javascript, 2024 from the repo footer), trace rail, oneLiner intro, launch control (§5.6), ticket rail (all 12 menu items + prices, Tanmay's copy verbatim), smoker channel (brisket 14 h, pulled pork 14 h, chicken 3 h on a 0–14 h axis), covers (indoor · outdoor · bar, no counts), facts, origin line, Source, and a "Back to the board" link (/red)
- launch control: offline markup is the default (a <p>, not focusable). A module reads /shared/projects.json; only status "live" swaps in <a href="https://sweetbite.tanmaydesai.xyz">Launch · sweetbite.tanmaydesai.xyz</a>. The projects.json fetch is the mountProgram `ready` promise. projects.json not touched
- sweet-bite/_stub/: beat.js (no-op classic script), motion.css (empty), index.js (Motion API exports; mountProgram builds a Trace from Navigation Timing, renders nothing), shell.js (mountShell returning no-op methods)
swap when motion/construct merge (4 lines in sweet-bite/index.html, then delete sweet-bite/_stub/):
- <script src="/sweet-bite/_stub/beat.js">       → /shared/motion/beat.js
- <link href="/sweet-bite/_stub/motion.css">       → /shared/motion/motion.css
- import … from '/sweet-bite/_stub/index.js'        → '/shared/motion/index.js'
- import … from '/sweet-bite/_stub/shell.js'        → '/construct/shell.js'
tested (python3 -m http.server + Playwright Chromium):
- 1280 and 375: no horizontal scroll (scrollWidth == innerWidth)
- keyboard: Tab order src link → Source → Back to the board; every focus shows a solid outline; offline launch is not focusable (tabIndex -1)
- reduced motion: identical render (the page has no motion of its own)
- console: no page errors. Only failures were Google Fonts (sandbox proxy cert) and the dev server's /favicon.ico 404
- live state, simulated by intercepting projects.json with status "live": renders <a href="https://sweetbite.tanmaydesai.xyz">Launch · sweetbite.tanmaydesai.xyz</a>
- shots: .agents/critique/shots/sweetbite-r1-{1280,375,375-reduced,1280-live-sim}.png (fallback fonts, because the sandbox can't reach Google Fonts)
needs on preview: Archivo/Azeret render; /sweet-bite shows "Not connected yet"
open:
- menu copy uses "SCQ" (concepts.md placeholder: possibly from a real restaurant). Kept verbatim per decisions #8; Tanmay to confirm
- the "first program" line follows DESIGN §5.4 wording; Tanmay to confirm it's accurate
- lead: flip projects.json sweet-bite.status to "live" after Sweet-Bite#2 merges and sweetbite.tanmaydesai.xyz serves the app
