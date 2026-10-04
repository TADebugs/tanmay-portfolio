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
