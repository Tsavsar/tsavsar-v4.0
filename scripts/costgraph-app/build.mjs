// Builds the real CostGraph dashboard for the case study's demos.
//
// The demos on /work/costgraph are the actual app, built from its own code,
// running in frames at desktop size with a fake backend (local/backend.js)
// that answers sign-in and the API in the browser. Nothing in a demo talks
// to a real service.
//
// CG_DIR is a checkout of baselinehq/costgraph-web-v2 with its packages
// built and its API schemas generated. Four small patches are applied to
// it (idempotent): the fake backend in index.html, a memory router, a
// prepare step before boot, and the fonts served from the portfolio.
//
//   CG_DIR=/path/to/costgraph-web-v2 node scripts/costgraph-app/build.mjs
//   CG_DIR=... node scripts/costgraph-app/build.mjs --patch-only   (for vite dev)
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { realpathSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const CG = resolve(process.env.CG_DIR || join(homedir(), 'Documents/GitHub/costgraph-web-v2'))
const dash = join(CG, 'apps/dashboard')
const out = resolve(here, '../../v7/work/cg-app')

function patch(file, edits) {
  const path = join(dash, file)
  let s = readFileSync(path, 'utf8')
  for (const [marker, from, to] of edits) {
    if (s.includes(marker)) continue
    if (!s.includes(from)) throw new Error(`${file}: can't find ${JSON.stringify(from.slice(0, 60))}`)
    s = s.replace(from, to)
  }
  writeFileSync(path, s)
}

// 1. The portfolio's files go into the checkout
mkdirSync(join(dash, 'public/__local'), { recursive: true })
cpSync(join(here, 'local'), join(dash, 'public/__local'), { recursive: true })
cpSync(join(here, 'portfolio'), join(dash, 'src/__portfolio'), { recursive: true })

// 2. The fake backend loads before anything else on the page
patch('index.html', [[
  '__local/backend.js',
  '<head>',
  '<head>\n    <script src="__local/backend.js"></script>\n    <script src="__local/routes.js"></script>',
]])
// 3. A memory router, so each frame opens on its own screen
patch('src/bootstrap.tsx', [
  ['@/__portfolio/router', "import { BrowserRouter } from 'react-router-dom';", "import { DemoRouter as BrowserRouter } from '@/__portfolio/router';"],
])
// 4. The demo's starting state is set before the app boots
patch('src/main.tsx', [[
  '__portfolio/prepare',
  ".then(() => import('./bootstrap'))",
  ".then(() => import('./__portfolio/prepare').then(m => m.prepare()))\n    .then(() => import('./bootstrap'))",
]])
// 5. Fonts from the portfolio's own /fonts, not Google's
{
  const path = join(dash, 'src/index.css')
  let css = readFileSync(path, 'utf8')
  if (!css.includes('/fonts/geist-latin.woff2')) {
    css = css.replace(/^@import url\('https:\/\/fonts\.googleapis\.com.*\n/m, '')
    css += `
@font-face { font-family: 'Geist'; font-weight: 100 900; font-display: swap; src: url(/fonts/geist-latin.woff2) format('woff2'); }
@font-face { font-family: 'Funnel Display'; font-weight: 300 800; font-display: swap; src: url(/fonts/funnel-display-latin.woff2) format('woff2'); }
@font-face { font-family: 'Geist Mono'; font-weight: 100 900; font-display: swap; src: url(/fonts/geist-mono-latin.woff2) format('woff2'); }
`
    writeFileSync(path, css)
  }
}

// 6. Design changes shown in the demos ahead of the product. Support grows
// out of its sidebar button rather than fading in place.
patch('src/components/support/support-card.tsx', [
  ['scale-[0.6]', 'origin-bottom-left translate-y-1 scale-[0.98]', 'origin-bottom-left translate-y-3 scale-[0.6]'],
  ['OPEN_MS = 260', 'const OPEN_MS = 200;', 'const OPEN_MS = 260;'],
  ['CLOSE_MS = 160', 'const CLOSE_MS = 140;', 'const CLOSE_MS = 160;'],
  // Tailwind 4's scale-* and translate-* set the scale and translate
  // properties, not transform, so a transition on transform never moved
  // them: the card and the messages only faded.
  ['transition-[opacity,scale,translate]', 'transition-[opacity,transform]', 'transition-[opacity,scale,translate]'],
])
patch('src/components/support/messages.tsx', [
  ['transition-[opacity,translate]', 'transition-[opacity,transform]', 'transition-[opacity,translate]'],
])

// 7. Icons that say what the button will do. Support's "open fully" icon was
// only turned 180° once the panel was open, which is the same outward
// shape, so a large panel still offered to grow. The setup guide showed its
// minimise icon even when minimised. Each state gets its own icon, drawn to
// match the one it pairs with.
writeFileSync(join(dash, 'src/assets/collapse.svg'), `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 4V9H16" stroke="#D1D5DC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 11H9V16" stroke="#D1D5DC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`)
writeFileSync(join(dash, 'src/assets/get-started/expand.svg'), `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.39844 9.60156V13.6016H6.39844" stroke="#252A31" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.59766 2.39844H13.5977V6.39844" stroke="#252A31" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`)
patch('src/components/support/support-card.tsx', [
  ['@/assets/collapse.svg', "import expand from '@/assets/expand.svg';", "import collapse from '@/assets/collapse.svg';\nimport expand from '@/assets/expand.svg';"],
  ['src={docked ? collapse : expand}', "<Icon src={expand} className={cn('size-4', docked && 'rotate-180')} />", '<Icon src={docked ? collapse : expand} className="size-4" />'],
])

// 8. The setup guide opens and folds instead of swapping in one frame: the
// card's body animates its height (it's anchored at the bottom, so it opens
// upward) and fades, and the ring slides into the header as it folds.
patch('src/components/get-started/setup-guide-widget.tsx', [
  ['get-started/expand.svg', "import minimise from '@/assets/get-started/minimise.svg';", "import expandGuide from '@/assets/get-started/expand.svg';\nimport minimise from '@/assets/get-started/minimise.svg';"],
  ["'p-1.5', // demo", "                minimised ? 'p-1.5' : 'gap-2.5 px-1.5 pt-1.5 pb-2.5',", "                'p-1.5', // demo: the body carries its own spacing"],
  ['demo: the ring slides in', `                {minimised && (
                    <SetupProgressRing
                        reached={Math.min(current + 1, stages.length)}
                        className="-mb-px"
                    />
                )}`, `                {/* demo: the ring slides in as the card folds */}
                <span
                    aria-hidden
                    className={cn(
                        'flex shrink-0 overflow-hidden transition-[width,margin,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        minimised ? 'mr-0 w-5 opacity-100' : '-mr-2 w-0 opacity-0'
                    )}
                >
                    <SetupProgressRing
                        reached={Math.min(current + 1, stages.length)}
                        className="-mb-px"
                    />
                </span>`],
  ['src={minimised ? expandGuide : minimise}', '<Icon src={minimise} className="size-4" />', '<Icon src={minimised ? expandGuide : minimise} className="size-4" />'],
  ['demo: the body folds', `            {!minimised && (
                <>
                    <div aria-hidden className="flex h-1 gap-3 px-2.5">`, `            {/* demo: the body folds to nothing and opens back up */}
            <div
                inert={minimised}
                className={cn(
                    'grid transition-[grid-template-rows,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    minimised ? 'grid-rows-[0fr] opacity-0 duration-200' : 'grid-rows-[1fr] opacity-100 duration-300'
                )}
            >
                {/* the row folds to zero only if the folding box has no padding of its own */}
                <div className="min-h-0 overflow-hidden">
                <div className="flex flex-col gap-2.5 pt-2.5 pb-1">
                    <div aria-hidden className="flex h-1 gap-3 px-2.5">`],
  ['demo: end of the body', `                    </Accordion>
                </>
            )}
        </aside>`, `                    </Accordion>
                </div>
                </div>
            </div>
            {/* demo: end of the body */}
        </aside>`],
])

// 9. Get started, through to the end. Each step of the cluster flow fades
// out before the next fades in. When the operator reports in, the checklist
// completes one check at a time and waits for Next, instead of jumping
// straight to "Cluster connected" with all three ticked at once.
patch('src/components/compute/clusters/create-cluster/create-cluster-flow.tsx', [
  ['__portfolio/fade', "import { usePostHog } from '@posthog/react';", "import { usePostHog } from '@posthog/react';\n\nimport { Fade } from '@/__portfolio/fade';"],
  ['<Fade id={step}>', `    return (
        <>
            {step === 0 && (`, `    return (
        <Fade id={step}>
            {step === 0 && (`],
  ['</Fade>', `            )}
        </>
    );
}

function useClusterNameCheck`, `            )}
        </Fade>
    );
}

function useClusterNameCheck`],
  ['demo: Next moves on', `            void queryClient.invalidateQueries({ queryKey: clusterKeys.all(tenantId) });
            onConnected(cluster);
        },`, `            void queryClient.invalidateQueries({ queryKey: clusterKeys.all(tenantId) });
            // demo: Next moves on, once the checks below have all completed
        },`],
  ['function walkTheChecks', `    const reportedRef = useRef(false);
`, `    const reportedRef = useRef(false);
    const [ticked, setTicked] = useState(0);
    useEffect(
        function walkTheChecks() {
            if (status !== 'found' || ticked >= 3) return;
            const rate = (window as { __cgRate?: number }).__cgRate ?? 1;
            const timer = setTimeout(() => setTicked(n => n + 1), (ticked === 0 ? 700 : 1100) / rate);
            return () => clearTimeout(timer);
        },
        [status, ticked]
    );
`],
  ['ticked={ticked}', `            status={CONNECT_STATUS[status]}
            errorMessage={error}`, `            status={CONNECT_STATUS[status]}
            errorMessage={error}
            ticked={ticked}`],
])
patch('src/components/compute/clusters/create-cluster/connect-cluster-step.tsx', [
  ['ticked?: number;', `    errorMessage?: string | null;
    onBack: () => void;`, `    errorMessage?: string | null;
    /** demo: how many of the three checks after registration have completed */
    ticked?: number;
    onBack: () => void;`],
  ['    ticked,\n}: ConnectClusterStepProps', `    status,
}: ConnectClusterStepProps) {`, `    status,
    ticked,
}: ConnectClusterStepProps) {`],
  ['const stateOf', `    const operatorState: CheckState = connected ? 'done' : failed ? 'failed' : 'current';
    const laterState: CheckState = connected ? 'done' : 'pending';
    const checks: readonly ConnectionCheck[] = [
        { label: 'Cluster registered in CostGraph', state: 'done', detail: 'just now' },
        {
            label: 'Waiting for operator to come online',
            state: operatorState,
            detail: connected ? 'just now' : '--',
        },
        {
            label: 'Verifying metrics pipeline',
            state: laterState,
            detail: connected ? 'just now' : '--',
        },
        {
            label: 'First metrics received',
            state: laterState,
            detail: connected ? 'just now' : '--',
        },
    ];`, `    // demo: the checks complete in order, each one current while it runs
    const done = connected ? (ticked ?? 3) : 0;
    const stateOf = (i: number): CheckState =>
        done > i ? 'done' : done === i ? (i === 0 && failed ? 'failed' : 'current') : 'pending';
    const checks: readonly ConnectionCheck[] = [
        { label: 'Cluster registered in CostGraph', state: 'done', detail: 'just now' },
        { label: 'Waiting for operator to come online', state: stateOf(0), detail: done > 0 ? 'just now' : '--' },
        { label: 'Verifying metrics pipeline', state: stateOf(1), detail: done > 1 ? 'just now' : '--' },
        { label: 'First metrics received', state: stateOf(2), detail: done > 2 ? 'just now' : '--' },
    ];`],
  ['disabled={!connected || done < 3}', 'disabled={!connected}', 'disabled={!connected || done < 3}'],
])

// 10. The sign-up stashed for onboarding can't go missing. Its encryption
// key lived in an IndexedDB database every frame on the page shares, and
// the stash expired after a day; either way the profile step said "This
// sign-up has expired". In the demo the key stays in the frame's memory and
// the stash doesn't expire.
patch('src/lib/auth/pending-signup.ts', [
  ['demo: never expires', 'const PENDING_SIGNUP_TTL_MS = 24 * 60 * 60 * 1000;', 'const PENDING_SIGNUP_TTL_MS = Infinity; // demo: never expires'],
  ['demo: the key lives in this frame', `async function signupKey() {
    const database = await openKeyDatabase();
    const existing: unknown = await request(
        database.transaction(KEY_STORE).objectStore(KEY_STORE).get(KEY_ID)
    );
    if (existing instanceof CryptoKey) return existing;
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
        'encrypt',
        'decrypt',
    ]);
    await request(
        database.transaction(KEY_STORE, 'readwrite').objectStore(KEY_STORE).put(key, KEY_ID)
    );
    return key;
}`, `// demo: the key lives in this frame's memory, not in a database the frames share
let demoKey: Promise<CryptoKey> | null = null;
async function signupKey() {
    demoKey ??= crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    return demoKey;
}`],
])

// 11. The chart's "Stack by" menu opens at its top. At 240px the selected
// "Resource type" (sixth) didn't fit, so the menu opened scrolled 28px to
// reach it, leaving a sliver of "Provider" under the edge fade: a lip. At
// 292px the selected item shows without scrolling and half of the next one
// peeks out below, so the list still reads as one you can scroll.
patch('src/components/cost-overview/cost-summary-chart.tsx', [
  ['className="max-h-73"', '<SelectContent align="end" className="max-h-60">', '<SelectContent align="end" className="max-h-73">'],
])

// 12. Hover to isolate without the jumps. Each segment and legend row
// cleared the highlight the moment the pointer left it, so the 4px gaps
// between segments, the space between rows and the 10px-tall bar itself
// all flashed every colour back on. Clearing now waits a beat and gives way
// to the next item, and each segment's target reaches 8px above and below
// the bar and across half of each gap.
for (const card of ['system-cost-card', 'load-drivers-card']) {
  patch(`src/components/compute/resource-overview/${card}.tsx`, [
    ['__portfolio/hover', "import { useState } from 'react';", "import { useState } from 'react';\n\nimport { useSteadyKey } from '@/__portfolio/hover';"],
    ['useSteadyKey(); // demo', 'const [activeKey, setActiveKey] = useState<string | null>(null);', 'const [activeKey, setActiveKey] = useSteadyKey(); // demo: steady hover'],
    ['before:-inset-y-2', "'focus-visible:ring-stroke-strong h-full min-w-px rounded-[3px] transition-[opacity,filter] duration-150 outline-none focus-visible:ring-2',", "'focus-visible:ring-stroke-strong relative h-full min-w-px rounded-[3px] transition-[opacity,filter] duration-150 outline-none focus-visible:ring-2 before:absolute before:-inset-x-0.5 before:-inset-y-2',"],
  ])
}

// (No "Save password?" from the browser: local/backend.js keeps every input
// in a demo from ever becoming a password field. The onboarding field comes
// from a prebuilt library, so that's done at runtime, not as a patch here.)

if (process.argv.includes('--patch-only')) {
  console.log('patched', dash)
  process.exit(0)
}

// 6. Build the app under /work/cg-app/
const vite = join(realpathSync(join(dash, 'node_modules/vite')), 'bin/vite.js')
execFileSync(process.execPath, [vite, 'build', '--base', '/work/cg-app/', '--outDir', out, '--emptyOutDir'], {
  cwd: dash,
  stdio: 'inherit',
})
console.log('built the CostGraph app into', out)
