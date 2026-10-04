// shared/motion/lamp-test.js — DESIGN.md §8. Lights every [data-lamp] at full --legend, then restores.
import { reducedMotion } from './reduced.js';

// Counts only visible time: rAF doesn't run while document.hidden, and gaps are clamped.
const visibleDelay = ms => new Promise(done => {
  let left = ms, prev = null;
  const tick = t => {
    if (prev !== null) left -= Math.min(t - prev, 100);
    prev = t;
    left <= 0 ? done() : requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

export async function lampTest(root = document, { ms = 400 } = {}) {
  if (reducedMotion()) return;
  const lamps = [...root.querySelectorAll('[data-lamp]')];
  lamps.forEach(l => l.classList.add('is-test'));
  await visibleDelay(ms);
  lamps.forEach(l => l.classList.remove('is-test'));
}
