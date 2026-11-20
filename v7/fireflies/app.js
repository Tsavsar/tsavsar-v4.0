/* Catch up: iOS prototype.
   Vanilla JS. Springs are hand-rolled so every gesture hands its release velocity to the animation. */
(() => {
'use strict';

const D = window.DATA;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const root = document.documentElement;
const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
const reduce = () => reduceMQ.matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let S = 1; // device scale on desktop, so pointer deltas can be converted back to screen points

/* ---------- Physics ---------- */

// Apple's rubber band: resistance grows the further past the edge you drag.
const rubber = (o, dim = 400, c = .55) => (o * dim * c) / (dim + c * Math.abs(o));
// Where a flick would come to rest if it decelerated like a scroll view.
const project = (v, rate = .998) => (v / 1000) * rate / (1 - rate);

// precision: how close counts as settled, in the animated value's own units (px by default; tiny for 0..1 progress).
function spring({ from, to, velocity = 0, response = .4, damping = 1, precision = .12, onUpdate, onDone }) {
  if (reduce()) { onUpdate(to, 0); if (onDone) onDone(); return { stop() {}, get v() { return 0; } }; }
  const w = 2 * Math.PI / response, k = w * w, c = 2 * damping * w;
  let x = from, v = velocity, raf = 0, last = 0, dead = false;
  const step = (t) => {
    if (dead) return;
    if (!last) last = t;
    const dt = Math.min((t - last) / 1000, 1 / 20); last = t;
    const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) { const a = -k * (x - to) - c * v; v += a * h; x += v * h; }
    if (Math.abs(x - to) < precision && Math.abs(v) < precision * 25) { onUpdate(to, 0); if (onDone) onDone(); return; }
    onUpdate(x, v);
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return { stop() { dead = true; cancelAnimationFrame(raf); }, get v() { return v; } };
}

/* ---------- Icons (stroke set, one weight) ---------- */

const PATH = {
  meeting: '<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
  slack: '<path d="M9.6 4 8 20M16 4l-1.6 16M4.5 9h16M3.5 15h16"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="3.2"/><path d="m4.5 8 7.5 5.6L19.5 8"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="3.6"/><path d="M3.5 10h17M8 3.4v3M16 3.4v3"/>',
  check: '<path d="m5 12.8 4.4 4.4L19 7.4"/>',
  clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.2 2"/>',
  chevR: '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
  chevL: '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
  chevD: '<path d="m5.5 9.5 6.5 6.5 6.5-6.5"/>',
  chevU: '<path d="m5.5 14.5 6.5-6.5 6.5 6.5"/>',
  x: '<path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"/>',
  dots: '<path d="M5.5 12h.01M12 12h.01M18.5 12h.01"/>',
  arrowUp: '<path d="M12 19V5.5M6 11l6-6 6 6"/>',
  arrowUR: '<path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"/>',
  video: '<rect x="3" y="6.5" width="12.5" height="11" rx="3"/><path d="m15.5 11 5-3v8l-5-3"/>',
  list: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  eye: '<path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  minus: '<circle cx="12" cy="12" r="8.6"/><path d="M8 12h8"/>',
  circleCheck: '<circle cx="12" cy="12" r="8.6"/><path d="m8.2 12.4 2.6 2.6 5-5.4"/>',
  slip: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.6V12l3 1.8"/>',
  hourglass: '<path d="M7 3.5h10M7 20.5h10M8 3.5v3.2c0 1.6 1 2.8 4 5.3 3-2.5 4-3.7 4-5.3V3.5M8 20.5v-3.2c0-1.6 1-2.8 4-5.3 3 2.5 4 3.7 4 5.3v3.2"/>',
  send: '<path d="M20.5 3.5 10.6 13.4M20.5 3.5l-6.2 17-3.7-7.1-7.1-3.7 17-6.2Z"/>',
  question: '<path d="M9.2 9.2a2.9 2.9 0 1 1 4.2 2.6c-.9.5-1.4 1.1-1.4 2.1v.6M12 18.2v.1"/>',
  image: '<rect x="4" y="5" width="16" height="14" rx="3.2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.6-4.4a1.6 1.6 0 0 1 2.2 0L20 19"/>'
};
const FILL = {
  sparkle: '<path d="M10.5 3.2c.3-.9 1.7-.9 2 0l1.5 4.4a4 4 0 0 0 2.5 2.5l4.4 1.5c.9.3.9 1.7 0 2l-4.4 1.5a4 4 0 0 0-2.5 2.5l-1.5 4.4c-.3.9-1.7.9-2 0L9 17.6a4 4 0 0 0-2.5-2.5l-4.4-1.5c-.9-.3-.9-1.7 0-2L6.5 10a4 4 0 0 0 2.5-2.5z"/>',
  play: '<path d="M8 5.6v12.8c0 .8.9 1.3 1.6.8l9.4-6.4c.6-.4.6-1.2 0-1.6L9.6 4.8C8.9 4.3 8 4.8 8 5.6Z"/>',
  pause: '<rect x="6.5" y="5" width="3.8" height="14" rx="1.4"/><rect x="13.7" y="5" width="3.8" height="14" rx="1.4"/>'
};
/* Integration marks, supplied by Shater (selfh.st, Devicon and Lineicons sets): Gmail, Slack, ClickUp and GitHub. Each sits in a round container. */
const LOGO = {
  mail: { vb: '0 0 512 512', body: '<path fill="#4285f4" d="M34.9 448h81.5V250.2L0 163v250.2C0 432.5 15.7 448 34.9 448"/><path fill="#34a853" d="M395.6 448h81.5c19.3 0 34.9-15.7 34.9-34.9V163l-116.4 87.3"/><path fill="#fbbc04" d="M395.6 99v151.3L512 163v-46.5c0-43.2-49.3-67.8-83.8-41.9"/><path fill="#ea4335" d="M116.4 250.2V99L256 203.7L395.6 99v151.3L256 355"/><path fill="#c5221f" d="M0 116.4V163l116.4 87.3V99L83.8 74.5C49.2 48.6 0 73.2 0 116.4"/>' },
  slack: { vb: '0 0 128 128', body: '<path fill="#de1c59" d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317S.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317c-7.33 0-13.317-5.987-13.317-13.317zm0 0"/><path fill="#35c5f0" d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309S39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0"/><path fill="#2eb57d" d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317s13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0"/><path fill="#ebb02e" d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309s-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317c0 7.33-5.987 13.317-13.317 13.317zm0 0"/>' },
  clickup: { vb: '0 0 24 24', body: '<path fill="currentColor" fill-rule="evenodd" d="m3.672 17.38l3.07-2.37c1.641 2.127 3.374 3.13 5.289 3.13s3.617-.973 5.167-3.1l3.13 2.31C18.08 20.39 15.283 22 12.031 22c-3.222 0-6.05-1.61-8.36-4.62m8.177-10.243l-5.471 4.711L3.854 8.9L11.848 2l7.964 6.9l-2.553 2.918z" clip-rule="evenodd"/>' },
  github: { vb: '0 0 512 512', body: '<path fill="#fff" fill-rule="evenodd" d="M256 6.3C114.6 6.3 0 120.9 0 262.3c0 113.3 73.3 209 175 242.9c12.8 2.2 17.6-5.4 17.6-12.2c0-6.1-.3-26.2-.3-47.7c-64.3 11.8-81-15.7-86.1-30.1c-2.9-7.4-15.4-30.1-26.2-36.2c-9-4.8-21.8-16.6-.3-17c20.2-.3 34.6 18.6 39.4 26.2c23 38.7 59.8 27.8 74.6 21.1c2.2-16.6 9-27.8 16.3-34.2c-57-6.4-116.5-28.5-116.5-126.4c0-27.8 9.9-50.9 26.2-68.8c-2.6-6.4-11.5-32.6 2.6-67.8c0 0 21.4-6.7 70.4 26.2c20.5-5.8 42.2-8.6 64-8.6s43.5 2.9 64 8.6c49-33.3 70.4-26.2 70.4-26.2c14.1 35.2 5.1 61.4 2.6 67.8c16.3 17.9 26.2 40.6 26.2 68.8c0 98.2-59.8 120-116.8 126.4c9.3 8 17.3 23.4 17.3 47.4c0 34.2-.3 61.8-.3 70.4c0 6.7 4.8 14.7 17.6 12.2C438.7 471.3 512 375.3 512 262.3c0-141.4-114.6-256-256-256"/>' }
};
// A source mark: the integration's logo when there is one, otherwise the line icon.
function srcIc(s, size) {
  const L = LOGO[s]; if (!L) return ic(s, size);
  return `<svg width="${size}" height="${size}" viewBox="${L.vb}" aria-hidden="true">${L.body}</svg>`;
}
function ic(name, size = 20, sw = 1.8) {
  if (FILL[name]) return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${FILL[name]}</svg>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATH[name]}</svg>`;
}
const SRC_WORD = { meeting: 'a meeting', slack: 'Slack', mail: 'email', calendar: 'your calendar', github: 'GitHub', clickup: 'ClickUp' };
function srcStack(list) {
  const names = list.map((s) => SRC_WORD[s]);
  const label = 'From ' + (names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0]);
  return `<span class="srcs" role="img" aria-label="${label}">${list.map((s) => `<span class="src" data-s="${s}">${srcIc(s, 13)}</span>`).join('')}</span>`;
}
/* Mock portraits of fictional, generated people (@protoyard/avatars, MIT) with initials as the fallback. */
const FACES = ['priya', 'tomas', 'sam', 'lena', 'noor', 'maya'];
const face = (id, initials) => (FACES.includes(id) ? `<img src="/fireflies/avatars/${id}.webp" alt="" width="42" height="42" decoding="async">` : initials);
const KIND_ICON = { decision: 'circleCheck', commit: 'calendar', choice: 'image' };
const STATUS_ICON = { ok: 'circleCheck', slip: 'slip', watch: 'eye' };

/* ---------- State ---------- */

const state = {};
function resetState() {
  state.status = {}; state.info = {};
  D.items.forEach((i) => { state.status[i.id] = 'open'; });
  state.openProj = new Set(); state.waitOpen = false;
  state.hinted = false; state.interacted = false;
  state.choice = { android: 'approve', state: 'B' };
  state.toggles = { cal: true, note: true };
  state.drafts = { approve: D.items[0].drafts.approve, changes: D.items[0].drafts.changes };
  state.snoozeLabel = null;
}
resetState();
const item = (id) => D.items.find((i) => i.id === id);
const openItems = () => D.items.filter((i) => state.status[i.id] === 'open');
const snoozedItems = () => D.items.filter((i) => state.status[i.id] === 'snoozed');
const NUM = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

function verdictFor() {
  const open = openItems(), snz = snoozedItems();
  if (!open.length) {
    if (snz.length) return { a: 'Nothing needs you now.', b: `${snz.length === 1 ? 'One item returns' : snz.length + ' items return'} at ${state.snoozeLabel}.` };
    return { a: 'You’re caught up.', b: 'Nothing else needs you before Product sync.' };
  }
  const n = open.length, top = open[0];
  // The headline mirrors the layout: how many, and how many of them are urgent (the one in focus).
  const urgent = open.filter((i) => i.level === 3).length;
  const a = n === 1 ? 'One thing left.'
    : urgent ? `${NUM[n]} things, ${urgent === 1 ? 'one' : NUM[urgent].toLowerCase()} urgent.`
    : `${NUM[n]} things left, nothing urgent.`;
  return { a, b: n === 1 ? top.leadSingle : top.lead };
}

/* ---------- Home ---------- */

const content = $('#content'), scroller = $('#scroll');

// Urgency as a word, not just a colour: due within hours, due today, or no deadline.
const URGENCY = { 3: 'Urgent', 2: 'Today', 1: 'No rush' };
const FOCUS_CTA = { decision: 'Review and approve', commit: 'Send the deck', choice: 'Pick one' };
function rowHTML(it) {
  return `<div class="row-wrap" data-id="${it.id}"><div class="row-clip">
    <div class="row-actions">
      <button type="button" class="later" data-act="later" tabindex="-1" aria-label="Snooze: ${esc(it.title)}">${ic('clock', 22, 2)}<span>Later</span></button>
      <button type="button" class="done" data-act="done" tabindex="-1" aria-label="Done: ${esc(it.title)}">${ic('check', 22, 2.3)}<span>Done</span></button>
    </div>
    <div class="row" role="button" tabindex="0" data-id="${it.id}" data-lvl="${it.level}">
      <span class="row-glow"><span class="glow" data-lvl="${it.level}"></span><span class="row-tile" data-lvl="${it.level}" data-hue="${it.hue}" title="${it.who}: ${it.actLabel}" aria-hidden="true">${face(it.av, it.initials)}<i class="who-act" data-act="${it.act}">${ic(it.act, 11, 2.4)}</i></span></span>
      <div>
        <h3 class="row-title">${it.title}</h3>
        <span class="u-tag" data-lvl="${it.level}">${URGENCY[it.level]}</span>
        <p class="row-sub">${it.sub}</p>
        <div class="row-meta">${srcStack(it.sources)}<span class="due" data-lvl="${it.level}">${it.due}</span></div>
        <span class="row-go" aria-hidden="true"><span>${FOCUS_CTA[it.kind]}</span><span class="go-due">${it.level > 1 ? it.due : ''}</span></span>
      </div>
      <span class="row-due">${it.dueShort || it.due}</span>
    </div>
  </div></div>`;
}

function projHTML(p) {
  return `<div class="proj" data-id="${p.id}" data-open="false">
    <button type="button" class="proj-head" aria-expanded="false" aria-controls="pb-${p.id}">
      <span class="proj-main">
        <span class="proj-top"><span class="proj-name">${p.name}</span><span class="status" data-s="${p.status}">${ic(STATUS_ICON[p.status], 14, 2)}${p.statusLabel}</span></span>
        <span class="proj-line">${p.line}</span>
      </span>
      <span class="chev">${ic('chevD', 16, 2.2)}</span>
    </button>
    <div class="proj-body" id="pb-${p.id}"><div class="proj-clip"><div class="proj-inner">
      ${p.bullets.map((b) => `<div class="bul"><time>${b.t}</time><span>${b.text}</span><span class="src" data-s="${b.src}">${srcIc(b.src, 11)}</span></div>`).join('')}
      <div class="proj-cta" data-link="${p.link || ''}"></div>
    </div></div></div>
  </div>`;
}

function homeHTML() {
  const w = D.wait;
  // One question answered at the top, one thing in focus, everything else quiet and one tap away.
  return `
  <div class="ambient" id="ambient"></div>
  <section class="hero">
    <p class="dateline rise" style="--i:0"><span>Hey Maya, you were away ${D.away}.</span></p>
    <h1 class="verdict rise" style="--i:1" id="verdict"></h1>
  </section>

  <div class="panel">
  <button type="button" class="panel-grab" aria-label="Expand the list"><i></i></button>
  <section class="block rise" style="--i:2" id="needs">
    <div class="group" id="needsGroup">
      ${D.items.map(rowHTML).join('')}
      <div class="clear-wrap" id="clearWrap"><div class="clear-clip"><div class="clear" id="clear"></div></div></div>
    </div>
    <p class="caption" id="caption"></p>
  </section>

  <section class="block can-wait rise" style="--i:3">
    <h2 class="later-h">Can wait</h2>
    <div class="later-group">
      <div id="moved" data-open="false">
        <button type="button" class="wait-head" id="movedHead" aria-expanded="false" aria-controls="movedBody">
          <span class="grow"><span class="n">${D.projects.length}</span> projects moved</span>
          <span class="chev">${ic('chevD', 16, 2.2)}</span>
        </button>
        <div class="wait-body" id="movedBody"><div class="wait-clip"><div class="group">${D.projects.map(projHTML).join('')}</div></div></div>
      </div>
      <div id="wait" data-open="false">
        <button type="button" class="wait-head" id="waitHead" aria-expanded="false" aria-controls="waitBody">
          <span class="grow"><span class="n">${w.count}</span> updates that don’t need you</span>
          <span class="chev">${ic('chevD', 16, 2.2)}</span>
        </button>
        <div class="wait-body" id="waitBody"><div class="wait-clip">
          <div class="wait-list">
            ${w.rows.map((r) => `<div class="wl"><span class="src" data-s="${r.src}">${srcIc(r.src, 13)}</span><span>${r.text}${r.tag ? `<span class="tag">${r.tag}</span>` : ''}</span><time>${r.t}</time></div>`).join('')}
            <div class="wl wl-more"><span class="src" data-s="more">${ic('dots', 18, 3)}</span><span>${w.more} more</span><time></time></div>
          </div>
          <p class="wait-rule">${w.rule}</p>
        </div></div>
      </div>
    </div>
  </section>

  <p class="foot rise" style="--i:4">That’s everything since ${D.since}.<a class="foot-notes" href="/fireflies/details">Design notes</a></p>
  </div>`;
}

function capsuleHTML() {
  const m = D.meeting;
  return `<span class="cap-main"><b>${m.title}</b><span>in ${m.inMin} min</span></span><span class="cap-go">${ic('chevU', 16, 2.4)}</span><span class="cap-badge" id="capBadge" hidden></span>`;
}

const WORD = ['No', 'One', 'Two', 'Three', 'Four', 'Five'];
const jump = (to, text) => `<button type="button" class="hl" data-jump="${to}">${text}</button>`;
function overviewFor() {
  const open = openItems(), snz = snoozedItems();
  const done = D.items.filter((i) => state.status[i.id] === 'done' || state.status[i.id] === 'dismissed').length;
  const proj = jump('moved', `${D.projects.length} projects`), wait = jump('wait', `${D.wait.count} updates`);
  if (!open.length) {
    if (snz.length) return `Nothing needs you now. ${jump('needs', snz.length === 1 ? 'One item' : snz.length + ' items')} ${snz.length === 1 ? 'comes' : 'come'} back at ${state.snoozeLabel}, ${proj} moved and ${wait} can wait.`;
    return `You’re caught up. You cleared ${jump('needs', `${done} ${done === 1 ? 'thing' : 'things'}`)}, ${proj} moved and ${wait} can wait.`;
  }
  const n = open.length, top = open[0];
  return `${jump('needs', `${WORD[n] || n} ${n === 1 ? 'thing needs' : 'things need'} you`)}. ${top.lead} ${proj} moved and ${wait} can wait.`;
}
let overviewKey = '';
function swapOverview(first) {
  const html = overviewFor(); if (html === overviewKey) return; overviewKey = html;
  const el = $('#overview'); if (!el) return;
  if (first || reduce()) { el.innerHTML = html; return; }
  el.classList.add('out');
  setTimeout(() => { if (overviewKey !== html) return; el.innerHTML = html; requestAnimationFrame(() => el.classList.remove('out')); }, 200);
}
content.addEventListener('click', (e) => {
  const j = e.target.closest('[data-jump]'); if (!j) return;
  e.stopPropagation();
  const t = $('#' + j.dataset.jump); if (!t) return;
  if (j.dataset.jump === 'wait' && t.dataset.open !== 'true') $('#waitHead').click();
  scroller.scrollTo({ top: Math.max(0, t.offsetTop - 70), behavior: reduce() ? 'auto' : 'smooth' });
}, true);

let verdictKey = '';
function swapVerdict(v, first) {
  const key = v.a + '|' + v.b;
  if (key === verdictKey) return;
  verdictKey = key;
  const el = $('#verdict'); if (!el) return;
  const html = `<span class="a swap">${v.a}</span> <span class="b swap">${v.b}</span>`;
  if (first || reduce()) { el.innerHTML = html; return; }
  $$('.swap', el).forEach((s) => s.classList.add('out'));
  setTimeout(() => {
    if (verdictKey !== key) return;
    el.innerHTML = html;
    const spans = $$('.swap', el); spans.forEach((s) => s.classList.add('out'));
    requestAnimationFrame(() => requestAnimationFrame(() => spans.forEach((s) => s.classList.remove('out'))));
  }, 190);
}

function captionText() {
  const open = openItems();
  if (!open.length) return '';
  const done = D.items.filter((i) => state.status[i.id] === 'done').length;
  const dis = D.items.filter((i) => state.status[i.id] === 'dismissed').length;
  const snz = snoozedItems();
  const parts = [];
  if (done + dis) parts.push(`${done + dis} handled`);
  if (snz.length) parts.push(`${snz.length} snoozed until ${state.snoozeLabel}`);
  return parts.join(', ');
}

function clearHTML() {
  const done = D.items.filter((i) => state.status[i.id] === 'done');
  const snz = snoozedItems();
  const title = done.length ? 'What you handled' : 'What’s coming back';
  const lis = [
    ...done.map((i) => `<li>${ic('check', 16, 2.4)}<span><b>${i.title}</b>${state.info[i.id].how || 'Done'}</span></li>`),
    ...snz.map((i) => `<li class="snz">${ic('clock', 16, 2.2)}<span><b>${i.title}</b>Back at ${state.snoozeLabel}</span></li>`)
  ];
  return `<div class="clear-top"><span class="unlit"></span><h3>${title}</h3></div>${lis.length ? `<ul class="handled">${lis.join('')}</ul>` : ''}`;
}

const LINK_LABEL = { android: 'Review the Android sign-off', deck: 'Send the revised deck' };
function projCta(el) {
  const id = el.dataset.link; if (!id) { el.remove(); return; }
  const st = state.status[id], it = item(id);
  let html = '';
  if (st === 'open') html = `<button type="button" class="proj-link" data-open-item="${id}"><span class="glow" data-lvl="${it.level}"></span><span class="grow">${LINK_LABEL[id]}</span>${ic('chevR', 16, 2.2)}</button>`;
  else if (st === 'done') html = `<div class="proj-link is-done"><span class="ok" style="color:var(--done)">${ic('check', 16, 2.4)}</span><span class="grow">${state.info[id].how}</span></div>`;
  else if (st === 'snoozed') html = `<div class="proj-link is-done">${ic('clock', 16, 2)}<span class="grow">Snoozed until ${state.snoozeLabel}</span></div>`;
  if (el.innerHTML !== html) el.innerHTML = html;
}

function update(first) {
  const open = openItems();
  swapVerdict(verdictFor(), first);
  swapOverview(first);
  const count = $('#count');
  if (count) count.innerHTML = open.length ? String(open.length) : ic('check', 13, 2.6);
  const navTitle = $('#navTitle');
  if (navTitle) navTitle.innerHTML = open.length ? `<span>${open.length} ${open.length === 1 ? 'task' : 'tasks'}</span>` : '<span>All clear</span>';
  const amb = $('#ambient');
  if (amb) amb.style.setProperty('--amb', open.length ? ({ 1: .45, 2: .72, 3: 1 })[Math.max(...open.map((i) => i.level))] : 0);
  const cap = $('#caption'); if (cap) cap.textContent = captionText();
  const lead = open[0];
  $$('.row-wrap').forEach((w) => w.classList.toggle('is-focus', !!lead && w.dataset.id === lead.id));
  // The rest read as one grouped list: round only its ends.
  const quiet = open.slice(1).map((i) => i.id);
  $$('.row-wrap').forEach((w) => { const k = quiet.indexOf(w.dataset.id); w.classList.toggle('q-first', k === 0); w.classList.toggle('q-last', k > -1 && k === quiet.length - 1); });
  const cw = $('#clearWrap');
  if (cw) {
    cw.classList.toggle('on', open.length === 0);
    if (open.length === 0) $('#clear').innerHTML = clearHTML();
  }
  const badge = $('#capBadge');
  if (badge && !badge.hidden) {
    const need = D.items.some((i) => i.meeting === 'sync' && state.status[i.id] === 'open');
    badge.innerHTML = need ? `<span class="glow" data-lvl="3"></span>` : '';
  }
  $$('.proj-cta').forEach(projCta);
  if (sh.detent !== 'closed' && sh.view && sh.view.type === 'prep') refreshPrep();
}

/* ---------- Swipe rows ---------- */

const AW = 168;
const openRows = new Set();

function bindRow(wrap) {
  const id = wrap.dataset.id, row = $('.row', wrap), act = $('.row-actions', wrap);
  let x = 0, sp = null, st = null, moved = false;
  const W = () => wrap.offsetWidth;
  const setX = (v) => {
    x = v;
    row.style.transform = v ? `translate3d(${v}px,0,0)` : '';
    act.style.width = Math.max(0, -v) + 'px';
    act.classList.toggle('commit', -v > W() * .6);
  };
  const to = (t, vel = 0, o = {}) => {
    if (sp) sp.stop();
    sp = spring({ from: x, to: t, velocity: vel, response: o.response || .36, damping: o.damping || .88, onUpdate: setX, onDone: o.onDone });
  };
  const setFocusable = (on) => $$('button', act).forEach((b) => { b.tabIndex = on ? 0 : -1; });
  wrap._setX = setX;
  wrap._close = (vel = 0) => { if (x !== 0) to(0, vel, { damping: 1 }); openRows.delete(wrap); setFocusable(false); };
  wrap._peek = () => { to(-48, 0, { response: .5, damping: .82 }); setTimeout(() => { if (!st) to(0, 0, { response: .5, damping: 1 }); }, 1100); };

  row.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    if (sp) sp.stop();
    moved = false;
    st = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: x, lock: null, base: 0, samples: [{ x: e.clientX, t: e.timeStamp }] };
  });
  row.addEventListener('pointermove', (e) => {
    if (!st || e.pointerId !== st.id) return;
    const dx = (e.clientX - st.x) / S, dy = (e.clientY - st.y) / S;
    if (st.lock === null) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.25) {
        st.lock = 'h'; st.base = dx; moved = true;
        try { row.setPointerCapture(e.pointerId); } catch (_) {}
        openRows.forEach((w) => { if (w !== wrap) w._close(); });
        markInteracted();
      } else if (Math.abs(dy) > 8) { st = null; return; }
      else return;
    }
    st.samples.push({ x: e.clientX, t: e.timeStamp }); if (st.samples.length > 6) st.samples.shift();
    let nx = st.x0 + (dx - st.base);
    if (nx > 0) nx = rubber(nx, 200);
    if (nx < -W()) nx = -W() - rubber(-nx - W(), 200);
    setX(nx);
  });
  const end = (e) => {
    if (!st || (e && e.pointerId !== st.id)) return;
    const s = st; st = null;
    if (s.lock !== 'h') return;
    const a = s.samples[Math.max(0, s.samples.length - 4)], b = s.samples[s.samples.length - 1];
    const vel = (b.x - a.x) / Math.max(1, b.t - a.t) * 1000 / S;
    const w = W();
    if (-x > w * .58 || (vel < -1100 && -x > 60)) { finish('done', vel); return; }
    if (x + project(vel, .992) < -AW * .5) { to(-AW, vel); openRows.add(wrap); setFocusable(true); }
    else wrap._close(vel);
  };
  row.addEventListener('pointerup', end);
  row.addEventListener('pointercancel', end);

  function finish(kind, vel = 0) {
    to(-W(), vel - 600, {
      response: .28, damping: 1,
      onDone: () => {
        if (kind === 'done') { resolveItem(id, 'done', { how: 'Marked done' }); toast('Marked done.', () => undoItem(id)); }
        else { const u = snoozeUntil('hour'); resolveItem(id, 'snoozed', { until: u }); toast(`Snoozed until ${u}.`, () => undoItem(id)); }
      }
    });
  }
  act.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    markInteracted();
    finish(b.dataset.act === 'done' ? 'done' : 'later');
  });
  row.addEventListener('click', () => {
    if (moved) { moved = false; return; }
    if (x < -4) { wrap._close(); return; }
    markInteracted();
    openSheet({ type: 'item', id, medium: .76 }, row);
  });
  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
  });
}

document.addEventListener('pointerdown', (e) => {
  openRows.forEach((w) => { if (!w.contains(e.target)) w._close(); });
}, true);

function markInteracted() {
  state.interacted = true;
  if (!state.hinted) { state.hinted = true; const cap = $('#caption'); if (cap) cap.style.opacity = 0; setTimeout(() => { update(); const c = $('#caption'); if (c) c.style.opacity = 1; }, 300); }
}

function snoozeUntil(kind) {
  const u = { hour: '1:48 PM', afternoon: '3:30 PM', tomorrow: 'tomorrow at 9:00 AM' }[kind];
  state.snoozeLabel = u; return u;
}

function resolveItem(id, status, info) {
  state.status[id] = status; state.info[id] = info || {};
  const wrap = $(`.row-wrap[data-id="${id}"]`);
  if (wrap) { wrap.classList.add('gone'); wrap.inert = true; openRows.delete(wrap); }
  update();
}
function undoItem(id) {
  state.status[id] = 'open'; delete state.info[id];
  const wrap = $(`.row-wrap[data-id="${id}"]`);
  if (wrap) { wrap._setX(0); wrap.classList.remove('gone'); wrap.inert = false; }
  if (!snoozedItems().length) state.snoozeLabel = null;
  update();
}

/* ---------- Toast ---------- */

const toastEl = $('#toast');
let toastTimer = 0;
function toast(msg, undo, ms = 6000) {
  clearTimeout(toastTimer);
  toastEl.classList.toggle('top', sh.el.classList.contains('open') && !sh.closing);
  toastEl.innerHTML = `<div class="toast-pill"><span>${msg}</span>${undo ? '<button type="button">Undo</button>' : ''}</div>`;
  const pill = $('.toast-pill', toastEl);
  if (undo) $('button', pill).addEventListener('click', () => { undo(); hideToast(); });
  toastTimer = setTimeout(hideToast, ms);
}
function hideToast() {
  const pill = $('.toast-pill', toastEl); if (!pill) return;
  pill.classList.add('out');
  setTimeout(() => { if (pill.isConnected) pill.remove(); }, 220);
}

/* ---------- Sheet ---------- */

const screenEl = $('#screen');
const sh = {
  el: $('#sheet'), head: $('#sheetHead'), body: $('#sheetBody'), foot: $('#sheetFoot'), grab: $('#sheetGrab'),
  scrim: $('#scrim'), app: $('#app'),
  y: 0, H: 0, yMed: 0, detent: 'closed', closing: false, view: null, sp: null, opener: null, dragEnd: 0
};

function measure() {
  // Like a Vaul drawer, a sheet is only as tall as its content, up to full height. Ask stays tall: its thread grows.
  sh.el.style.top = '';
  const screenH = screenEl.clientHeight;
  let top = parseFloat(getComputedStyle(sh.el).top) || 0;
  if (sh.view && sh.view.type !== 'ask') {
    const footOverlap = parseFloat(getComputedStyle(sh.foot).marginTop) || 0;
    sh.body.style.flex = 'none'; const bodyH = sh.body.scrollHeight; sh.body.style.flex = ''; // its natural height, not the stretched one
    const natural = Math.ceil(sh.grab.offsetHeight + sh.head.offsetHeight + bodyH + sh.foot.offsetHeight + footOverlap);
    if (natural < screenH - top) { top = screenH - natural; sh.el.style.top = top + 'px'; }
  }
  sh.H = screenH - top;
  const med = sh.view && sh.view.detents && sh.view.detents.length === 1 ? 1 : ((sh.view && sh.view.medium) || .7);
  sh.yMed = Math.max(0, sh.H - Math.min(sh.H, med * screenEl.clientHeight));
}
function setY(y) {
  sh.y = y;
  sh.el.style.transform = `translate3d(0,${y}px,0)`;
  const vis = clamp((sh.H - y) / Math.max(1, sh.H - Math.max(sh.yMed, sh.H * .2)), 0, 1);
  sh.scrim.style.opacity = (.38 * vis).toFixed(3);
  const ref = sh.yMed > 0 ? sh.yMed : sh.H * .35;
  if (!mo) setAppBack(clamp((ref - y) / ref, 0, 1));
  sh.foot.style.transform = `translate3d(0,${-clamp(y, 0, sh.yMed)}px,0)`;
}
// The app behind a sheet: pushed back and rounded, in step with the sheet (t = 0 resting, 1 fully behind).
function setAppBack(t) {
  sh.app.style.transform = t > 0 ? `translate3d(0,${(t * 10).toFixed(2)}px,0) scale(${(1 - .065 * t).toFixed(4)})` : '';
  sh.app.style.borderRadius = (t * 34).toFixed(1) + 'px';
}
function setDetent(d) {
  sh.detent = d;
  sh.el.classList.toggle('at-medium', d === 'medium');
  if (d === 'medium') { sh.body.scrollTop = 0; sh.body.classList.remove('scrolled'); }
}
function springSheet(to, vel = 0, o = {}) {
  if (sh.sp) sh.sp.stop();
  sh.sp = spring({ from: sh.y, to, velocity: vel, response: o.response || .42, damping: o.damping || 1, onUpdate: setY, onDone: o.onDone });
}
function openSheet(view, opener) {
  if (sh.detent !== 'closed' && !sh.closing) return;
  hideToast();
  // One resting height, like a Vaul drawer: the sheet opens as one piece and is dragged down to dismiss.
  view.detents = view.detents || ['large'];
  sh.view = view; sh.opener = opener || document.activeElement; sh.closing = false;
  renderView(view);
  measure();
  sh.el.classList.add('open'); sh.scrim.classList.add('on'); sh.app.inert = true;
  const start = view.start === 'large' || view.detents.length === 1 ? 'large' : 'medium';
  setDetent(start);
  { setY(sh.H); springSheet(start === 'large' ? 0 : sh.yMed, 0, { response: .46, damping: 1 }); }
  setTimeout(() => { try { sh.el.focus({ preventScroll: true }); } catch (_) {} }, 60);
}
function closeSheet(after, fromDrag) {
  if (sh.detent === 'closed' && !sh.closing) { if (after) after(); return; }
  sh.closing = true; sh.detent = 'closed';
  const menu = $('#menu'); if (menu) menu.classList.remove('on');
  const done = () => {
    sh.el.classList.remove('open', 'at-medium'); sh.scrim.classList.remove('on'); sh.app.inert = false; sh.closing = false;
    sh.app.style.transform = ''; sh.app.style.borderRadius = '';
    sh.view = null; capEl.style.opacity = '';
    if (sh.opener && sh.opener.isConnected) { try { sh.opener.focus({ preventScroll: true }); } catch (_) {} }
    if (after) after();
  };
  springSheet(sh.H + 20, sh.sp ? sh.sp.v : 0, { response: .36, damping: 1, onDone: done });
}

/* ---------- Capsule to sheet: the Up next capsule grows into meeting prep ---------- */
const capEl = $('#capsule');
let mo = null;
const smooth = (x, a, b) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function capInset() {
  const sr = screenEl.getBoundingClientRect(), cr = capEl.getBoundingClientRect();
  const k = sr.width / screenEl.clientWidth || 1;
  const boxTop = (parseFloat(getComputedStyle(sh.el).top) || 0) + sh.y;
  const t = (cr.top - sr.top) / k - boxTop, l = (cr.left - sr.left) / k, w = cr.width / k, h = cr.height / k;
  return { t, l, r: screenEl.clientWidth - l - w, b: sh.H - t - h, rad: Math.min(parseFloat(getComputedStyle(capEl).borderTopLeftRadius) || 22, h / 2) };  // a pill's 999px radius would hold the clip round until the last frame
}
function applyMorph(m) {
  const k = mo.k, e = 1 - m, R = parseFloat(getComputedStyle(sh.el).borderTopLeftRadius) || 30;
  const ra = k.rad + (R - k.rad) * m, rb = k.rad * e;
  sh.el.style.clipPath = `inset(${(k.t * e).toFixed(2)}px ${(k.r * e).toFixed(2)}px ${(k.b * e).toFixed(2)}px ${(k.l * e).toFixed(2)}px round ${ra.toFixed(2)}px ${ra.toFixed(2)}px ${rb.toFixed(2)}px ${rb.toFixed(2)}px)`;
  sh.el.style.setProperty('--m-cap', (1 - smooth(m, .04, .26)).toFixed(3));
  sh.el.style.setProperty('--m-bg', smooth(m, .04, .26).toFixed(3));
  sh.el.style.setProperty('--m-in', smooth(m, .18, .58).toFixed(3));
  capEl.style.opacity = (1 - smooth(m, 0, .06)).toFixed(3);
  sh.scrim.style.opacity = (.38 * smooth(m, 0, .8)).toFixed(3);
  setAppBack(clamp(m, 0, 1));
}
function morphSheet(to, onDone) {
  if (mo && mo.sp) mo.sp.stop();
  const from = mo ? mo.m : (to ? 0 : 1);
  mo = { m: from, k: capInset() };
  sh.el.classList.add('morphing');
  applyMorph(from);
  mo.sp = spring({ from, to, response: to ? .5 : .42, damping: 1, precision: .0008, onUpdate: (m) => { mo.m = m; applyMorph(m); }, onDone: () => {
    sh.el.classList.remove('morphing'); sh.el.style.clipPath = '';
    ['--m-cap', '--m-bg', '--m-in'].forEach((p) => sh.el.style.removeProperty(p));
    if (to) capEl.style.opacity = '0';
    mo = null; if (onDone) onDone();
  } });
}
function goDetent(d, vel = 0, damp = .9) {
  if (!sh.view.detents.includes(d)) return;
  setDetent(d);
  springSheet(d === 'large' ? 0 : sh.yMed, vel, { response: .4, damping: damp });
}
function releaseSheet(vel) {
  const has = (d) => sh.view.detents.includes(d);
  const lowest = has('medium') ? sh.yMed : 0;
  const proj = sh.y + project(vel, .996);
  // Dismiss past a quarter of the way down, or on a flick that would carry it there.
  if (proj > lowest + (sh.H - lowest) * .25 || vel > 900) { closeSheet(undefined, true); return; }
  const cands = [];
  if (has('large')) cands.push({ d: 'large', y: 0 });
  if (has('medium')) cands.push({ d: 'medium', y: sh.yMed });
  cands.sort((a, b) => Math.abs(a.y - proj) - Math.abs(b.y - proj));
  const pick = cands[0];
  setDetent(pick.d);
  springSheet(pick.y, vel, { response: .38, damping: Math.abs(vel) > 350 ? .86 : 1 });
}

/* Drag: touch events on phones (so we can cancel native scroll at the top), pointer events for a mouse. */
let g = null;
function gStart(y, t, target) {
  if (sh.detent === 'closed' || sh.closing || mo) return false;
  if (target.closest('textarea, input, label, .switch, [data-nodrag]')) return false;
  if (sh.sp) sh.sp.stop();
  sh.dragEnd = 0;
  g = { y0: y, startY: sh.y, active: false, base: 0, inBody: sh.body.contains(target), samples: [{ y, t }] };
  return true;
}
function gMove(y, t, ev) {
  if (!g) return;
  const dy = (y - g.y0) / S;
  g.samples.push({ y, t }); if (g.samples.length > 6) g.samples.shift();
  if (!g.active) {
    if (Math.abs(dy) < 6) return;
    if (sh.detent === 'large' && g.inBody && (sh.body.scrollTop > 0 || dy < 0)) { g = null; return; }
    g.active = true; g.base = dy;
    if (g.pid != null) { try { sh.el.setPointerCapture(g.pid); } catch (_) {} }
  }
  if (ev.cancelable) ev.preventDefault();
  let ny = g.startY + (dy - g.base);
  if (ny < 0) ny = -rubber(-ny, 300);
  setY(ny);
}
function gEnd() {
  if (!g) return;
  const s = g; g = null;
  if (!s.active) return;
  sh.dragEnd = performance.now();
  const a = s.samples[Math.max(0, s.samples.length - 4)], b = s.samples[s.samples.length - 1];
  releaseSheet((b.y - a.y) / Math.max(1, b.t - a.t) * 1000 / S);
}
sh.el.addEventListener('touchstart', (e) => { if (e.touches.length === 1) gStart(e.touches[0].clientY, e.timeStamp, e.target); }, { passive: true });
sh.el.addEventListener('touchmove', (e) => { if (e.touches.length === 1) gMove(e.touches[0].clientY, e.timeStamp, e); }, { passive: false });
sh.el.addEventListener('touchend', gEnd);
sh.el.addEventListener('touchcancel', gEnd);
sh.el.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button) return;
  if (gStart(e.clientY, e.timeStamp, e.target)) g.pid = e.pointerId;
});
sh.el.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') gMove(e.clientY, e.timeStamp, e); });
sh.el.addEventListener('pointerup', (e) => { if (e.pointerType === 'mouse') gEnd(); });
sh.el.addEventListener('pointercancel', (e) => { if (e.pointerType === 'mouse') gEnd(); });
sh.el.addEventListener('click', (e) => { if (sh.dragEnd && performance.now() - sh.dragEnd < 160) { e.stopPropagation(); e.preventDefault(); } }, true);
sh.el.addEventListener('wheel', (e) => {
  if (sh.detent === 'medium' && e.deltaY > 8 && sh.view.detents.includes('large')) { goDetent('large'); }
  else if (sh.detent === 'large' && e.deltaY < -8 && sh.body.scrollTop <= 0 && sh.view.detents.includes('medium')) { goDetent('medium'); }
}, { passive: true });
sh.body.addEventListener('scroll', () => sh.body.classList.toggle('scrolled', sh.body.scrollTop > 4), { passive: true });
sh.scrim.addEventListener('pointerdown', () => { if (sh.detent !== 'closed') closeSheet(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sh.detent !== 'closed') { const menu = $('#menu'); if (menu && menu.classList.contains('on')) menu.classList.remove('on'); else closeSheet(); }
});

function swapView(view, o = {}) {
  const els = [sh.head, sh.body, sh.foot];
  const dir = o.back ? -1 : 1;
  els.forEach((e) => { e.style.transition = 'opacity .14s var(--ease-out), translate .14s var(--ease-out)'; e.style.opacity = 0; e.style.translate = `${-12 * dir}px 0`; });
  setTimeout(() => {
    view.detents = view.detents || ['large'];
    sh.view = view; renderView(view); sh.body.scrollTop = 0; measure();
    if (sh.detent === 'medium') springSheet(sh.yMed, 0, { response: .35 }); else setY(sh.y);
    els.forEach((e) => { e.style.transition = 'none'; e.style.translate = `${12 * dir}px 0`; });
    requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((e) => {
      e.style.transition = 'opacity .24s var(--ease-out), translate .32s var(--ease-out)'; e.style.opacity = 1; e.style.translate = '0 0';
    })));
  }, 150);
}

function renderView(v) {
  if (v.type === 'item') renderItem(v);
  else if (v.type === 'prep') renderPrep(v);
  else if (v.type === 'ask') renderAsk(v);
  else if (v.type === 'look') renderLooks(v);
  stopPlayback();
}

/* ---------- Item sheet ---------- */

function headHTML(kicker, title, v) {
  return `${v.back ? `<button type="button" class="back-btn" data-back aria-label="Back">${ic('chevL', 22, 2.2)}</button>` : ''}
    <div class="sheet-head-main"><p class="kicker">${kicker}</p><h2 class="sheet-title" id="sheetTitle">${title}</h2></div>
    <button type="button" class="icon-btn" data-close aria-label="Close">${ic('x', 16, 2.3)}</button>`;
}

function ctaLabel(it) {
  if (it.kind === 'decision') return state.choice.android === 'approve' ? `Approve in ${it.channel}` : 'Send changes to Priya';
  if (it.kind === 'commit') {
    const t = state.toggles;
    if (t.cal && t.note) return 'Block time and tell Tomas';
    if (t.cal) return 'Block 3:30 to 4:15 PM';
    if (t.note) return 'Tell Tomas';
    return 'Mark as done';
  }
  return `Reply to Sam with ${state.choice.state}`;
}

function actionHTML(it) {
  if (it.kind === 'decision') {
    const ch = state.choice.android;
    return `<section class="act">
      <div class="act-head">${ic('sparkle', 15)}<span>Suggested reply</span></div>
      <div class="seg" role="radiogroup" aria-label="Your decision" data-i="${ch === 'approve' ? 0 : 1}">
        <button type="button" role="radio" aria-checked="${ch === 'approve'}" data-choice="approve">Approve</button>
        <button type="button" role="radio" aria-checked="${ch === 'changes'}" data-choice="changes">Request changes</button>
        <span class="seg-thumb"></span>
      </div>
      <div class="draft"><textarea id="draft" rows="2" aria-label="Reply to Priya">${esc(state.drafts[ch])}</textarea>
        <p class="act-meta draft-to"><span class="to-mark">${srcIc('slack', 13)}</span>Posts as you in ${it.channel}, in Priya’s thread.</p></div>
    </section>`;
  }
  if (it.kind === 'commit') {
    const t = state.toggles;
    return `<section class="act">
      <div class="act-head">${ic('sparkle', 15)}<span>Suggested plan</span></div>
      <div class="toggles">
        <label class="tg"><span class="ico">${ic('calendar', 18)}</span>
          <span><b>Block 3:30 to 4:15 PM</b><small>You’re free. Product sync ends at 2:00 PM.</small></span>
          <span class="switch"><input type="checkbox" role="switch" data-tg="cal" ${t.cal ? 'checked' : ''}><i></i></span></label>
        <label class="tg"><span class="ico">${ic('mail', 18)}</span>
          <span><b>Tell Tomas it lands by 5 PM</b><small>“Deck lands by 5. I’ll ping you here once it’s sent.”</small></span>
          <span class="switch"><input type="checkbox" role="switch" data-tg="note" ${t.note ? 'checked' : ''}><i></i></span></label>
        <p class="act-meta draft-to"><span class="to-mark">${srcIc('mail', 13)}</span>Sends as you, by email, in Tomas’s thread.</p>
      </div>
    </section>`;
  }
  const c = state.choice.state;
  return `<section class="act">
    <div class="act-head">${ic('sparkle', 15)}<span>Your pick</span><span class="sub">Suggested: B</span></div>
    <div class="choices" role="radiogroup" aria-label="Empty state design">
      <button type="button" class="choice" role="radio" aria-checked="${c === 'A'}" data-pick="A">
        <div class="mini"><span class="art">${ic('image', 17)}</span><i class="l1"></i><i class="l2"></i><i class="btn"></i></div>
        <div class="lab"><em>A</em>Illustrated</div><div class="vote">1 vote</div><span class="tick">${ic('check', 13, 3)}</span>
      </button>
      <button type="button" class="choice" role="radio" aria-checked="${c === 'B'}" data-pick="B">
        <div class="mini"><i class="l1"></i><i class="l2"></i><i class="lnk"></i></div>
        <div class="lab"><em>B</em>Text only</div><div class="vote">2 votes</div><span class="tick">${ic('check', 13, 3)}</span>
      </button>
    </div>
    <p class="act-meta draft-to solo"><span class="to-mark">${srcIc('slack', 13)}</span>Replies to Sam in #design-crit with your pick.</p>
  </section>`;
}

function evHTML(e, i) {
  const meet = e.src === 'meeting';
  const q = meet ? '“' + e.quote.split(' ').map((w) => `<span class="w">${esc(w)}</span>`).join(' ') + '”' : '“' + esc(e.quote) + '”';
  const open = meet ? 'Open recording' : e.src === 'slack' ? 'Open in Slack' : 'Open email';
  return `<article class="ev" data-i="${i}">
    <div class="ev-top"><span class="src" data-s="${e.src}">${srcIc(e.src, 14)}</span><span class="ev-where">${esc(e.where)}</span><span class="ev-when">${e.when}</span></div>
    <p class="ev-who">${e.who} ${meet ? 'said' : 'wrote'}</p>
    <p class="ev-quote">${q}</p>
    <div class="ev-actions">
      ${meet ? `<button type="button" class="pill" data-play="${i}"><span class="ico-play">${ic('play', 12)}</span><span class="wave" hidden><i></i><i></i><i></i><i></i></span><span class="lbl">Play from ${e.play}</span></button>` : ''}
      <button type="button" class="link-btn" data-open-src="${e.src}">${open}${ic('arrowUR', 14, 2)}</button>
    </div>
  </article>`;
}

// The draft box grows with its text instead of scrolling or sitting half empty.
function fitDraft() { const ta = $('#draft'); if (!ta) return; ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }
document.addEventListener('input', (e) => { if (e.target.id === 'draft') fitDraft(); });

function renderItem(v) {
  const it = item(v.id);
  sh.head.innerHTML = headHTML(`<span>${it.dueLong}</span>`, it.title, v);
  sh.body.innerHTML = `<p class="why">${it.why}</p>
    ${actionHTML(it)}
    <button type="button" class="ev-toggle" data-expand aria-expanded="false">
      ${srcStack([...new Set(it.evidence.map((e) => e.src))])}<span class="grow">Where this came from</span><span class="sub">${it.evidence.length}</span>${ic('chevD', 16, 2.2)}
    </button>
    <div class="evid">${it.evidence.map(evHTML).join('')}</div>`;
  sh.foot.innerHTML = `<button type="button" class="cta" data-cta><span class="swap" id="ctaLabel">${ctaLabel(it)}</span></button>
    <div class="foot-row">
      <div class="menu" id="menu" role="menu">
        <button type="button" role="menuitem" data-snooze="hour">In 1 hour<small>1:48 PM</small></button>
        <button type="button" role="menuitem" data-snooze="afternoon">This afternoon<small>3:30 PM</small></button>
        <button type="button" role="menuitem" data-snooze="tomorrow">Tomorrow morning<small>9:00 AM</small></button>
        <button type="button" role="menuitem" class="menu-sep" data-notmine>This isn’t mine</button>
      </div>
      <button type="button" class="ghost quiet" data-remind aria-haspopup="menu">Not now</button>
    </div>`;
  requestAnimationFrame(fitDraft);
}

function setCta(text) {
  const el = $('#ctaLabel'); if (!el || el.textContent === text) return;
  if (reduce()) { el.textContent = text; return; }
  el.classList.add('out');
  setTimeout(() => { el.textContent = text; el.classList.remove('out'); }, 150);
}

function commitItem(it) {
  let how, msg;
  if (it.kind === 'decision') {
    const ok = state.choice.android === 'approve';
    how = ok ? `Approved in ${it.channel}` : 'Sent changes to Priya';
    msg = ok ? `Approved in ${it.channel}. Priya has been told.` : 'Sent your changes to Priya.';
  } else if (it.kind === 'commit') {
    const t = state.toggles;
    how = t.cal && t.note ? 'Blocked 3:30 PM and told Tomas' : t.cal ? 'Blocked 3:30 to 4:15 PM' : t.note ? 'Told Tomas it lands by 5' : 'Marked done';
    msg = t.cal && t.note ? 'Blocked 3:30 PM and told Tomas.' : t.cal ? 'Blocked 3:30 to 4:15 PM.' : t.note ? 'Told Tomas it lands by 5.' : 'Marked done.';
  } else {
    how = `Replied to Sam with ${state.choice.state}`;
    msg = `Replied to Sam with ${state.choice.state}.`;
  }
  closeSheet();
  setTimeout(() => resolveItem(it.id, 'done', { how }), 260);
  setTimeout(() => toast(msg, () => undoItem(it.id)), 520);
}

/* Evidence playback: the transcript lights up word by word. */
let playTimer = 0, playBtn = null;
function stopPlayback() {
  clearInterval(playTimer); playTimer = 0;
  if (playBtn && playBtn.isConnected) resetPlayBtn(playBtn);
  playBtn = null;
}
function resetPlayBtn(btn) {
  const ev = btn.closest('.ev');
  btn.classList.remove('playing');
  $('.ico-play', btn).innerHTML = ic('play', 12);
  $('.ico-play', btn).hidden = false; $('.wave', btn).hidden = true;
  const quote = $('.ev-quote', ev); quote.classList.remove('tracking');
  $$('.w', quote).forEach((w) => w.classList.remove('said'));
}
function togglePlay(btn) {
  if (playBtn === btn) { stopPlayback(); return; }
  stopPlayback();
  playBtn = btn;
  const ev = btn.closest('.ev'), words = $$('.ev-quote .w', ev);
  btn.classList.add('playing');
  $('.ico-play', btn).hidden = true; $('.wave', btn).hidden = false;
  $('.ev-quote', ev).classList.add('tracking');
  let n = 0;
  playTimer = setInterval(() => {
    if (n < words.length) { words[n].classList.add('said'); n++; }
    else { clearInterval(playTimer); playTimer = 0; setTimeout(() => { if (playBtn === btn) stopPlayback(); }, 700); }
  }, reduce() ? 40 : 170);
}

/* ---------- Prep sheet ---------- */

function prepRows() {
  return ['android', 'state'].map((id) => {
    const it = item(id), st = state.status[id];
    if (st === 'open') return `<button type="button" class="pr" data-resolve="${id}"><span class="glow" data-lvl="${it.level}"></span><span class="row-tile" data-lvl="${it.level}" data-hue="${it.hue}" aria-hidden="true">${face(it.av, it.initials)}</span><span><b>${it.title}</b><small>${it.dueLong}</small></span><span class="go">${ic('chevR', 16, 2.4)}</span></button>`;
    if (st === 'done') return `<div class="pr is-done"><span class="ok">${ic('check', 18, 2.4)}</span><span><b>${it.title}</b><small>${state.info[id].how}</small></span><span></span></div>`;
    if (st === 'snoozed') return `<div class="pr is-done"><span>${ic('clock', 18, 2)}</span><span><b>${it.title}</b><small>Snoozed until ${state.snoozeLabel}</small></span><span></span></div>`;
    return `<div class="pr is-done"><span>${ic('minus', 18, 2)}</span><span><b>${it.title}</b><small>Marked not yours</small></span><span></span></div>`;
  }).join('');
}
function refreshPrep() {
  const l = $('#prepList'); if (l) l.innerHTML = prepRows();
}
function renderPrep(v) {
  const m = D.meeting;
  sh.head.innerHTML = headHTML(`${ic('calendar', 15, 2)}<span>In ${m.inMin} min, ${m.time}</span>`, m.title, v);
  sh.body.innerHTML = `
    <div class="people"><span class="av-stack">${m.people.map((p) => `<span class="av" title="${p.full}">${face(p.n.toLowerCase(), p.n[0])}</span>`).join('')}</span><span class="t">${m.people.map((p) => p.n).slice(0, -1).join(', ')} and ${m.people[m.people.length - 1].n}</span></div>
    <div class="sect-head"><span>Before you join</span></div>
    <div class="plist" id="prepList">${prepRows()}</div>
    <div class="sect-head"><span>Going in, you should know</span></div>
    <ul class="going">${m.going.map((g2) => `<li><i></i><span>${g2}</span></li>`).join('')}</ul>`;
  sh.foot.innerHTML = `<button type="button" class="cta" data-join>${ic('video', 20, 2)}<span>Join with Zoom</span></button>`;
}

/* ---------- Ask sheet ---------- */

const ASK_KEYS = [['priya', 'android', 'build'], ['promise', 'promised', 'tomas', 'deck', 'today', 'owe'], ['prep', 'sync', 'meeting', 'next']];
function renderAsk(v) {
  sh.head.innerHTML = headHTML(`${ic('sparkle', 14)}<span>Across ${D.tally.split(',')[0]}, Slack and email</span>`, 'Ask Fireflies', v);
  sh.body.innerHTML = `<div class="thread" id="thread"><div class="sugg" id="sugg">${D.ask.prompts.map((p, i) => `<button type="button" class="sg" data-prompt="${i}"><span class="grow">${p}</span>${ic('arrowUp', 16, 2.2)}</button>`).join('')}</div></div>`;
  sh.foot.innerHTML = `<form class="askbar" id="askForm" autocomplete="off"><input id="askInput" type="text" placeholder="Ask about anything you missed" aria-label="Ask Fireflies"><button type="submit" class="send" id="askSend" aria-label="Send">${ic('arrowUp', 18, 2.4)}</button></form>`;
  state.asked = new Set();
}
function ask(i, typed) {
  const a = i == null ? null : D.ask.answers[i];
  const thread = $('#thread'), sugg = $('#sugg');
  if (!thread) return;
  if (i != null) state.asked.add(i);
  sugg.remove();
  thread.insertAdjacentHTML('beforeend', `<div class="you">${esc(typed || D.ask.prompts[i])}</div>`);
  scrollThread();
  const text = a ? a.text : D.ask.fallback;
  const botId = 'bot' + Date.now();
  setTimeout(() => {
    const words = text.split(' ');
    thread.insertAdjacentHTML('beforeend', `<div class="bot" id="${botId}"><div class="bot-head">${ic('sparkle', 14)}<span>Fireflies</span></div>
      <span class="sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${esc(text)}</span>
      <p aria-hidden="true">${words.map((w) => `<span class="w">${esc(w)}</span>`).join(' ')}</p>
      <div class="cites">${a ? a.cites.map((c) => `<span class="chip"><span class="src" data-s="${c.src}">${srcIc(c.src, 10)}</span>${c.label}</span>`).join('') : ''}${a && a.open ? `<button type="button" class="chip open" data-ask-open="${a.open}">${a.open === 'prep' ? 'Open prep' : 'Open item'}</button>` : ''}</div></div>`);
    const spans = $$('.w', $('#' + botId));
    scrollThread();
    spans.forEach((s, k) => setTimeout(() => s.classList.add('on'), reduce() ? 0 : 28 * k));
    setTimeout(() => {
      const c = $('.cites', $('#' + botId)); if (c) c.classList.add('on');
      const rest = D.ask.prompts.map((p, k) => [p, k]).filter(([, k]) => !state.asked.has(k));
      if (rest.length && a) {
        thread.insertAdjacentHTML('beforeend', `<div class="sugg bot" id="sugg">${rest.map(([p, k]) => `<button type="button" class="sg" data-prompt="${k}"><span class="grow">${p}</span>${ic('arrowUp', 16, 2.2)}</button>`).join('')}</div>`);
      }
      scrollThread();
    }, reduce() ? 0 : 28 * spans.length + 200);
  }, reduce() ? 0 : 420);
}
function scrollThread() { requestAnimationFrame(() => sh.body.scrollTo({ top: sh.body.scrollHeight, behavior: reduce() ? 'auto' : 'smooth' })); }

/* ---------- Delegated sheet events ---------- */

sh.el.addEventListener('click', (e) => {
  const t = e.target;
  const b = (sel) => t.closest(sel);
  let el0;
  if (b('[data-close]')) { closeSheet(); return; }
  if (b('[data-back]')) { swapView(sh.view.back, { back: true }); return; }
  if (b('#sheetGrab')) { if (sh.view.detents.length > 1) goDetent(sh.detent === 'medium' ? 'large' : 'medium'); return; }
  if ((el0 = b('[data-expand]'))) {
    const on = !sh.body.classList.contains('ev-open');
    const before = sh.el.getBoundingClientRect().top;
    sh.body.classList.toggle('ev-open', on); el0.setAttribute('aria-expanded', on);
    measure();
    const after = sh.el.getBoundingClientRect().top - sh.y * S;
    setY((before - after) / S);
    springSheet(0, 0, { response: .42, damping: 1 });
    if (on) setTimeout(() => { const ev = $('.ev-toggle', sh.body); if (ev && sh.body.scrollHeight > sh.body.clientHeight) sh.body.scrollTo({ top: ev.offsetTop - 12, behavior: reduce() ? 'auto' : 'smooth' }); }, 120);
    return;
  }
  const it = sh.view && sh.view.type === 'item' ? item(sh.view.id) : null;
  let el;
  if ((el = b('[data-choice]')) && it) {
    const v = el.dataset.choice, seg = $('.seg');
    if (state.choice.android === v) return;
    state.choice.android = v; seg.dataset.i = v === 'approve' ? 0 : 1;
    $$('[data-choice]', seg).forEach((x) => x.setAttribute('aria-checked', x.dataset.choice === v));
    const ta = $('#draft'); ta.classList.add('swap-out');
    setTimeout(() => { ta.value = state.drafts[v]; fitDraft(); ta.classList.remove('swap-out'); }, reduce() ? 0 : 150);
    setCta(ctaLabel(it)); return;
  }
  if ((el = b('[data-pick]')) && it) {
    state.choice.state = el.dataset.pick;
    $$('[data-pick]').forEach((x) => x.setAttribute('aria-checked', x.dataset.pick === state.choice.state));
    setCta(ctaLabel(it)); return;
  }
  if (b('[data-cta]') && it) { commitItem(it); return; }
  if (b('[data-remind]')) { const m = $('#menu'); m.classList.toggle('on'); return; }
  if ((el = b('[data-snooze]')) && it) {
    const u = snoozeUntil(el.dataset.snooze);
    closeSheet(); setTimeout(() => resolveItem(it.id, 'snoozed', { until: u }), 260); setTimeout(() => toast(`Snoozed until ${u}.`, () => undoItem(it.id)), 520); return;
  }
  if (b('[data-notmine]') && it) {
    closeSheet(); setTimeout(() => resolveItem(it.id, 'dismissed', { how: 'Marked not yours' }), 260);
    setTimeout(() => toast('Marked not yours. Fireflies will weigh asks like this lower.', () => undoItem(it.id)), 520); return;
  }
  if ((el = b('[data-play]'))) { togglePlay(el); return; }
  if ((el = b('[data-open-src]'))) { toast(`Opens ${el.dataset.openSrc === 'meeting' ? 'the recording' : el.dataset.openSrc === 'slack' ? 'the thread in Slack' : 'the email'} in the full app.`); return; }
  if ((el = b('[data-resolve]'))) { swapView({ type: 'item', id: el.dataset.resolve, medium: .76, back: sh.view }); return; }
  if (b('[data-join]')) { toast('Opens Zoom in the full app.'); return; }
  if ((el = b('[data-prompt]'))) { ask(+el.dataset.prompt); return; }
  if ((el = b('[data-ask-open]'))) {
    const id = el.dataset.askOpen;
    if (id === 'prep') swapView({ type: 'prep', medium: .76 });
    else swapView({ type: 'item', id, medium: .76 });
    return;
  }
  if (!b('.menu, [data-remind]')) { const m = $('#menu'); if (m) m.classList.remove('on'); }
});
sh.el.addEventListener('change', (e) => {
  const tg = e.target.closest('[data-tg]'); if (!tg) return;
  state.toggles[tg.dataset.tg] = tg.checked;
  setCta(ctaLabel(item('deck')));
});
sh.el.addEventListener('input', (e) => {
  if (e.target.id === 'draft') state.drafts[state.choice.android] = e.target.value;
  if (e.target.id === 'askInput') $('#askSend').classList.toggle('ready', !!e.target.value.trim());
});
sh.el.addEventListener('submit', (e) => {
  e.preventDefault();
  const inp = $('#askInput'); const q = inp.value.trim(); if (!q) return;
  inp.value = ''; $('#askSend').classList.remove('ready');
  const low = q.toLowerCase();
  const idx = ASK_KEYS.findIndex((ks) => ks.some((k) => low.includes(k)));
  ask(idx < 0 ? null : idx, q);
});

/* ---------- Page chrome ---------- */

// Room under the phone frame for the "better on mobile" note.
const HINT_H = 140;
function fit() {
  if (innerWidth <= 520) { S = 1; $('#deviceWrap').style.setProperty('--s', 1); return; }
  S = Math.min(1, (innerHeight - 32 - HINT_H) / 876, (innerWidth - 32) / 417);
  $('#deviceWrap').style.setProperty('--s', S.toFixed(4));
}
addEventListener('resize', () => { fit(); if (sh.detent !== 'closed') { measure(); setY(sh.detent === 'large' ? 0 : sh.yMed); } });

/* The paper panel works like a sheet: drag its handle up and it docks under a compact bar. */
const dockY = () => { const p = $('.panel', content); return p ? p.offsetTop : 0; };
let dockSp = null;
function scrollToY(to, vel = 0) {
  if (dockSp) dockSp.stop();
  dockSp = spring({ from: scroller.scrollTop, to, velocity: vel, response: .44, damping: 1, onUpdate: (y) => { scroller.scrollTop = y; } });
}
let pg = null;
content.addEventListener('pointerdown', (e) => {
  const h = e.target.closest('.panel-grab'); if (!h) return;
  if (dockSp) dockSp.stop();
  pg = { id: e.pointerId, y0: e.clientY, s0: scroller.scrollTop, moved: false, samples: [{ y: e.clientY, t: e.timeStamp }] };
  try { h.setPointerCapture(e.pointerId); } catch (_) {}
});
content.addEventListener('pointermove', (e) => {
  if (!pg || e.pointerId !== pg.id) return;
  const dy = (e.clientY - pg.y0) / S;
  if (Math.abs(dy) > 3) pg.moved = true;
  scroller.scrollTop = clamp(pg.s0 - dy, 0, scroller.scrollHeight - scroller.clientHeight);
  pg.samples.push({ y: e.clientY, t: e.timeStamp }); if (pg.samples.length > 6) pg.samples.shift();
});
const endGrab = (e) => {
  if (!pg || e.pointerId !== pg.id) return;
  const d = dockY(), y = scroller.scrollTop, a = pg.samples[0], b = pg.samples[pg.samples.length - 1];
  const vUp = b.t > a.t ? -((b.y - a.y) / S) / ((b.t - a.t) / 1000) : 0;
  if (!pg.moved) scrollToY(y < d - 4 ? d : 0);
  else if (y < d) scrollToY(y + project(vUp, .996) > d / 2 ? d : 0, vUp);
  pg = null;
};
content.addEventListener('pointerup', endGrab);
content.addEventListener('pointercancel', endGrab);

function onScroll() {
  const p = clamp((scroller.scrollTop - 74) / 40, 0, 1);
  const nav = $('#navbar'), y = scroller.scrollTop;
  nav.style.setProperty('--nav-p', p.toFixed(3));
  nav.style.setProperty('--sy', y.toFixed(1));
  // When a light panel reaches the status bar, the status bar switches to dark text, as iOS does.
  const panel = $('.panel', content);
  if (panel) {
    const top = parseFloat(getComputedStyle(scroller).paddingTop) + panel.offsetTop - y;
    screenEl.classList.toggle('on-panel', top <= ($('.statusbar') ? $('.statusbar').offsetHeight : 47) - 6);
    const pt = parseFloat(getComputedStyle(scroller).paddingTop);
    const gap = top - pt; // distance between the panel's top edge and the bottom of the compact bar
    screenEl.classList.toggle('docked', gap <= .5);
    if (gap <= .5) screenEl.classList.add('on-panel');
    panel.style.setProperty('--dock', clamp(1 - gap / 44, 0, 1).toFixed(3));
    const d = panel.offsetTop; screenEl.style.setProperty('--cover', d > 0 ? clamp(y / d, 0, 1).toFixed(3) : 0);
    const g = $('.panel-grab', panel); if (g) g.setAttribute('aria-label', gap <= .5 ? 'Show the summary' : 'Expand the list');
  }
}
scroller.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });

/* ---------- Pull to refresh ----------
   From the top of the list, pull down: the page follows with growing resistance and a ring under the bar
   fills in. Past the line the ring bumps to say "let go"; release and it spins while the page holds open,
   then settles back with the time it checked. A short pull just springs home. */
const PTR_T = 64, PTR_HOLD = 52;
const ptr = { el: null, d: 0, g: null, busy: false, sp: null, armed: false };
function ptrEl() {
  if (!ptr.el) {
    ptr.el = document.createElement('div');
    ptr.el.className = 'ptr'; ptr.el.setAttribute('aria-hidden', 'true');
    ptr.el.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" class="ptr-track"/><circle cx="12" cy="12" r="9" class="ptr-arc" pathLength="100"/></svg>';
    $('#app').appendChild(ptr.el);
  }
  return ptr.el;
}
function ptrSet(d) {
  ptr.d = d;
  content.style.transform = d > .5 ? `translate3d(0,${d.toFixed(1)}px,0)` : '';
  const p = clamp(d / PTR_T, 0, 1), el = ptrEl();
  el.style.opacity = clamp((d - 6) / 26, 0, 1).toFixed(3);
  el.style.setProperty('--p', p.toFixed(3));
  el.style.transform = `translate3d(-50%,${(d * .5 - 16).toFixed(1)}px,0)`;
  const armed = p >= 1 && !ptr.busy;
  if (armed !== ptr.armed) {
    ptr.armed = armed; el.classList.toggle('armed', armed);
    if (armed && navigator.vibrate) { try { navigator.vibrate(8); } catch (_) {} }
  }
}
function ptrTo(to, vel = 0, done) {
  if (ptr.sp) ptr.sp.stop();
  ptr.sp = spring({ from: ptr.d, to, velocity: vel, response: .42, damping: 1, onUpdate: ptrSet, onDone: done });
}
function ptrBegin(y) {
  if (ptr.busy || sh.detent !== 'closed' || scroller.scrollTop > 0) return false;
  if (ptr.sp) ptr.sp.stop();
  ptr.g = { y0: y, active: false };
  return true;
}
function ptrMove(y, ev) {
  const g = ptr.g; if (!g) return;
  const dy = (y - g.y0) / S;
  if (!g.active) {
    if (dy < -4 || scroller.scrollTop > 0) { ptr.g = null; return; }
    if (dy < 8) return;
    g.active = true; g.y0 = y;
  }
  if (ev.cancelable) ev.preventDefault();
  ptrSet(rubber(Math.max(0, (y - g.y0) / S), 420, .62));
}
function ptrEnd() {
  const g = ptr.g; ptr.g = null;
  if (!g || !g.active) return;
  if (ptr.armed) runRefresh(); else ptrTo(0);
}
function runRefresh() {
  ptr.busy = true; ptr.armed = false;
  const el = ptrEl(); el.classList.remove('armed'); el.classList.add('spinning');
  ptrTo(PTR_HOLD);
  setTimeout(() => {
    const dl = $('.dateline span', content); if (dl) dl.textContent = 'Hey Maya, you’re up to date.';
    el.classList.remove('spinning');
    ptrTo(0, 0, () => { ptr.busy = false; });
    toast(`You’re up to date. Nothing new since ${D.now}.`, null, 2600);
  }, reduce() ? 500 : 1100);
}
scroller.addEventListener('touchstart', (e) => { if (e.touches.length === 1 && !e.target.closest('.panel-grab')) ptrBegin(e.touches[0].clientY); }, { passive: true });
scroller.addEventListener('touchmove', (e) => { if (e.touches.length === 1) ptrMove(e.touches[0].clientY, e); }, { passive: false });
scroller.addEventListener('touchend', ptrEnd);
scroller.addEventListener('touchcancel', ptrEnd);
// A mouse can pull too (the desktop phone frame), from anywhere that isn't a control or a swipeable row.
scroller.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || e.button || e.target.closest('.panel-grab, .row-wrap, button, a, input, label')) return;
  ptrBegin(e.clientY);
});
addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && ptr.g) ptrMove(e.clientY, e); });
addEventListener('pointerup', (e) => { if (e.pointerType === 'mouse' && ptr.g) ptrEnd(); });

/* ---------- QR: inline code with accent corners, and a lightbox that tilts (from Luotain) ----------
   The corner squares take the accent, so they follow the picker. Click the thumbnail and the code opens
   on a card that tilts toward the cursor; the code sits 26px above the card and a light streak 60px above
   that, so they sweep at different rates (parallax). The tilt lerps toward the cursor rather than
   snapping, which is what gives it weight. */
const QR_DATA = 'M8 0h1v1h-1zM10 0h1v1h-1zM11 0h1v1h-1zM13 0h1v1h-1zM14 0h1v1h-1zM15 0h1v1h-1zM17 0h1v1h-1zM18 0h1v1h-1zM19 0h1v1h-1zM20 0h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM13 1h1v1h-1zM16 1h1v1h-1zM18 1h1v1h-1zM9 2h1v1h-1zM10 2h1v1h-1zM11 2h1v1h-1zM12 2h1v1h-1zM16 2h1v1h-1zM18 2h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM14 3h1v1h-1zM15 3h1v1h-1zM17 3h1v1h-1zM12 4h1v1h-1zM14 4h1v1h-1zM16 4h1v1h-1zM19 4h1v1h-1zM11 5h1v1h-1zM13 5h1v1h-1zM15 5h1v1h-1zM16 5h1v1h-1zM18 5h1v1h-1zM19 5h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM8 7h1v1h-1zM9 7h1v1h-1zM15 7h1v1h-1zM16 7h1v1h-1zM17 7h1v1h-1zM18 7h1v1h-1zM19 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM9 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1zM15 8h1v1h-1zM16 8h1v1h-1zM17 8h1v1h-1zM22 8h1v1h-1zM25 8h1v1h-1zM27 8h1v1h-1zM28 8h1v1h-1zM2 9h1v1h-1zM5 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM14 9h1v1h-1zM15 9h1v1h-1zM17 9h1v1h-1zM18 9h1v1h-1zM19 9h1v1h-1zM22 9h1v1h-1zM23 9h1v1h-1zM24 9h1v1h-1zM28 9h1v1h-1zM0 10h1v1h-1zM2 10h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM9 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM20 10h1v1h-1zM23 10h1v1h-1zM24 10h1v1h-1zM26 10h1v1h-1zM27 10h1v1h-1zM0 11h1v1h-1zM1 11h1v1h-1zM2 11h1v1h-1zM4 11h1v1h-1zM9 11h1v1h-1zM12 11h1v1h-1zM15 11h1v1h-1zM16 11h1v1h-1zM18 11h1v1h-1zM19 11h1v1h-1zM20 11h1v1h-1zM21 11h1v1h-1zM23 11h1v1h-1zM24 11h1v1h-1zM28 11h1v1h-1zM0 12h1v1h-1zM1 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM16 12h1v1h-1zM17 12h1v1h-1zM20 12h1v1h-1zM25 12h1v1h-1zM26 12h1v1h-1zM4 13h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM9 13h1v1h-1zM11 13h1v1h-1zM12 13h1v1h-1zM14 13h1v1h-1zM15 13h1v1h-1zM16 13h1v1h-1zM17 13h1v1h-1zM19 13h1v1h-1zM22 13h1v1h-1zM23 13h1v1h-1zM26 13h1v1h-1zM27 13h1v1h-1zM28 13h1v1h-1zM2 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM11 14h1v1h-1zM13 14h1v1h-1zM17 14h1v1h-1zM18 14h1v1h-1zM19 14h1v1h-1zM20 14h1v1h-1zM23 14h1v1h-1zM24 14h1v1h-1zM26 14h1v1h-1zM27 14h1v1h-1zM28 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM9 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1zM16 15h1v1h-1zM18 15h1v1h-1zM20 15h1v1h-1zM21 15h1v1h-1zM23 15h1v1h-1zM24 15h1v1h-1zM27 15h1v1h-1zM1 16h1v1h-1zM2 16h1v1h-1zM3 16h1v1h-1zM4 16h1v1h-1zM6 16h1v1h-1zM8 16h1v1h-1zM9 16h1v1h-1zM11 16h1v1h-1zM12 16h1v1h-1zM14 16h1v1h-1zM18 16h1v1h-1zM19 16h1v1h-1zM20 16h1v1h-1zM21 16h1v1h-1zM24 16h1v1h-1zM25 16h1v1h-1zM27 16h1v1h-1zM1 17h1v1h-1zM3 17h1v1h-1zM4 17h1v1h-1zM5 17h1v1h-1zM9 17h1v1h-1zM11 17h1v1h-1zM14 17h1v1h-1zM15 17h1v1h-1zM17 17h1v1h-1zM20 17h1v1h-1zM23 17h1v1h-1zM25 17h1v1h-1zM26 17h1v1h-1zM27 17h1v1h-1zM0 18h1v1h-1zM2 18h1v1h-1zM6 18h1v1h-1zM7 18h1v1h-1zM9 18h1v1h-1zM13 18h1v1h-1zM14 18h1v1h-1zM15 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM21 18h1v1h-1zM23 18h1v1h-1zM26 18h1v1h-1zM3 19h1v1h-1zM4 19h1v1h-1zM8 19h1v1h-1zM10 19h1v1h-1zM11 19h1v1h-1zM12 19h1v1h-1zM13 19h1v1h-1zM14 19h1v1h-1zM17 19h1v1h-1zM18 19h1v1h-1zM19 19h1v1h-1zM20 19h1v1h-1zM21 19h1v1h-1zM26 19h1v1h-1zM1 20h1v1h-1zM5 20h1v1h-1zM6 20h1v1h-1zM7 20h1v1h-1zM10 20h1v1h-1zM11 20h1v1h-1zM12 20h1v1h-1zM13 20h1v1h-1zM14 20h1v1h-1zM15 20h1v1h-1zM16 20h1v1h-1zM17 20h1v1h-1zM18 20h1v1h-1zM19 20h1v1h-1zM20 20h1v1h-1zM21 20h1v1h-1zM22 20h1v1h-1zM23 20h1v1h-1zM24 20h1v1h-1zM25 20h1v1h-1zM26 20h1v1h-1zM8 21h1v1h-1zM9 21h1v1h-1zM10 21h1v1h-1zM12 21h1v1h-1zM16 21h1v1h-1zM19 21h1v1h-1zM20 21h1v1h-1zM24 21h1v1h-1zM25 21h1v1h-1zM26 21h1v1h-1zM27 21h1v1h-1zM28 21h1v1h-1zM8 22h1v1h-1zM9 22h1v1h-1zM12 22h1v1h-1zM14 22h1v1h-1zM19 22h1v1h-1zM20 22h1v1h-1zM22 22h1v1h-1zM24 22h1v1h-1zM25 22h1v1h-1zM27 22h1v1h-1zM8 23h1v1h-1zM9 23h1v1h-1zM10 23h1v1h-1zM13 23h1v1h-1zM14 23h1v1h-1zM20 23h1v1h-1zM24 23h1v1h-1zM25 23h1v1h-1zM9 24h1v1h-1zM10 24h1v1h-1zM11 24h1v1h-1zM12 24h1v1h-1zM17 24h1v1h-1zM20 24h1v1h-1zM21 24h1v1h-1zM22 24h1v1h-1zM23 24h1v1h-1zM24 24h1v1h-1zM26 24h1v1h-1zM27 24h1v1h-1zM8 25h1v1h-1zM10 25h1v1h-1zM11 25h1v1h-1zM15 25h1v1h-1zM16 25h1v1h-1zM17 25h1v1h-1zM19 25h1v1h-1zM20 25h1v1h-1zM21 25h1v1h-1zM24 25h1v1h-1zM25 25h1v1h-1zM28 25h1v1h-1zM8 26h1v1h-1zM9 26h1v1h-1zM10 26h1v1h-1zM11 26h1v1h-1zM14 26h1v1h-1zM16 26h1v1h-1zM18 26h1v1h-1zM21 26h1v1h-1zM23 26h1v1h-1zM26 26h1v1h-1zM28 26h1v1h-1zM9 27h1v1h-1zM16 27h1v1h-1zM20 27h1v1h-1zM23 27h1v1h-1zM25 27h1v1h-1zM27 27h1v1h-1zM8 28h1v1h-1zM9 28h1v1h-1zM13 28h1v1h-1zM18 28h1v1h-1zM19 28h1v1h-1zM20 28h1v1h-1zM25 28h1v1h-1zM27 28h1v1h-1z';
const QR_FINDER = 'M0 0h1v1h-1zM1 0h1v1h-1zM2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM22 0h1v1h-1zM23 0h1v1h-1zM24 0h1v1h-1zM25 0h1v1h-1zM26 0h1v1h-1zM27 0h1v1h-1zM28 0h1v1h-1zM0 1h1v1h-1zM6 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM6 2h1v1h-1zM22 2h1v1h-1zM24 2h1v1h-1zM25 2h1v1h-1zM26 2h1v1h-1zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM6 3h1v1h-1zM22 3h1v1h-1zM24 3h1v1h-1zM25 3h1v1h-1zM26 3h1v1h-1zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM6 4h1v1h-1zM22 4h1v1h-1zM24 4h1v1h-1zM25 4h1v1h-1zM26 4h1v1h-1zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM22 6h1v1h-1zM23 6h1v1h-1zM24 6h1v1h-1zM25 6h1v1h-1zM26 6h1v1h-1zM27 6h1v1h-1zM28 6h1v1h-1zM0 22h1v1h-1zM1 22h1v1h-1zM2 22h1v1h-1zM3 22h1v1h-1zM4 22h1v1h-1zM5 22h1v1h-1zM6 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM0 24h1v1h-1zM2 24h1v1h-1zM3 24h1v1h-1zM4 24h1v1h-1zM6 24h1v1h-1zM0 25h1v1h-1zM2 25h1v1h-1zM3 25h1v1h-1zM4 25h1v1h-1zM6 25h1v1h-1zM0 26h1v1h-1zM2 26h1v1h-1zM3 26h1v1h-1zM4 26h1v1h-1zM6 26h1v1h-1zM0 27h1v1h-1zM6 27h1v1h-1zM0 28h1v1h-1zM1 28h1v1h-1zM2 28h1v1h-1zM3 28h1v1h-1zM4 28h1v1h-1zM5 28h1v1h-1zM6 28h1v1h-1z';
const qrSVG = () => `<svg viewBox="0 0 29 29" shape-rendering="crispEdges" aria-hidden="true"><path class="qr-data" d="${QR_DATA}"/><path class="qr-finder" d="${QR_FINDER}"/></svg>`;
function tiltLoop({ node, max, ease = .12, perspective = 700, extra }) {
  const t = { rx: 0, ry: 0 }; let rx = 0, ry = 0, id = 0, running = false;
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = () => {
    rx += (t.rx - rx) * ease; ry += (t.ry - ry) * ease;
    node.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
    if (extra) extra(rx, ry);
    if (Math.abs(t.rx - rx) + Math.abs(t.ry - ry) < .01 && !t.rx && !t.ry) { running = false; return; }
    id = requestAnimationFrame(step);
  };
  const kick = () => { if (!running && !still()) { running = true; id = requestAnimationFrame(step); } };
  return {
    aim(x, y) { t.rx = -y * max; t.ry = x * max; kick(); },  // x, y in -1..1
    rest() { t.rx = 0; t.ry = 0; kick(); },
    stop() { cancelAnimationFrame(id); running = false; rx = ry = 0; node.style.transform = ''; },
  };
}
(function qrInit() {
  const thumb = $('#qrThumb'), thumbTilt = $('#qrThumbTilt');
  if (!thumb) return;
  thumbTilt.innerHTML = qrSVG();
  // The thumbnail tilts a little within itself, an invitation to pick it up.
  const small = tiltLoop({ node: thumbTilt, max: 9, ease: .14, perspective: 520 });
  thumb.addEventListener('mousemove', (e) => { const r = thumb.getBoundingClientRect(); small.aim(((e.clientX - r.left) / r.width - .5) * 2, ((e.clientY - r.top) / r.height - .5) * 2); });
  thumb.addEventListener('mouseleave', () => small.rest());

  const box = document.createElement('div');
  box.className = 'qrbox'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'QR code for shatermt.com/fireflies');
  box.innerHTML = `<div class="qrbox-scrim"></div>
    <div class="qrbox-stage"><div class="qrbox-shadow"></div>
      <div class="qrbox-card"><div class="qrbox-code">${qrSVG()}</div><div class="qrbox-gloss"><i></i></div></div></div>
    <p class="qrbox-cap"><b>Point your phone’s camera here</b><span>shatermt.com/fireflies</span></p>`;
  document.body.appendChild(box);
  const card = $('.qrbox-card', box), gloss = $('.qrbox-gloss i', box), shadow = $('.qrbox-shadow', box);
  const big = tiltLoop({ node: card, max: 18, ease: .12, perspective: 700, extra: (rx, ry) => {
    gloss.style.transform = `translate3d(${(-ry * 6).toFixed(2)}%, ${(rx * 6).toFixed(2)}%, 0)`;   // light slides against the tilt
    shadow.style.transform = `translate3d(${(ry * 1.6).toFixed(2)}px, ${(-rx * 1.6).toFixed(2)}px, 0)`; // shadow leans away
  } });
  let closeT = 0;
  function open() {
    clearTimeout(closeT); box.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('on')));
    small.rest();
  }
  function close() {
    if (box.hidden) return;
    box.classList.remove('on'); big.rest();
    closeT = setTimeout(() => { box.hidden = true; big.stop(); thumb.focus({ preventScroll: true }); }, 180);  // exits faster than it enters
  }
  thumb.addEventListener('click', open);

  // An occasional "Click me" bubble over the thumbnail. It stops once the code has been opened.
  const bubble = document.createElement('span');
  bubble.className = 'qr-bubble'; bubble.setAttribute('aria-hidden', 'true'); bubble.textContent = 'Click me';
  thumb.appendChild(bubble);
  let clicked = false, bubbleT = 0;
  const showBubble = () => {
    if (clicked) return;
    if (box.hidden && !document.hidden && thumb.offsetParent) {
      bubble.classList.remove('show'); void bubble.offsetWidth; bubble.classList.add('show');
      setTimeout(() => bubble.classList.remove('show'), 2600);
    }
    bubbleT = setTimeout(showBubble, 11000);
  };
  bubbleT = setTimeout(showBubble, 3500);
  thumb.addEventListener('click', () => { clicked = true; clearTimeout(bubbleT); bubble.classList.remove('show'); });
  box.addEventListener('mousemove', (e) => big.aim((e.clientX / innerWidth - .5) * 2, (e.clientY / innerHeight - .5) * 2));  // measured from the screen, so it keeps responding over the scrim
  box.addEventListener('mouseleave', () => big.rest());
  box.addEventListener('click', (e) => { if (!e.target.closest('.qrbox-card')) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ---------- Look and appearance ---------- */

const LOOKS = {
  night: { name: 'Night', tag: 'A dark masthead over a warm paper panel. Numbers you can tap, urgency as solid tiles.', desc: 'Dark masthead, paper panel.' },
  breathe: { name: 'Breathe', tag: 'A golden field that slowly breathes, about five breaths a minute, to set a calmer pace.', desc: 'A slow golden breath.' },
  glow: { name: 'Glow', tag: 'Cool greys and one amber light. The calm default.', desc: 'Cool greys, one amber light.' },
  dusk: { name: 'Dusk', tag: 'A night meadow. Aqua bloom on deep blue, soft and quiet.', desc: 'Aqua bloom on a night-blue field.' },
  signal: { name: 'Signal', tag: 'Stark and graphic. Urgency is a rail you can read at a glance.', desc: 'Stark and graphic. Urgency is a rail.' },
  marker: { name: 'Marker', tag: 'A reader’s page. Serif type, urgency as a highlighter stroke.', desc: 'Serif type. Urgency is a highlighter stroke.' }
};
const LOOK_IDS = Object.keys(LOOKS);
const store = {
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
};
const currentLook = () => (LOOKS[root.getAttribute('data-look')] ? root.getAttribute('data-look') : 'night');
const currentTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
// Night is designed for light mode only. The viewer's own light or dark choice is kept for the other looks.
const LIGHT_ONLY = [];
let prefTheme = currentTheme();
const themeFor = (look) => (LIGHT_ONLY.includes(look) ? 'light' : prefTheme);

function syncPickers() {
  const l = currentLook(), t = currentTheme();
  $$('[data-set-look]').forEach((b) => b.setAttribute('aria-checked', b.dataset.setLook === l));
  const bar = $('#lookbar'); if (bar) { const i = LOOK_IDS.indexOf(l); bar.style.setProperty('--x', i % 3); bar.style.setProperty('--y', Math.floor(i / 3)); }
  const tag = $('#lookTag'); if (tag) tag.textContent = LOOKS[l].tag;
  $$('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.themeSet === t));
  const th = $('.theme'); if (th) th.dataset.i = t === 'dark' ? 1 : 0;
  $$('[data-appearance]').forEach((b) => b.setAttribute('aria-checked', b.dataset.appearance === t));
  const locked = LIGHT_ONLY.includes(l);
  $$('[data-theme-set="dark"],[data-appearance="dark"]').forEach((b) => { b.disabled = locked; b.title = locked ? `${LOOKS[l].name} is light only` : ''; });
  const note = $('#appearanceNote'); if (note) note.hidden = !locked;
  const ab = $('[data-appearance]'); if (ab) ab.parentElement.dataset.i = t === 'dark' ? 1 : 0;
}
// A look change crossfades through the View Transitions API where it exists, and swaps instantly elsewhere.
function restyle(fn) {
  const run = () => { root.classList.add('theme-switching'); fn(); syncPickers(); setTimeout(() => root.classList.remove('theme-switching'), 80); };
  if (document.startViewTransition && !reduce()) document.startViewTransition(run); else run();
}
function setLook(id) { if (LOOKS[id] && id !== currentLook()) restyle(() => { root.setAttribute('data-look', id); root.setAttribute('data-theme', themeFor(id)); store.set('fcu-look', id); }); }
function setTheme(t) { if ((t === 'light' || t === 'dark') && t !== currentTheme() && !(t === 'dark' && LIGHT_ONLY.includes(currentLook()))) restyle(() => { prefTheme = t; root.setAttribute('data-theme', t); store.set('fcu-theme', t); }); }

document.addEventListener('click', (e) => {
  const l = e.target.closest('[data-set-look]'); if (l) { setLook(l.dataset.setLook); return; }
  const t = e.target.closest('[data-theme-set],[data-appearance]'); if (t) setTheme(t.dataset.themeSet || t.dataset.appearance);
});

function lookTile(id) {
  return `<button type="button" class="look-tile" role="radio" aria-checked="${id === currentLook()}" data-set-look="${id}">
    <span class="lt-art" data-look="${id}" aria-hidden="true"><i class="l1"></i><i class="l2"></i><span class="lt-card"><i class="lt-mark"></i><span class="lt-lines"><i></i><i></i></span></span><span class="lt-cta"></span></span>
    <span class="lt-name" data-look="${id}">${LOOKS[id].name}</span><span class="lt-desc">${LOOKS[id].desc}</span>
  </button>`;
}
/* Accent: one primary color drives buttons, highlights and urgency. */
const ACCENTS = [['Teal', '#0E8C99'], ['Ember', '#D4582A'], ['Cobalt', '#2F6BFF'], ['Fireflies', '#7A3FF2'], ['Jade', '#12946A'], ['Rose', '#DB3F66']];
const toRgb = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const mixHex = (h, t) => '#' + toRgb(h).map((c) => Math.round(c + (255 - c) * t).toString(16).padStart(2, '0')).join('');
const currentAccent = () => (getComputedStyle(root).getPropertyValue('--accent-pick').trim() || '#0E8C99');
function applyAccent(hex, save = true) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return;
  const [r, g, b] = toRgb(hex);
  root.style.setProperty('--accent-pick', hex); root.style.setProperty('--glow', hex);
  root.style.setProperty('--glow-rgb', `${r}, ${g}, ${b}`); root.style.setProperty('--hl', mixHex(hex, .3));
  if (save) store.set('fcu-accent', hex);
  syncAccent();
}
function accentHTML() {
  const cur = currentAccent().toLowerCase(), preset = ACCENTS.some(([, h]) => h.toLowerCase() === cur);
  return `<div class="swatches" role="radiogroup" aria-label="Accent color">${ACCENTS.map(([n, h]) => `<button type="button" class="swatch" role="radio" aria-label="${n}" title="${n}" aria-checked="${h.toLowerCase() === cur}" data-accent="${h}" style="--c:${h}">${ic('check', 16, 3)}</button>`).join('')}
    <label class="swatch custom" title="Pick any color" aria-checked="${!preset}" style="--c:${preset ? 'transparent' : cur}">${ic('check', 16, 3)}<input type="color" value="${cur}" data-accent-custom aria-label="Custom accent color"></label></div>`;
}
function accentName() { const cur = currentAccent().toLowerCase(), f = ACCENTS.find(([, h]) => h.toLowerCase() === cur); return f ? f[0] : 'Custom'; }
function syncAccent() {
  const an = $('#accentName'); if (an) an.textContent = accentName();
  const cur = currentAccent().toLowerCase(), preset = ACCENTS.some(([, h]) => h.toLowerCase() === cur);
  $$('[data-accent]').forEach((b) => b.setAttribute('aria-checked', b.dataset.accent.toLowerCase() === cur));
  $$('.swatch.custom').forEach((l) => { l.setAttribute('aria-checked', !preset); l.style.setProperty('--c', preset ? 'transparent' : cur); const i = $('input', l); if (i) i.value = cur; });
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-accent]'); if (b) applyAccent(b.dataset.accent); });
document.addEventListener('input', (e) => { if (e.target.matches('[data-accent-custom]')) applyAccent(e.target.value); });
{ const pick = $('#accentPicker'); if (pick) pick.innerHTML = accentHTML(); }

function renderLooks(v) {
  const t = currentTheme();
  const art = (m) => `<span class="mode-art ${m}" aria-hidden="true"><i class="m-top"><b></b><b></b></i><i class="m-panel"><i class="m-card"><s></s><u></u></i><i class="m-card"><s></s><u></u></i></i></span>`;
  const mode = (m, label) => `<button type="button" class="mode" role="radio" aria-checked="${t === m}" data-appearance="${m}">${art(m)}<span class="mode-foot"><span class="radio"></span>${label}</span></button>`;
  sh.head.innerHTML = headHTML(`${ic('sparkle', 14)}<span>Settings</span>`, 'Appearance', v);
  sh.body.innerHTML = `<p class="set-label">Mode</p>
    <div class="modes" role="radiogroup" aria-label="Mode">${mode('light', 'Light')}${mode('dark', 'Dark')}</div>
    <div class="set-row"><p class="set-label">Accent</p><span class="accent-name" id="accentName">${accentName()}</span></div>
    ${accentHTML()}`;
  sh.foot.innerHTML = `<button type="button" class="cta" data-close>Done</button>`;
}


$('#capsule').addEventListener('click', () => openSheet({ type: 'prep', medium: .76 }, $('#capsule')));
$('#avatarBtn').addEventListener('click', () => openSheet({ type: 'look', medium: .82 }, $('#avatarBtn')));
$('#askBtn').addEventListener('click', () => openSheet({ type: 'ask', detents: ['large'], start: 'large' }, $('#askBtn')));

content.addEventListener('click', (e) => {
  const ph = e.target.closest('.proj-head');
  if (ph) {
    const p = ph.closest('.proj'), on = p.dataset.open !== 'true';
    p.dataset.open = on; ph.setAttribute('aria-expanded', on);
    return;
  }
  const mh = e.target.closest('#movedHead');
  if (mh) { const w = $('#moved'), on = w.dataset.open !== 'true'; w.dataset.open = on; mh.setAttribute('aria-expanded', on); return; }
  const wh = e.target.closest('#waitHead');
  if (wh) { const w = $('#wait'), on = w.dataset.open !== 'true'; w.dataset.open = on; wh.setAttribute('aria-expanded', on); return; }
  const oi = e.target.closest('[data-open-item]');
  if (oi) openSheet({ type: 'item', id: oi.dataset.openItem, medium: .76 }, oi);
});

function mount() {
  verdictKey = '';
  content.innerHTML = homeHTML();
  $('#capsule').innerHTML = capsuleHTML();
  $$('.row-wrap').forEach(bindRow);
  update(true);
  scroller.scrollTop = 0; onScroll();
  setTimeout(() => {
    if (!state.interacted && !reduce()) { const w = $('.row-wrap'); if (w && w._peek) w._peek(); }
  }, 1700);
}

$('#reset')?.addEventListener('click', () => {
  stopPlayback(); hideToast();
  const go = () => { resetState(); mount(); };
  if (sh.detent !== 'closed') closeSheet(go); else go();
});

fit(); syncPickers(); mount();
document.addEventListener('pointerdown', () => { state.interacted = true; }, { once: true, capture: true });
})();
