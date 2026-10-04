// construct/shell.js: the Shell API (DESIGN.md §9). Status line (§4.4), comms loop
// terminal (§4.5), déjà vu cat log side (§4.6). Contract: mountShell / Shell#log /
// logTrace / register / open / close. Extra exports (projects, statusOf) are for /red.
import { loadProgram, bell, sessionClock, formatClock, formatMs } from '/shared/motion/index.js';

const store = (area) => ({
  get(k, d) { try { const v = area().getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { area().setItem(k, JSON.stringify(v)); } catch {} },
});
const ss = store(() => sessionStorage);

const CONTACT = {
  name: 'Tanmay Desai', city: 'Boston', email: 't.desai240305@gmail.com',
  linkedin: 'https://www.linkedin.com/in/tanmaydesai2126/', github: 'https://github.com/TADebugs',
};
// shared/cv.md, role · org · dates
const RESUME = [
  'SDET intern · Medidata Solutions · Jul–Nov 2026',
  'Data engineering intern · Medidata Solutions · Apr–Jul 2026',
  'Software engineering intern · Electronic Arts · Nov 2025–Jan 2026',
  'B.S. Information Technology · Northeastern University · 2024–May 2027',
  "Associate's, Computer Science · Golden Gate University · 2023–24",
];

let projectsP;
export function projects() {
  return projectsP ??= fetch('/shared/projects.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => d.projects.map((p, i) => ({ ...p, ch: 'CH-' + String(i + 1).padStart(2, '0') })));
}

// DESIGN.md §4.2 lamp table. A subdomain hand-off that isn't live reads NOT CONNECTED (§5.6).
export function statusOf(p) {
  if (p.status === 'live') return p.treatment === 'recorded-demo'
    ? { lamp: 'caution', label: 'RECORDED' } : { lamp: 'nominal', label: 'LIVE' };
  if (p.launch) return { lamp: 'inactive', label: 'NOT CONNECTED' };
  return { lamp: 'caution', label: 'IN PROGRESS' };
}

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');

function lev(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const t = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = t;
    }
  }
  return row[b.length];
}
function suggest(word, pool) {
  let best = null, d = 3;
  for (const w of pool) { const x = lev(word, w); if (x < d) { d = x; best = w; } }
  return best;
}
const pad = (s, n) => s.padEnd(n);
const hhmmss = ms => { const s = Math.floor(ms / 1000); return [s / 3600, s / 60 % 60, s % 60].map(n => String(Math.floor(n)).padStart(2, '0')).join(':'); };
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) k === 'class' ? e.className = v : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

const CAT = '<svg viewBox="0 0 8 8" width="16" height="16" aria-hidden="true" shape-rendering="crispEdges">'
  + '<path fill="#0B0C0E" d="M1 1h1v1h1v1h2V2h1V1h1v5H6v1H5V6H3v1H2V6H1z"/>'
  + '<path fill="var(--caution)" d="M2 3h1v1H2zM5 3h1v1H5z"/></svg>';

let shell;

