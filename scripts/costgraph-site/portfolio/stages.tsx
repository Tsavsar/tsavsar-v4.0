// The website's stages: the real nav, the real changelog scrubber and the
// real "In this post" pill, each on a drawn page. Grey bars where words
// would be, real words only where the demo needs them.
import { SiteNav } from '@costgraph/site';
import { logoWordmarkUrl } from '@costgraph/ui';
import { PostContents } from '@/../../../packages/site/src/post-contents';
import { useRef, type CSSProperties, type ReactNode } from 'react';

import { ReleaseList } from '@/components/changelog/release-list';

function Bar({ w, h = 9, style, className = '' }: Readonly<{ w: number | string; h?: number; style?: CSSProperties; className?: string }>) {
    return <span aria-hidden className={`bg-bg-layer block shrink-0 rounded-full ${className}`} style={{ width: typeof w === 'number' ? `${w}px` : w, height: h, ...style }} />;
}

function Paragraph({ lines = 4, seed = 0 }: Readonly<{ lines?: number; seed?: number }>) {
    return (
        <div aria-hidden className="flex flex-col gap-3 py-1">
            {Array.from({ length: lines }, (_, i) => (
                <Bar key={i} w={i === lines - 1 ? `${48 + ((seed * 13 + i * 7) % 30)}%` : `${88 + ((seed * 7 + i * 11) % 12)}%`} h={9} />
            ))}
        </div>
    );
}

function MenuStage() {
    return (
        <div className="bg-bg-default min-h-screen">
            <SiteNav />
            <div aria-hidden className="mx-auto flex max-w-240 flex-col items-center gap-5 px-4 pt-24 text-center">
                <Bar w={520} h={34} className="rounded-lg" />
                <Bar w={420} h={34} className="rounded-lg" />
                <Bar w={380} h={10} className="mt-3" />
                <div className="mt-6 flex gap-3">
                    <Bar w={132} h={40} className="rounded-xl" />
                    <Bar w={112} h={40} className="rounded-xl opacity-60" />
                </div>
            </div>
        </div>
    );
}

function ChangelogStage() {
    return (
        <div className="bg-bg-default min-h-screen">
            <div aria-hidden className="mx-auto flex h-18 max-w-240 items-center justify-between px-4 lg:px-0">
                <Bar w={120} h={14} className="rounded-md" />
                <div className="flex gap-8"><Bar w={64} /><Bar w={72} /><Bar w={84} /><Bar w={52} /></div>
                <Bar w={96} h={32} className="rounded-full" />
            </div>
            <main className="mx-auto flex max-w-240 flex-col gap-12 px-4 pt-14 pb-24 lg:px-0">
                <div className="flex flex-col gap-4">
                    <h1 className="text-title-regular-h3 text-text-subtle">Changelog</h1>
                    <Bar w={460} h={10} />
                </div>
                <ReleaseList />
            </main>
        </div>
    );
}

// The real post's section titles, so the pill reads true
const SECTIONS = [
    'What is a node, really?',
    'A pod is a vector',
    'How big is a pod?',
    'Why sorting by size is not enough',
    'The heuristics in the paper',
    'What we run in production',
    'What this does not do (yet)',
    'Summary',
];

function PostStage() {
    const body = useRef<HTMLDivElement>(null);
    return (
        <div className="bg-bg-default min-h-screen">
            <div aria-hidden className="mx-auto flex h-18 max-w-180 items-center justify-between px-4">
                <img src={logoWordmarkUrl} alt="" className="h-5 w-auto" />
                <Bar w={96} h={32} className="rounded-full" />
            </div>
            <article className="mx-auto flex max-w-180 flex-col gap-6 px-4 pt-10 pb-[60vh]">
                <h1 className="text-title-regular-h4 text-text-strong">Tetris in d dimensions: how we rightsize Kubernetes nodes</h1>
                <Bar w={220} h={9} className="mb-6" />
                <div ref={body} className="blog-prose flex flex-col gap-6">
                    <Paragraph lines={5} seed={1} />
                    {SECTIONS.map((title, i) => (
                        <section key={title} className="flex flex-col gap-5 pt-4">
                            <h2 className="text-title-regular-h6 text-text-strong">{title}</h2>
                            <Paragraph lines={5 + (i % 3)} seed={i + 2} />
                            {i % 2 === 0 && <div aria-hidden className="bg-bg-surface h-56 rounded-xl" />}
                            <Paragraph lines={4} seed={i + 9} />
                        </section>
                    ))}
                </div>
                <PostContents bodyRef={body} />
            </article>
        </div>
    );
}

const STAGES: Record<string, () => ReactNode> = { menu: MenuStage, changelog: ChangelogStage, blog: PostStage };

export function StageRoot({ name }: Readonly<{ name: string }>) {
    const Stage = STAGES[name];
    return Stage ? <Stage /> : null;
}
