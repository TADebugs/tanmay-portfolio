// STUB of /shared/motion/index.js (DESIGN.md §8). Same exports and signatures, minimal behavior.
// Swap the import to '/shared/motion/index.js' once motion merges.

export const now = () => performance.timeOrigin + performance.now();
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function startTrace(slug, opts = {}) {
  const t0 = now();
  const root = { name: 'load', start: 0, end: null, children: [] };
  const trace = { id: Math.random().toString(16).slice(2, 10), slug, from: opts.from ?? null, t0, root, total: null };
  return span(root, trace);
}
function span(rec, trace) {
  return {
    child(name) {
      const c = { name, start: now() - trace.t0, end: null, children: [] };
      rec.children.push(c);
      return span(c, trace);
    },
    end(at) {
      if (rec.end == null) rec.end = (at ?? now()) - trace.t0;
      if (rec === trace.root) trace.total = rec.end;
      return rec.end - rec.start;
    },
    get trace() { return trace; },
  };
}
export const savePending = () => {};
export const takePending = () => null;
export const sessionClock = () => performance.now();
export function formatClock(ms) {
  const s = Math.floor(ms / 1000), p = n => String(n).padStart(2, '0');
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
  return `+${h ? h + ':' + p(m) : p(m)}:${p(s % 60)}.${String(Math.floor(ms % 1000)).padStart(3, '0')}`;
}
export const formatMs = ms => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`);

export function renderTrace() { return { update() {}, stop() {} }; }

export async function loadProgram(slug, opts) { location.assign(opts.href); }

// Measured from Navigation Timing; no beat, no rendering.
export async function mountProgram(slug, opts = {}) {
  const root = startTrace(slug);
  const tr = root.trace;
  tr.t0 = performance.timeOrigin;
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) {
    tr.root.children.push({ name: 'request', start: nav.requestStart, end: nav.responseEnd, children: [] });
    tr.root.children.push({ name: 'parse', start: nav.responseEnd, end: nav.domContentLoadedEventEnd || performance.now(), children: [] });
  }
  const mount = root.child('mount');
  try { await opts.ready; } catch { mount.trace.root.children.at(-1).name = 'mount (failed)'; }
  mount.end();
  root.end();
  return tr;
}

export function bell() {}
export async function lampTest() {}
