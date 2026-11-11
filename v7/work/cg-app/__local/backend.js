// A fake backend for the CostGraph app as it runs in the portfolio.
//
// The real dashboard, built from its own code, runs inside a frame on the
// case study. This script loads before it and answers everything the app
// asks of the outside world, in the browser: Cognito sign-up and sign-in,
// the CostGraph API, the app's config. Anything else that tries to leave
// the page is refused, so a demo never talks to a real service.
(function () {
  const params = new URLSearchParams(location.search);
  const demo = params.get('demo') || 'app';
  const log = (...a) => { if (params.has('debug')) console.log('%c[cg-demo]', 'color:#2e7cfa', ...a); };

  // A demo frame never shows a browser scrollbar; it still scrolls
  {
    const css = document.createElement('style');
    css.textContent = 'html,body,*{scrollbar-width:none}*::-webkit-scrollbar{display:none}';
    document.documentElement.append(css);
  }

  // The password requirements list stays out of the demo: the strength bar
  // above it already shows the password coming together, and the list made
  // the profile screen taller than the frame
  new MutationObserver(() => {
    for (const p of document.querySelectorAll('p')) {
      if (p.textContent.trim().startsWith('Must contain at least') && p.parentElement.style.display !== 'none') {
        p.parentElement.style.display = 'none';
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Scrolling over a demo scrolls the case study, never the frame: the
  // wheel is handed to the page around it
  // ...except over a small list that can still scroll that way (a menu's
  // options, a support conversation): that scrolls itself, as it would in
  // the app. Anything page-sized still hands the wheel on, so the case
  // study never gets stuck inside a frame.
  const scrollsItself = (target, dx, dy) => {
    for (let n = target instanceof Element ? target : null; n && n !== document.body; n = n.parentElement) {
      if (n.clientHeight > innerHeight * 0.75) break;
      const cs = getComputedStyle(n);
      if (dy && /auto|scroll/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1 &&
          (dy > 0 ? n.scrollTop + n.clientHeight < n.scrollHeight - 1 : n.scrollTop > 0)) return true;
      if (dx && /auto|scroll/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 1 &&
          (dx > 0 ? n.scrollLeft + n.clientWidth < n.scrollWidth - 1 : n.scrollLeft > 0)) return true;
    }
    return false;
  };
  addEventListener('wheel', (e) => {
    if (!e.isTrusted || parent === window) return;
    if (scrollsItself(e.target, e.deltaX, e.deltaY)) return;
    e.preventDefault();
    parent.postMessage({ type: 'cg-wheel', dx: e.deltaX, dy: e.deltaY }, location.origin);
  }, { passive: false, capture: true });

  // Copy buttons say they copied, and nothing reaches the visitor's
  // clipboard: not the walkthrough's presses, not their own clicks
  const quiet = { writeText: () => Promise.resolve(), write: () => Promise.resolve(), readText: () => Promise.resolve(''), read: () => Promise.resolve([]), addEventListener() {}, removeEventListener() {} };
  try { Object.defineProperty(Navigator.prototype, 'clipboard', { configurable: true, get: () => quiet }); } catch (e) {}
  const exec = Document.prototype.execCommand;
  Document.prototype.execCommand = function (cmd, ...rest) { return /^(copy|cut)$/i.test(cmd) ? true : exec.call(this, cmd, ...rest); };

  // A frame on the case study must never move the page around it. Focus
  // and scroll-into-view both scroll every ancestor frame, so inside a demo
  // focus never scrolls, and scrolling into view stays inside the frame.
  if (parent !== window) {
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (options) {
      return focus.call(this, { ...(options || {}), preventScroll: true });
    };
    const intoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (arg) {
      let x = 0, y = 0;
      try { x = parent.scrollX; y = parent.scrollY; } catch (e) {}
      intoView.call(this, typeof arg === 'object' ? { ...arg, behavior: 'instant' } : arg);
      try { parent.scrollTo({ left: x, top: y, behavior: 'instant' }); } catch (e) {}
    };
  }

  /* ---- storage --------------------------------------------------------
     Every frame on the case study shares the portfolio's origin, and so,
     with real storage, one localStorage: a demo loading further down the
     page would wipe the one you're in (its session, its stashed sign-up).
     So each frame keeps its storage in its own memory instead. Nothing a
     demo does can reach another frame or the site's own keys (theme,
     audio), nothing is left behind in the visitor's browser, and each load
     starts clean. */
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
  /* ---- no saved passwords ----------------------------------------------
     The onboarding walkthrough types a password and submits it; a real
     password field would have the visitor's browser offer to save it. So
     no input in a demo is ever a password field: asked to become one, it
     stays a text field drawn as dots in the product's own password font
     (show/hide still works), and password autocomplete hints become "off".
     Password managers are told to leave it alone. */
  {
    const typeOf = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'type');
    const setAttr = Element.prototype.setAttribute;
    const hide = (el) => {
      setAttr.call(el, 'data-cg-pw', '');
      setAttr.call(el, 'autocomplete', 'off');
      setAttr.call(el, 'data-1p-ignore', '');
      setAttr.call(el, 'data-lpignore', 'true');
      setAttr.call(el, 'data-form-type', 'other');
      el.style.setProperty('-webkit-text-security', 'disc');
      el.style.setProperty('font-family', 'var(--font-password)');
    };
    const show = (el) => {
      el.style.removeProperty('-webkit-text-security');
      el.style.removeProperty('font-family');
    };
    Object.defineProperty(HTMLInputElement.prototype, 'type', {
      configurable: true,
      get() { return typeOf.get.call(this); },
      set(v) {
        if (String(v).toLowerCase() === 'password') { typeOf.set.call(this, 'text'); hide(this); return; }
        if (this.hasAttribute('data-cg-pw')) show(this);
        typeOf.set.call(this, v);
      },
    });
    Element.prototype.setAttribute = function (name, value) {
      if (this instanceof HTMLInputElement) {
        const n = String(name).toLowerCase();
        if (n === 'type') { this.type = value; return; }
        if (n === 'autocomplete' && /password/i.test(String(value))) return setAttr.call(this, name, 'off');
      }
      return setAttr.call(this, name, value);
    };
  }

  // The page's theme, where the app's own boot script looks for it, so a
  // stage (which never loads the user's settings) opens in it too
  localStorage.setItem('color_theme', params.get('theme') === 'dark' ? 'dark' : 'light');

  /* ---- the world the demo starts in ----------------------------------- */
  const CLIENT = 'demo-client';
  const POOL = 'eu-west-1_Demo';
  const presets = {
    // Just verified their email: signed in, no profile yet
    onboarding: { email: 'ada@analytical.engines', profiled: false },
    // Set up, on day one
    app: { email: 'ada@analytical.engines', profiled: true, name: 'Ada Lovelace', org: 'Analytical Engines', slug: 'analytical-engines' },
  };
  // A few months in: everything connected, the setup guide done and gone
  presets.established = {
    ...presets.app, cluster: true, vm: true,
    integrations: [{ id: 'conn_gh', connection_id: 'conn_gh', provider: 'github', display_name: 'GitHub', tenant_id: 'tenant_demo', status: 'active', ingest_mode: 'pull', provider_account_id: 'analytical-engines', created_at: '2026-08-14T10:00:00Z', updated_at: '2026-11-01T10:00:00Z', last_sync_error: null, last_synced_at: '2026-11-10T08:00:00Z' }],
    chats: [{ id: 'chat_1', title: 'Why did prod-eu-west spend jump?', pinned: false, pinnedAt: null, updatedAt: '2026-11-07T14:02:00Z' }],
    reports: [{ id: 'r_weekly', title: 'Weekly spend by team' }],
    vtags: [{ key: 'team', values: ['platform', 'ml', 'data'] }],
  };
  for (const d of ['budgets', 'provider', 'highlight']) presets[d] = presets.established;
  const store = JSON.parse(sessionStorage.getItem('store') || 'null') || {
    sub: '7f9c2b1e-5a4d-4c3b-9e8f-1a2b3c4d5e6f',
    ...(presets[demo] || presets.app),
  };
  if (store.profiled && !store.tenants) store.tenants = [{ id: 'tenant_demo', name: store.org }];
  const save = () => sessionStorage.setItem('store', JSON.stringify(store));
  save();
  window.__cgStore = store;
  window.__cgSave = save;

  /* ---- tokens: unsigned, for the app to decode, never to verify ------- */
  const b64u = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = (use) => {
    const now = Math.floor(Date.now() / 1000);
    return b64u({ alg: 'RS256', kid: 'demo' }) + '.' + b64u({
      sub: store.sub, email: store.email, 'cognito:username': store.sub, username: store.sub,
      token_use: use, iss: `https://cognito-idp.eu-west-1.amazonaws.com/${POOL}`, aud: CLIENT, client_id: CLIENT,
      iat: now, exp: now + 6 * 3600, auth_time: now, email_verified: true,
    }) + '.ZGVtbw';
  };
  const tokens = () => ({ AccessToken: jwt('access'), IdToken: jwt('id'), RefreshToken: 'demo-refresh', ExpiresIn: 21600, TokenType: 'Bearer' });
  // Signed in from the first frame, the way Amplify keeps a session
  const p = `CognitoIdentityServiceProvider.${CLIENT}`;
  localStorage.setItem(`${p}.LastAuthUser`, store.sub);
  localStorage.setItem(`${p}.${store.sub}.accessToken`, jwt('access'));
  localStorage.setItem(`${p}.${store.sub}.idToken`, jwt('id'));
  localStorage.setItem(`${p}.${store.sub}.refreshToken`, 'demo-refresh');
  localStorage.setItem(`${p}.${store.sub}.clockDrift`, '0');
  localStorage.setItem(`${p}.${store.sub}.signInDetails`, JSON.stringify({ loginId: store.email, authFlowType: 'USER_SRP_AUTH' }));

  /* ---- responses ------------------------------------------------------ */
  const amz = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/x-amz-json-1.1' } });
  const ok = (data) => new Response(JSON.stringify({ status: 'success', message: 'ok', data }), { headers: { 'content-type': 'application/json' } });
  const fail = (status, message) => new Response(JSON.stringify({ status: 'error', message }), { status, headers: { 'content-type': 'application/json' } });
  window.__cgFail = fail;
  const hex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0')).join('');

  function cognito(target, body) {
    log('cognito', target);
    switch (target) {
      case 'SignUp':
        store.email = body.Username; save();
        return amz({ UserConfirmed: false, UserSub: store.sub, CodeDeliveryDetails: { AttributeName: 'email', DeliveryMedium: 'EMAIL', Destination: 'a***@a***' } });
      case 'ConfirmSignUp': return amz({});
      case 'InitiateAuth':
        if (/REFRESH/.test(body.AuthFlow || '')) return amz({ AuthenticationResult: tokens() });
        return amz({ ChallengeName: 'PASSWORD_VERIFIER', ChallengeParameters: { SALT: hex(16), SECRET_BLOCK: btoa(hex(32)), SRP_B: 'f' + hex(383), USERNAME: store.sub, USER_ID_FOR_SRP: store.sub } });
      case 'RespondToAuthChallenge': return amz({ AuthenticationResult: tokens(), ChallengeParameters: {} });
      case 'GetUser':
        return amz({ Username: store.sub, UserAttributes: [{ Name: 'sub', Value: store.sub }, { Name: 'email', Value: store.email }, { Name: 'email_verified', Value: 'true' }] });
      default: return amz({});
    }
  }

  const routes = [];
  window.__cgRoute = (method, re, fn) => routes.push({ method, re, fn });
  async function api(path, method, init) {
    let body = null;
    try { body = init && typeof init.body === 'string' ? JSON.parse(init.body) : null; } catch {}
    for (const r of routes) {
      const m = r.method === method && path.match(r.re);
      if (!m) continue;
      const out = await r.fn({ path, body, m, store, save, params: new URLSearchParams(path.split('?')[1] || '') });
      log('api', method, path);
      return out instanceof Response ? out : ok(out);
    }
    log('api', method, path, 'UNHANDLED');
    (window.__cgUnhandled = window.__cgUnhandled || []).push(`${method} ${path}`);
    return fail(404, 'Not available in this demo');
  }

  const config = () => ({
    apiBaseUrl: `${location.origin}/__cg-api`,
    graphAiBaseUrl: `${location.origin}/__cg-graphai`,
    signupOpen: true,
    cognito: { userPoolId: POOL, userPoolClientId: CLIENT, passkeys: false },
    posthog: { enabled: false },
  });

  const realFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input && input.url;
    const url = new URL(String(raw), location.href);
    const method = ((init && init.method) || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    if (url.hostname.startsWith('cognito-idp.')) {
      const headers = new Headers((init && init.headers) || (input instanceof Request ? input.headers : undefined));
      const target = (headers.get('x-amz-target') || '').split('.').pop();
      const text = (init && init.body) || (input instanceof Request ? await input.clone().text() : '{}');
      return cognito(target, JSON.parse(text || '{}'));
    }
    if (url.origin === location.origin && url.pathname.endsWith('/config.json')) return new Response(JSON.stringify(config()), { headers: { 'content-type': 'application/json' } });
    if (url.origin === location.origin && url.pathname.startsWith('/__cg-api')) return api(url.pathname.slice('/__cg-api'.length) + url.search, method, init);
    if (url.origin === location.origin && url.pathname.startsWith('/__cg-graphai')) {
      if (url.pathname.endsWith('/conversations')) return new Response(JSON.stringify({ conversations: store.chats || [] }), { headers: { 'content-type': 'application/json' } });
      return fail(404, 'Not available in this demo');
    }
    if (url.origin !== location.origin) { log('blocked', url.href); return new Response('', { status: 503 }); }
    return realFetch(url.href, init);
  };
  navigator.sendBeacon = () => true;
  const xopen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u, ...rest) {
    const url = new URL(u, location.href);
    if (url.origin !== location.origin) u = 'about:blank';
    return xopen.call(this, m, u, ...rest);
  };
  if ('WebSocket' in window) window.WebSocket = function () { throw new Error('offline demo'); };
  if ('EventSource' in window) window.EventSource = function () { throw new Error('offline demo'); };
})();
