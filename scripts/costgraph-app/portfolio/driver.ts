// The scripted walkthroughs. Each one does what a person would do, through
// the real interface: focus, type, pick, press. The first real pointer or
// key press ends the script and the visitor carries on by hand.

import { queryClient } from '@/lib/query-client';

let rate = 1;
let cancelled = false;

/* ---- speed: CSS transitions and animations follow the case study's 1x/¼x */
const slow = (e: Event) => (e.target as Element).getAnimations?.().forEach(a => (a.playbackRate = rate));
document.addEventListener('transitionrun', slow, true);
document.addEventListener('animationstart', slow, true);
addEventListener('message', e => {
    if (e.origin !== location.origin) return;
    if (e.data?.type === 'cg-speed') {
        rate = e.data.rate;
        (window as { __cgRate?: number }).__cgRate = rate;
        document.getAnimations().forEach(a => (a.playbackRate = rate));
    }
});
{
    const r = Number(new URLSearchParams(location.search).get('speed'));
    if (r > 0) rate = r;
    // the demo's own timers (the flow's checklist, the screen fades) follow it too
    (window as { __cgRate?: number }).__cgRate = rate;
}

/* ---- hand over the moment the visitor acts ---------------------------- */
['pointerdown', 'keydown'].forEach(t =>
    addEventListener(t, e => { if (e.isTrusted) cancelled = true; }, true)
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
        if (!over) left -= step;
    }
    if (cancelled) throw new Cancelled();
};

async function find<T extends Element = HTMLElement>(test: () => T | null | undefined, timeout = 8000): Promise<T> {
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
const byText = (sel: string, text: string) =>
    [...document.querySelectorAll<HTMLElement>(sel)].find(el => el.textContent?.trim() === text) ?? null;

function press(el: Element) {
    const o = { bubbles: true, cancelable: true, view: window, button: 0, pointerType: 'mouse' };
    el.dispatchEvent(new PointerEvent('pointerdown', o));
    el.dispatchEvent(new MouseEvent('mousedown', o));
    // focus without scrolling: a frame that scrolls itself into view drags
    // the whole case study along with it
    (el as HTMLElement).focus?.({ preventScroll: true });
    el.dispatchEvent(new PointerEvent('pointerup', o));
    el.dispatchEvent(new MouseEvent('mouseup', o));
    (el as HTMLElement).click();
}

/** Types like a person: a character at a time, with a little unevenness */
async function type(el: HTMLInputElement | HTMLTextAreaElement, text: string, perChar = 70) {
    el.focus({ preventScroll: true });
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
    const set = Object.getOwnPropertyDescriptor(proto.prototype, 'value')!.set!;
    for (let i = 1; i <= text.length; i++) {
        set.call(el, text.slice(0, i));
        el.dispatchEvent(new Event('input', { bubbles: true }));
        await wait(perChar * (0.7 + Math.random() * 0.6));
    }
}


type DemoStore = { cluster?: boolean; integrations?: unknown[]; chats?: unknown[] };
const demoStore = () => (window as unknown as { __cgStore: DemoStore }).__cgStore;
const saveStore = () => (window as unknown as { __cgSave: () => void }).__cgSave();
/** Something happened outside this screen; the app hears about it the way it would */
async function happen(change: (s: DemoStore) => void) {
    change(demoStore());
    saveStore();
    await queryClient.invalidateQueries();
}
// Starts-with, because nav links carry screen-reader text after their label
// ("Get started, 0 of 3 setup stages done")
const linkTo = (text: string, root: ParentNode = document) =>
    [...root.querySelectorAll<HTMLAnchorElement>('a')].find(a => a.textContent?.trim().startsWith(text)) ?? null;
const buttonCalled = (text: string, root: ParentNode = document) =>
    [...root.querySelectorAll<HTMLButtonElement>('button')].find(b => b.textContent?.trim() === text) ?? null;
const sidebar = () => document.querySelector('aside[data-state]') ?? document;
const guideCard = () =>
    [...document.querySelectorAll('aside')].find(a => a.querySelector('h2')?.textContent?.trim() === 'Setup guide') ?? null;


/** A mouse resting on a chart at a fraction of its width and height */
function overChart(el: Element, fx: number, fy: number) {
    const r = el.getBoundingClientRect();
    const target = el.querySelector('canvas') ?? el;
    target.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, view: window, clientX: r.left + r.width * fx, clientY: r.top + r.height * fy }));
}
function offChart(el: Element) {
    const target = el.querySelector('canvas') ?? el;
    target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, view: window, relatedTarget: document.body }));
}
/** Sweeps a resting mouse across a chart, the way someone reads it */
async function sweep(el: Element, from: number, to: number, ms: number, fy = 0.55) {
    const steps = Math.max(2, Math.round(ms / 40));
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        overChart(el, from + (to - from) * eased, fy);
        await wait(ms / steps);
    }
}
/** Presses a drag handle, moves it by dy in steps, lets go */
async function drag(handle: Element, dy: number, ms = 900) {
    const r = handle.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y0 = r.top + r.height / 2;
    const o = { bubbles: true, cancelable: true, view: window, button: 0, buttons: 1, pointerId: 1, isPrimary: true, pointerType: 'mouse' };
    handle.dispatchEvent(new PointerEvent('pointerdown', { ...o, clientX: x, clientY: y0 }));
    const steps = Math.round(ms / 30);
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const eased = 1 - (1 - t) ** 3;
        document.dispatchEvent(new PointerEvent('pointermove', { ...o, clientX: x, clientY: y0 + dy * eased }));
        await wait(ms / steps);
    }
    await wait(250);
    document.dispatchEvent(new PointerEvent('pointerup', { ...o, buttons: 0, clientX: x, clientY: y0 + dy }));
}
const sectionOf = (name: string) =>
    [...document.querySelectorAll('section')].find(s => s.querySelector('h2, h3')?.textContent?.trim() === name) ?? null;


