// The CostGraph hero as a video, for posting the case study where a link
// preview can't move. It's the hero itself (the page's markup, styles and
// costgraph-hero.js), at rest the way the OG image shows it; a cursor comes
// in and clicks the card, which plays the month again, as it does on the
// page; then it rests on a few categories, each greying out the rest, and
// leaves. It ends on the frame it starts on, so it loops.
//
// Every frame is stepped, not filmed in real time: the page's timers, its
// animation frames and every CSS transition and animation run on a clock
// this script advances a 60th of a second at a time, so nothing stutters
// however slow the capture is.
//
//   node scripts/og/video.mjs [out dir]   (needs Google Chrome and ffmpeg)
//
// Writes costgraph-hero.mp4 (1920 x 1008, the whole 1200 x 630 frame) and
// costgraph-hero-card.mp4 (1080 x 1134, the card on its own, the crop the
// hero takes on a phone).
import { spawn } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { heroMarkup, heroStyle } from './hero.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const v7 = resolve(here, '../../v7')
const outDir = resolve(process.argv[2] || join(here, '../../../exports/costgraph'))
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const FPS = 60
const W = 1200
const H = 630
const SCALE = 2
mkdirSync(outDir, { recursive: true })

// ---- the page ---------------------------------------------------------------
const page = `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8" />
<base href="/work/" />
<link rel="stylesheet" href="/styles.css" />
<style>${heroStyle}</style></head><body>
<div class="study-hero cg-hero cg-armed">${heroMarkup(v7, 'work/costgraph.html')}</div>
<script type="module" src="/work/costgraph-hero.js"></script>
<script type="module">
  import { createCursor } from '/__cursor.js'
  const wait = (ms) => new Promise((r) => setTimeout(r, ms))
  const pointer = createCursor({ wait, rate: () => 1 })
  const $ = (s) => document.querySelector(s)
  const over = (el, x, y) => {
    const o = { bubbles: true, view: window, pointerType: 'mouse', clientX: x, clientY: y }
    el.dispatchEvent(new PointerEvent('pointerover', o))
    el.dispatchEvent(new PointerEvent('pointermove', o))
  }
  // where the words are, not the box they sit in (the total and the
  // legend's names fill their rows)
  const text = (el) => {
    const range = document.createRange()
    range.selectNodeContents(el)
    return range.getBoundingClientRect()
  }
  const events = (el, x, y, types) => {
    const o = { bubbles: true, cancelable: true, view: window, button: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true, clientX: x, clientY: y }
    for (const t of types) el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, o))
  }
  // a click on the words themselves
  const click = async (el) => {
    const r = text(el)
    const x = r.left + r.width * 0.62
    const y = r.top + r.height / 2
    await pointer.moveTo(x, y)
    events(el, x, y, ['pointerover', 'mouseover', 'pointermove', 'mousemove'])
    await wait(140)
    pointer.down()
    events(el, x, y, ['pointerdown', 'mousedown'])
    await wait(90)
    events(el, x, y, ['pointerup', 'mouseup'])
    el.click()
    pointer.up()
  }
  // a category in the legend, pointed at by its name
  const row = async (k) => {
    const el = $('.cg-row[data-k="' + k + '"]')
    const r = text(el.querySelector('span'))
    await pointer.hoverOn(el, r.left + r.width * 0.55, r.top + r.height / 2)
  }
  window.__story = async () => {
    // the card at rest, as the link preview shows it
    await wait(900)
    // in from the lower right, onto the total: a click plays the month again
    pointer.pointTo(W + 40, H + 60)
    await click($('.cg-total'))
    await wait(1750)
    // a category at a time, the rest greying out
    await row('volume')
    await wait(1050)
    await row('model')
    await wait(1050)
    // and the same in the chart: the unassigned spend on the busiest day
    const seg = $('.cg-col[style="--c:4"] [data-k="unassigned"]')
    const s = seg.getBoundingClientRect()
    await pointer.hoverOn(seg, s.left + s.width * 0.45, s.top + s.height / 2)
    await wait(1150)
    // off the card and out of the frame; the chart is whole again
    const out = pointer.moveTo(W + 40, H + 80)
    await wait(160)
    over($('.cg-card'), pointer.at.x, pointer.at.y)
    await out
    pointer.leave()
    await wait(1300)
    window.__done = true
  }
  const W = ${W}, H = ${H}
</script>
</body></html>`

// ---- the clock --------------------------------------------------------------
// In before anything on the page runs. performance.now, timers and animation
// frames read and fire on virtual time, and every animation the page starts
// is paused and set to where it would be at that time.
const CLOCK = `(() => {
  const realTimeout = window.setTimeout.bind(window)
  let now = 0
  let seq = 0
  const timers = []
  const frames = new Map()
  const born = new WeakMap()
  performance.now = () => now
  window.setTimeout = (fn, ms, ...args) => { const id = ++seq; timers.push({ id, at: now + Math.max(0, Number(ms) || 0), fn, args }); return id }
  window.setInterval = (fn, ms, ...args) => { const every = Math.max(1, Number(ms) || 0); const id = ++seq; timers.push({ id, at: now + every, fn, args, every }); return id }
  window.clearTimeout = window.clearInterval = (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1) }
  window.requestAnimationFrame = (fn) => { const id = ++seq; frames.set(id, fn); return id }
  window.cancelAnimationFrame = (id) => { frames.delete(id) }
  const settle = () => new Promise((r) => realTimeout(r, 0))
  const run = (fn, args) => { try { typeof fn === 'function' ? fn(...args) : (0, eval)(fn) } catch (e) { console.error(e) } }
  function seek() {
    for (const a of document.getAnimations()) {
      if (!born.has(a)) born.set(a, now)
      if (a.playState !== 'paused') a.pause()
      a.currentTime = (now - born.get(a)) * a.playbackRate
    }
  }
  window.__clock = {
    get now() { return now },
    async to(end) {
      for (;;) {
        timers.sort((a, b) => a.at - b.at || a.id - b.id)
        const t = timers[0]
        if (!t || t.at > end) break
        now = Math.max(now, t.at)
        if (t.every) t.at += t.every
        else timers.shift()
        run(t.fn, t.args)
        await settle()
        seek()
      }
      now = end
      const due = [...frames.values()]
      frames.clear()
      for (const fn of due) run(fn, [now])
      await settle()
      seek()
      await settle()
    },
  }
})()`

