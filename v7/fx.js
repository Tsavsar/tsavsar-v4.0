/* fx.js: a playground, local only for now.
   Images form out of particles once they've loaded and come into view.
   With reduced motion they just show.

   A plain script at the end of the body rather than a module, so the
   images are claimed before the first paint and never flash in first. */
(function () {
'use strict';

const root  = document.documentElement;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const main  = document.querySelector('main.content');
// Reached from another page on the site: a card may be growing into the
// hero. (This runs before the view transition is known, so it's a guess
// from where the visit came from.)
let arrived = false;
try { arrived = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (_) {}

/* ---- images form out of particles ------------------------------------ */
const IMG_SKIP = '.nav, .cards, .vinyl, .player, .collage, .gallery, .lb, .study-pill, .hero-brand, .cg-hero';

function wants(img) {
  if (img.closest(IMG_SKIP)) return false;
  // the hero the card just grew into is already on screen
  // (this runs before the transition is known, so: arrived from the site)
  if (arrived && img.closest('.study-hero')) return false;
  if (/\.svg(\?|$)/i.test(img.currentSrc || img.src)) return false;
  const w = Number(img.getAttribute('width')) || img.clientWidth;
  return w >= 80;
}

// What the img actually shows, at grid resolution, honouring object-fit
function drawFit(ctx, img, cw, ch) {
  const cs = getComputedStyle(img);
  const nw = img.naturalWidth, nh = img.naturalHeight;
  let dw = cw, dh = ch;
  if (cs.objectFit === 'cover' || cs.objectFit === 'contain') {
    const k = (cs.objectFit === 'cover' ? Math.max : Math.min)(cw / nw, ch / nh);
    dw = nw * k; dh = nh * k;
  }
  const [px, py] = cs.objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5));
  ctx.drawImage(img, (cw - dw) * px, (ch - dh) * (py ?? 0.5), dw, dh);
}

const ease = (t) => 1 - Math.pow(1 - t, 3);

// Timing, in ms. A speck flies for FLIGHT; specks set off across SCATTER at
// random, plus up to FALL more the lower they sit, so the image fills in
// loosely top to bottom. About 1.2s to the mosaic, then SHARPEN (matched
// in styles.css) to the real image: long enough to read as forming, short
// enough that scrolling never waits long on it, and in step with the text streaming in.
const FLIGHT = 640, SCATTER = 420, FALL = 160, SHARPEN = 340;

function form(img) {
  const finish = () => {
    img.classList.add('fx-done');
    img.classList.remove('fx-wait');
  };
  const w = img.clientWidth, h = img.clientHeight;
  if (!w || !h || !img.naturalWidth) return finish();

  // one particle per cell, about 4,500 of them whatever the image's size
  const s = Math.max(4, Math.ceil(Math.sqrt((w * h) / 4500)));
  const cols = Math.ceil(w / s), rows = Math.ceil(h / s);
  const grid = document.createElement('canvas');
  grid.width = cols; grid.height = rows;
  const g = grid.getContext('2d', { willReadFrequently: true });
  let px;
  try {
    drawFit(g, img, cols, rows);
    px = g.getImageData(0, 0, cols, rows).data;
  } catch (_) { return finish(); }

  const P = [];
  const spread = Math.max(w, h) * 0.32;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      if (px[i + 3] < 12) continue;
      const a = Math.random() * Math.PI * 2, d = spread * (0.25 + Math.random() * 0.75);
      P.push({
        tx: c * s, ty: r * s,
        sx: c * s + Math.cos(a) * d, sy: r * s + Math.sin(a) * d,
        // a little later further down, so it settles like it's falling into place
        delay: Math.random() * SCATTER + (r / rows) * FALL,
        fill: `rgba(${px[i]},${px[i + 1]},${px[i + 2]},${(px[i + 3] / 255).toFixed(3)})`,
      });
    }
  }

  const dpr = Math.min(2, devicePixelRatio || 1);
  const cv = document.createElement('canvas');
  cv.className = 'fx-canvas';
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  cv.setAttribute('aria-hidden', 'true');
  const cs = getComputedStyle(img);
  Object.assign(cv.style, {
    left: img.offsetLeft + img.clientLeft + 'px',
    top: img.offsetTop + img.clientTop + 'px',
    width: w + 'px', height: h + 'px',
    borderRadius: cs.borderRadius,
  });
  img.after(cv);
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);

  const t0 = performance.now();
  const frame = (t) => {
    const k = t - t0;
    ctx.clearRect(0, 0, w, h);
    for (const q of P) {
      const p = Math.min(1, Math.max(0, (k - q.delay) / FLIGHT));
      if (p <= 0) continue;
      const e = ease(p);
      const size = 1.2 + (s - 1.2) * e * e; // a speck that grows to fill its cell
      ctx.globalAlpha = Math.min(1, p * 2.5);
      ctx.fillStyle = q.fill;
      ctx.fillRect(q.sx + (q.tx - q.sx) * e, q.sy + (q.ty - q.sy) * e, size + 0.5, size + 0.5);
    }
    if (k < SCATTER + FALL + FLIGHT) return requestAnimationFrame(frame);
    // formed as a mosaic; the sharp image fades up through it
    finish();
    cv.classList.add('fx-canvas-out');
    setTimeout(() => cv.remove(), SHARPEN + 40);
  };
  requestAnimationFrame(frame);
}

if (root.classList.contains('fx') && main) {
  if (still) {
    root.classList.add('fx-ready');
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const img = en.target;
        io.unobserve(img);
        const go = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => form(img));
        if (img.complete && img.naturalWidth) go();
        else {
          img.addEventListener('load', go, { once: true });
          img.addEventListener('error', () => { img.classList.remove('fx-wait'); }, { once: true });
        }
      }
    }, { threshold: 0.15 });
    main.querySelectorAll('img').forEach((img) => {
      if (!wants(img)) return;
      img.classList.add('fx-wait');
      io.observe(img);
    });
    root.classList.add('fx-ready');
  }
}
})();
