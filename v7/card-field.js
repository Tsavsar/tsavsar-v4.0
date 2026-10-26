// Work cards: each project's mark drawn large as a field of light points on
// a moving surface: waves roll across it and ripples spread out of it.
//
// The mark is rasterised once into a mask; every frame is a grid of small
// squares whose brightness is mask x a band of light sliding down each column,
// every column at its own speed. Near the cursor the squares part and lift,
// eased so the field follows rather than snaps, and moving the cursor drops
// ripples (rings that grow and fade) along its path. The text block is
// measured and the field dims under it.
//
// The bottom three quarters are a piece of fabric hanging in the wind: a
// small spring grid pinned along its top edge, freer towards the hem. Gusts
// come and go, the sway travels down the cloth and flutter runs across it. The
// cursor presses into it and drags it along; sliding the row or scrolling the
// page makes it trail behind and swing back when the motion stops. Its folds
// are shaded from the grid, and the dots below the seam ride on it like print.

const STEP = 3          // grid pitch, CSS px
const DOT = 1.4         // square size, CSS px
const FLOOR = 0.05      // points outside the mark, so the waves read across the card
const RING_SPEED = 64   // ripple growth, CSS px per second
const RING_LIFE = 3.2   // seconds before a ripple is gone
const RING_WIDTH = 9    // ring thickness, CSS px
const RING_PUSH = 5     // max outward displacement, CSS px
const RADIUS = 64       // cursor reach, CSS px
const PUSH = 9          // max displacement at the cursor, CSS px
const SEAM = 0.25       // where the fabric hangs from, fraction of height
const CELL = 8          // fabric grid pitch, CSS px
const TAUT = 420        // neighbour spring: how much the cloth holds together
const HOLD = 20         // pull back to rest
const DAMP = 0.9        // velocity kept per 1/60s step
const SUB = 1 / 60      // fixed physics step
const GATHER = 8        // sides draw in this much by the hem, CSS px
const HEM = 12          // hem hangs this far above the card's bottom at rest

const reduce = matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
const dpr = Math.min(devicePixelRatio || 1, 2)

// Where the mark sits on each card: centre (fraction of width/height) and
// size (fraction of width). Big enough that it runs off an edge.
const PLACE = {
  luotain:   { x: 0.62, y: 0.7,  s: 0.92 },
  costgraph: { x: 0.64, y: 0.69, s: 0.9 },
  yote:      { x: 0.6,  y: 0.72, s: 1.0 },
  lonar:     { x: 0.64, y: 0.7,  s: 0.94 },
  kernui:    { x: 0.62, y: 0.7,  s: 0.94 },
}

const fields = []

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const now = () => performance.now() / 1000