/** A resting pointer arriving on, and leaving, an element */
function hoverOn(el: Element) {
    const o = { bubbles: true, view: window, pointerType: 'mouse', relatedTarget: document.body };
    el.dispatchEvent(new PointerEvent('pointerover', o));
    el.dispatchEvent(new PointerEvent('pointerenter', { ...o, bubbles: false }));
    el.dispatchEvent(new MouseEvent('mouseover', o));
    el.dispatchEvent(new MouseEvent('mouseenter', { ...o, bubbles: false }));
}
function hoverOff(el: Element) {
    const o = { bubbles: true, view: window, pointerType: 'mouse', relatedTarget: document.body };
    el.dispatchEvent(new PointerEvent('pointerout', o));
    el.dispatchEvent(new PointerEvent('pointerleave', { ...o, bubbles: false }));
    el.dispatchEvent(new MouseEvent('mouseout', o));
    el.dispatchEvent(new MouseEvent('mouseleave', { ...o, bubbles: false }));
}
const legendRow = (near: Element, label: string) => {
    const card = near.closest('section') ?? document;
    return [...card.querySelectorAll('li')].find(li => li.textContent?.trim().startsWith(label)) ?? null;
};
/** A click on a chart at a fraction of its width and height */
function clickChart(el: Element, fx: number, fy: number) {
    const r = el.getBoundingClientRect();
    const target = el.querySelector('canvas') ?? el;
    const o = { bubbles: true, cancelable: true, view: window, button: 0, clientX: r.left + r.width * fx, clientY: r.top + r.height * fy };
    const p = { ...o, pointerId: 1, pointerType: 'mouse', isPrimary: true };
    target.dispatchEvent(new PointerEvent('pointermove', p));
    target.dispatchEvent(new MouseEvent('mousemove', o));
    target.dispatchEvent(new PointerEvent('pointerdown', p));
    target.dispatchEvent(new MouseEvent('mousedown', o));
    target.dispatchEvent(new PointerEvent('pointerup', p));
    target.dispatchEvent(new MouseEvent('mouseup', o));
    target.dispatchEvent(new MouseEvent('click', o));
}


/** Scrolls the app's own panel to an element, never the page around the frame */
function scrollWithin(el: Element) {
    let box = el.parentElement;
    while (box && !(box.scrollHeight > box.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(box).overflowY))) box = box.parentElement;
    const scroller = box ?? document.scrollingElement!;
    const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - scroller.clientHeight / 2 + el.getBoundingClientRect().height / 2;
    scroller.scrollTo({ top, behavior: 'smooth' });
}

