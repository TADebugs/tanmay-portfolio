// Playwright checks for DESIGN.md §8. Run: python3 -m http.server 8123 (repo root), then NODE_PATH=$(npm root -g) node shared/motion/verify.cjs
const { chromium } = require('playwright');
const B = 'http://localhost:8123/shared/motion/';
const SHOTS = require('path').join(__dirname, '../../.agents/critique/shots/');
const errors = [];
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };

// Logs html class changes with performance.now(), from the very first moment of every document.
const classLog = () => {
  window.__cls = [];
  let last = null;
  const rec = () => {
    const h = document.documentElement;
    if (!h || h.className === last) return;
    last = h.className;
    window.__cls.push([Math.round(performance.now()), last]);
  };
  new MutationObserver(rec).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  rec();
};
async function ctx(browser, opts = {}) {
  const c = await browser.newContext({ viewport: { width: 900, height: 700 }, ...opts });
  await c.addInitScript(classLog);
  const p = await c.newPage();
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', e => errors.push(String(e)));
  return [c, p];
}
const names = t => [t.root.name, ...t.root.children.map(c => c.name)];

(async () => {
  const browser = await chromium.launch();

  // 1. trace across navigation + white beat
  {
    const [c, p] = await ctx(browser);
    await p.goto(B + 'demo.html');
    await p.click('#load-slow');
    await p.waitForTimeout(60);
    await p.screenshot({ path: SHOTS + 'motion-r1-leave-fade.png' });
    await p.waitForURL(/demo-program/);
    await p.screenshot({ path: SHOTS + 'motion-r1-white-beat.png' });
    await p.waitForFunction(() => window.__trace);
    const t = await p.evaluate(() => window.__trace);
    const cls = await p.evaluate(() => window.__cls);
    ok(t.from === 'board' && t.slug === 'demo', `trace carried across nav (from=${t.from})`);
    ok(['load', 'request', 'mount', 'parse'].every(n => names(t).includes(n)), `spans: ${names(t).join(', ')}`);
    const mount = t.root.children.find(s => s.name === 'mount');
    ok(mount.end - mount.start >= 795, `mount span measured ${Math.round(mount.end - mount.start)} ms (ready=800)`);
    ok(Math.abs(t.total - Math.max(...t.root.children.map(s => s.end))) < 0.01, `total ${t.total.toFixed(1)} = last child end`);
    const first = cls.find(([, k]) => k); ok(first && first[1].includes('is-beat'), `is-beat is the first class html ever gets (${first && first[0]} ms): ${JSON.stringify(cls.slice(0,4))}`);
    const off = cls.find(([, k], i) => i > cls.indexOf(first) && !k.includes('is-beat'));
    ok(off && off[0] >= 200 && off[0] < 1500, `is-beat removed by mountProgram at ${off && off[0]} ms`);
    await p.waitForTimeout(300);
    ok(!(await p.evaluate(() => document.documentElement.className)), 'html classes clean after reveal');
    await p.screenshot({ path: SHOTS + 'motion-r1-program-mounted.png', fullPage: true });
    // Rail during a live load, board side
    await p.goto(B + 'demo.html');
    await p.route('**/demo-program.html', async r => { await new Promise(x => setTimeout(x, 600)); r.continue(); });
    await p.click('#load');
    await p.waitForTimeout(350);
    await p.screenshot({ path: SHOTS + 'motion-r1-board-live-rail.png' });
    await p.waitForURL(/demo-program/);
    await p.waitForFunction(() => window.__trace);
    const t2 = await p.evaluate(() => window.__trace);
    const req = t2.root.children.find(s => s.name === 'request');
    ok(req.end - req.start >= 590, `slow request measured ${Math.round(req.end - req.start)} ms`);
    await p.unroute('**/demo-program.html');
    await c.close();
  }

  // 2. failsafe: module blocked, beat still clears at 1500 ms
  {
    const [c, p] = await ctx(browser);
    await p.goto(B + 'demo.html');
    await p.evaluate(() => sessionStorage.setItem('td.trace.pending', JSON.stringify({ id: 'x', slug: 'demo', from: 'board', t0: performance.timeOrigin + performance.now(), root: { name: 'load', start: 0, end: null, children: [] }, total: null })));
    await p.route('**/shared/motion/index.js', r => r.abort());
    await p.goto(B + 'demo-program.html');
    await p.waitForTimeout(700);
    ok((await p.evaluate(() => document.documentElement.className)).includes('is-beat'), 'module blocked: still white at 700 ms');
    await p.screenshot({ path: SHOTS + 'motion-r1-failsafe-white.png' });
    await p.waitForTimeout(1000);
    const cls = await p.evaluate(() => window.__cls);
    const on = cls.findIndex(([, k]) => k.includes('is-beat')); const off = cls.find(([, k], i) => i > on && !k.includes('is-beat'));
    ok(off && off[0] >= 1450 && off[0] < 1700, `failsafe removed is-beat at ${off && off[0]} ms`);
    await p.screenshot({ path: SHOTS + 'motion-r1-failsafe-revealed.png' });
    errors.splice(0); // the aborted module is an expected console error here
    await c.close();
  }

  // 3. direct visit, mount failure, request failure
  {
    const [c, p] = await ctx(browser);
    await p.goto(B + 'demo-program.html');
    await p.waitForFunction(() => window.__trace);
    let t = await p.evaluate(() => window.__trace);
    ok(t.from === null && names(t).includes('request') && names(t).includes('parse'), `direct visit: from=null, ${names(t).join(', ')}`);
    ok(!(await p.evaluate(() => window.__cls.some(([, k]) => k.includes('is-beat')))), 'direct visit: no beat');

    await p.goto(B + 'demo-program.html?fail=1');
    await p.waitForFunction(() => window.__trace);
    t = await p.evaluate(() => window.__trace);
    ok(names(t).includes('mount (failed)'), 'rejected ready → "mount (failed)", promise still resolved');

    await p.goto(B + 'demo.html');
    await p.route('**/demo-program.html', r => r.request().resourceType() === 'fetch' ? r.abort() : r.continue());
    await p.click('#load');
    await p.waitForURL(/demo-program/);
    await p.waitForFunction(() => window.__trace);
    t = await p.evaluate(() => window.__trace);
    ok(names(t).includes('request (failed)'), 'fetch rejected → "request (failed)", navigated anyway');
    errors.splice(0); // aborted fetch logs net::ERR_FAILED
    await p.unroute('**/demo-program.html');
    await c.close();
  }

  // 4. bell rate limit
  {
    const [c, p] = await ctx(browser);
    await p.goto(B + 'demo.html');
    for (let i = 0; i < 10; i++) await p.click('#bell', { delay: 0 });
    await p.waitForTimeout(100);
    const burst = await p.evaluate(() => document.getElementById('rings').textContent);
    await p.waitForTimeout(500);
    await p.click('#bell');
    await p.waitForTimeout(100);
    const after = await p.evaluate(() => document.getElementById('rings').textContent);
    const flashes = await p.evaluate(() => window.__cls.filter(([, k]) => k.includes('is-bell')).map(x => x[0]));
    const gaps = flashes.slice(1).map((t, i) => t - flashes[i]);
    ok(gaps.every(g => g >= 500), `bell: ${burst} → ${after}; gaps ${gaps.join(',')} ms`);
    await c.close();
  }

  // 5. reduced motion
  {
    const [c, p] = await ctx(browser, { reducedMotion: 'reduce' });
    await p.goto(B + 'demo.html');
    await p.click('#bell');
    ok(await p.evaluate(() => document.querySelector('[data-lamp="session"]').classList.contains('is-fault')), 'reduced bell: session lamp is-fault');
    ok(!(await p.evaluate(() => window.__cls.some(([, k]) => k.includes('is-bell')))), 'reduced bell: no inversion');
    await p.screenshot({ path: SHOTS + 'motion-r1-reduced-bell.png' });
    await p.waitForTimeout(1100);
    ok(!(await p.evaluate(() => document.querySelector('[data-lamp="session"]').classList.contains('is-fault'))), 'reduced bell: lamp restored after 1000 ms');
    const lt = await p.evaluate(async () => { const { lampTest } = await import('/shared/motion/index.js'); const t = performance.now(); await lampTest(); return [performance.now() - t, document.querySelectorAll('.is-test').length]; });
    ok(lt[0] < 50 && lt[1] === 0, `reduced lampTest resolves immediately (${lt[0].toFixed(1)} ms)`);
    await p.click('#load');
    await p.waitForURL(/demo-program/);
    await p.waitForFunction(() => window.__trace);
    const t = await p.evaluate(() => window.__trace);
    const cls = await p.evaluate(() => window.__cls);
    ok(t.from === 'board' && names(t).includes('request'), 'reduced: trace still recorded across nav');
    ok(!cls.some(([, k]) => /is-beat|is-reveal/.test(k)), 'reduced: no beat, no reveal');
    await p.screenshot({ path: SHOTS + 'motion-r1-reduced-program.png', fullPage: true });
    await c.close();
  }

  // 6. lamp test (motion on) + static renderTrace + bfcache restore
  {
    const [c, p] = await ctx(browser);
    await p.goto(B + 'demo.html');
    await p.click('#lamp');
    await p.waitForTimeout(100);
    const lit = await p.evaluate(() => document.querySelectorAll('#lamps .is-test').length);
    await p.screenshot({ path: SHOTS + 'motion-r1-lamp-test.png' });
    await p.waitForTimeout(450);
    const after = await p.evaluate(() => document.querySelectorAll('.is-test').length);
    ok(lit === 3 && after === 0, `lampTest lit ${lit}, restored to ${after}`);
    await p.click('#measure');
    await p.waitForSelector('#static .trace-span');
    await p.screenshot({ path: SHOTS + 'motion-r1-board-static-trace.png', fullPage: true });

    await p.click('#load');
    await p.waitForURL(/demo-program/);
    await p.waitForFunction(() => window.__trace);
    await p.goBack();
    await p.waitForTimeout(200);
    const persisted = await p.evaluate(() => performance.getEntriesByType('navigation')[0]?.type);
    let leaving = await p.evaluate(() => document.documentElement.classList.contains('is-leaving'));
    if (leaving === false && !(await p.evaluate(() => window.__cls.some(([, k]) => k.includes('is-leaving'))))) {
      // Not restored from bfcache (fresh load): simulate the persisted pageshow on a faded board.
      await p.evaluate(() => { document.documentElement.classList.add('is-leaving'); dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })); });
      leaving = await p.evaluate(() => document.documentElement.classList.contains('is-leaving'));
      ok(!leaving, `bfcache: persisted pageshow drops the fade (simulated; nav type ${persisted})`);
    } else ok(!leaving, 'bfcache: real Back restore, fade dropped');
    await p.screenshot({ path: SHOTS + 'motion-r1-bfcache-back.png' });
    await c.close();
  }

  // 7. 375px
  {
    const [c, p] = await ctx(browser, { viewport: { width: 375, height: 740 } });
    await p.goto(B + 'demo-program.html?ready=300');
    await p.waitForFunction(() => window.__trace);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    ok(sw <= 375, `375px: no horizontal scroll (${sw})`);
    await p.screenshot({ path: SHOTS + 'motion-r1-375.png' });
    await c.close();
  }

  ok(errors.length === 0, `console errors: ${errors.length ? errors.join(' | ') : 'none'}`);
  await browser.close();
})();