async function setup(card) {
  const key = [...card.classList].find(c => c.startsWith('card-') && PLACE[c.slice(5)])?.slice(5)
  const markImg = card.querySelector('.card-mark img')
  if (!key || !markImg) return

  const img = await loadImage(markImg.src)
  const canvas = document.createElement('canvas')
  canvas.className = 'card-field'
  canvas.setAttribute('aria-hidden', 'true')
  card.prepend(canvas)

  const f = {
    card, canvas, ctx: canvas.getContext('2d'), img, place: PLACE[key],
    w: 0, h: 0, cols: 0, rows: 0, mask: null, shade: null,
    rings: [],
    cloth: null,
    mouse: null,         // last cursor position and velocity over the card
    px: 0, py: 0, hover: 0,   // eased cursor and how present it is
    // cards start at different points in the swell and drop rings out of step
    seed: fields.length * 1.7 + Math.random() * 6,
    last: null,          // where the cursor last dropped a ring
    visible: false,
  }
  measure(f)
  fields.push(f)

  if (finePointer.matches) {
    const local = e => {
      const r = card.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    card.addEventListener('pointerenter', e => {
      const p = local(e)
      if (f.hover < 0.05) { f.px = p.x; f.py = p.y }
      drop(f, p.x, p.y, 1)
      f.last = { ...p, t: now() }
      wake()
    })
    // a ring every so often along the cursor's path: enough to trail it,
    // not so many that they merge into noise
    card.addEventListener('pointermove', e => {
      const p = local(e), t = now()
      const m = f.mouse
      f.mouse = { x: p.x, y: p.y, vx: m ? p.x - m.x : 0, vy: m ? p.y - m.y : 0, fresh: true }
      if (!f.last || Math.hypot(p.x - f.last.x, p.y - f.last.y) > 26 && t - f.last.t > 0.09) {
        drop(f, p.x, p.y, 0.75)
        f.last = { ...p, t }
      }
    })
    card.addEventListener('pointerleave', () => { f.last = null; f.mouse = null })
  }
  io.observe(card)
  draw(f, now())
}

function drop(f, x, y, amp) {
  if (reduce.matches) return
  f.rings.push({ x, y, t0: now(), amp })
  if (f.rings.length > 10) f.rings.shift()
}

// Rasterise the mark at grid resolution, then work out how much to hold the
// field back under the text.
function measure(f) {
  const { card, canvas, place, img } = f
  const w = card.offsetWidth, h = card.offsetHeight
  if (!w || !h) return
  f.w = w; f.h = h
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)

  const cols = f.cols = Math.ceil(w / STEP)
  const rows = f.rows = Math.ceil(h / STEP)

  const off = document.createElement('canvas')
  off.width = cols; off.height = rows
  const o = off.getContext('2d', { willReadFrequently: true })
  const size = (w * place.s) / STEP
  const ratio = img.naturalHeight / img.naturalWidth || 1
  const mw = size, mh = size * ratio
  o.drawImage(img, place.x * cols - mw / 2, place.y * rows - mh / 2, mw, mh)
  const data = o.getImageData(0, 0, cols, rows).data

  const text = [card.querySelector('.card-mark'), card.querySelector('.card-body')]
    .filter(Boolean).map(el => {
      const r = el.getBoundingClientRect(), c = card.getBoundingClientRect()
      return { top: r.top - c.top, bottom: r.bottom - c.top }
    })
  const top = Math.min(...text.map(t => t.top))
  const bottom = Math.max(...text.map(t => t.bottom))

  // fabric grid: offsets (x, y, depth) and velocities per node
  const cx = Math.ceil(w / CELL) + 1, cy = Math.ceil((h * (1 - SEAM)) / CELL) + 1
  const n = cx * cy
  f.cloth = {
    cx, cy, top: h * SEAM,
    x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n),
    vx: new Float32Array(n), vy: new Float32Array(n), vz: new Float32Array(n),
    // how free each row is: pinned at the seam, loose at the hem
    give: Float32Array.from({ length: cy }, (_, r) => Math.pow(r / (cy - 1), 1.3)),
  }

  // every column drifts at its own pace so the field never moves as one sheet
  f.phase = Float32Array.from({ length: cols }, () => Math.random() * Math.PI * 2)
  f.speed = Float32Array.from({ length: cols }, () => 0.6 + Math.random() * 0.9)

  f.mask = new Float32Array(cols * rows)
  f.shade = new Float32Array(rows)
  for (let i = 0; i < cols * rows; i++) f.mask[i] = data[i * 4 + 3] / 255
  for (let r = 0; r < rows; r++) {
    const y = r * STEP
    // distance outside the text band, in px; 0 inside it
    const d = Math.max(top - y, y - bottom, 0)
    f.shade[r] = 0.12 + 0.88 * smooth(0, 36, d)
  }
}

