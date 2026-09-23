// Renders v7/resume.pdf from v7/resume.html with headless Chrome, using the
// page's print stylesheet. Run after editing the resume page:
//   node scripts/resume/pdf.mjs
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const v7 = join(here, '../../v7')
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
  '--virtual-time-budget=4000', '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${join(v7, 'resume.pdf')}`,
  pathToFileURL(join(v7, 'resume.html')).href,
], { stdio: 'ignore' })
console.log('v7/resume.pdf')
