# shared/motion + shared/trace

Owner: `motion`. Implements DESIGN.md §8 exactly. Native ES modules, no deps, no build. Signatures are a contract: change one only through artdirector (decisions.md #3).

Demo (not linked from the site): `/shared/motion/demo.html` → Load → `/shared/motion/demo-program.html`. Add `?ready=800` or `?fail=1` to the program URL for a slow or failed mount.

## Include

Program page `<head>`, first thing after the metas:

```html
<script src="/shared/motion/beat.js"></script>          <!-- classic, blocking, before any stylesheet -->
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/shared/motion/motion.css">
```

Board and other red-side pages: `tokens.css` + `motion.css` only (no `beat.js`).

```js
import { loadProgram, mountProgram, bell, lampTest, reducedMotion,
         renderTrace, startTrace, sessionClock, formatClock, formatMs } from '/shared/motion/index.js';
```

## Board side: `loadProgram(slug, { href, from?, rail? }) → Promise<void>`

```js
loadBtn.onclick = () => loadProgram('gods-eye', { href: '/gods-eye', rail: strip.querySelector('.trace-rail') });
```

Caller rule: intercept only unmodified primary clicks. Let Ctrl/Cmd/Shift/Alt and middle clicks fall through to the link's `href`:

```js
link.addEventListener('click', e => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  loadProgram(slug, { href: link.href, rail });
});
```

Records a `"request"` span around a real `fetch(href)`, saves the trace to sessionStorage, fades to `--construct`, then navigates. It never blocks: a failed fetch is named `request (failed)`, and a fetch still pending after 5 s (1.5 s under reduced motion) is named `request (timeout)`. Either way it navigates. Repeated calls while one is running return the same promise.

- **Fade:** a fixed `--construct` layer fades in over the body (`html.is-leaving::after`, opacity only). It works whatever element the page paints its ground on.
- **The trace clock is paused during the fade:** `t0` shifts by the measured fade time, so no span includes it.
- **bfcache:** on Back (`pageshow` with `persisted`), the fade is removed instantly and any live rail is stopped.

## Program side: `mountProgram(slug, { ready?, rail? }) → Promise<Trace>`

Call once, as early as the module runs (boilerplate in DESIGN.md §9).

- **Arriving through `loadProgram`:** it continues that trace.
- **Direct visit:** it starts a new trace (`from: null`, `t0 = performance.timeOrigin`) with a `request` span from Navigation Timing.

Spans added:
- `parse`: `responseEnd` → `domContentLoadedEventEnd`
- `mount`: from the call until `ready` settles; `mount (failed)` if `ready` rejects (the promise still resolves)

The root ends at the last measured child end. The white beat (≥ `--t-beat` from navigation start) and the reveal fade run beside the trace and are never counted in it.

## `bell()`

Reverse-video flash on `<html>` for 50 ms, at most once per 500 ms. Under reduced motion it lights `[data-lamp="session"]` with `.is-fault` for 1000 ms instead.

## `lampTest(root = document, { ms = 400 }) → Promise<void>`

Adds `.is-test` to every `[data-lamp]` in `root` for `ms` of **visible** time, then removes it. It restores state because it only adds and removes its own class. Under reduced motion it resolves immediately.

## `reducedMotion() → boolean`

Read live on every call.

## Trace data: `shared/trace/trace.js`

| export | notes |
|---|---|
| `now()` | `performance.timeOrigin + performance.now()` |
| `startTrace(slug, { from?, t0? })` | returns the root `Span`. `t0` is an extension used by `mountProgram` |
| `Span#child(name, at?)` | `at` is an extension: an `EpochMs` start, used for Navigation Timing spans |
| `Span#end(at?)` | idempotent |
| `Span#trace` | the live Trace object |
| `Span#name` | get/set; used for the `(failed)` suffixes |
| `resumeTrace(trace)` | extension: wraps a plain Trace (e.g. from `takePending`) and returns its root `Span` |
| `savePending` / `takePending` | `sessionStorage['td.trace.pending']`. Take removes the entry, and returns null if it's missing, unparseable, or more than 10 s old |
| `sessionClock()` | ms since `sessionStorage['td.session.t0']`, which it sets on first call |
| `formatClock(ms)` | `+03:41.208` / `+1:03:41.208` |
| `formatMs(ms)` | `412 ms` / `1.84 s` (U+2009 before the unit) |

The extensions are additive. Every contract signature works exactly as written in §8.

## Rendering: `shared/trace/render.js`

`renderTrace(el, trace, { live?, label? }) → { update(trace), stop() }`

Renders the label (`p.trace-label`, default `loaded in {total}`, or `loading` while open) and an `ol.trace` waterfall.

- **Rows:** one `li.trace-span` per span, depth-first, with siblings ordered by start. Each row has `--depth`, `.trace-name`, `.trace-track[aria-hidden] > .trace-bar`, and `.trace-ms`.
- **Bars:** the offset and `inline-size` are percentages of the total.
- **`live: true`:** open spans grow each frame from real elapsed time and carry `.is-open`. Growth pauses while `document.hidden` and is off under reduced motion; open spans then show `—` until they end.
- **Styling:** default styles live in `motion.css` under `:where()`, so they have zero specificity. Restyle freely.

## motion.css

| selector | what it does |
|---|---|
| `html.is-beat` | white Construct, body hidden |
| `html.is-reveal` | 120 ms body fade-in |
| `html.is-leaving` | board fade to white |
| `html.is-bell` | `filter: invert(1)` |
| `[data-lamp].is-fault` | lamp shows `--fault` |
| `[data-lamp].is-test` | lamp at full `--legend` |
| trace defaults | waterfall styling, overridable |

**View Transitions are intentionally off.** The beat already makes white-to-white seamless. `@view-transition { navigation: auto }` would add a crossfade to every other red-side navigation, and §3 doesn't allow that.

## beat.js

Classic script, ten lines. It adds `html.is-beat` when a pending trace exists and reduced motion is off. Failsafe: it removes the class itself after 1500 ms, so a page whose module never runs still shows.
