## algolend — round 1
branch: agent/algolend
route: /algolend
app: TADebugs/ALGOLEND_AI PR #2 (seeded demo default, live backend toggle off by default, invented metrics removed). Vercel project algolend-ai-frontend-v2.

changes (DESIGN.md mapping):
- §4.3 asset tag: CH-02 · AlgoLend AI · react · typescript · fastapi · algorand typescript · 2025 (repo's first commit is 2025-09-08) · src link. Rivets, no drafting furniture. Trace rail under it.
- §5.2 desks: three columns at 5fr / 3fr / 2fr (Risk Analyzer > Market Oracle > Yield Optimizer), separated by hairlines, not cards. Each shows reads / calls from its Python module, plus its wiring lamp:
  - Risk Analyzer `--nominal` WIRED (served by app.py /api/analyze-account)
  - Market Oracle `--caution` SIMULATED (imported by app.py, data from `random`)
  - Yield Optimizer `--inactive` outline NOT WIRED (app.py doesn't import it)
- Weights bar: segment flex = real weights (.25/.20/.15/.15/.10/.10/.05, sum 1.00), labeled.
- SEEDED table: Risk Analyzer 86 A+ / 67 B+ / 54 C+, attributed to `analyze_account` on synthetic inputs (backend/scripts/generate_demo_seed.py) per decisions #10.
- LendingPool: deposit · withdraw · borrow · repay, `interestRate` in bps (500 bps = 5 %), tagged NOT DEPLOYED (true: the app's pool app IDs are placeholders).
- ALGORAND TESTNET tag.
- §5.6 launch control: reads /shared/projects.json at runtime; status `todo` → offline `<p class="launch is-offline">` "Not connected yet · algolend.tanmaydesai.xyz / the app is being deployed; source is live". The offline markup is the default in HTML, so no-JS and fetch failure are also safe. When lead flips status to `live`, it becomes `<a href=launch>` "Launch · algolend.tanmaydesai.xyz" with a `--nominal` lamp. projects.json not edited.
- Facts: CV bullet 1 as worded; bullet 2 without the 90%+/3x numbers ("Three AI agent modules for market analysis, risk scoring and yield optimization"). CV bullet 3 (instant loan approvals, real-time portfolio analytics) is omitted: the app has neither. Lead/Tanmay to confirm.
- No accuracy/utilization numbers anywhere; "Fraud Detective" absent.

stubs (swap when the real modules merge; then delete algolend/_stub/):
- `<script src="/algolend/_stub/beat.js">` → `/shared/motion/beat.js` (stub is a no-op)
- add `<link rel="stylesheet" href="/shared/motion/motion.css">` after tokens.css (not linked now, to avoid a 404)
- `import { mountProgram } from '/algolend/_stub/index.js'` → `/shared/motion/index.js`
  (stub implements trace.js + a minimal renderTrace/mountProgram from Navigation Timing so the rail shows a real measured number; effects are no-ops)
- `import { mountShell } from '/algolend/_stub/shell.js'` → `/construct/shell.js`
  (stub renders a minimal status line: session lamp + clock, /red › CH-02 AlgoLend, plain version, reconsider; no terminal)
- the page's `.trace-rail .t-*` and `.status-line` CSS styles the stubs' output; drop or adapt when the real renderTrace/shell markup lands.

tested (python3 -m http.server + Playwright Chromium):
- 1280 px, 375 px, 375 px + prefers-reduced-motion: no horizontal scroll, no 4xx, no banned strings (90%, 3x, accuracy, Fraud, 94.2/98.7/91.5).
- keyboard: tab order src link → Source → /red → plain version → reconsider; offline launch not focusable; focus ring 2px --legend.
- console clean except Google Fonts fetches failing through the sandbox proxy (cert / retries); not a page issue.
- trace rail shows real values; in the sandbox `parse` is long because the Google Fonts CSS is slow through the proxy.
- nothing animates on this page beyond the stub status clock (1/s, paused when hidden).

screenshots: .agents/critique/shots/algolend-r1-desktop.png, algolend-r1-375.png, algolend-r1-375-reduced.png
