// STUB for /construct/shell.js (DESIGN.md §9). Same exports and signatures.
// Renders a minimal status line (session lamp + clock, location, plain version, reconsider);
// no terminal. Delete this file when construct merges.
import { sessionClock, formatMs } from './index.js';

let shell = null;

export function mountShell(opts) {
  if (shell) return shell;
  const log = [];
  const line = document.createElement('footer');
  line.className = 'status-line';
  line.innerHTML = `
    <span class="lamp is-nominal" data-lamp="session" aria-hidden="true"></span>
    <span class="mono" id="op-clock">op 00:00:00</span>
    <span class="loc"><a href="/red">/red</a>${opts.channel ? ' › CH-02 AlgoLend' : ''}</span>
    <span class="spacer"></span>
    <a href="/blue">plain version</a>
    <a href="/?reconsider">reconsider</a>`;
  document.body.append(line);
  const clock = line.querySelector('#op-clock');
  const tick = () => {
    if (document.hidden) return;
    const s = Math.floor(sessionClock() / 1000);
    clock.textContent = `op ${[s / 3600, (s / 60) % 60, s % 60].map((n) => String(Math.floor(n)).padStart(2, '0')).join(':')}`;
  };
  tick();
  setInterval(tick, 1000);
  shell = {
    log(rec) { log.push({ ...rec, at: sessionClock() }); },
    logTrace(trace) { this.log({ level: 'ok', text: `${trace.slug} loaded in ${formatMs(trace.total ?? 0)}` }); },
    register() {},
    open() {},
    close() {},
  };
  return shell;
}
