## construct — round 1
branch: agent/construct
route: /red (v1 deleted). Shell: /construct/shell.js + /construct/shell.css

files
- red/index.html, red/board.css, red/board.js: on-call plate (role wording PLACEHOLDER kept), board strips from shared/projects.json at runtime (CH-01…), logbook (experience, education, leadership) + loaded-modules table from shared/cv.md, lamp test on td.from-gate
- construct/shell.js: Shell API §9, exact signatures: mountShell({channel}) → { log, logTrace, register, open, close }. Idempotent. Injects shell.css itself if the page didn't link it (DOM stays hidden until it loads). Extra exports for /red: projects(), statusOf(p)
- construct/_stub/motion.js + motion.css: Motion API stand-ins (same exports/signatures; trace helpers per spec, motion minimal)

terminal (§4.5): help, ls programs, run <slug>, cat resume, contact, whoami, clear, exit. Tab completion (commands + run slugs, ls/cat args; several matches → table + common prefix; Tab with empty input moves focus, so it never traps keyboard users). ↑/↓ history in sessionStorage (50). Levenshtein ≤2 suggestions for commands and slugs. Errors = warn + bell(). ARIA: region "Terminal", role=log aria-live=polite, input labelled "Terminal command". Esc / exit / close return focus to the opener. ` toggles (inside the input it closes). Log, command count and loaded programs persist per session across pages; after `run`, the terminal reopens on the program page. Block caret via mirror, blinks at --caret, steady while typing and under reduced motion. Ctrl+L clears, Ctrl+U kills the line.
eggs (§4.6), exactly 2:
- déjà vu cat: 45 s idle on /red, once per session → last record duplicated with the same timestamp, pixel cat in the gutter. Cat click or `deja vu` → `warn duplicate frame · they changed something` + 2 s outline on a strip. "Most recently changed" = a status that differs from this visitor's last look (localStorage td.seen), else the newest `statusChangedAt` if lead adds one to projects.json, else the newest channel (last in file order)
- white rabbit: `follow white rabbit` / `knock knock` → CH-00 · UNLISTED at the top of the board (origin: SCI-TECH VP + Golden Gate Associate's). `ls -a programs` lists it dimmed. Never in help, completion or suggestions. Off-board it links to /red#ch-00

lamp mapping (§4.2): live → LIVE (or RECORDED for treatment recorded-demo); not live with a `launch` subdomain → NOT CONNECTED; else IN PROGRESS
readouts: DESIGN.md §5 verbatim (TRINITY per lead correction: "3 personalities · per-personality tools (config) · desktop app in progress"). No "sub-second", no AlgoLend numbers.
Motion API v1.1 caller rule: Load buttons call loadProgram only on unmodified primary clicks; modified and middle clicks fall through to the href.

swap to real motion when agent/motion merges: replace '/construct/_stub/motion.js' with '/shared/motion/index.js' in construct/shell.js and red/board.js, the /construct/_stub/motion.css link in red/index.html with /shared/motion/motion.css, then delete construct/_stub/.

tested (python3 -m http.server + Playwright Chromium, 46 checks, all pass): keyboard-only (focus-visible 2px on every control), every command, tab completion, history, error + bell, both eggs (déjà vu with fake clock), reduced motion (lamp fault instead of invert, panel and caret static), 375px no h-scroll, Shell API on a program page (location, logTrace, register, rabbit link), every internal link 200 (/resume.pdf 404s locally; vercel rewrite → /resume), console clean.
known: the sandbox proxy blocks fonts.gstatic.com, so the screenshots render Archivo/Azeret in fallback faces. Check the Vercel preview for real type. Wide `ls programs` rows scroll sideways inside the log at 375px.
screenshots: .agents/critique/shots/construct-r1-*.png
