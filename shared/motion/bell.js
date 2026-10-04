// shared/motion/bell.js — DESIGN.md §8. Visual bell, max one flash per 500 ms (photosensitivity).
import { reducedMotion } from './reduced.js';

let last = -Infinity, faultTimer = 0;

export function bell() {
  const t = performance.now();
  if (t - last < 500) return;
  last = t;
  if (reducedMotion()) {
    const lamp = document.querySelector('[data-lamp="session"]');
    if (!lamp) return;
    lamp.classList.add('is-fault');
    clearTimeout(faultTimer);
    faultTimer = setTimeout(() => lamp.classList.remove('is-fault'), 1000);
    return;
  }
  const html = document.documentElement;
  html.classList.add('is-bell');
  setTimeout(() => html.classList.remove('is-bell'), 50);
}
