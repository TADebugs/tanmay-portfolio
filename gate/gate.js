// Gate: blue is one click, red is lift the guard, then throw the switch.
(function () {
  var sw = document.getElementById('switch');
  var state = document.getElementById('switch-state');

  function remember(c) { try { localStorage.setItem('td.choice', c); } catch (e) {} }

  function setGuard(open) {
    sw.setAttribute('aria-expanded', String(open));
    state.textContent = open ? 'guard open · press again to throw' : 'guard closed';
  }

  document.querySelector('[data-choice="blue"]').addEventListener('click', function () { remember('blue'); });

  sw.addEventListener('click', function () {
    if (sw.getAttribute('aria-expanded') !== 'true') return setGuard(true);
    if (sw.classList.contains('is-thrown')) return;
    sw.classList.add('is-thrown');
    state.textContent = 'switch thrown · loading the console';
    remember('red');
    try { sessionStorage.setItem('td.from-gate', '1'); } catch (e) {}
    // Let the throw paint, then go: lever transitionend or 300ms, whichever is first.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return go();
    sw.querySelector('.lever').addEventListener('transitionend', go, { once: true });
    setTimeout(go, 300);
  });

  var gone = false;
  function go() { if (!gone) { gone = true; location.assign('/red'); } }

  sw.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sw.getAttribute('aria-expanded') === 'true') setGuard(false);
  });
  sw.addEventListener('blur', function () { if (!sw.classList.contains('is-thrown')) setGuard(false); });

  // Back from /red via bfcache: reset to the closed state.
  addEventListener('pageshow', function (e) {
    if (e.persisted) { gone = false; sw.classList.remove('is-thrown'); setGuard(false); }
  });
})();
