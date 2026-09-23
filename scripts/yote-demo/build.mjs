// Bundles the live Yöte fields for v7/work/yote.html.
// Resolves react and yote-ui from the local Yöte checkout, so the portfolio
// shows exactly what the library ships. Set YOTE_DIR if it lives elsewhere.
import { copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const yote = process.env.YOTE_DIR || join(homedir(), 'Documents/GitHub/yote')
const out = join(here, '../../v7/work')
// esbuild comes from the Yöte checkout too; the portfolio has no toolchain.
const { build } = await import(join(yote, 'node_modules/esbuild/lib/main.js'))

await build({
  entryPoints: [join(here, 'entry.jsx')],
  outfile: join(out, 'yote-demo.js'),
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2020',
  jsx: 'automatic',
  // One React for the whole bundle. Without the aliases the entry would
  // pick up the portfolio's own node_modules copy and yote-ui the Yöte one,
  // and hooks fail on the second React.
  alias: {
    react: join(yote, 'node_modules/react'),
    'react-dom': join(yote, 'node_modules/react-dom'),
    'yote-ui': join(yote, 'packages/yote-ui'),
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'eof',
})

copyFileSync(join(yote, 'packages/yote-ui/dist/styles.css'), join(out, 'yote-ui.css'))
