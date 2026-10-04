// shared/trace/render.js — DESIGN.md §8. Span waterfall as an <ol>.
import { now, formatMs } from './trace.js';
import { reducedMotion } from '../motion/reduced.js';

const flatten = (rec, depth = 0, out = []) => {
  out.push([rec, depth]);
  for (const c of [...rec.children].sort((a, b) => a.start - b.start)) flatten(c, depth + 1, out);
  return out;
};
const pct = (v, scale) => `${scale > 0 ? Math.min(100, Math.max(0, (v / scale) * 100)) : 0}%`;

function el(tag, cls) {
  const e = document.createElement(tag);
  e.className = cls;
  return e;
}

/**
 * @param {HTMLElement} host
 * @param {import('./trace.js').Trace} trace
 * @param {{ live?: boolean, label?: string }} [opts]
 * @returns {{ update(trace: import('./trace.js').Trace): void, stop(): void }}
 */
export function renderTrace(host, trace, { live = false, label } = {}) {
  let rows = [], cap = null, raf = 0, stopped = false;
  const growing = () => live && !stopped && !reducedMotion();

  function build(flat) {
    cap = el('p', 'trace-label');
    const list = el('ol', 'trace');
    rows = flat.map(([, depth]) => {
      const li = el('li', 'trace-span');
      li.style.setProperty('--depth', depth);
      const name = el('span', 'trace-name');
      const track = el('span', 'trace-track');
      track.setAttribute('aria-hidden', 'true');
      const bar = el('span', 'trace-bar');
      track.append(bar);
      const ms = el('span', 'trace-ms');
      li.append(name, ' ', track, ms);
      list.append(li);
      return { name, bar, ms };
    });
    host.replaceChildren(cap, list);
  }

  function paint() {
    const flat = flatten(trace.root);
    if (flat.length !== rows.length) build(flat);
    const grow = growing();
    const t = now() - trace.t0;
    // Scale: the measured total; while open and growing, real elapsed time; otherwise the latest ended span.
    const scale = trace.total ?? (grow ? t : Math.max(0, ...flat.map(([r]) => r.end ?? 0)));
    flat.forEach(([rec], i) => {
      const r = rows[i];
      const end = rec.end ?? (grow ? t : null);
      r.name.textContent = rec.name;
      r.bar.style.marginInlineStart = pct(rec.start, scale);
      r.bar.style.inlineSize = end === null ? '0%' : pct(end - rec.start, scale);
      r.ms.textContent = end === null ? '—' : formatMs(end - rec.start);
      r.bar.classList.toggle('is-open', rec.end === null);
    });
    cap.textContent = label ?? (trace.total === null ? 'loading' : `loaded in ${formatMs(trace.total)}`);
  }

  function frame() {
    raf = 0;
    if (document.hidden || !growing()) return;
    paint();
    if (trace.root.end === null) raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!raf && growing() && !document.hidden) raf = requestAnimationFrame(frame); };
  const onVisible = () => { if (!document.hidden) start(); };

  paint();
  if (live) { document.addEventListener('visibilitychange', onVisible); start(); }

  return {
    update(next) { trace = next; rows = []; paint(); start(); },
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      raf = 0;
      document.removeEventListener('visibilitychange', onVisible);
    },
  };
}
