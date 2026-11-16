// The CostGraph stages. Two kinds of frame:
//
//  - data-app: the real CostGraph dashboard (work/cg-app, built from its
//    own code by scripts/costgraph-app), opened on one screen with a fake
//    backend and a scripted walkthrough. It always renders at desktop size,
//    1440 x 900, and is scaled to the stage, never reflowed.
//  - data-demo: a single real component (work/cg-demos). With data-size it
//    gets a real window of that size, scaled from outside like the app, so
//    anything that measures itself (the ASCII band's canvas) sees its true
//    width.
//
// A frame is only made once its stage is mostly on screen, so the script
// plays where it can be seen. Replay reloads it; speed runs every CSS
// transition in the frame at 1x or a quarter. The site is light only, so
// every demo opens light.

const stages = [...document.querySelectorAll('.cg-demo[data-app], .cg-demo[data-site], .cg-demo[data-demo]')];
const theme = () => 'light';
const speeds = new WeakMap();

function src(fig) {
  const speed = speeds.get(fig) ?? 1;
  if (fig.dataset.app) {
    const q = new URLSearchParams({ demo: fig.dataset.app, route: fig.dataset.route || '/', theme: theme(), speed });
    // a stage is one real component in a drawn screen, not the whole app
    if (fig.dataset.stage !== undefined) q.set('stage', fig.dataset.app);
    return `/work/cg-app/?${q}`;
  }
  // costgraph.ai itself: light only, as the site is
  if (fig.dataset.site) {
    const q = new URLSearchParams({ demo: fig.dataset.site, route: fig.dataset.route || '/', speed });
    if (fig.dataset.stage !== undefined) q.set('stage', fig.dataset.site);
    // a page you can read keeps its own scrolling
    if (fig.dataset.scroll !== undefined) q.set('scroll', '1');
    return `/work/cg-site/?${q}`;
  }
  return `/work/cg-demos/${fig.dataset.demo}?theme=${theme()}`;
}

// The app keeps its desktop width, and the frame takes the full height of
// whatever it's showing: nothing inside a demo ever needs scrolling, so a
// wheel over it scrolls the page instead of getting stuck in the frame.
// The stage follows the height (it eases, in CSS).
function fitToContent(fig, frame) {
  const win = frame.contentWindow;
  const doc = frame.contentDocument;
  if (!win || !doc) return;
  let height = 900;
  const fit = () => {
    const needed = Math.ceil(doc.documentElement.scrollHeight);
    if (needed <= height) return;
    height = needed;
    frame.style.height = `${height}px`;
    fig.style.setProperty('--app-h', height);
  };
  const ro = new win.ResizeObserver(fit);
  ro.observe(doc.documentElement);
  if (doc.body) ro.observe(doc.body);
  fit();
}

// Frames with a design size of their own, scaled to the stage, never reflowed
const fixed = (fig) => Boolean(fig.dataset.app || fig.dataset.site || fig.dataset.size);

// The stage takes its size from the design before anything loads, so it
// holds its place on the page and nothing below it jumps when the frame
// arrives
function size(fig) {
  const [w, h] = (fig.dataset.size || '1440x900').split('x').map(Number);
  fig.style.setProperty('--dw', w);
  fig.style.setProperty('--app-h', h);
  // zoomed in on part of the frame: x, y, width, height in design pixels
  if (fig.dataset.crop) {
    const [cx, cy, cw, ch] = fig.dataset.crop.split(',').map(Number);
    fig.style.setProperty('--cx', cx);
    fig.style.setProperty('--cy', cy);
    fig.style.setProperty('--cw', cw);
    fig.style.setProperty('--ch', ch);
  }
  return [w, h];
}

// A frame fades in once there's something in it: its page has rendered and
// its fonts are in, not merely loaded. Never longer than four seconds.
function shown(frame) {
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) return Promise.resolve();
  const frames = (n) => new Promise((r) => { const step = () => (n-- ? win.requestAnimationFrame(step) : r()); step(); });
  const drawn = new Promise((resolve) => {
    const start = performance.now();
    const check = () => {
      const root = doc.getElementById('root') || doc.body;
      if ((root && root.querySelectorAll('*').length > 12) || performance.now() - start > 4000) resolve();
      else setTimeout(check, 50);
    };
    check();
  });
  return drawn
    .then(() => Promise.race([doc.fonts ? doc.fonts.ready : null, new Promise((r) => setTimeout(r, 1500))]))
    .then(() => frames(2));
}

function load(fig) {
  const stage = fig.querySelector('.cg-demo-stage');
  let frame = stage.querySelector('iframe');
  fig.classList.remove('is-ready');
  if (frame) {
    // a replay fades the demo out first, then starts it again from the
    // design height; frames that fill the stage have none to go back to
    const f = frame;
    setTimeout(() => {
      if (fixed(fig)) f.style.height = `${size(fig)[1]}px`;
      f.src = src(fig);
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
    return;
  }
  frame = document.createElement('iframe');
  frame.title = fig.querySelector('.cg-demo-title')?.textContent || 'CostGraph demo';
  frame.src = src(fig);
  // The real app is fixed at its desktop size; everything else fills the stage
  if (fixed(fig)) {
    frame.className = 'cg-app-frame';
    // each stage has its own design size; the app itself is 1440 wide
    const [w, h] = size(fig);
    frame.style.width = `${w}px`;
    frame.style.height = `${h}px`;
  }
  frame.addEventListener('load', () => {
    shown(frame).then(() => fig.classList.add('is-ready'));
    // the app's screens fit the window; the website scrolls as a page, so
    // its frames stay at the desktop window's height
    if (fig.dataset.app && fig.dataset.stage === undefined) fitToContent(fig, frame);
  });
  stage.append(frame);
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    io.unobserve(e.target);
    load(e.target);
  }
}, { threshold: 0.45 });

for (const fig of stages) {
  if (fixed(fig)) size(fig);
  io.observe(fig);
  fig.querySelector('.cg-demo-replay')?.addEventListener('click', () => load(fig));
  for (const b of fig.querySelectorAll('.cg-demo-speed button')) {
    b.addEventListener('click', () => {
      const rate = Number(b.dataset.rate);
      speeds.set(fig, rate);
      for (const o of fig.querySelectorAll('.cg-demo-speed button')) o.setAttribute('aria-pressed', String(o === b));
      fig.querySelector('iframe')?.contentWindow?.postMessage({ type: 'cg-speed', rate }, location.origin);
    });
  }
}


// A wheel over an app frame is handed up from inside it; it scrolls the page
addEventListener('message', (e) => {
  if (e.origin !== location.origin || e.data?.type !== 'cg-wheel') return;
  scrollBy({ left: e.data.dx, top: e.data.dy, behavior: 'instant' });
});
