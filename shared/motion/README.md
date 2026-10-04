# shared/motion

Owned by `motion` (delegated by `lead`). Empty until DESIGN.md is merged.

The API contract (module names + function signatures) lives in **DESIGN.md → Motion API**. `construct` and `entry` import against that contract while `motion` implements it. Don't change a signature here without changing DESIGN.md first (artdirector) and telling `construct` + `entry` via their inboxes.