export function mountShell({ channel = null } = {}) {
  if (shell) return shell;

  const records = ss.get('td.log', []);
  let history = ss.get('td.history', []);
  let hIdx = null, draft = '';
  const extra = new Map();
  const isBoard = channel == null;

  // ---------- DOM ----------
  const root = el('div', { id: 'td-shell', hidden: '' });
  const lamp = el('span', { class: 'lamp', 'data-lamp': 'session', 'aria-hidden': 'true' });
  const clock = el('span', { class: 'sl-clock' });
  const loc = el('span', { class: 'sl-loc' }, el('a', { href: '/red' }, '/red'));
  const msg = el('button', { type: 'button', class: 'sl-msg', 'aria-controls': 'td-term' });
  const termBtn = el('button', { type: 'button', class: 'sl-btn', 'aria-expanded': 'false', 'aria-controls': 'td-term' },
    el('kbd', { class: 'sl-key', 'aria-hidden': 'true' }, '`'), 'terminal');
  const status = el('footer', { class: 'sl', 'aria-label': 'Status line' },
    el('span', { class: 'sl-op' }, lamp, el('span', { class: 'sl-op-k' }, 'op'), clock),
    loc, msg, el('span', { class: 'sl-gap' }), termBtn,
    el('a', { class: 'sl-btn', href: '/blue' }, 'plain version'),
    el('a', { class: 'sl-btn', href: '/?reconsider' }, 'reconsider'));

  const log = el('div', { class: 'term-log', role: 'log', 'aria-live': 'polite', 'aria-label': 'Comms log', tabindex: '0' });
  const input = el('input', {
    id: 'td-term-in', class: 'term-in', type: 'text', autocomplete: 'off', autocapitalize: 'off',
    autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'send',
  });
  const pre = el('span', { class: 'term-pre' });
  const caret = el('span', { class: 'term-caret' });
  const field = el('span', { class: 'term-field' }, input, el('span', { class: 'term-mirror', 'aria-hidden': 'true' }, pre, caret));
  const closeBtn = el('button', { type: 'button', class: 'term-close' }, 'close');
  const panel = el('section', { id: 'td-term', class: 'term', 'aria-label': 'Terminal' },
    el('div', { class: 'term-head' },
      el('span', { class: 'term-title' }, 'comms loop'),
      el('span', { class: 'term-hint', 'aria-hidden': 'true' }, 'tab completes · ↑ ↓ history · esc closes'),
      closeBtn),
    log,
    el('form', { class: 'term-line', autocomplete: 'off' },
      el('label', { class: 'vh', for: 'td-term-in' }, 'Terminal command'),
      el('span', { class: 'term-prompt', 'aria-hidden': 'true' }, 'op ▸'), field));
  root.append(panel, status);
  document.body.prepend(el('p', { class: 'print-note', hidden: '' }, 'Printable version: tanmaydesai.xyz/blue'));
  records.forEach(r => log.append(renderRec(r)));
  // §4.4 v1.2 message line: the latest record, updated only by push().
  function annunciate(r) {
    msg.replaceChildren();
    msg.hidden = !r;
    if (!r) return;
    if (r.cat) { const c = el('span', { class: 'sl-cat' }); c.innerHTML = CAT; msg.append(c); }
    msg.append(el('span', { class: 'sl-msg-lv' }, r.level), el('span', { class: 'sl-msg-tx' }, (r.text ?? '') + (r.linkText ?? '')));
    msg.setAttribute('aria-label', `Open terminal. Last message: ${r.level} ${(r.text ?? '') + (r.linkText ?? '')}`.trim());
  }
  annunciate(records.at(-1));
  msg.addEventListener('click', () => open());

  // shell.css is part of the shell; inject it if the page didn't link it.
  let link = document.querySelector('link[href="/construct/shell.css"]');
  const reveal = () => root.removeAttribute('hidden');
  if (!link) {
    link = el('link', { rel: 'stylesheet', href: '/construct/shell.css' });
    link.addEventListener('load', reveal); link.addEventListener('error', reveal);
    document.head.append(link);
  } else if (link.sheet) reveal();
  else { link.addEventListener('load', reveal); link.addEventListener('error', reveal); }
  document.body.append(root);
  document.body.classList.add('has-shell');

  // ---------- records ----------
  function renderRec(r) {
    const tx = el('span', { class: 'tx' }, r.text ?? '');
    if (r.href) tx.append(el('a', { href: r.href }, r.linkText ?? r.href));
    const row = el('div', { class: `rec lv-${r.level}${r.dim ? ' is-dim' : ''}${r.pre ? ' is-pre' : ''}` },
      el('span', { class: 'gut' }),
      el('span', { class: 'ts', 'aria-hidden': 'true' }, r.t),
      el('span', { class: 'lv' }, r.level), tx);
    if (r.cat) {
      const b = el('button', { type: 'button', class: 'cat', 'aria-label': 'Black cat. Déjà vu' });
      b.innerHTML = CAT;
      b.addEventListener('click', () => exec('deja vu', { echo: false }));
      row.firstChild.append(b);
    }
    return row;
  }
  function push(r) {
    records.push(r);
    while (records.length > 200) { records.shift(); log.firstChild?.remove(); }
    ss.set('td.log', records);
    log.append(renderRec(r));
    log.scrollTop = log.scrollHeight;
    annunciate(r);
  }
  const say = (level, text, more = {}) => push({ t: formatClock(sessionClock()), level, text, ...more });
  const warn = (text) => { say('warn', text); bell(); };

  // ---------- open / close ----------
  let opener = null;
  const isOpen = () => panel.classList.contains('is-open');
  function open() {
    if (isOpen()) { input.focus(); return; }
    const a = document.activeElement;
    opener = a && a !== document.body && !panel.contains(a) ? a : termBtn;
    panel.classList.add('is-open');
    termBtn.setAttribute('aria-expanded', 'true');
    log.scrollTop = log.scrollHeight;
    input.focus({ preventScroll: true });
    paintCaret();
  }
  function close() {
    if (!isOpen()) return;
    const hadFocus = panel.contains(document.activeElement);
    panel.classList.remove('is-open');
    termBtn.setAttribute('aria-expanded', 'false');
    ss.set('td.term.open', false);
    if (hadFocus) (opener?.isConnected ? opener : termBtn).focus();
  }
  termBtn.addEventListener('click', () => isOpen() ? close() : open());
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); close(); } });
  document.addEventListener('keydown', e => {
    if (e.key !== '`' || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t === input) { e.preventDefault(); close(); return; }
    if (t.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
    e.preventDefault(); open();
  });

  // ---------- caret ----------
  let typingT;
  function paintCaret() {
    pre.textContent = input.value.slice(0, input.selectionStart ?? input.value.length);
    caret.textContent = input.value[input.selectionStart] ?? ' ';
    pre.parentNode.style.transform = `translateX(${-input.scrollLeft}px)`;
  }
  ['input', 'keyup', 'click', 'select', 'focus', 'scroll'].forEach(ev => input.addEventListener(ev, paintCaret));
  input.addEventListener('keydown', () => {
    field.classList.add('is-typing'); clearTimeout(typingT);
    typingT = setTimeout(() => field.classList.remove('is-typing'), 600);
    requestAnimationFrame(paintCaret);
  });

  // ---------- commands ----------
  const VISIBLE = [
    ['help', 'list commands'],
    ['ls programs', 'list the channels on the board'],
    ['run <slug>', 'load a program'],
    ['cat resume', 'print the résumé'],
    ['contact', 'email, LinkedIn, GitHub'],
    ['whoami', 'who is on this line'],
    ['clear', 'clear the log'],
    ['exit', 'close the terminal'],
  ];
  const visibleNames = () => [...VISIBLE.map(([n]) => n.split(' ')[0]),
    ...[...extra].filter(([, c]) => !c.hidden).map(([n]) => n)];
  const loaded = (slug) => { const s = new Set(ss.get('td.loaded', [])); s.add(slug); ss.set('td.loaded', [...s]); };

  async function lsPrograms(all) {
    const ps = await projects();
    if (all) say('info', pad('CH-00', 7) + pad('.origin', 12) + pad('unlisted', 24) + 'UNLISTED', { pre: true, dim: true });
    for (const p of ps) say('info', pad(p.ch, 7) + pad(p.slug, 12) + pad(p.name, 24) + statusOf(p).label, { pre: true });
  }

  async function run(args) {
    const slug = args[0];
    const ps = await projects();
    if (!slug) return warn('usage: run <slug> · ls programs lists them');
    const p = ps.find(x => x.slug === slug);
    if (!p) {
      const s = suggest(slug, ps.map(x => x.slug));
      return warn(`no program "${slug}"` + (s ? ` · did you mean ${s}?` : ' · ls programs lists them'));
    }
    say('info', `loading ${p.ch} ${p.name}`);
    loaded(p.slug);
    ss.set('td.term.open', true);
    await loadProgram(p.slug, { href: p.route, from: channel ?? 'board', rail: null });
  }

  function rabbit() {
    ss.set('td.rabbit', true);
    if (isBoard) {
      say('ok', 'CH-00 · unlisted channel open at the top of the board');
      document.dispatchEvent(new CustomEvent('td:rabbit'));
    } else say('ok', 'CH-00 · unlisted channel open on the board · ', { href: '/red#ch-00', linkText: '/red' });
  }

  function dejavu() {
    say('warn', 'duplicate frame · they changed something');
    ss.set('td.dejavu', 'paid');
    document.dispatchEvent(new CustomEvent('td:dejavu'));
  }

  // first word → handler(args, line). Return false when args don't match (→ unknown).
  const CORE = {
    help() {
      for (const [n, d] of VISIBLE) say('info', pad(n, 14) + d, { pre: true });
      for (const [n, c] of extra) if (!c.hidden) say('info', pad(n, 14) + (c.help ?? ''), { pre: true });
    },
    ls(a) {
      const s = a.join(' ');
      if (s === '' || s === 'programs') return lsPrograms(false);
      if (s === '-a programs' || s === '-a') return lsPrograms(true);
      warn(`ls: no such directory "${s}" · try ls programs`);
    },
    run,
    cat(a) {
      if (a.join(' ') !== 'resume') return warn(`cat: no such file "${a.join(' ')}" · try cat resume`);
      RESUME.forEach(r => say('info', r));
      say('ok', 'open ', { href: '/resume.pdf', linkText: '/resume.pdf' });
    },
    contact() {
      say('info', pad('email', 10), { pre: true, href: 'mailto:' + CONTACT.email, linkText: CONTACT.email });
      say('info', pad('linkedin', 10), { pre: true, href: CONTACT.linkedin, linkText: 'linkedin.com/in/tanmaydesai2126' });
      say('info', pad('github', 10), { pre: true, href: CONTACT.github, linkText: 'github.com/TADebugs' });
    },
    whoami() {
      const n = ss.get('td.cmds', 0), l = ss.get('td.loaded', []).length;
      say('info', `operator · session ${hhmmss(sessionClock())} · ${n} command${n === 1 ? '' : 's'} · ${l} program${l === 1 ? '' : 's'} loaded`);
      say('info', `on call: ${CONTACT.name} · ${CONTACT.city} · `, { href: 'mailto:' + CONTACT.email, linkText: CONTACT.email });
    },
    clear() { records.length = 0; ss.set('td.log', records); log.replaceChildren(); },
    exit() { close(); },
    // hidden (§4.6): never in help, completion or suggestions
    follow: a => a.join(' ') === 'white rabbit' ? rabbit() : false,
    knock: a => a.join(' ') === 'knock' ? rabbit() : false,
    deja: a => a.join(' ') === 'vu' ? dejavu() : false,
  };

  async function exec(line, { echo = true } = {}) {
    const n = norm(line);
    if (!n) return;
    if (echo) {
      if (history.at(-1) !== n) history.push(n);
      history = history.slice(-50); ss.set('td.history', history);
      ss.set('td.cmds', ss.get('td.cmds', 0) + 1);
      say('cmd', n);
    }
    const [cmd, ...args] = n.split(' ');
    try {
      const fn = CORE[cmd];
      if (fn && (await fn(args, n)) !== false) return;
      const x = extra.get(cmd);
      if (x) return await x.run(args, shell);
      const s = suggest(cmd, visibleNames());
      warn(`unknown command "${cmd}"` + (s ? ` · did you mean ${s}?` : ' · type help'));
    } catch (err) {
      say('fault', `${cmd} failed · ${err.message || err}`); bell();
    }
  }

  // ---------- input ----------
  panel.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value;
    input.value = ''; hIdx = null; paintCaret();
    exec(v);
  });

  async function complete() {
    const v = input.value.replace(/^\s+/, '');
    const parts = v.split(/\s+/);
    let pool, stem, head = '';
    if (parts.length === 1) {
      pool = visibleNames(); stem = parts[0];
    } else {
      head = parts.slice(0, -1).join(' ') + ' '; stem = parts.at(-1);
      const c = norm(parts[0]);
      pool = c === 'run' ? (await projects()).map(p => p.slug) : c === 'ls' ? ['programs'] : c === 'cat' ? ['resume'] : [];
      if (parts.length > 2) pool = [];
    }
    const hits = pool.filter(w => w.startsWith(stem.toLowerCase()));
    if (hits.length === 1) input.value = head + hits[0] + ' ';
    else if (hits.length > 1) {
      let p = hits[0];
      for (const h of hits) while (!h.startsWith(p)) p = p.slice(0, -1);
      input.value = head + p;
      say('info', hits.join('   '), { pre: true });
    } else bell();
    paintCaret();
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Tab' && !e.shiftKey && input.value.trim()) { e.preventDefault(); complete(); }
    else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      if (hIdx == null) { draft = input.value; hIdx = history.length; }
      hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx];
    } else if (e.key === 'ArrowDown' && hIdx != null) {
      e.preventDefault();
      hIdx++;
      if (hIdx >= history.length) { hIdx = null; input.value = draft; } else input.value = history[hIdx];
    } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); CORE.clear(); }
    else if (e.key === 'u' && e.ctrlKey) { e.preventDefault(); input.value = ''; }
    else return;
    const end = input.value.length; input.setSelectionRange(end, end);
  });

  // ---------- status line ----------
  const tick = () => { if (!document.hidden) clock.textContent = hhmmss(sessionClock()); };
  tick(); setInterval(tick, 1000);
  document.addEventListener('visibilitychange', tick);
  if (!isBoard) projects().then(ps => {
    const p = ps.find(x => x.slug === channel);
    if (p) loc.append(` › ${p.ch} ${p.name}`);
  }).catch(() => {});

  // ---------- déjà vu (§4.6): once per session, 45 s idle on /red ----------
  if (isBoard && !ss.get('td.dejavu')) {
    let idle;
    const arm = () => { clearTimeout(idle); if (!document.hidden) idle = setTimeout(glitch, 45000); };
    const glitch = () => {
      const last = records.at(-1);
      if (!last || ss.get('td.dejavu')) return;
      ss.set('td.dejavu', 'shown');
      push({ ...last, cat: true });
      ['pointerdown', 'keydown', 'scroll', 'visibilitychange'].forEach(ev => removeEventListener(ev, arm, true));
    };
    ['pointerdown', 'keydown', 'scroll', 'visibilitychange'].forEach(ev => addEventListener(ev, arm, { capture: true, passive: true }));
    arm();
  }

  shell = {
    log({ level, text }) { say(level, text); },
    async logTrace(trace) {
      const ps = await projects().catch(() => []);
      const p = ps.find(x => x.slug === trace.slug);
      const id = p ? `${p.ch} ${p.name}` : trace.slug;
      const failed = [];
      (function walk(s) { if (/\((failed|timeout)\)/.test(s.name)) failed.push(s.name); s.children.forEach(walk); })(trace.root);
      loaded(trace.slug);
      if (failed.length) say('warn', `${id} loaded in ${formatMs(trace.total ?? 0)} · ${failed.join(', ')}`);
      else say('ok', `${id} loaded in ${formatMs(trace.total ?? 0)}`);
    },
    register(name, cmd) {
      const n = norm(name);
      if (CORE[n] || extra.has(n) || n.includes(' ')) throw new Error(`shell.register: "${name}" collides or has spaces`);
      extra.set(n, cmd);
    },
    open, close,
  };
  if (ss.get('td.term.open')) requestAnimationFrame(open);
  return shell;
}
