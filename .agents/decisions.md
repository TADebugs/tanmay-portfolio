# decisions.md — lead-only; everyone follows these

1. **Nothing goes straight to `main`.** Every agent opens a PR from its own branch. `lead` checks the Vercel preview for that PR, then merges. Push to `main` = production deploy.
2. **Shared files are split per agent** so parallel branches never touch the same file:
   - status: `.agents/status/<id>.md` (only `<id>` writes it)
   - inbox: `.agents/inbox/<to>/<YYYYMMDD-HHMM>-<from>.md` (sender creates a new file; nobody edits an existing message)
   - handoff: `.agents/handoff/<id>.md` (only `<id>` writes it)
3. **Motion API is a contract.** DESIGN.md defines `shared/motion/` module names + function signatures. `construct` and `entry` code against it; `motion` implements it in parallel. If the contract can't be pinned down, `motion` goes first and the others wait.
4. **No 404s while pages are unbuilt.** Every route has an "in progress" placeholder. `/resume.pdf` is served by a vercel.json *rewrite* to `/resume/` until `resume.pdf` exists at the repo root; Vercel serves real files before rewrites, so dropping in the PDF needs no config change.
5. **No `public/` folder.** On Vercel's "Other" preset, a `public/` directory can become the output directory and hide every page outside it. Static files sit at the repo root. (`resume.pdf` goes in the root, not `public/`.)
6. **Deadline: credits expire Oct 8.** Wave 1 must be merged before wave 2 starts work that depends on it.
7. **AlgoLend and Sweet-Bite are not ported here.** Each stays in its own repo + Vercel project at `algolend.tanmaydesai.xyz` / `sweetbite.tanmaydesai.xyz`. `/algolend` and `/sweet-bite` are program pages (sub-world intro + launch link). A launch link to a subdomain that doesn't resolve yet is shown as unavailable, not linked.
8. **Truth flags (Tanmay, 2026-10-04):**
   - God's Eye: never claim "sub-second". Say "executes 5–10 timed AI actions per vision plan"; if latency is mentioned, it's the real 1–3s round-trip.
   - AlgoLend: no invented metrics anywhere. The demo UI's 94.2 / 98.7 / 91.5 are removed. "90%+ risk-assessment accuracy" is unverified until `algolend` measures it; until then describe the agents with no number. "Roughly 3x capital utilization" is also unmeasured in the repo: same rule.
   - Sweet-Bite: copy is Tanmay's own. One-liner approved.
