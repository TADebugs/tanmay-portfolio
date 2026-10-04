// shared/motion/beat.js — DESIGN.md §8. CLASSIC script (not a module), first thing in <head> of every program page.
// Paints the white Construct beat on the first frame when arriving through loadProgram.
(function () {
  try {
    if (!sessionStorage.getItem('td.trace.pending')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch (e) { return; }
  var html = document.documentElement;
  html.classList.add('is-beat');
  // Failsafe: if mountProgram never runs, the page still reveals itself.
  setTimeout(function () { html.classList.remove('is-beat'); }, 1500);
})();
