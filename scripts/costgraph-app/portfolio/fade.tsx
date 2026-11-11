// Moving to the next screen: the one you're on fades out, then the next one
// fades in, so a screen never swaps under you in a single frame. The swap
// waits for the fade-out's transitionend rather than a timer, so the case
// study's quarter speed slows it like every other transition. Reduced
// motion swaps straight away.
import { useEffect, useRef, useState, type ReactNode } from 'react';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const rate = () => (window as { __cgRate?: number }).__cgRate ?? 1;

export function Fade({ id, className, children }: Readonly<{ id: string | number; className?: string; children: ReactNode }>) {
    const [current, setCurrent] = useState(id);
    // what the screen on show last looked like, so it can fade out as it was
    const held = useRef(children);
    const leaving = id !== current && !reduced();
    if (!leaving) held.current = children;

    // a backstop, should the transition never run (a hidden tab)
    useEffect(() => {
        if (id === current) return;
        if (reduced()) return setCurrent(id);
        const t = setTimeout(() => setCurrent(id), 600 / rate());
        return () => clearTimeout(t);
    }, [id, current]);

    return (
        <div
            className={className}
            onTransitionEnd={e => {
                if (e.target === e.currentTarget && e.propertyName === 'opacity' && leaving) setCurrent(id);
            }}
            style={{
                opacity: leaving ? 0 : 1,
                // out quicker than in
                transition: leaving ? 'opacity 140ms cubic-bezier(0.4, 0, 1, 1)' : 'opacity 220ms cubic-bezier(0, 0, 0.2, 1)',
            }}
        >
            {leaving ? held.current : children}
        </div>
    );
}