// One fixed step of the cloth. lean is where the row/page motion wants the
// fabric to trail to; it springs towards that and overshoots back when it ends.
function stepCloth(f, lean, t) {
  const c = f.cloth, { cx, cy, give } = c
  const m = f.mouse
  // the wind: each card has its own gusts, which rise and fall out of step
  const gust = 0.55 + 0.45 * Math.sin(t * 0.37 + f.seed) * Math.sin(t * 0.13 + f.seed * 2)
  for (let r = 1; r < cy; r++) {
    const g = give[r]
    const ty = c.top + r * CELL
    for (let q = 0; q < cx; q++) {
      const i = r * cx + q
      const up = i - cx, dn = r < cy - 1 ? i + cx : i
      const lf = q > 0 ? i - 1 : i, rt = q < cx - 1 ? i + 1 : i
      // neighbours pull each node towards their average: the cloth holds together
      let ax = TAUT * (c.x[up] + c.x[dn] + c.x[lf] + c.x[rt] - 4 * c.x[i])
      let ay = TAUT * (c.y[up] + c.y[dn] + c.y[lf] + c.y[rt] - 4 * c.y[i])
      let az = TAUT * (c.z[up] + c.z[dn] + c.z[lf] + c.z[rt] - 4 * c.z[i])
      // at rest it hangs in soft vertical folds, deeper towards the hem, and
      // the folds drift sideways slowly as if there's a little air moving
      const x = q * CELL
      const drape = g * (15 * Math.sin(x * 0.055 + 1.2 * Math.sin(t * 0.45 + f.seed))
                       + 4 * Math.sin(x * 0.14 - t * 0.9 + r * 0.25))
      ax += HOLD * (lean.x * g - c.x[i])
      ay += HOLD * (lean.y * g - c.y[i])
      az += HOLD * (lean.z * g + drape - c.z[i])
      // sway that starts at the seam and swings wider down to the hem, a lift
      // with each gust, and flutter rolling across and down the cloth
      ax += g * gust * (180 + 430 * Math.sin(t * 1.5 - r * 0.28 + f.seed))
      ay -= g * gust * 120 * (0.6 + 0.4 * Math.sin(t * 2.1 + q * 0.2))
      az += g * gust * 560 * Math.sin(x * 0.07 - t * 3.2 + r * 0.35 + f.seed)
      if (m) {
        const dx = x - m.x, dy = ty - m.y
        const d2 = dx * dx + dy * dy
        if (d2 < 3600) {
          const k = (1 - Math.sqrt(d2) / 60) * g
          az -= 2200 * k                         // pressed in under the cursor
          if (m.fresh) { c.vx[i] += m.vx * 14 * k; c.vy[i] += m.vy * 14 * k }   // dragged along
        }
      }
      c.vx[i] = (c.vx[i] + ax * SUB) * DAMP
      c.vy[i] = (c.vy[i] + ay * SUB) * DAMP
      c.vz[i] = (c.vz[i] + az * SUB) * DAMP
    }
  }
  for (let i = cx; i < cx * cy; i++) {
    c.x[i] += c.vx[i] * SUB; c.y[i] += c.vy[i] * SUB; c.z[i] += c.vz[i] * SUB
  }
  if (m) m.fresh = false
}

// Cloth offset and fold shade at a point below the seam (bilinear)
function sampleCloth(c, x, y, out) {
  const fx = Math.max(0, Math.min(c.cx - 1.001, x / CELL))
  const fy = Math.max(0, Math.min(c.cy - 1.001, (y - c.top) / CELL))
  const q = fx | 0, r = fy | 0, u = fx - q, v = fy - r
  const i = r * c.cx + q, j = i + c.cx
  const lerp2 = a => (a[i] * (1 - u) + a[i + 1] * u) * (1 - v) + (a[j] * (1 - u) + a[j + 1] * u) * v
  out.x = lerp2(c.x); out.y = lerp2(c.y); out.z = lerp2(c.z)
  return out
}

