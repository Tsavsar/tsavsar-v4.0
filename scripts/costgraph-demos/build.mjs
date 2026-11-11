// Builds the live CostGraph demos for v7/work/costgraph.html.
//
// Every demo is the real component from the CostGraph monorepo, rendered
// with made-up data, as its own small page that the case study loads in an
// iframe. The iframe keeps CostGraph's Tailwind (and its reset) away from
// the portfolio's CSS, and "replay" is just a reload.
//
// Point CG_DIR at an up-to-date checkout of baselinehq/costgraph-web-v2 with
// its packages built (pnpm install && pnpm --filter "./packages/*" build).
// Vite, React and Tailwind all come from that checkout; the portfolio still
// has no toolchain of its own.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const CG = resolve(process.env.CG_DIR || join(homedir(), 'Documents/GitHub/costgraph-web-v2'))
const dash = join(CG, 'apps/dashboard')
const site = join(CG, 'apps/costgraph-landing')
const out = resolve(here, '../../v7/work/cg-demos')
const only = process.argv[2] // build one demo: node build.mjs ascii-world

const need = createRequire(join(dash, 'package.json'))
const load = async (id) => import(pathToFileURL(need.resolve(id)).href)
const { build } = await load('vite')
const react = (await load('@vitejs/plugin-react')).default
const tailwind = (await load('@tailwindcss/vite')).default

// The demo sources are staged inside the checkout, under the dashboard, so
// plain Node resolution finds the dashboard's React and libraries for them:
// one React, one copy of everything, no portfolio node_modules involved.
const stage = join(dash, `.portfolio-demos-${only || 'all'}`)
rmSync(stage, { recursive: true, force: true })
cpSync(here, stage, { recursive: true, filter: (f) => !f.includes('/.gen') && !f.endsWith('build.mjs') })

// The two CSS surfaces. Tailwind only scans what it's pointed at, so each
// one names the component sources its demos pull in.
const gen = join(stage, '.gen')
mkdirSync(gen, { recursive: true })
writeFileSync(join(gen, 'dashboard.css'), `@import '${dash}/src/index.css';
@source '${dash}/src/**/*.{ts,tsx}';
@source '${CG}/packages/ui/src/**/*.{ts,tsx}';
@source '../demos/**/*.{ts,tsx}';
@source '../shared/**/*.{ts,tsx}';
@import '../shared/fonts.css';
`)
writeFileSync(join(gen, 'site.css'), `@import '${site}/src/index.css';
@source '${site}/src/**/*.{ts,tsx}';
@source '${CG}/packages/site/src/**/*.{ts,tsx}';
@source '${CG}/packages/ui/src/**/*.{ts,tsx}';
@source '../demos/**/*.{ts,tsx}';
@source '../shared/**/*.{ts,tsx}';
@import '../shared/fonts.css';
`)

const pages = readdirSync(join(stage, 'demos'))
  .filter((f) => f.endsWith('.html') && (!only || f === `${only}.html`))
const input = Object.fromEntries(pages.map((f) => [f.replace(/\.html$/, ''), join(stage, 'demos', f)]))

// `@/` means each app's own src, as it does in the monorepo: website files
// (and the site-* demos) resolve into the website, the rest into the dashboard.
const cgResolve = {
  name: 'cg-resolve',
  enforce: 'pre',
  async resolveId(id, importer, opts) {
    if (!importer) return null
    if (id === '@baselinehq/ts-shared') return '\0ts-shared'
    // the dashboard's route list for its search palette, which no demo opens
    if (id === 'virtual:link-manifest') return '\0link-manifest'
    if (id.startsWith('@/')) {
      const app = importer.startsWith(site) || importer.includes('/demos/site-') ? site : dash
      return this.resolve(join(app, 'src', id.slice(2)), importer, { ...opts, skipSelf: true })
    }
    return null
  },
  load(id) {
    // a private registry package this machine can't install; see the stub
    if (id === '\0link-manifest') return 'export const LINKABLE_ROUTES = []'
    if (id === '\0ts-shared') return readFileSync(join(stage, 'shared/ts-shared-stub.js'), 'utf8')
  },
  transform(code, id) {
    // fonts come from the portfolio's own /fonts, not Google's
    if (id.endsWith('.css') && code.includes('fonts.googleapis.com')) {
      return code.replace(/@import url\(['"]https:\/\/fonts\.googleapis\.com[^)]*\);?/g, '')
    }
  },
}

await build({
  configFile: false,
  root: join(stage, 'demos'),
  base: '/work/cg-demos/',
  logLevel: 'warn',
  plugins: [cgResolve, react(), tailwind()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom', 'nuqs'],
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  esbuild: { keepNames: true },
  build: {
    outDir: out,
    emptyOutDir: !only,
    assetsInlineLimit: 0,
    rollupOptions: { input },
    chunkSizeWarningLimit: 2000,
  },
})

rmSync(stage, { recursive: true, force: true })
console.log(`built ${pages.length} demo${pages.length === 1 ? '' : 's'} into ${out}`)
