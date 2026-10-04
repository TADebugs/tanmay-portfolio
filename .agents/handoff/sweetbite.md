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

## sweetbite: round 2 (critique .agents/critique/sweetbite-r1.md)
- F1: the five rails are now ONE <ul class="rail"> with role=region and aria-label "Ticket rail, 12 items", holding 12 tickets in menu order. Each ticket is stamped with a station code (APP/TRAY/SANDO/SIDE/DESSERT). The h3 category headings are gone and the h4s are now h3s. There's one key line under the rail. Tickets are 176px with align-items:flex-start. At ≤640px the rail is a scroll-snap strip (ticket flex 0 0 72%, overscroll-behavior-x contain) with a focus-visible outline. tabindex=0 is set only at ≤640px: it's in the markup and a matchMedia listener removes it on wider screens, so desktop gets no dead tab stop
- F2: each price part is a nowrap span, so lines break only at " / ". Copy is verbatim, including $16.5
- F3: covers are now a mono readout line `indoor · outdoor · bar` in the .smoker row style
- optional: added the PLACEHOLDER comment beside "first program". "Back to the board" stays until the stub swap
measured (Playwright):
- rail section is 625px tall at 1280 (target ≤700) and 268px at 375 (target ≤420)
- page height at 375 went from 3137 to 1613px
- scrollWidth == innerWidth at 375
- ticket heights vary (145–180 px)
- every price part sits on one line
- at 375, the rail takes focus and ArrowRight scrolls it (scrollLeft 0 → 263)
- no page errors. Live-launch sim still renders the <a>
shots: .agents/critique/shots/sweetbite-r2-{1280,375,375-reduced,1280-live-sim}.png

## sweetbite: A1 (critique .agents/critique/sweetbite-r2.md, conditional pass)
- The scroll region is now a wrapper <div class="rail-scroll" id="ticket-rail" role="region" aria-label="Ticket rail, 12 items" tabindex="0"> around <ul class="rail">, so the list keeps its list role. At ≤640px, overflow-x, scroll-snap and overscroll moved onto .rail-scroll, and so did :focus-visible
- The ul is width:max-content at ≤640px so the rail line spans every ticket. Ticket width is 72% of the content width, computed from 100vw because a % of a max-content parent would be circular
- syncRail is unchanged
- verified: the ARIA snapshot reads region "Ticket rail, 12 items" > list > listitem. Metrics match round 2 (625 / 268 px, no page h-scroll at 375). ArrowRight still scrolls the rail. No page errors
- shots: .agents/critique/shots/sweetbite-r2a-*.png
later: when motion and construct merge, swap the 4 stub paths (listed above), delete sweet-bite/_stub/ and drop "Back to the board"
