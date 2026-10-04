// /red: the board (DESIGN.md §4.1–4.2, §4.6). Channels come from shared/projects.json at runtime.
import { mountShell, projects, statusOf } from '/construct/shell.js';
import { loadProgram, lampTest } from '/construct/_stub/motion.js';

const shell = mountShell({ channel: null });
const board = document.getElementById('board');
const T = ' '; // thin space before units
const u = s => `<span class="u">${s}</span>`;

// DESIGN.md §5 board readouts (v1.1). True facts only.
const READOUT = {
  'gods-eye': `5–10 timed actions / vision plan · round-trip 1–3${T}${u('s')} · press T to be seen`,
  'algolend': '3 agent modules · LendingPool on Algorand testnet · seeded demo',
  'trinity': '3 personalities · per-personality tools (config) · desktop app in progress',
  'sweet-bite': 'menu · hours · reservations · plain HTML/CSS/JS',
  'rag': 'BM25 ∥ vector → rerank → cite · Langfuse p50/p95 · RAGAS-gated CI',
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ss = {
  get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function strip(p) {
  const s = statusOf(p);
  const li = document.createElement('article');
  li.className = 'strip';
  li.id = p.slug === '.origin' ? 'ch-00' : 'ch-' + p.slug;
  li.dataset.slug = p.slug;
  li.setAttribute('aria-labelledby', li.id + '-n');
  li.innerHTML = `
    <div class="plate">
      <span class="ch">${p.ch}</span>
      <span class="state"><span class="lamp" data-lamp="${s.lamp}" aria-hidden="true"></span>${s.label}</span>
    </div>
    <div class="body">
      <h3 class="name" id="${li.id}-n">${esc(p.name)}</h3>
      ${p.oneLiner ? `<p class="one">${esc(p.oneLiner)}</p>` : ''}
      ${p.readout ?? (READOUT[p.slug] ? `<p class="readout">${READOUT[p.slug].split(' · ').map(x => `<span>${x}</span>`).join(' · ')}</p>` : '')}
    </div>
    <div class="ctl">
      ${p.route ? `<a class="btn" href="${esc(p.route)}" data-load>Load<span class="vh"> ${esc(p.name)}</span></a>` : ''}
      ${p.repo ? `<a class="src" href="${esc(p.repo)}">Source<span class="vh"> for ${esc(p.name)}</span></a>` : ''}
    </div>
    <div class="rail" aria-hidden="true"></div>`;
  const load = li.querySelector('[data-load]');
  load?.addEventListener('click', e => {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab etc: let the browser have it
    e.preventDefault();
    shell.log({ level: 'info', text: `loading ${p.ch} ${p.name}` });
    try { const l = new Set(JSON.parse(sessionStorage.getItem('td.loaded')) ?? []); l.add(p.slug); sessionStorage.setItem('td.loaded', JSON.stringify([...l])); } catch {}
    loadProgram(p.slug, { href: p.route, from: 'board', rail: li.querySelector('.rail') });
  });
  return li;
}

// CH-00 · unlisted: the origin channel (white rabbit, §4.6). CV facts only.
const ORIGIN = {
  slug: '.origin', ch: 'CH-00', name: 'Origin', status: 'unlisted', route: null, repo: null,
  readout: `<p class="readout">2023–24 · Golden Gate University, San Francisco</p>
    <ul class="origin">
      <li>Vice President and Software Development Lead, SCI-TECH Club. Organized coding competitions and hackathon-style STEM contests, mentored junior students, led discussions on AI algorithms and mathematical modeling.</li>
      <li>Associate's in Computer Science, GPA 3.9. Before Northeastern, before the board.</li>
    </ul>`,
};
const originStatus = { lamp: 'inactive', label: 'UNLISTED' };

function flag(el) {
  if (!el) return;
  el.classList.remove('is-flag'); void el.offsetWidth;
  el.classList.add('is-flag');
  el.scrollIntoView({ block: 'nearest' });
  setTimeout(() => el.classList.remove('is-flag'), 2000);
}

function showOrigin(focus) {
  let el = document.getElementById('ch-00');
  if (!el) {
    el = strip({ ...ORIGIN });
    el.querySelector('.state').innerHTML = `<span class="lamp" data-lamp="${originStatus.lamp}" aria-hidden="true"></span>${originStatus.label}`;
    el.classList.add('is-origin');
    board.prepend(el);
  }
  if (focus) flag(el);
}

// "the strip whose status changed most recently": vs. this visitor's last look at the board,
// else an explicit statusChangedAt in projects.json, else the newest channel (file order is append order).
let changed = null;

try {
  const ps = await projects();
  board.replaceChildren(...ps.map(strip));
  document.getElementById('board-n').textContent = `${ps.length} channels`;

  let seen = null;
  try { seen = JSON.parse(localStorage.getItem('td.seen')); } catch {}
  const diff = seen ? ps.filter(p => seen[p.slug] && seen[p.slug] !== p.status) : [];
  changed = diff[0]
    ?? [...ps].filter(p => p.statusChangedAt).sort((a, b) => a.statusChangedAt < b.statusChangedAt ? 1 : -1)[0]
    ?? ps.at(-1);
  try { localStorage.setItem('td.seen', JSON.stringify(Object.fromEntries(ps.map(p => [p.slug, p.status])))); } catch {}

  shell.log({ level: 'ok', text: `board up · ${ps.length} channels` });
} catch (err) {
  board.innerHTML = `<p class="board-msg"><span class="lamp" data-lamp="inactive" aria-hidden="true"></span> board offline · projects.json unreachable. Everything is on the <a href="/blue">plain version</a>.</p>`;
  shell.log({ level: 'fault', text: 'board offline · projects.json unreachable' });
}

if (ss.get('td.rabbit')) showOrigin(location.hash === '#ch-00');
document.addEventListener('td:rabbit', () => showOrigin(true));
document.addEventListener('td:dejavu', () => flag(changed && document.getElementById('ch-' + changed.slug)));

// Lamp test once per session on arrival from the gate (§8).
let fromGate = null;
try { fromGate = sessionStorage.getItem('td.from-gate'); sessionStorage.removeItem('td.from-gate'); } catch {}
if (fromGate) lampTest(document);
