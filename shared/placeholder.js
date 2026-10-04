// Shared placeholder behavior: faint code rain + name decode. Off with reduced motion.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789ZTD';
  const c = document.getElementById('rain'), x = c.getContext('2d'), fs = 16;
  let cols = [];
  const size = () => { c.width = innerWidth; c.height = innerHeight; cols = Array(Math.ceil(c.width / fs)).fill(0).map(() => Math.random() * -50); };
  const draw = () => {
    if (!document.hidden) {
      x.fillStyle = 'rgba(0,10,3,.08)'; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = '#22C55E'; x.font = fs + 'px monospace';
      cols.forEach((y, i) => {
        x.fillText(glyphs[Math.random() * glyphs.length | 0], i * fs, y * fs);
        cols[i] = (y * fs > c.height && Math.random() > .975) ? 0 : y + 1;
      });
    }
    requestAnimationFrame(draw);
  };
  size(); addEventListener('resize', size); draw();

  const h = document.querySelector('[data-decode]'), target = h.dataset.decode;
  let frame = 0;
  const tick = () => {
    const done = Math.floor(frame / 3);
    h.textContent = [...target].map((ch, i) => i < done || ch === ' ' ? ch : glyphs[Math.random() * glyphs.length | 0]).join('');
    if (done < target.length) { frame++; requestAnimationFrame(tick); } else h.textContent = target;
  };
  tick();
})();
