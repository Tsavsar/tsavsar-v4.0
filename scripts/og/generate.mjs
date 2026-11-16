// Renders the 1200x630 link previews into v7/og/ with headless Chrome.
// Run: node scripts/og/generate.mjs   (needs Google Chrome installed)
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { heroMarkup, heroStyle } from './hero.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '../../v7/og')
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
mkdirSync(out, { recursive: true })

// og/home.png is Shater's own image, not generated. Never add it back here.
const PAGES = [
  { name: 'about', title: 'About me', desc: 'Arsenal, the Knicks, chess, films and far too much music.', card: 'card-luotain', img: '../../public/assets/pfp.png', solo: 1, url: 'shatermt.com/about' },
  // CostGraph's own OG frame: its wordmark and line on the left, the blue
  // panel with the spend card on the right. The case study hero is built
  // from that frame at 1200 x 630, so this is the hero itself, taken
  // from the page, never a copy that can drift from it
  { name: 'costgraph', hero: 'work/costgraph.html' },
  { name: 'luotain', title: 'Luotain', desc: 'Short links and QR codes that keep their own scan data, editable after print.', card: 'card-luotain', img: '../../v7/media/luotain/cover-4.webp', url: 'shatermt.com/work/luotain' },
  { name: 'yote', title: 'Yöte', desc: 'Form inputs for React. One set of props, zero dependencies, 24KB.', card: 'card-yote', img: '../../v7/media/yote/cover-form.webp', url: 'shatermt.com/work/yote' },
  { name: 'lonar', title: 'Lönar', desc: 'Invoicing that works before you sign up.', card: 'card-lonar', img: '../../v7/media/lonar/cover-2.webp', url: 'shatermt.com/work/lonar' },
  { name: 'kernui', title: 'KernUI', desc: 'A design system of 3,000+ components built on one token set.', card: 'card-kernui', img: '../../v7/media/kernui/cover-table.webp', url: 'shatermt.com/work/kernui' },
  { name: 'fundify', title: 'Fundify', desc: 'A savings app that rewards the good moves instead of scolding the bad ones.', card: 'card-kernui', img: '../../v7/heroes/fundify.jpg', url: 'shatermt.com/work/fundify' },
  { name: 'explorations', title: 'Explorations', desc: 'Prototypes, components and experiments.', card: 'card-kernui', img: '../../public/assets/pfp.png', solo: 1, url: 'shatermt.com/explorations' },
  { name: 'vicariously', title: 'Living through the main character', desc: 'Why some films become favourites: the characters we can see ourselves being.', card: 'card-lonar', img: '../../public/assets/pfp.png', solo: 1, url: 'shatermt.com/articles/vicariously' },
]

const v7 = join(here, '../../v7')

// A page whose hero is a 1200 x 630 stage (.cg-stage), on its own at that
// size: its markup cut from the page, with the site's styles and the
// chart at rest (no cg-armed, so nothing is held down for an entrance)
function heroPage(file) {
  const page = `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8" />
<base href="${pathToFileURL(join(v7, dirname(file))).href}/" />
<link rel="stylesheet" href="${pathToFileURL(join(v7, 'styles.css')).href}" />
<style>${heroStyle}</style></head><body><div class="study-hero cg-hero">${heroMarkup(v7, file)}</div></body></html>`
  const tmp = join(mkdtempSync(join(tmpdir(), 'og-')), 'hero.html')
  writeFileSync(tmp, page)
  return pathToFileURL(tmp).href
}

// node scripts/og/generate.mjs costgraph   renders just the pages named
const only = process.argv.slice(2)
const template = pathToFileURL(join(here, 'template.html')).href
for (const p of PAGES.filter((p) => !only.length || only.includes(p.name))) {
  const q = new URLSearchParams(Object.entries(p).map(([k, v]) => [k, String(v)]))
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=4000',
    `--screenshot=${join(out, p.name + '.png')}`, p.hero ? heroPage(p.hero) : `${template}?${q}`,
  ], { stdio: 'ignore' })
  console.log('og/' + p.name + '.png')
}
