// The CostGraph hero's markup, cut from the case study page: the 1200 x 630
// stage (.cg-stage) the OG image and the hero video are both taken from, so
// neither is a copy that can drift from the page.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export function heroMarkup(v7, file) {
  const html = readFileSync(join(v7, file), 'utf8')
  const start = html.indexOf('<div class="cg-stage"')
  if (start < 0) throw new Error(`${file}: no .cg-stage`)
  const tag = /<\/?div\b[^>]*>/g
  tag.lastIndex = start
  let depth = 0
  for (let m; (m = tag.exec(html)); ) {
    depth += m[0][1] === '/' ? -1 : 1
    if (depth === 0) return html.slice(start, tag.lastIndex)
  }
  throw new Error(`${file}: .cg-stage never closes`)
}

// The stage on its own at its own size, with nothing of the page around it
export const heroStyle = `
  html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; background: #fff; transition: none; }
  .study-hero.cg-hero { position: relative; width: 1200px; height: 630px; margin: 0; border-radius: 0; overflow: hidden; }
  .cg-hero::after { display: none; }
`
