// shared/trace/trace.js — DESIGN.md §8. Pure data: no DOM, no motion.

/** Epoch milliseconds with sub-ms precision: performance.timeOrigin + performance.now(). */
/** @typedef {number} EpochMs */

/**
 * @typedef {Object} SpanRecord
 * @property {string} name          stage name, e.g. "request", "parse", "mount"
 * @property {number} start         ms relative to the trace's t0
 * @property {number|null} end      ms relative to t0; null while open
 * @property {SpanRecord[]} children
 */

/**
 * @typedef {Object} Trace
 * @property {string} id            random 8-char hex
 * @property {string} slug          program slug, or "board"
 * @property {string|null} from     slug or "board" the visitor came from; null on direct visit
 * @property {EpochMs} t0
 * @property {SpanRecord} root
 * @property {number|null} total    root duration in ms (null while open)
 */

const PENDING = 'td.trace.pending';
const SESSION = 'td.session.t0';
const STALE_MS = 10000;

/** @returns {EpochMs} */
export const now = () => performance.timeOrigin + performance.now();

export class Span {
  #trace; #rec;
  constructor(trace, rec) { this.#trace = trace; this.#rec = rec; }

  /** @returns {Trace} */
  get trace() { return this.#trace; }

  get name() { return this.#rec.name; }
  set name(v) { this.#rec.name = v; }

  /** Opens a child span at `at` (default now()). */
  child(name, at = now()) {
    const rec = { name, start: at - this.#trace.t0, end: null, children: [] };
    this.#rec.children.push(rec);
    return new Span(this.#trace, rec);
  }

  /** Closes the span at `at` (default now()); returns its duration in ms. Idempotent. */
  end(at = now()) {
    const rec = this.#rec;
    if (rec.end === null) {
      rec.end = at - this.#trace.t0;
      if (rec === this.#trace.root) this.#trace.total = rec.end - rec.start;
    }
    return rec.end - rec.start;
  }
}

function hex8() {
  const b = crypto.getRandomValues(new Uint8Array(4));
  return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a Trace with an open root span "load"; returns the root Span.
 * `t0` is an extension used by mountProgram for direct visits (t0 = performance.timeOrigin).
 * @param {string} slug
 * @param {{ from?: string|null, t0?: EpochMs }} [opts]
 */
export function startTrace(slug, { from = null, t0 = now() } = {}) {
  /** @type {Trace} */
  const trace = { id: hex8(), slug, from, t0, root: { name: 'load', start: 0, end: null, children: [] }, total: null };
  return new Span(trace, trace.root);
}

/** Wraps an existing Trace (e.g. from takePending) so spans can be added to it. Returns its root Span. */
export const resumeTrace = trace => new Span(trace, trace.root);

/** @param {Trace} trace */
export function savePending(trace) {
  try { sessionStorage.setItem(PENDING, JSON.stringify(trace)); } catch {}
}

/** Reads and removes the pending trace. Null if none, unparseable, or older than 10 s. */
export function takePending() {
  let raw = null;
  try { raw = sessionStorage.getItem(PENDING); sessionStorage.removeItem(PENDING); } catch {}
  if (!raw) return null;
  try {
    const t = JSON.parse(raw);
    if (!t || typeof t.t0 !== 'number' || !t.root || now() - t.t0 > STALE_MS) return null;
    return t;
  } catch { return null; }
}

let t0Session = null; // cached per page; sessionStorage carries it across pages
/** ms since the first red-side page view this session. */
export function sessionClock() {
  if (t0Session === null) {
    try { t0Session = Number(sessionStorage.getItem(SESSION)) || null; } catch {}
    if (t0Session === null) {
      t0Session = now();
      try { sessionStorage.setItem(SESSION, String(t0Session)); } catch {}
    }
  }
  return now() - t0Session;
}

const pad = (n, w = 2) => String(n).padStart(w, '0');

/** +03:41.208, or +1:03:41.208 at 1 h or more. */
export function formatClock(ms) {
  const t = Math.max(0, Math.floor(ms));
  const h = Math.floor(t / 3600000), m = Math.floor(t / 60000) % 60, s = Math.floor(t / 1000) % 60;
  const tail = `${pad(m)}:${pad(s)}.${pad(t % 1000, 3)}`;
  return h ? `+${h}:${tail}` : `+${tail}`;
}

/** 412 ms under 1000, else 1.84 s. Thin space (U+2009) before the unit. */
export function formatMs(ms) {
  const r = Math.round(ms);
  return r < 1000 ? `${r} ms` : `${(ms / 1000).toFixed(2)} s`;
}
