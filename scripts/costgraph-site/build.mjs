// Builds the real costgraph.ai website for the case study's demos, the
// same way scripts/costgraph-app builds the dashboard: from its own code,
// in frames at desktop size, with a scripted walkthrough. The website has
// no backend to fake; local/guard.js keeps every request and link inside
// the frame.
//
//   CG_DIR=/path/to/costgraph-web-v2 node scripts/costgraph-site/build.mjs
import { cpSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const CG = resolve(process.env.CG_DIR || join(homedir(), 'Documents/GitHub/costgraph-web-v2'))
const site = join(CG, 'apps/costgraph-landing')
const out = resolve(here, '../../v7/work/cg-site')

function patch(file, marker, from, to) {
  const path = join(site, file)
  const s = readFileSync(path, 'utf8')
  if (s.includes(marker)) return
  if (!s.includes(from)) throw new Error(`${file}: can't find ${JSON.stringify(from.slice(0, 60))}`)
  writeFileSync(path, s.replace(from, to))
}

mkdirSync(join(site, 'public/__local'), { recursive: true })
cpSync(join(here, 'local'), join(site, 'public/__local'), { recursive: true })
cpSync(join(here, 'portfolio'), join(site, 'src/__portfolio'), { recursive: true })

// absolute: the live site serves this folder without its trailing slash
patch('index.html', '__local/guard.js', '<head>', '<head>\n    <script src="/work/cg-site/__local/guard.js"></script>')
patch('src/main.tsx', '__portfolio/router', "import { BrowserRouter } from 'react-router-dom';", "import { DemoRouter as BrowserRouter } from './__portfolio/router';")
patch('src/main.tsx', '__portfolio/driver', "const root = document.getElementById('root');", "void import('./__portfolio/driver').then(m => m.start());\n\nconst root = document.getElementById('root');")

// Design changes shown in the demos ahead of the website: the contents
// pill's icons at 16px, and its minimise control a 20px target sitting
// 8px from the counter instead of pulled out by a negative margin.
{
  const file = join(CG, 'packages/site/src/post-contents.tsx')
  let s = readFileSync(file, 'utf8')
  if (!s.includes('demo: pill icons')) {
    s = s
      .replace('<div className="flex items-center gap-3">', '<div className="flex items-center gap-2">')
      .replace('-m-1 flex size-6 cursor-pointer', 'flex size-5 cursor-pointer')
      .replace('<svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">', '<svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none">')
      .replace('className="size-3.5 shrink-0 text-white/50"', 'className="size-4 shrink-0 text-white/50"')
    writeFileSync(file, `// demo: pill icons\n${s}`)
  }
  // Pressing the pill focuses it, focus opens the card, the open card makes
  // the pill inert, and the browser drops its focus: that blur closed the
  // card again. Focus moves into the card instead.
  s = readFileSync(file, 'utf8')
  if (!s.includes('demo: pill focus')) {
    const from = `                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);`
    if (!s.includes(from)) throw new Error("post-contents.tsx: can't find the pill's onBlur")
    s = s.replace(from, `                // demo: pill focus
                const nav = event.currentTarget;
                if (nav.contains(event.relatedTarget)) return;
                if (!event.relatedTarget && (event.target as HTMLElement).closest('[inert]')) {
                    nav.querySelector<HTMLElement>('button[aria-label="Minimise the contents"]')?.focus({ preventScroll: true });
                    return;
                }
                setOpen(false);`)
    writeFileSync(file, s)
  }
  // The contents list at its full height: eight sections fit, so the card
  // grows to hold them rather than scrolling inside a 256px box
  s = readFileSync(file, 'utf8')
  if (!s.includes('demo: no inner scroll')) {
    const open = `                    <ScrollArea
                        tone="dark"
                        fade
                        className="mt-3 max-h-64"
                        viewportClassName="max-h-64"
                    >`
    const close = `                    </ScrollArea>`
    if (!s.includes(open) || !s.includes(close)) throw new Error("post-contents.tsx: can't find the contents ScrollArea")
    s = s.replace(open, `                    {/* demo: no inner scroll */}
                    <div className="mt-3">`).replace(close, `                    </div>`)
    writeFileSync(file, s)
  }
}

const vite = join(realpathSync(join(site, 'node_modules/vite')), 'bin/vite.js')
execFileSync(process.execPath, [vite, 'build', '--base', '/work/cg-site/', '--outDir', out, '--emptyOutDir'], { cwd: site, stdio: 'inherit' })
// Only what the demos show: the one blog post, not the whole blog's images
const POST = 'node-rightsizing'
// Every post keeps its cover and hero (the related-posts cards show them);
// only the demo's post keeps the images inside it
for (const name of readdirSync(join(out, 'posts'), { withFileTypes: true })) {
  if (name.name.startsWith(POST) || !name.isDirectory()) continue
  for (const file of readdirSync(join(out, 'posts', name.name))) {
    if (!/^cover\./.test(file)) rmSync(join(out, 'posts', name.name, file), { recursive: true, force: true })
  }
}
for (const name of ['legal', 'md', 'og-video.mp4']) rmSync(join(out, name), { recursive: true, force: true })
console.log('built the CostGraph website into', out)
