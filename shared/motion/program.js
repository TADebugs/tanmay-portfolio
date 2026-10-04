// shared/motion/program.js — DESIGN.md §8. The "loading a program" transition, both sides.
import { now, startTrace, resumeTrace, savePending, takePending } from '../trace/trace.js';
import { renderTrace } from '../trace/render.js';
import { reducedMotion } from './reduced.js';

const html = document.documentElement;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Reads a duration token like "120ms" / ".2s" from :root. */
function cssMs(name, fallback) {
  const v = getComputedStyle(html).getPropertyValue(name).trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? (v.endsWith('ms') ? n : n * 1000) : fallback;
}

// Board side ---------------------------------------------------------------

const REDUCED_CAP_MS = 1500; // §8: reduced motion navigates after the fetch or 1500 ms
const FETCH_CAP_MS = 5000;   // never block navigation on a hung request
let inflight = null, liveRail = null;

// bfcache: Back to a board that faded out must come back un-faded.
addEventListener('pageshow', e => {
  if (!e.persisted) return;
  html.classList.remove('is-leaving'); // drops the fade instantly, no transition back
  liveRail?.stop();
  liveRail = null;
  inflight = null;
});

/**
 * @param {string} slug
 * @param {{ href: string, from?: string, rail?: HTMLElement|null }} opts
 * @returns {Promise<void>}
 */
export function loadProgram(slug, { href, from, rail = null }) {
  return (inflight ??= go(slug, href, from, rail));
}

async function go(slug, href, from, rail) {
  const reduced = reducedMotion();
  const root = startTrace(slug, { from: from ?? 'board' });
  const req = root.child('request');
  if (rail) liveRail = renderTrace(rail, root.trace, { live: true }); // live is ignored under reduced motion

  let outcome = 'timeout';
  const fetched = fetch(href, { credentials: 'same-origin' })
    .then(r => { outcome = r.ok ? 'ok' : 'failed'; }, () => { outcome = 'failed'; });
  await Promise.race([fetched, sleep(reduced ? REDUCED_CAP_MS : FETCH_CAP_MS)]);
  req.end();
  if (outcome !== 'ok') req.name = `request (${outcome})`;
  liveRail?.update(root.trace);

  if (!reduced) {
    // The white beat starts here. The trace clock is paused for the fade: t0 shifts by
    // exactly the measured fade, so no later span includes it.
    const before = now();
    html.classList.add('is-leaving');
    await sleep(cssMs('--t-quick', 120));
    root.trace.t0 += now() - before;
  }

  savePending(root.trace);
  setTimeout(() => location.assign(href)); // resolve first, then navigate
}

// Program side -------------------------------------------------------------

/** Waits until Navigation Timing has domContentLoadedEventEnd. */
function afterDCL(nav) {
  if (!nav || nav.domContentLoadedEventEnd > 0) return Promise.resolve();
  return new Promise(r => {
    const check = () => (nav.domContentLoadedEventEnd > 0 || document.readyState === 'complete' ? r() : setTimeout(check, 0));
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', () => setTimeout(check, 0), { once: true })
      : setTimeout(check, 0);
  });
}

function reveal() {
  html.classList.remove('is-beat');
  if (reducedMotion()) return;
  html.classList.add('is-reveal');
  setTimeout(() => html.classList.remove('is-reveal'), cssMs('--t-quick', 120) + 50);
}

/**
 * @param {string} slug
 * @param {{ ready?: Promise<unknown>, rail?: HTMLElement|null }} [opts]
 * @returns {Promise<import('../trace/trace.js').Trace>}
 */
export async function mountProgram(slug, { ready, rail = null } = {}) {
  const origin = performance.timeOrigin;
  const nav = performance.getEntriesByType('navigation')[0];
  const at = ms => origin + ms;

  // (3) beat: hold the white for the rest of --t-beat since navigation start. Never part of the trace.
  if (html.classList.contains('is-beat')) setTimeout(reveal, Math.max(0, cssMs('--t-beat', 200) - performance.now()));

  // (1) the pending trace from loadProgram, or a direct visit measured from Navigation Timing.
  const pending = takePending();
  let root;
  if (pending && pending.slug === slug) {
    root = resumeTrace(pending);
  } else {
    root = startTrace(slug, { from: null, t0: origin });
    if (nav) root.child('request', at(nav.requestStart || nav.fetchStart)).end(at(nav.responseEnd));
  }

  const view = rail ? renderTrace(rail, root.trace, { live: true }) : null;

  // (4) mount: from now until `ready` settles.
  const mount = root.child('mount');
  const mounted = Promise.resolve(ready).then(
    () => mount.end(),
    () => { mount.end(); mount.name = 'mount (failed)'; },
  );

  // (2) parse: responseEnd → domContentLoadedEventEnd.
  await afterDCL(nav);
  if (nav && nav.domContentLoadedEventEnd > 0) root.child('parse', at(nav.responseEnd)).end(at(nav.domContentLoadedEventEnd));
  await mounted;

  // (5) the root ends at the last measured event, not at whenever this line runs.
  const t = root.trace;
  root.end(t.t0 + Math.max(...t.root.children.map(c => c.end)));
  if (view) { view.stop(); view.update(t); }
  return t;
}
