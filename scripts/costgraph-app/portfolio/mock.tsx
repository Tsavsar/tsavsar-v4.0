// The quiet, drawn version of the dashboard that a stage's real component
// sits in. Same proportions as the app (a 248px sidebar on the surface
// colour, a white page with a 56px header), same tokens, so it follows the
// theme; but grey bars where the words would be, and nothing to click.
// Real words only on what the demo is about.
import { logoMarkUrl } from '@costgraph/ui';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Bar({ w, h = 8, className, style }: Readonly<{ w: number | string; h?: number; className?: string; style?: CSSProperties }>) {
    return (
        <span
            aria-hidden
            className={cn('bg-bg-layer block shrink-0 rounded-full', className)}
            style={{ width: typeof w === 'number' ? `${w}px` : w, height: h, ...style }}
        />
    );
}

function Glyph() {
    return <span aria-hidden className="bg-bg-layer block size-4 shrink-0 rounded-[5px]" />;
}

/** A sidebar row: a glyph and a grey label, or real content when given */
export function NavRow({ w = 90, active, children }: Readonly<{ w?: number; active?: boolean; children?: ReactNode }>) {
    return (
        <div className={cn('flex h-8 items-center gap-2 rounded-lg px-2', active && 'bg-bg-default shadow-[0_1px_2px_rgba(0,0,0,0.04)]')}>
            {children ?? (
                <>
                    <Glyph />
                    <Bar w={w} h={7} />
                </>
            )}
        </div>
    );
}

export function MockSidebar({ top, bottom }: Readonly<{ top?: ReactNode; bottom?: ReactNode }>) {
    const widths = [74, 96, 62, 88, 108, 70, 82, 64, 92, 58];
    return (
        <aside aria-hidden={!top && !bottom} className="bg-bg-surface flex h-full w-62 shrink-0 flex-col justify-between px-3 pt-3.5 pb-4.5">
            <div className="flex flex-col gap-4">
                <div className="flex h-8 items-center gap-2 px-2">
                    <img src={logoMarkUrl} alt="" className="size-4.5 shrink-0" />
                    <Bar w={112} h={8} />
                </div>
                <div className="flex flex-col gap-1">
                    {top}
                    {widths.map((w, i) => (
                        <NavRow key={i} w={w} active={!top && i === 1} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-0.5">
                <NavRow w={78} />
                <NavRow w={44} />
                <NavRow w={58} />
                <ul className="mt-3 flex items-center gap-2 px-2 pb-2">
                    {bottom ?? <Bar w={104} h={26} className="opacity-70" />}
                    <Bar w={58} h={26} className="opacity-70" />
                </ul>
            </div>
        </aside>
    );
}

export function MockHeader({ title }: Readonly<{ title?: ReactNode }>) {
    return (
        <div className="flex h-14 shrink-0 items-center justify-between px-5">
            <div className="flex items-center gap-2">
                <Glyph />
                {title ?? <Bar w={128} h={9} />}
            </div>
            <div className="flex items-center gap-3">
                <Bar w={240} h={30} className="rounded-lg opacity-70" />
                <span className="bg-bg-layer block size-7 rounded-full" />
            </div>
        </div>
    );
}

export function MockTabs({ count = 6 }: Readonly<{ count?: number }>) {
    return (
        <div className="border-stroke-soft flex h-10 items-end gap-7 border-b px-5">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={cn('pb-3', i === 0 && 'border-text-strong/20 -mb-px border-b-2')}>
                    <Bar w={[54, 38, 76, 88, 62, 70][i % 6]} h={7} />
                </div>
            ))}
        </div>
    );
}

export function MockKpis({ n = 3 }: Readonly<{ n?: number }>) {
    return (
        <div className="grid gap-8 px-5 py-6" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {Array.from({ length: n }, (_, i) => (
                <div key={i} className="flex flex-col gap-3">
                    <Bar w={90} h={6} />
                    <Bar w={[132, 116, 98, 124][i % 4]} h={18} className="rounded-md" />
                    <Bar w={150} h={6} className="opacity-70" />
                </div>
            ))}
        </div>
    );
}

export function MockChart({ height = 260 }: Readonly<{ height?: number }>) {
    const bars = [58, 64, 61, 70, 66, 72, 69, 75, 71, 78, 74, 80, 77, 83, 79, 86, 82, 88];
    return (
        <div className="flex flex-col gap-4 px-5 pb-6">
            <div className="flex items-center justify-between">
                <Bar w={96} h={8} />
                <Bar w={140} h={26} className="rounded-lg opacity-70" />
            </div>
            <div className="flex items-end gap-2.5" style={{ height }}>
                {bars.map((b, i) => (
                    <span key={i} className="bg-bg-layer block flex-1 rounded-[3px]" style={{ height: `${b}%` }} />
                ))}
            </div>
        </div>
    );
}

export function MockRows({ n = 5 }: Readonly<{ n?: number }>) {
    return (
        <div className="flex flex-col px-5">
            {Array.from({ length: n }, (_, i) => (
                <div key={i} className="border-stroke-soft flex h-12 items-center gap-6 border-b">
                    <Glyph />
                    <Bar w={[180, 140, 210, 160, 120][i % 5]} h={7} />
                    <span className="flex-1" />
                    <Bar w={64} h={7} />
                    <Bar w={84} h={7} className="opacity-70" />
                </div>
            ))}
        </div>
    );
}

/** The whole screen: sidebar, page and anything docked to the right */
export function MockShell({ sidebar, children, right }: Readonly<{ sidebar?: ReactNode; children: ReactNode; right?: ReactNode }>) {
    return (
        <div className="bg-bg-default text-text-strong flex h-screen w-screen overflow-hidden">
            {sidebar ?? <MockSidebar />}
            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
            {right}
        </div>
    );
}
