// Stand-in for /shared/motion/index.js until agent/motion merges (DESIGN.md §8).
// Same exports, same signatures. Pure trace helpers follow the spec; the motion
// is minimal. Swap: replace every '/construct/_stub/motion.js' import with
// '/shared/motion/index.js' and the stub motion.css link with /shared/motion/motion.css.

const ss = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
  del(k) { try { sessionStorage.removeItem(k); } catch {} },
};

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const now = () => performance.timeOrigin + performance.now();

class Span {
  constructor(rec, trace) { this.rec = rec; this._trace = trace; }
  child(name) {
    const rec = { name, start: now() - this._trace.t0, end: null, children: [] };
    this.rec.children.push(rec);
    return new Span(rec, this._trace);
  }
  end(at) {
    if (this.rec.end == null) this.rec.end = (at ?? now()) - this._trace.t0;
    if (this.rec === this._trace.root) this._trace.total = this.rec.end - this.rec.start;
    return this.rec.end - this.rec.start;
  }
  get trace() { return this._trace; }
}

export function startTrace(slug, opts = {}) {
  const t0 = now();
  const trace = {
    id: Math.random().toString(16).slice(2, 10).padEnd(8, '0'),
    slug, from: opts.from ?? null, t0,
    root: { name: 'load', start: 0, end: null, children: [] }, total: null,
  };
  return new Span(trace.root, trace);
}

export function savePending(trace) { ss.set('td.trace.pending', JSON.stringify(trace)); }
export function takePending() {
  const raw = ss.get('td.trace.pending');
  ss.del('td.trace.pending');
  try { const t = JSON.parse(raw); return t && now() - t.t0 < 10000 ? t : null; } catch { return null; }
}

export function sessionClock() {
  let t0 = Number(ss.get('td.session.t0'));
  if (!t0) { t0 = now(); ss.set('td.session.t0', String(t0)); }
  return now() - t0;
}

export function formatClock(ms) {
  ms = Math.max(0, Math.floor(ms));
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `+${h ? h + ':' : ''}${p(m)}:${p(s)}.${p(ms % 1000, 3)}`;
}

export const formatMs = ms => ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`;

export function renderTrace() { return { update() {}, stop() {} }; }

export async function loadProgram(slug, opts) {
  const root = startTrace(slug, { from: opts.from ?? 'board' });
  const req = root.child('request');
  try { const r = await fetch(opts.href, { credentials: 'same-origin' }); if (!r.ok) req.rec.name = 'request (failed)'; }
  catch { req.rec.name = 'request (failed)'; }
  req.end();
  savePending(root.trace);
  location.assign(opts.href);
}

export async function mountProgram(slug, opts = {}) {
  const t = takePending() ?? startTrace(slug).trace;
  document.documentElement.classList.remove('is-beat');
  const root = new Span(t.root, t);
  const mount = root.child('mount');
  try { await opts.ready; } catch { mount.rec.name = 'mount (failed)'; }
  mount.end(); root.end();
  return t;
}

let lastBell = 0;
export function bell() {
  const t = performance.now();
  if (t - lastBell < 500) return;
  lastBell = t;
  if (reducedMotion()) {
    const lamp = document.querySelector('[data-lamp="session"]');
    if (!lamp) return;
    lamp.classList.add('is-fault');
    setTimeout(() => lamp.classList.remove('is-fault'), 1000);
    return;
  }
  const html = document.documentElement;
  html.classList.add('is-bell');
  setTimeout(() => html.classList.remove('is-bell'), 50);
}

export async function lampTest(root = document, opts = {}) {
  if (reducedMotion()) return;
  const lamps = root.querySelectorAll('[data-lamp]');
  lamps.forEach(l => l.classList.add('is-test'));
  await new Promise(r => setTimeout(r, opts.ms ?? 400));
  lamps.forEach(l => l.classList.remove('is-test'));
}
