// STUB for /shared/motion/index.js (DESIGN.md §8). Same exports and signatures.
// Trace functions are small real implementations so the rail shows measured numbers;
// motion effects (fade, beat, bell, lamp test) are no-ops. Delete this file when motion merges.

const PENDING = 'td.trace.pending';
const SESSION = 'td.session.t0';

export const now = () => performance.timeOrigin + performance.now();
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class Span {
  constructor(trace, rec) { this._trace = trace; this._rec = rec; }
  child(name) {
    const rec = { name, start: now() - this._trace.t0, end: null, children: [] };
    this._rec.children.push(rec);
    return new Span(this._trace, rec);
  }
  end(at) {
    if (this._rec.end === null) this._rec.end = (at ?? now()) - this._trace.t0;
    if (this._rec === this._trace.root) this._trace.total = this._rec.end - this._rec.start;
    return this._rec.end - this._rec.start;
  }
  get trace() { return this._trace; }
}

const hex8 = () => Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0');

export function startTrace(slug, opts = {}) {
  const trace = { id: hex8(), slug, from: opts.from ?? null, t0: now(), root: null, total: null };
  trace.root = { name: 'load', start: 0, end: null, children: [] };
  return new Span(trace, trace.root);
}

export function savePending(trace) {
  try { sessionStorage.setItem(PENDING, JSON.stringify(trace)); } catch { /* silent */ }
}

export function takePending() {
  try {
    const raw = sessionStorage.getItem(PENDING);
    sessionStorage.removeItem(PENDING);
    const t = raw && JSON.parse(raw);
    return t && now() - t.t0 <= 10000 ? t : null;
  } catch { return null; }
}

export function sessionClock() {
  try {
    let t0 = Number(sessionStorage.getItem(SESSION));
    if (!t0) { t0 = now(); sessionStorage.setItem(SESSION, String(t0)); }
    return now() - t0;
  } catch { return performance.now(); }
}

const pad = (n, w = 2) => String(Math.floor(n)).padStart(w, '0');
export function formatClock(ms) {
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `+${h ? h + ':' : ''}${pad(m)}:${pad(s)}.${pad(ms % 1000, 3)}`;
}
export const formatMs = (ms) => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`);

export function renderTrace(el, trace, opts = {}) {
  const draw = (t) => {
    const total = t.total || 1;
    const rows = [];
    const walk = (s, depth) => {
      const dur = (s.end ?? s.start) - s.start;
      rows.push(`<li style="--d:${depth}"><span class="t-name">${s.name}</span><span class="t-bar" aria-hidden="true"><i style="margin-inline-start:${(s.start / total) * 100}%;inline-size:${(dur / total) * 100}%"></i></span><span class="t-dur">${formatMs(dur)}</span></li>`);
      s.children.forEach((c) => walk(c, depth + 1));
    };
    walk(t.root, 0);
    const label = opts.label ?? `loaded in ${formatMs(t.total ?? 0)}`;
    el.innerHTML = `<p class="t-label">${label}</p><ol class="t-spans">${rows.join('')}</ol>`;
  };
  draw(trace);
  return { update: draw, stop() {} };
}

export async function loadProgram(slug, opts) { location.assign(opts.href); }

export async function mountProgram(slug, opts = {}) {
  const nav = performance.getEntriesByType('navigation')[0];
  const span = startTrace(slug, { from: null });
  const trace = span.trace;
  trace.t0 = performance.timeOrigin;
  if (nav) {
    trace.root.children.push({ name: 'request', start: nav.requestStart, end: nav.responseEnd, children: [] });
    trace.root.children.push({ name: 'parse', start: nav.responseEnd, end: nav.domContentLoadedEventEnd || performance.now(), children: [] });
  }
  const mount = span.child('mount');
  try { await opts.ready; } catch { mount._rec.name = 'mount (failed)'; }
  mount.end();
  span.end();
  if (opts.rail) renderTrace(opts.rail, trace);
  return trace;
}

export function bell() {}
export async function lampTest() {}
