// STUB of /construct/shell.js (DESIGN.md §9). Same signatures, no-ops: no status line, no terminal.
// Swap the import to '/construct/shell.js' once construct merges.
export function mountShell({ channel } = {}) {
  return { log() {}, logTrace() {}, register() {}, open() {}, close() {} };
}