// ---- serving it -------------------------------------------------------------
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' }
const server = createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (url === '/__hero.html') return res.writeHead(200, { 'content-type': 'text/html' }).end(page)
  const path = url === '/__cursor.js' ? join(here, '../shared/cursor.js') : join(v7, url)
  if (!path.startsWith(resolve(here, '..')) && !path.startsWith(v7)) return res.writeHead(404).end()
  if (!existsSync(path) || statSync(path).isDirectory()) return res.writeHead(404).end()
  res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' })
  createReadStream(path).pipe(res)
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const origin = `http://127.0.0.1:${server.address().port}`

// ---- Chrome, over the DevTools protocol --------------------------------------
const profile = mkdtempSync(join(tmpdir(), 'cg-video-'))
const browser = spawn(chrome, [
  '--headless=new', '--hide-scrollbars', '--mute-audio', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, `--window-size=${W},${H}`, 'about:blank',
], { stdio: 'ignore' })
const portFile = join(profile, 'DevToolsActivePort')
for (let i = 0; !existsSync(portFile) || !readFileSync(portFile, 'utf8').includes('\n'); i++) {
  if (i > 200) throw new Error('Chrome never opened its DevTools port')
  await new Promise((r) => setTimeout(r, 50))
}
const port = readFileSync(portFile, 'utf8').split('\n')[0]
const target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page')
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j })
let seq = 0
const pending = new Map()
ws.onmessage = (m) => {
  const d = JSON.parse(m.data)
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') console.error('page:', d.params.args.map((a) => a.value ?? a.description).join(' '))
  if (d.method === 'Runtime.exceptionThrown') console.error('page:', d.params.exceptionDetails.exception?.description)
  const p = pending.get(d.id)
  if (!p) return
  pending.delete(d.id)
  d.error ? p.j(new Error(d.error.message)) : p.r(d.result)
}
const send = (method, params = {}) => new Promise((r, j) => {
  const id = ++seq
  pending.set(id, { r, j })
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value

const frameDir = mkdtempSync(join(tmpdir(), 'cg-frames-'))
try {
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: SCALE, mobile: false })
  await send('Page.addScriptToEvaluateOnNewDocument', { source: CLOCK })
  await send('Page.navigate', { url: `${origin}/__hero.html` })
  for (let i = 0; !(await evaluate(`!!window.__story && document.fonts.status === 'loaded' && [...document.images].every((i) => i.complete)`)); i++) {
    if (i > 200) throw new Error('the page never got ready')
    await new Promise((r) => setTimeout(r, 50))
  }
  // the hero's own entrance plays once, off camera, so the video opens on
  // the card at rest
  await new Promise((r) => setTimeout(r, 400))
  for (let t = 0; t <= 3000; t += 1000 / FPS) await evaluate(`__clock.to(${t})`)
  const t0 = await evaluate('__clock.now')
  await evaluate('void window.__story()')

  // ffmpeg takes the frames as they come: the whole frame, and the card
  const enc = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', '-r', String(FPS)]
  const ff = spawn('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-filter_complex',
    `[0:v]split=2[a][b];[a]scale=1920:1008:flags=lanczos:out_color_matrix=bt709[full];[b]crop=${W}:${H * SCALE}:${W}:0,scale=1080:1134:flags=lanczos:out_color_matrix=bt709[card]`,
    '-map', '[full]', ...enc, join(outDir, 'costgraph-hero.mp4'),
    '-map', '[card]', ...enc, join(outDir, 'costgraph-hero-card.mp4'),
  ], { stdio: ['pipe', 'inherit', 'inherit'] })
  const done = new Promise((r, j) => ff.on('close', (c) => (c ? j(new Error('ffmpeg failed')) : r())))

  let n = 0
  for (;; n++) {
    await evaluate(`__clock.to(${t0 + (n * 1000) / FPS})`)
    const { data } = await send('Page.captureScreenshot', { format: 'png' })
    const png = Buffer.from(data, 'base64')
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r))
    // a still every half second, to look through
    if (n % (FPS / 2) === 0) writeFileSync(join(frameDir, `${String(n).padStart(4, '0')}.png`), png)
    if (await evaluate('!!window.__done')) break
    if (n > FPS * 20) throw new Error('the story never finished')
  }
  ff.stdin.end()
  await done
  console.log(`${n + 1} frames, ${((n + 1) / FPS).toFixed(2)}s`)
  console.log('wrote', join(outDir, 'costgraph-hero.mp4'))
  console.log('wrote', join(outDir, 'costgraph-hero-card.mp4'))
  console.log('stills', frameDir)
} finally {
  ws.close()
  const exited = new Promise((r) => browser.once('exit', r))
  browser.kill()
  await exited
  server.close()
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 })
}
