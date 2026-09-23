// Renders the 1200x630 link previews into v7/og/ with headless Chrome.
// Run: node scripts/og/generate.mjs   (needs Google Chrome installed)
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, '../../v7/og')
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
mkdirSync(out, { recursive: true })

const PAGES = [
  { name: 'home', title: 'Product designer', desc: 'I design products as systems of reusable parts, then write the frontend they become.', card: 'card-costgraph', img: '../../public/assets/pfp.png', solo: 1 },
  { name: 'about', title: 'About me', desc: 'Arsenal, the Knicks, chess, films and far too much music.', card: 'card-luotain', img: '../../public/assets/pfp.png', solo: 1, url: 'shatermt.com/about' },
  { name: 'costgraph', title: 'CostGraph.ai', desc: 'Kubernetes and cloud spend, and exactly where to cut it.', card: 'card-costgraph', img: '../../v7/media/costgraph/dashboard.webp', url: 'shatermt.com/work/costgraph' },
  { name: 'luotain', title: 'Luotain', desc: 'Short links and QR codes that keep their own scan data, editable after print.', card: 'card-luotain', img: '../../v7/heroes/luotain.jpg', url: 'shatermt.com/work/luotain' },
  { name: 'yote', title: 'Yöte', desc: 'Form inputs for React. One set of props, zero dependencies, 24KB.', card: 'card-yote', img: '../../v7/media/yote/yote-digit.webp', url: 'shatermt.com/work/yote' },
  { name: 'lonar', title: 'Lönar', desc: 'Invoicing that works before you sign up.', card: 'card-lonar', img: '../../v7/media/lonar/cover.webp', url: 'shatermt.com/work/lonar' },
  { name: 'kernui', title: 'KernUI', desc: 'A design system of 3,000+ components built on one token set.', card: 'card-kernui', img: '../../v7/media/kernui/kernui-demo-poster.webp', url: 'shatermt.com/work/kernui' },
  { name: 'fundify', title: 'Fundify', desc: 'A savings app that rewards the good moves instead of scolding the bad ones.', card: 'card-kernui', img: '../../v7/heroes/fundify.jpg', url: 'shatermt.com/work/fundify' },
  { name: 'explorations', title: 'Explorations', desc: 'Prototypes, components and experiments.', card: 'card-kernui', img: '../../public/assets/pfp.png', solo: 1, url: 'shatermt.com/explorations' },
  { name: 'vicariously', title: 'Living through the main character', desc: 'Why some films become favourites: the characters we can see ourselves being.', card: 'card-lonar', img: '../../public/assets/pfp.png', solo: 1, url: 'shatermt.com/articles/vicariously' },
]

const template = pathToFileURL(join(here, 'template.html')).href
for (const p of PAGES) {
  const q = new URLSearchParams(Object.entries(p).map(([k, v]) => [k, String(v)]))
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=4000',
    `--screenshot=${join(out, p.name + '.png')}`, `${template}?${q}`,
  ], { stdio: 'ignore' })
  console.log('og/' + p.name + '.png')
}
