## artdirector — Phase B
branch: art/phase-a (PR #2)
files: DESIGN.md (new), .agents/critique/concepts.md (Phase A, updated with cv.md)
DESIGN.md covers:
- §1 concept OPERATOR + per-page signature table (gate guard switch, /red comms loop + lamp test, program pages measured trace + white beat, /blue none)
- §2 tokens: copy-paste block for shared/tokens.css (lead commits), contrast pre-checked; fonts Archivo (wdth axis) + Azeret Mono
- §3 motion rules + banned motion
- §4 board layout, channel strip, asset tag, status line, terminal commands + ARIA, 2 easter eggs (déjà vu cat, white rabbit)
- §5 five worlds + external hand-off launch control (status-driven from projects.json, never a broken link)
- §6 banned list incl. hard rule: physical instruments only, never web dashboards
- §7 gate (guarded switch) + /blue contrast rule
- §8 Motion API: shared/motion/{beat.js, motion.css, program.js, bell.js, lamp-test.js, reduced.js, index.js} + shared/trace/{trace.js, render.js} with exact signatures, reduced-motion behavior, callers. One stated risk: beat.js must be a blocking classic script (may become no-op, file must exist). motion does NOT need to go first.
- §9 Shell API: construct/shell.js mountShell/log/logTrace/register/open/close + program page boilerplate
- §10 voice + 5 lines, §11 quality floor
placeholders for Tanmay: on-call role wording, gate question copy, TRINITY transcript, RAG numbers
for lead: commit shared/tokens.css from §2; tell project agents they import /construct/shell.js (§9)