// Folds: light from the upper left, so slopes facing it brighten and the far
// side of each fold darkens; compression (nodes bunching up) reads as a crease.
function drawFolds(f) {
  const { ctx } = f, c = f.cloth, { cx, cy } = c
  for (let r = 0; r < cy - 1; r++) {
    for (let q = 0; q < cx - 1; q++) {
      const i = r * cx + q, j = i + cx
      const gx = (c.z[i + 1] + c.z[j + 1]) - (c.z[i] + c.z[j])
      const gy = (c.z[j] + c.z[j + 1]) - (c.z[i] + c.z[i + 1])
      const squeeze = (c.x[i + 1] - c.x[i]) + (c.y[j] - c.y[i])
      let s = -(gx * 0.55 + gy * 0.85) * 0.028 + squeeze * 0.025
      if (s > -0.012 && s < 0.012) continue
      s = Math.max(-0.32, Math.min(0.24, s))
      const x0 = q * CELL, y0 = c.top + r * CELL
      const quiet = f.shade[Math.min(f.rows - 1, (y0 / STEP) | 0)]   // hold back under the text
      ctx.fillStyle = s > 0 ? '#fff' : '#000'
      ctx.globalAlpha = Math.abs(s) * (s > 0 ? quiet : 1)
      ctx.beginPath()
      ctx.moveTo(x0 + c.x[i], y0 + c.y[i])
      ctx.lineTo(x0 + CELL + c.x[i + 1], y0 + c.y[i + 1])
      ctx.lineTo(x0 + CELL + c.x[j + 1], y0 + CELL + c.y[j + 1])
      ctx.lineTo(x0 + c.x[j], y0 + CELL + c.y[j])
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

// The card's own outline follows the cloth below the seam: the sides gather
// in towards the hem and sway with it, and the hem scallops with the folds.
// Clipped to the card's box, so the rest shape is drawn in a little to leave
// the fabric room to swing.
function clipCard(f) {
  const c = f.cloth, { cx, cy } = c, w = f.w, h = f.h
  const pts = ['0 0', `${w}px 0`, `${w}px ${c.top}px`]
  // sides stop where the hem starts, so no sliver runs down past it
  const rowY = r => Math.min(h - HEM, c.top + r * CELL)
  const px = (x, y) => `${x.toFixed(1)}px ${y.toFixed(1)}px`
  for (let r = 1; r < cy - 1; r++) {
    const i = r * cx + cx - 1
    pts.push(px(Math.min(w, w - GATHER * c.give[r] + c.x[i]), rowY(r) + c.y[i]))
  }
  for (let q = cx - 1; q >= 0; q--) {
    const i = (cy - 1) * cx + q
    const off = (q * CELL - w / 2) / (w / 2)            // -1 at the left, 1 at the right
    const x = Math.max(0, Math.min(w, q * CELL + c.x[i] - off * GATHER))
    const y = Math.min(h, h - HEM + c.y[i] + c.z[i] * 0.4)
    pts.push(px(x, y))
  }
  for (let r = cy - 2; r >= 1; r--) {
    const i = r * cx
    pts.push(px(Math.max(0, GATHER * c.give[r] + c.x[i]), rowY(r) + c.y[i]))
  }
  pts.push(`0 ${c.top}px`)
  f.card.style.clipPath = `polygon(${pts.join(',')})`
}

const tmp = { x: 0, y: 0, z: 0 }

function draw(f, t) {
  const { ctx, cols, rows, mask, shade } = f
  if (!mask) return
  const { phase, speed } = f
  const still = reduce.matches
  const tt = still ? 0 : t + f.seed

  // ease the cursor and its presence; the lag is what makes it feel fluid
  const m = f.mouse
  if (m) { f.px += (m.x - f.px) * 0.14; f.py += (m.y - f.py) * 0.14 }
  f.hover += ((m && !still ? 1 : 0) - f.hover) * 0.08
  const hv = f.hover, R2 = RADIUS * RADIUS

  // live rings: radius and strength now, so the inner loop only does distance
  const rings = []
  for (const g of f.rings) {
    const age = t - g.t0
    if (age > RING_LIFE) continue
    const fade = 1 - age / RING_LIFE
    rings.push({ x: g.x, y: g.y, r: age * RING_SPEED, k: g.amp * fade * fade })
  }
  f.rings = f.rings.filter(g => t - g.t0 <= RING_LIFE)

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, f.w, f.h)
  if (f.cloth) drawFolds(f)
  ctx.fillStyle = '#fff'
  const cl = f.cloth

  const inv2w = 1 / (2 * RING_WIDTH * RING_WIDTH)
  for (let c = 0; c < cols; c++) {
    const x0 = c * STEP + (STEP - DOT) / 2
    const ph = phase[c], sp = speed[c]
    for (let r = 0; r < rows; r++) {
      const mk = mask[r * cols + c]
      const y0 = r * STEP + (STEP - DOT) / 2
      // a band of light sliding down the column, sharpened into streaks
      let lift = 0.5 + 0.5 * Math.sin(r * 0.11 - tt * sp * 1.6 + ph)
      lift *= lift * lift
      let x = x0, y = y0
      let ink = 0
      if (cl && y0 > cl.top) {
        sampleCloth(cl, x0, y0, tmp)
        x += tmp.x; y += tmp.y
        ink = Math.max(-0.3, Math.min(0.3, tmp.z * 0.008))   // pressed-in cloth catches less light
      }
      // the field parts around the cursor and brightens there
      if (hv > 0.01) {
        const dx = x0 - f.px, dy = y0 - f.py
        const d2 = dx * dx + dy * dy
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1
          const k = 1 - d / RADIUS, kk = k * k * hv
          x += (dx / d) * PUSH * kk
          y += (dy / d) * PUSH * kk
          lift += (mk > 0.02 ? 0.55 : 0.22) * kk
        }
      }
      for (let i = 0; i < rings.length; i++) {
        const g = rings[i]
        const dx = x0 - g.x, dy = y0 - g.y
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const off = d - g.r
        if (off > 3 * RING_WIDTH || off < -3 * RING_WIDTH) continue
        const band = Math.exp(-off * off * inv2w) * g.k
        x += (dx / d) * RING_PUSH * band
        y += (dy / d) * RING_PUSH * band
        lift += band * 0.9
      }
      let a = mk > 0.02 ? mk * (0.18 + 0.62 * lift) : FLOOR * (0.4 + lift)
      a = (a + ink) * shade[r]
      if (a < 0.015) continue
      ctx.globalAlpha = a > 1 ? 1 : a
      ctx.fillRect(x, y, DOT, DOT)
    }
  }
  ctx.globalAlpha = 1
  if (cl) clipCard(f)
}

// Row and page motion, eased: the fabric trails behind whichever way things move
const motion = { sl: null, sy: null, vx: 0, vy: 0, t: 0 }
let row = null

let raf = 0
function frame() {
  raf = 0
  const t = now()
  const dt = Math.min(0.05, motion.t ? t - motion.t : SUB)
  motion.t = t
  row = row || document.querySelector('.cards')
  const sl = row ? row.scrollLeft : 0, sy = scrollY
  if (motion.sl !== null && dt > 0) {
    motion.vx += ((sl - motion.sl) / dt - motion.vx) * 0.3
    motion.vy += ((sy - motion.sy) / dt - motion.vy) * 0.3
  }
  motion.sl = sl; motion.sy = sy
  const clamp = (v, m) => Math.max(-m, Math.min(m, v))
  const lean = {
    x: clamp(motion.vx * 0.014, 16),
    y: clamp(motion.vy * 0.01, 12),
    z: clamp(Math.abs(motion.vx) * 0.004 + Math.abs(motion.vy) * 0.003, 6),
  }
  const steps = reduce.matches ? 0 : Math.min(3, Math.max(1, Math.round(dt / SUB)))
  let busy = false
  for (const f of fields) {
    if (!f.visible) continue
    for (let k = 0; k < steps; k++) if (f.cloth) stepCloth(f, lean, t)
    draw(f, t)
    busy = true
  }
  if (busy && !reduce.matches && !document.hidden) raf = requestAnimationFrame(frame)
}
function wake() { if (!raf) raf = requestAnimationFrame(frame) }

const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    const f = fields.find(f => f.card === e.target)
    if (f) f.visible = e.isIntersecting
  }
  wake()
})

document.addEventListener('visibilitychange', wake)
reduce.addEventListener('change', () => { fields.forEach(f => { f.rings = []; draw(f, now()) }); wake() })

let resizeTimer
addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => { fields.forEach(f => { measure(f); draw(f, now()) }) }, 150)
})

const start = () => document.querySelectorAll('.cards .card').forEach(card => setup(card).catch(() => {}))
document.fonts?.ready ? document.fonts.ready.then(start) : start()
