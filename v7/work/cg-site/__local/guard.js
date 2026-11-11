// The costgraph.ai website as it runs in a frame on the case study. This
// loads first and keeps the frame to itself: no request leaves the page,
// links stay put, and the wheel scrolls the case study, not the frame.
(function () {
  // Each frame keeps its storage in its own memory: the frames share the
  // portfolio's origin, so with real storage they'd share one localStorage
  // with each other and the site, and leave keys in the visitor's browser
  {
    const memory = new WeakMap();
    const of = (s) => { let m = memory.get(s); if (!m) memory.set(s, (m = new Map())); return m; };
    const proto = Storage.prototype;
    proto.getItem = function (k) { const m = of(this); k = String(k); return m.has(k) ? m.get(k) : null; };
    proto.setItem = function (k, v) { of(this).set(String(k), String(v)); };
    proto.removeItem = function (k) { of(this).delete(String(k)); };
    proto.key = function (i) { return [...of(this).keys()][i] ?? null; };
    proto.clear = function () { of(this).clear(); };
    Object.defineProperty(proto, 'length', { configurable: true, get() { return of(this).size; } });
  }
  // A returning visitor who has already said no to analytics
  localStorage.setItem('cg-cookie-consent', JSON.stringify({ analytics: false, decidedAt: new Date().toISOString() }));

  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input && input.url;
    const url = new URL(String(raw), location.href);
    if (url.origin !== location.origin) return Promise.resolve(new Response('', { status: 503 }));
    return realFetch(url.href, init);
  };
  navigator.sendBeacon = () => true;
  const xopen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u, ...rest) {
    if (new URL(u, location.href).origin !== location.origin) u = 'about:blank';
    return xopen.call(this, m, u, ...rest);
  };
  // Links the router didn't take stay in the frame
  addEventListener('click', (e) => {
    const a = e.target instanceof Element && e.target.closest('a[href]');
    if (a && !e.defaultPrevented) e.preventDefault();
  });
  addEventListener('submit', (e) => e.preventDefault(), true);
  const ownScroll = new URLSearchParams(location.search).has('scroll');
  if (parent !== window && !ownScroll) {
    addEventListener('wheel', (e) => {
      if (!e.isTrusted) return;
      e.preventDefault();
      parent.postMessage({ type: 'cg-wheel', dx: e.deltaX, dy: e.deltaY }, location.origin);
    }, { passive: false, capture: true });
  }
  if (parent !== window) {
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (o) { return focus.call(this, { ...(o || {}), preventScroll: true }); };
    const intoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (arg) {
      let x = 0, y = 0;
      try { x = parent.scrollX; y = parent.scrollY; } catch (e) {}
      intoView.call(this, typeof arg === 'object' ? { ...arg } : arg);
      try { parent.scrollTo({ left: x, top: y, behavior: 'instant' }); } catch (e) {}
    };
  }
  // The site's own images use root paths (/posts/...); in the portfolio they
  // live under this build's folder
  const BASE = location.pathname.replace(/[^/]*$/, '');
  const rebase = (el) => {
    for (const attr of ['src', 'poster']) {
      const v = el.getAttribute && el.getAttribute(attr);
      if (v && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(BASE)) el.setAttribute(attr, BASE + v.slice(1));
    }
    const set = el.getAttribute && el.getAttribute('srcset');
    if (set && /(^|,\s*)\/(?!\/)/.test(set) && !set.includes(BASE)) el.setAttribute('srcset', set.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}`));
  };
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'attributes') rebase(m.target);
      for (const n of m.addedNodes || []) {
        if (n.nodeType !== 1) continue;
        if (/^(IMG|SOURCE|VIDEO)$/.test(n.tagName)) rebase(n);
        n.querySelectorAll && n.querySelectorAll('img, source, video').forEach(rebase);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset', 'poster'] });

  const css = document.createElement('style');
  css.textContent = 'html,body,*{scrollbar-width:none}*::-webkit-scrollbar{display:none}';
  document.documentElement.append(css);
})();