/* ---- the walkthroughs -------------------------------------------------- */
const scripts: Record<string, () => Promise<void>> = {
    // Hover one part of a split and everything else steps back, from the
    // bar or from its legend, on cost and then on what's using the machine
    async highlight() {
        const gpu = await find(() => $('button[aria-label^="GPU:"]'));
        await wait(1800);
        hoverOn(gpu);
        await wait(2400);
        hoverOff(gpu);
        await wait(500);
        const memory = await find(() => legendRow(gpu, 'Memory'));
        hoverOn(memory);
        await wait(2000);
        hoverOff(memory);
        await wait(700);
        const triton = await find(() => $('button[aria-label^="triton-server:"]'));
        scrollWithin(triton);
        await wait(1400);
        hoverOn(triton);
        await wait(2300);
        hoverOff(triton);
        await wait(500);
        const workers = await find(() => legendRow(triton, 'python (batch workers)'));
        hoverOn(workers);
        await wait(2200);
        hoverOff(workers);
    },

    // Read a month by service, stop on the spike, open that day, then take
    // the biggest service out to see the rest at their own scale
    async provider() {
        const chart = await find(() => $('[_echarts_instance_]'));
        await wait(1700);
        // read along the month until the tooltip reaches the spike: the
        // data puts it eight days before today
        const spikeDay = new Date(Date.now() - 8 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
        const tipDay = () => {
            const tip = [...document.querySelectorAll<HTMLElement>('div')].find(d => d.style.position === 'absolute' && d.innerText?.includes('Amazon EC2') && d.offsetWidth > 60);
            return tip?.innerText.split('\n')[0]?.trim() ?? '';
        };
        let spike = 0.7;
        for (let fx = 0.04; fx < 0.98; fx += 0.0125) {
            overChart(chart, fx, 0.5);
            await wait(70);
            if (tipDay() === spikeDay) { spike = fx; break; }
        }
        await wait(1700);
        clickChart(chart, spike, 0.82);
        await wait(3800);
        const close = $('button[aria-label="Close day breakdown"]');
        if (close) press(close);
        offChart(chart);
        await wait(900);
        const ec2 = await find(() => [...document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')].find(b => b.textContent?.trim() === 'Amazon EC2') ?? null);
        press(ec2);
        await wait(2400);
        await sweep(chart, 0.35, spike, 1500, 0.6);
        await wait(2000);
        offChart(chart);
    },

    // Read a budget's month, fold the list to compare, move the one that's
    // over to the top and open it
    async budgets() {
        const chart = await find(() => $('[_echarts_instance_]'));
        await wait(1700);
        await sweep(chart, 0.04, 0.33, 2600);
        await wait(1200);
        await sweep(chart, 0.33, 0.97, 1800);
        await wait(1500);
        offChart(chart);
        await wait(600);
        for (const name of ['Production AWS', 'GPU training', 'Data platform']) {
            const section = await find(() => sectionOf(name));
            press(await find(() => section.querySelector('button[aria-label="Collapse budget"]')));
            await wait(650);
        }
        await wait(1600);
        const handle = await find(() => $('button[aria-label^="Reorder Data platform"]'));
        handle.style.opacity = '1';
        const top = (await find(() => sectionOf('Production AWS'))).getBoundingClientRect().top;
        await wait(500);
        await drag(handle, top - handle.getBoundingClientRect().top - 6);
        await wait(1200);
        const data = await find(() => sectionOf('Data platform'));
        press(await find(() => data.querySelector('button[aria-label="Expand budget"]')));
    },

    // Support opens from the sidebar, in place: ask, get an answer, see the
    // history, then open it fully as a side panel
    async support() {
        const button = await find(() => $('button[aria-label="Help & support"]'));
        await wait(1600);
        press(button);
        const box = await find(() => $<HTMLTextAreaElement>('textarea[aria-label="Message support"]'));
        await wait(1300);
        await type(box, 'Our budget alert fired twice for prod-eu-west this week. Is that expected?', 34);
        await wait(450);
        press(await find(() => $('button[aria-label="Send message"]')));
        await find(() => [...document.querySelectorAll('p')].find(p => p.textContent?.startsWith('Not expected.')) ?? null, 15000);
        await wait(3000);
        press(await find(() => $('button[aria-label="Back to conversations"]')));
        await wait(2400);
        press(await find(() => $('button[aria-label="Open support in side panel"]')));
    },

    // From the guide to a connected cluster and back, through the real flow
    async 'get-started'() {
        const task = await find(() => linkTo('Connect a Cluster', document.querySelector('main') ?? document));
        // the ASCII world lifts under a passing pointer and ripples where it's tapped
        const hero = document.querySelector('section[aria-labelledby]');
        if (hero) {
            const r = hero.getBoundingClientRect();
            const at = (fx: number, fy: number) => ({ clientX: r.left + r.width * fx, clientY: r.top + r.height * fy, bubbles: true, pointerType: 'mouse' });
            await wait(1400);
            for (let i = 0; i <= 40; i++) {
                const t = i / 40;
                window.dispatchEvent(new PointerEvent('pointermove', at(0.42 + 0.5 * t, 0.75 - 0.45 * Math.sin(t * Math.PI))));
                await wait(30);
            }
            window.dispatchEvent(new PointerEvent('pointerdown', at(0.78, 0.45)));
            await wait(900);
            window.dispatchEvent(new PointerEvent('pointerdown', at(0.62, 0.62)));
            await wait(1400);
        }
        await wait(800);
        press(task);
        const name = await find(() => $<HTMLInputElement>('input[placeholder="prod-api-1"]'));
        await wait(900);
        await type(name, 'prod-eu-west', 75);
        await wait(500);
        press(await find(() => [...document.querySelectorAll<HTMLElement>('button, label')].find(b => /^AWS/.test(b.textContent?.trim() ?? '')) ?? null));
        const next = await find(() => { const b = buttonCalled('Next'); return b && !b.disabled ? b : null; });
        await wait(700);
        press(next);
        // the command arrives holding the cluster's name and its own key
        const copy = await find(() => buttonCalled('Copy'));
        await wait(2200);
        press(copy);
        await wait(1300);
        press(await find(() => { const b = buttonCalled('Next'); return b && !b.disabled ? b : null; }));
        // Listening: the operator is being installed on the other side
        await find(() => [...document.querySelectorAll('h1, h2, h3')].find(h => h.textContent?.includes('Waiting for your cluster')) ?? null);
        await wait(3600);
        // The operator comes online in the cluster, and the checks follow it
        await happen(s => { s.cluster = true; });
        const done = await find(() => { const b = buttonCalled('Next'); return b && !b.disabled ? b : null; }, 15000);
        await wait(1100);
        press(done);
        // Connected: read the card, then back to the guide, already ticked
        await find(() => [...document.querySelectorAll('h1, h2, h3')].find(h => h.textContent?.includes('Cluster connected')) ?? null, 15000);
        await wait(3000);
        press(await find(() => linkTo('Get started', sidebar())));
        await wait(2400);
    },

    // The guide stays with you from page to page and ticks as you go
    async guide() {
        const card = await find(guideCard);
        await wait(2000);
        await happen(s => {
            s.integrations = [{ id: 'conn_gh', connection_id: 'conn_gh', provider: 'github', display_name: 'GitHub', tenant_id: 'tenant_demo', status: 'active', ingest_mode: 'pull', provider_account_id: 'analytical-engines', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_sync_error: null, last_synced_at: null }];
        });
        await wait(1700);
        await happen(s => { s.cluster = true; });
        await wait(1700);
        await happen(s => { s.chats = [{ id: 'chat_1', title: 'Why did prod-eu-west spend jump?', pinned: false, pinnedAt: null, updatedAt: new Date().toISOString() }]; });
        await wait(3000);
        // Out of the way: down to its header and the ring
        press(await find(() => card.querySelector<HTMLButtonElement>('button[aria-label="Minimise setup guide"]')));
        await wait(2200);
        // and back open, on the stage you're on
        press(await find(() => card.querySelector<HTMLButtonElement>('button[aria-label="Expand setup guide"]')));
        await wait(2000);
    },

    // Profile in, the preview fills; password in, the second track fills;
    // continue, and the dashboard settles into place to confetti.
    async onboarding() {
        const first = await find(() => $<HTMLInputElement>('input[placeholder="John"]'));
        await wait(1100);
        await type(first, 'Ada');
        await wait(250);
        await type($<HTMLInputElement>('input[placeholder="Doe"]')!, 'Lovelace');
        await wait(350);
        await type($<HTMLInputElement>('input[placeholder="acme org"]')!, 'Analytical Engines', 60);
        await wait(600);
        press($('[role="combobox"]')!);
        const role = await find(() => byText('[role="option"]', 'CTO / VP of Engineering'));
        await wait(500);
        press(role);
        await wait(600);
        await type($<HTMLInputElement>('input[data-cg-pw]')!, 'Engine#1843x', 85);
        await wait(900);
        press(await find(() => byText('button[type="submit"]', 'Continue')));
    },
};

export function start(demo: string) {
    const script = scripts[demo];
    if (!script || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    script().catch(e => {
        if (!(e instanceof Cancelled)) console.warn(e);
    });
}
