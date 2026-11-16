// The website walkthroughs: what a visitor would do, through the real site,
// with a visible cursor doing the pointing (cursor.js, shared with the other
// demos). The first real pointer or key press ends the script.
import { createCursor } from './cursor.js';

const params = new URLSearchParams(location.search);
const demo = params.get('demo') ?? '';
let rate = Number(params.get('speed')) > 0 ? Number(params.get('speed')) : 1;
let cancelled = false;

const slow = (e: Event) => (e.target as Element).getAnimations?.().forEach(a => (a.playbackRate = rate));
document.addEventListener('transitionrun', slow, true);
document.addEventListener('animationstart', slow, true);
addEventListener('message', e => {
    if (e.origin !== location.origin || e.data?.type !== 'cg-speed') return;
    rate = e.data.rate;
    document.getAnimations().forEach(a => (a.playbackRate = rate));
});
['pointerdown', 'keydown'].forEach(t =>
    addEventListener(t, e => {
        if (!e.isTrusted) return;
        cancelled = true;
        pointer.leave();
    }, true)
);

class Cancelled extends Error {}
// While the visitor's pointer rests on the demo the script holds still, so
// it never moves something out from under them; it carries on when they
// leave. Only real pointer movement counts, not the script's own hovers.
let hovering = false;
document.addEventListener('pointermove', e => { if (e.isTrusted) hovering = true; }, true);
document.documentElement.addEventListener('pointerleave', e => { if (e.isTrusted) hovering = false; });
document.addEventListener('mouseleave', e => { if (e.isTrusted) hovering = false; });
const wait = async (ms: number) => {
    let left = ms / rate;
    while (left > 0) {
        if (cancelled) throw new Cancelled();
        const step = Math.min(50, left);
        await new Promise(r => setTimeout(r, step));
        // moved over it, or resting on it since before the frame loaded
        const over = hovering || document.documentElement.matches(':hover');
        pointer.hold(over);
        if (!over) left -= step;
    }
    if (cancelled) throw new Cancelled();
};
const pointer = createCursor({ wait, rate: () => rate });
async function find<T extends Element = HTMLElement>(test: () => T | null | undefined, timeout = 10000): Promise<T> {
    const start = performance.now();
    for (;;) {
        if (cancelled) throw new Cancelled();
        const el = test();
        if (el) return el;
        if (performance.now() - start > timeout) throw new Error('demo: element never appeared');
        await new Promise(r => setTimeout(r, 60));
    }
}
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel);
const byText = <T extends Element = HTMLElement>(sel: string, text: string) =>
    [...document.querySelectorAll<T>(sel)].find(el => el.textContent?.trim() === text) ?? null;

/** The cursor arriving on an element and resting there */
const hoverOn = (el: Element) => pointer.hoverOn(el);
function hoverOff(el: Element) {
    const o = { bubbles: true, view: window, pointerType: 'mouse', relatedTarget: document.body };
    el.dispatchEvent(new PointerEvent('pointerout', o));
    el.dispatchEvent(new PointerEvent('pointerleave', { ...o, bubbles: false }));
    el.dispatchEvent(new MouseEvent('mouseout', o));
    el.dispatchEvent(new MouseEvent('mouseleave', { ...o, bubbles: false }));
}
/** The cursor goes to it, rests a beat, and presses it */
const press = (el: Element) => pointer.press(el);
/** Scrolls the page the way a reader would: in an eased glide */
async function glideTo(y: number, ms: number) {
    const from = scrollY;
    const steps = Math.max(2, Math.round(ms / 16));
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        // instant: the glide is its own easing, and the site's smooth
        // scroll-behavior would chase every step with another
        scrollTo({ top: from + (y - from) * e, behavior: 'instant' });
        await wait(ms / steps);
    }
}

const scripts: Record<string, () => Promise<void>> = {
    // Read down the releases and watch the ticks follow, preview a few from
    // the scrubber, jump to one, and come back up
    async changelog() {
        await find(() => (document.querySelectorAll('nav[aria-label="Releases by date"] button, nav[aria-label="Releases by date"] a').length > 6 ? document.body : null));
        await wait(1800);
        // about two releases down
        await glideTo(Math.min(1700, document.documentElement.scrollHeight - innerHeight), 2800);
        await wait(1500);
        const ticks = await find(() => { const b = [...document.querySelectorAll('nav[aria-label="Releases by date"] button, nav[aria-label="Releases by date"] a')]; return b.length > 6 ? b : null; });
        for (const i of [5, 6, 7, 8]) {
            await hoverOn(ticks[i]);
            await wait(850);
            hoverOff(ticks[i]);
        }
        await hoverOn(ticks[8]);
        await wait(500);
        await press(ticks[8]);
        await wait(2600);
        hoverOff(ticks[8]);
        await glideTo(0, 2000);
    },

    // Read on, and the pill keeps your place; open it, jump to a section
    async blog() {
        const heads = await find(() => { const h = [...document.querySelectorAll('main h2, article h2')]; return h.length > 4 ? h : null; });
        await wait(1600);
        const yOf = (el: Element) => el.getBoundingClientRect().top + scrollY - 160;
        await glideTo(yOf(heads[1]) + 120, 3000);
        await wait(1300);
        await glideTo(yOf(heads[2]) + 80, 2200);
        await wait(1300);
        const pill = await find(() => $('nav[aria-label="In this post"]'));
        await hoverOn(pill.firstElementChild ?? pill);
        pill.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, view: window, pointerType: 'mouse' }));
        pill.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, view: window }));
        await wait(2400);
        const target = [...pill.querySelectorAll('a, button')].find(a => a.textContent?.trim() === 'What we run in production');
        if (target) await press(target);
        await wait(2600);
        hoverOff(pill.firstElementChild ?? pill);
        hoverOff(pill);
    },

    // One panel for the whole menu: it resizes and slides between triggers
    async menu() {
        const features = await find(() => byText('button', 'Features'));
        await wait(1600);
        const open = async (name: string, ms: number) => {
            const t = await find(() => byText('button', name));
            await hoverOn(t);
            await wait(ms);
            return t;
        };
        await open('Features', 2400);
        await open('Resources', 2400);
        await open('Integrations', 2600);
        const r = await open('Resources', 2000);
        hoverOff(r);
        hoverOff(features);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    },
};

export function start() {
    const script = scripts[demo];
    if (!script || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    script()
        // done: the hand comes off, and the result is left clear
        .then(() => wait(900))
        .then(() => pointer.leave())
        .catch(e => {
            pointer.leave();
            if (!(e instanceof Cancelled)) console.warn(e);
        });
}
