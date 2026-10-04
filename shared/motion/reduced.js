// shared/motion/reduced.js — DESIGN.md §8. Read live on every call.
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
