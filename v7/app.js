(function () {
  'use strict';

  var TZ         = 'Africa/Lagos';
  var SPOTIFY    = 'https://spotify-api-lilac.vercel.app/api/now-playing';
  var ASSET_BASE = '/media/gallery/';
  var root = document.documentElement;
  // Set by each page's head script from the second page of a visit on: the
  // entrance has been seen once, so nothing replays it.
  var entered = root.classList.contains('no-enter');
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- analytics ------------------------------------------------------- */
  // Vercel Web Analytics, which v4 loaded through its React component. The
  // script only exists on a Vercel deploy, so it's skipped locally.
  if (!/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname)) {
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    var va = document.createElement('script');
    va.defer = true;
    va.src = '/_vercel/insights/script.js';
    document.head.appendChild(va);
  }


  /* ---- click sound ----------------------------------------------------- */
  // Cuelume (MIT), https://cuelume.dev. Synthesised Web Audio, no files.
  // Vendored so the sounds don't depend on a CDN staying up.
  var play = null;
  // Sound is opt-in: nobody should open a portfolio in an office and have it
  // click at them. The note below offers it once.
  var audioOn = false;
  try { audioOn = localStorage.getItem('audio') === 'on'; } catch (e) {}

  import('./vendor/cuelume.js').then(function (cuelume) {
    play = cuelume.play;
    cuelume.setEnabled(audioOn);
    cuelume.setVolume(0.5);
    window.__cuelume = cuelume;
  }).catch(function () { /* sounds simply don't load; everything else works */ });

  function click(kind) {
    if (!audioOn || !play) return;
    try { play(kind); } catch (e) {}
  }

  // The pen stroke gets its own sound. Cuelume's kit is clicks and chimes;
  // none of them read as a line being drawn. Noise swept up through a
  // bandpass and back down is the cheapest thing that does.
  var actx = null, noiseBuf = null, lastSwoosh = 0;
  function swoosh() {
    if (!audioOn) return;
    if (Date.now() - lastSwoosh < 450) return;          // don't machine-gun on a dart across
    // Hover isn't a gesture, so without a prior click the context would only
    // be resumed to play nothing.
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!actx) actx = new AC();
      if (actx.state === 'suspended') actx.resume();
      if (!noiseBuf) {
        var n = Math.floor(actx.sampleRate * 1.2);
        noiseBuf = actx.createBuffer(1, n, actx.sampleRate);
        var d = noiseBuf.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      }
      lastSwoosh = Date.now();
      var t = actx.currentTime + 0.18, dur = 0.52;      // starts with the stroke, not before it
      var src = actx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
      var hp = actx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 340;
      var bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
      var g  = actx.createGain();
      // up as the pen picks up speed, down as it lifts: the shape of a stroke
      bp.frequency.setValueAtTime(430, t);
      bp.frequency.exponentialRampToValueAtTime(2300, t + dur * 0.42);
      bp.frequency.exponentialRampToValueAtTime(720, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.26, t + dur * 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(actx.destination);
      src.start(t); src.stop(t + dur + 0.02);
    } catch (e) {}
  }

  var audioBtn = $('.audio-toggle');
  if (audioBtn) {
    var paintAudio = function () {
      audioBtn.setAttribute('aria-pressed', String(audioOn));
      audioBtn.setAttribute('aria-label', audioOn ? 'Disable audio' : 'Enable audio');
      audioBtn.title = audioOn ? 'Disable audio' : 'Enable audio';
    };
    paintAudio();
    audioBtn.addEventListener('click', function () {
      audioOn = !audioOn;
      try { localStorage.setItem('audio', audioOn ? 'on' : 'off'); } catch (e) {}
      if (window.__cuelume) window.__cuelume.setEnabled(audioOn);
      paintAudio();
    });
  }

  // Sound is for the things that behave like objects: the cards, which lift
  // under the pointer, and the highlighted links in the prose, whose
  // underline fills in as you reach them. Pills, crumbs, nav links and the
  // writing and playground rows stay silent — a tick on every word the
  // pointer crosses stops meaning anything.
  if (window.matchMedia('(hover: hover)').matches) {
    var lastHover = null;
    document.addEventListener('mouseover', function (e) {
      // the same pair the stylesheet highlights
      var el = e.target.closest('.card, .intro a[href], .connect a[href]');
      if (el === lastHover) return;
      lastHover = el;
      if (el) click('tick');
    }, { passive: true });
  }

  // One place decides what a click sounds like, so per-control handlers never
  // double up. It runs after their own listeners, so switching audio back on
  // is itself audible. Anything not named here makes no sound at all.
  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle, .audio-toggle, .sticker-reset')) return click('toggle');
    // Only the real buttons: about's greeting is a heading, and away from the
    // homepage the avatar is a link home, which sounds like one below
    if (e.target.closest('#greeting, button.avatar-wrap')) return click('press');
    if (e.target.closest('.link-row'))                    return;   // writing and playground, quiet either way
    if (e.target.closest('a[href]:not([href^="#"])'))     return click('page');
  }, { passive: true });

  /* ---- sound note ------------------------------------------------------ */
  // A site that makes noise should say so before it makes any. Injected here
  // rather than written into all seven pages, and gone for good once closed.
  (function () {
    // The key carries a number: bump it when the note itself changes and
    // everyone sees the new one once, rather than only new visitors.
    var KEY = 'soundNote3';
    // ?note brings it back on a browser that has already dismissed it, for
    // looking at it again without clearing storage by hand.
    var forced = /[?&]note(=|&|$)/.test(location.search);
    var seen = false;
    try { seen = localStorage.getItem(KEY) === 'seen'; } catch (e) {}
    // The head script reserves the bar's 32px before first paint (html.note),
    // so the page never moves to make room. If it guessed wrong, give the
    // room back; if it didn't reserve any (?note), take it now.
    if (!forced && (seen || audioOn)) {        // nothing to offer if it's already on
      root.classList.remove('note');
      return;
    }
    root.classList.add('note');

    var note = document.createElement('div');
    note.className = 'sound-note';
    note.setAttribute('role', 'status');
    note.innerHTML =
      '<span>This site has sound effects. ' +
      '<button type="button" class="sound-note-off">Turn them on</button>' +
      '<span class="sound-note-where">, or use the speaker up top whenever</span>.</span>' +
      '<button type="button" class="sound-note-x" aria-label="Dismiss">' +
      '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>';
    document.body.appendChild(note);

    // Two frames: one to get it laid out off-screen, one to slide it down
    // into the space already held for it
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add('has-note'); });
    });

    // Closing it is the visitor's own doing, so the page closing up after it
    // is expected
    var close = function () {
      document.body.classList.remove('has-note');
      root.classList.remove('note');
      try { localStorage.setItem(KEY, 'seen'); } catch (e) {}
      setTimeout(function () { note.remove(); }, 600);
    };
    note.querySelector('.sound-note-x').addEventListener('click', close);
    note.querySelector('.sound-note-off').addEventListener('click', function () {
      // Through the real toggle, so there is one path that switches sound on
      if (!audioOn && audioBtn) audioBtn.click();
      close();
    });
  })();

  /* ---- theme ----------------------------------------------------------- */
  var toggle = $('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---- greeting + clock ------------------------------------------------ */
  // Both read Shater's hour in Lagos, not the visitor's.
  var greetingEl = $('#greeting');
  var clockEl    = $('#clock');
  var timeFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
  });
  var hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false });

  // Tiv evening/night greetings are still missing; English + German only there.
  var GREETINGS = {
    morning:   [['en', 'good morning'],   ['tiv', 'U nder vee'],  ['de', 'Guten Morgen']],
    afternoon: [['en', 'good afternoon'], ['tiv', 'U pande vee'], ['de', 'Guten Tag']],
    evening:   [['en', 'good evening'],                           ['de', 'Guten Abend']],
    night:     [['en', 'good night'],                             ['de', 'Gute Nacht']]
  };

  function bucket(h) {
    if (h >= 5  && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 22) return 'evening';
    return 'night';
  }

  var greetBtn  = $('#greeting');
  var greetText = $('#greetingText');
  var greetIdx  = 0;
  var greetKey  = null;

  function paintGreeting(animate) {
    if (!greetText) return;
    var set = GREETINGS[greetKey];
    var pair = set[greetIdx % set.length];
    var write = function () {
      greetText.textContent = pair[1];
      greetText.setAttribute('lang', pair[0]);
    };
    if (!animate) { write(); return; }
    greetText.classList.add('is-out');
    setTimeout(function () { write(); greetText.classList.remove('is-out'); }, 180);
  }

  // It never changes by itself: a line rewriting itself right above the first
  // paragraph pulls the eye off it. Each click says it in the next language.
  // With reduced motion the word swaps outright, without the fade.
  if (greetBtn) {
    greetBtn.addEventListener('click', function () {
      greetIdx++;
      paintGreeting(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    });
  }

  function tick() {
    var now = new Date();
    if (clockEl) {
      clockEl.textContent = timeFmt.format(now).toLowerCase();
      clockEl.setAttribute('datetime', now.toISOString());
    }
    if (greetText) {
      var key = bucket(parseInt(hourFmt.format(now), 10) % 24);
      if (key !== greetKey) {     // crossed into a new part of the day
        greetKey = key;
        greetIdx = 0;
        paintGreeting(false);
      }
    }
  }
  if (clockEl || greetText) { tick(); setInterval(tick, 1000); }

  /* ---- signature ------------------------------------------------------- */
  // Drawn once a visit, on the first page. After that it's the same mark in
  // the same place on every page, and erasing it to draw it again only hid
  // it. Hovering still redraws it. With reduced motion it's simply there.
  var sigPath = $('.sig-path');
  if (sigPath) {
    var sigStill = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sigDrawn = entered;
    try {
      if (sessionStorage.getItem('sigDrawn')) sigDrawn = true;
      else sessionStorage.setItem('sigDrawn', '1');
    } catch (e) {}
    var sigAnim = null;
    var draw = function () {
      if (sigAnim) sigAnim.cancel();
      sigAnim = sigPath.animate(
        [{ strokeDashoffset: 1200 }, { strokeDashoffset: 0 }],
        { duration: 5000, delay: 200, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
      );
    };
    if (sigStill || sigDrawn || !sigPath.animate) sigPath.style.strokeDashoffset = '0';
    else draw();
    if (!sigStill && sigPath.animate) {
      $('.sig').addEventListener('mouseenter', function () { draw(); swoosh(); });
    }
  }

  /* ---- gallery --------------------------------------------------------- */
  // Clicking the avatar opens an inline strip under the nav, pushing the page
  // down. Clicking a photo in the strip opens it larger.
  var PHOTOS = [
    'selfie-hoodie.webp', 'mirror-selfie-arsenal-kit.webp', 'selfie-green-shirt.webp', 'mirror-selfie-black-tee.webp',
    'playing-bass.webp', 'portrait-bw-armchair.webp', 'portrait-studio-chair.webp'
  ].map(function (f) { return ASSET_BASE + f; });

  // Only the homepage's avatar is a button; everywhere else it links home
  var avatarBtn = $('button.avatar-wrap');
  var gallery   = $('#gallery');
  var track     = $('#galleryTrack');

  if (avatarBtn && gallery && track) {
    var built = false, open = false, staggerTimers = [];

    var build = function () {
      PHOTOS.forEach(function (src, i) {
        var card = document.createElement('button');
        card.className = 'gallery-card';
        card.type = 'button';
        card.setAttribute('aria-label', 'View photo ' + (i + 1));
        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        card.appendChild(img);
        card.addEventListener('click', function () { lightbox(i); });
        track.appendChild(card);
      });
      built = true;
    };

    var stagger = function (on) {
      staggerTimers.forEach(clearTimeout);
      staggerTimers = [];
      var cards = $$('.gallery-card', track);
      if (!on) { cards.forEach(function (c) { c.classList.remove('is-in'); }); return; }
      cards.forEach(function (c, i) {
        staggerTimers.push(setTimeout(function () { c.classList.add('is-in'); }, 60 + i * 80));
      });
    };

    avatarBtn.addEventListener('click', function () {
      if (!built) build();
      open = !open;
      gallery.classList.toggle('is-open', open);
      gallery.setAttribute('aria-hidden', String(!open));
      avatarBtn.classList.toggle('is-active', open);
      avatarBtn.setAttribute('aria-expanded', String(open));
      stagger(open);
    });
  }

  /* ---- lightbox -------------------------------------------------------- */
  function lightbox(startAt) {
    var idx = startAt, box = null;
    var lastFocus = document.activeElement;

    var show = function (i) {
      idx = (i + PHOTOS.length) % PHOTOS.length;
      $('.lb-img', box).src = PHOTOS[idx];
      $$('.lb-dot', box).forEach(function (d, n) {
        d.classList.toggle('is-on', n === idx);
      });
    };

    var onKey = function (e) {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft')  show(idx - 1);
    };

    var close = function () {
      box.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      setTimeout(function () { box.remove(); }, 200);
      if (lastFocus) lastFocus.focus();
    };

    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Photo');
    box.innerHTML =
      '<div class="lb-inner">' +
        '<button class="lb-close" type="button" aria-label="Close">&#10005;</button>' +
        '<button class="lb-nav lb-prev" type="button" aria-label="Previous">&#8249;</button>' +
        '<img class="lb-img" alt="" />' +
        '<button class="lb-nav lb-next" type="button" aria-label="Next">&#8250;</button>' +
        '<div class="lb-dots">' +
          PHOTOS.map(function () { return '<button class="lb-dot" type="button"></button>'; }).join('') +
        '</div>' +
      '</div>';
    document.body.appendChild(box);
    show(startAt);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { box.classList.add('is-open'); });

    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    $('.lb-close', box).addEventListener('click', close);
    $('.lb-prev',  box).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next',  box).addEventListener('click', function () { show(idx + 1); });
    $$('.lb-dot',  box).forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); });
    });
    document.addEventListener('keydown', onKey);
    $('.lb-close', box).focus();
  }

  /* ---- videos ---------------------------------------------------------- */
  // Case-study clips ship with preload="none" and a poster, so nothing loads
  // until a clip is on screen. They play while mostly visible and pause once
  // scrolled away. With reduced motion they stay on the poster and get
  // controls, so playing one is a choice.
  (function () {
    var vids = $$('video[preload="none"]');
    if (!vids.length) return;

    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || !('IntersectionObserver' in window)) {
      vids.forEach(function (v) { v.setAttribute('controls', ''); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { /* blocked: poster stays */ });
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.4 });

    vids.forEach(function (v) { io.observe(v); });
  })();

  /* ---- work row -------------------------------------------------------- */
  // The row scrolls sideways with its scrollbar hidden, which a trackpad or
  // a finger finds and a mouse wheel doesn't, so step buttons are there
  // whenever a card is cut off, and move one card at a time.
  (function () {
    var row = $('.cards');
    var nav = $('.cards-nav');
    if (!row || !nav) return;
    var steps = $$('.cards-step', nav);
    function update() {
      var max = row.scrollWidth - row.clientWidth;
      // The scroll extent runs on until the last card lines up with the
      // column, so on a wide screen the row still scrolls with every card
      // already in view. "More" means a card past the edge, not scroll left.
      var edge = Math.min(row.getBoundingClientRect().right, root.clientWidth);
      var allIn = row.lastElementChild.getBoundingClientRect().right <= edge + 1;
      steps[0].disabled = row.scrollLeft <= 2;
      steps[1].disabled = row.scrollLeft >= max - 2 || allIn;
      nav.hidden = steps[0].disabled && allIn;
    }
    steps.forEach(function (b) {
      b.addEventListener('click', function () {
        var card = $('.card', row);
        var by = card ? card.getBoundingClientRect().width + 14 : 222;
        row.scrollBy({ left: by * Number(b.dataset.dir), behavior: 'smooth' });
      });
    });
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---- card lights ----------------------------------------------------- */
  // The drifting lights repaint every frame they run, so they only run while
  // the row is on screen. (On touch screens the stylesheet holds them still.)
  (function () {
    var rows = $$('.cards');
    if (!rows.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-off', !e.isIntersecting); });
    });
    rows.forEach(function (r) { io.observe(r); });
  })();

  /* ---- card to case study ---------------------------------------------- */
  // Every card and its hero share a view-transition-name, so the card grows
  // into the hero. Left to the stylesheet, all five cards are captured on
  // every page change, and the four nobody followed hang over the next page
  // as fading ghosts. So only the pair that actually meets keeps its name:
  // the card being followed on the way in, the card being returned to on the
  // way back, and a hero only when the homepage is on the other side.
  (function () {
    var named = $$('.cards .card, .study-hero');
    if (!named.length) return;
    // compared as paths, so /work/luotain, /work/luotain/ and
    // /work/luotain.html are one page, and / and /index.html another
    var path = function (u) {
      try {
        return new URL(u, location.href).pathname.replace(/\.html$/, '').replace(/\/(index)?$/, '');
      } catch (e) { return null; }
    };
    var home = '';
    // other: the URL on the far side of the transition, or null to put every
    // name back as the stylesheet has it
    var keep = function (other) {
      var to = other == null ? null : path(other);
      named.forEach(function (el) {
        var mine = el.classList.contains('study-hero') ? home : path(el.href);
        el.style.viewTransitionName = to === null || to === mine ? '' : 'none';
      });
    };
    // On the way out: the page is still here, and this runs just before it
    // is captured
    addEventListener('pageswap', function (e) {
      if (!e.viewTransition || !e.activation || !e.activation.entry) return;
      keep(e.activation.entry.url);
    });
    // On the way in, including coming back from the cache with Back, where
    // the cards still carry whatever the way out left on them
    addEventListener('pagereveal', function (e) {
      var a = window.navigation && navigation.activation;
      keep(e.viewTransition && a && a.from ? a.from.url : null);
    });
  })();

  /* ---- now playing ----------------------------------------------------- */
  var vinyl = $('#vinyl');
  if (vinyl) {
    var art    = $('#vinylArt');
    var state  = $('#playerState');
    var title  = $('#trackTitle');
    var artist = $('#trackArtist');
    var trackLine = $('.player-track');
    var tag    = $('#player');

    function paint(d) {
      state.textContent  = d.isPlaying ? 'Now playing' : 'Last played';
      var named = !!(d.title || d.artist);
      title.textContent  = d.title  || '';
      artist.textContent = d.artist || '';
      trackLine.hidden = !named;
      vinyl.classList.toggle('spinning', !!d.isPlaying);
      // Spotify serves covers at 640, 300 and 64px, named by size in the URL.
      // The vinyl is 40px, so ask for the 300 rather than hauling the 640.
      if (d.albumArt) { art.src = String(d.albumArt).replace('ab67616d0000b273', 'ab67616d00001e02'); art.hidden = false; }
      // The tag is a link with no href until there's a song to point at, so
      // it's inert rather than broken before the fetch lands. Once it has one
      // it previews, ⌘-clicks and long-presses like any other link.
      if (d.songUrl) {
        var where = /^https:\/\/([a-z0-9-]+\.)*spotify\.com\//i.test(d.songUrl) ? 'Spotify' : '';
        var what = d.title ? d.title + (d.artist ? ' by ' + d.artist : '') : (d.artist || 'a song');
        tag.href = d.songUrl;
        tag.title = where ? 'Open on ' + where : 'Open in a new tab';
        tag.setAttribute('aria-label', state.textContent + ': ' + what + ', ' +
                         (where ? 'opens ' + where : 'opens in a new tab'));
      }
    }

    function poll() {
      fetch(SPOTIFY)
        .then(function (r) { return r.json(); })
        .then(paint)
        .catch(function () { /* endpoint down, leave the last good state */ });
    }
    poll();
    setInterval(poll, 10000);
  }




  /* ---- collage --------------------------------------------------------- */
  var canvas = $('.collage-canvas');
  if (canvas) {
    var items = $$('.collage-item', canvas);
    var z = items.length;

    // Fade each piece in once its image has decoded
    items.forEach(function (item, i) {
      var img = $('img', item);
      var reveal = function () {
        setTimeout(function () { img.classList.add('is-in'); }, 40 * i);
      };
      if (img.complete) reveal(); else img.addEventListener('load', reveal);
      img.addEventListener('error', function () { item.remove(); });
    });

    // A mouse drags a piece straight away. A finger has to rest on one for a
    // moment first: on a phone the collage fills most of the screen, and a
    // swipe across it is someone scrolling the page, not rearranging it.
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var HOLD = 300, SLOP = 10;
    var drag = null, hold = null;

    var start = function (item, x, y) {
      drag = {
        item: item, sx: x, sy: y,
        ox: parseFloat(item.dataset.dx || 0),
        oy: parseFloat(item.dataset.dy || 0)
      };
      item.style.zIndex = ++z;
      item.classList.add('is-dragging');
    };

    var move = function (x, y) {
      var dx = drag.ox + (x - drag.sx);
      var dy = drag.oy + (y - drag.sy);
      drag.item.dataset.dx = dx;
      drag.item.dataset.dy = dy;
      drag.item.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    };

    var end = function () {
      if (hold) { clearTimeout(hold.timer); hold = null; }
      if (!drag) return;
      drag.item.classList.remove('is-dragging');
      drag = null;
    };

    items.forEach(function (item) {
      item.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();                  // no text selection or image drag
        start(item, e.clientX, e.clientY);
      });

      item.addEventListener('touchstart', function (e) {
        end();
        if (e.touches.length > 1) return;    // a pinch is the page's
        var t = e.touches[0];
        hold = { x: t.clientX, y: t.clientY, cx: t.clientX, cy: t.clientY };
        hold.timer = setTimeout(function () {
          var h = hold;
          hold = null;
          start(item, h.cx, h.cy);
          // the only sign the hold took, since nothing has moved yet
          var img = $('img', item);
          if (!still && img && img.animate) {
            img.animate([{ transform: 'none' }, { transform: 'scale(1.06)' }, { transform: 'none' }],
                        { duration: 240, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
          }
        }, HOLD);
      }, { passive: true });

      // Touch events keep going to the piece the finger started on, wherever
      // it goes, so this one listener sees the whole gesture. It can't be
      // passive, since a drag has to stop the page scrolling, but it only
      // does that once a hold has become a drag; until then every swipe
      // scrolls as normal.
      item.addEventListener('touchmove', function (e) {
        var t = e.touches[0];
        if (drag) {
          if (e.cancelable) e.preventDefault();
          move(t.clientX, t.clientY);
        } else if (hold) {
          hold.cx = t.clientX; hold.cy = t.clientY;
          if (Math.hypot(hold.cx - hold.x, hold.cy - hold.y) > SLOP) end();   // it's a scroll
        }
      }, { passive: false });
      item.addEventListener('touchend', end);
      item.addEventListener('touchcancel', end);
      // a long press would otherwise bring up the menu mid-drag
      item.addEventListener('contextmenu', function (e) { if (drag) e.preventDefault(); });
    });
    window.addEventListener('mousemove', function (e) { if (drag) move(e.clientX, e.clientY); });
    window.addEventListener('mouseup', end);
  }
  /* ---- stickers -------------------------------------------------------- */
  // Stickers peek in from the far edges and can be peeled off and dropped
  // anywhere on the page. Untouched ones stay pinned to their edge as the
  // window changes; once moved, a sticker stays where it was put.
  (function () {
    var layer = $('.stickers');
    if (!layer) return;

    var BASE = '/media/about/';
    // w is the display width; nw/nh the natural size, so each box is the
    // right height before its image arrives. Each side fills top to bottom
    // in this order; p is how much of it peeks in, r its tilt. read marks
    // the ones with text on them: sized for it, and lifted larger in hand.
    var SET = [
      { f: 'batman-logo.webp',                                        nw: 304, nh: 231, w: 109, side: 'l', p: 0.55, r: -12 },
      { f: 'knicks-logo.webp',                                        nw: 249, nh: 249, w: 95, side: 'r', p: 0.5, r: 9 },
      { f: 'figma-logo.webp',                                         nw: 367, nh: 393, w: 92, side: 'l', p: 0.45, r: 8, own: 1 },
      { f: 'bass-guitar.webp',                                        nw: 829, nh: 974, w: 171, side: 'r', p: 0.5, r: 14 },
      { f: 'anime-luffy-boxing.webp',                                 nw: 362, nh: 245, w: 115, side: 'l', p: 0.5, r: -6 },
      { f: 'chess-pawn.webp',                                         nw: 350, nh: 411, w: 88, side: 'l', p: 0.6, r: 6, own: 1 },
      { f: 'knicks-player-reaction.webp',                             nw: 441, nh: 286, w: 118, side: 'r', p: 0.45, r: 7 },
      { f: 'holy-bible.webp',                                         nw: 417, nh: 334, w: 151, side: 'l', p: 0.5, r: -14 },
      { f: 'flag-nigeria.webp',                                       nw: 506, nh: 506, w: 139, side: 'r', p: 0.55, r: -7 },
      { f: 'polaroid-selfie.webp',                                    nw: 700, nh: 744, w: 170, side: 'l', p: 0.45, r: 10 },
      { f: 'manga-he-laughed.webp',                                   nw: 718, nh: 601, w: 104, side: 'r', p: 0.5, r: 12 },
      { f: 'xbox-controller.webp',                                    nw: 545, nh: 437, w: 106, side: 'l', p: 0.55, r: -9 },
      { f: 'hugeicons-tweet.webp',                                    nw: 1069, nh: 540, w: 320, side: 'r', p: 0.8, r: -5, read: 1 },
      { f: 'ornate-a-logo.webp',                                      nw: 420, nh: 395, w: 116, side: 'l', p: 0.5, r: 11, own: 1 },
      { f: 'book-its-kind-of-a-funny-story.webp',                     nw: 331, nh: 382, w: 122, side: 'r', p: 0.5, r: -12 },
      { f: 'anime-zoro.webp',                                         nw: 552, nh: 550, w: 95, side: 'r', p: 0.5, r: -8 },
      { f: 'receiptify-top-tracks.webp',                              nw: 818, nh: 1067, w: 240, side: 'l', p: 0.8, r: 7, read: 1 },
      { f: 'fc26-card-saliba.webp',                                   nw: 608, nh: 690, w: 180, side: 'r', p: 0.5, r: -13 }
    ];

    // The die-cut, drawn once per sticker on a canvas at the screen's real
    // pixel density rather than through an SVG filter, which some browsers
    // run at 1x and threshold into a stair-stepped edge. The border is the
    // art's own outline stamped around a circle, so it follows every shape,
    // comes out round at the corners, and keeps its anti-aliasing. Then a
    // soft shade just inside the cut, so the edge reads as having a
    // thickness.
    // 4px reads as a die-cut without turning into a frame. Art marked own
    // already has its white edge baked in, so it skips the stamp rather than
    // wearing two.
    var BORDER = 4, PAD = BORDER + 3;
    function cut(s) {
      var d = Math.min(2, window.devicePixelRatio || 1);
      var w = s.w, h = s.h;
      var cw = Math.ceil((w + PAD * 2) * d), ch = Math.ceil((h + PAD * 2) * d);
      var sheet = function () {
        var c = document.createElement('canvas');
        c.width = cw; c.height = ch;
        return c;
      };

      var art = sheet(), ac = art.getContext('2d');
      ac.imageSmoothingQuality = 'high';
      ac.drawImage(s.img, PAD * d, PAD * d, w * d, h * d);
      // Several of these were exported with a soft drop shadow baked in.
      // Left in, the stamping below grows that faint halo into a white blob
      // and the grey lands on top of the border, so anything that faint
      // goes first. Solid pixels keep their alpha; the band just above the
      // cutoff fades in so real edges stay anti-aliased.
      try {
        var px = ac.getImageData(0, 0, cw, ch), dt = px.data;
        for (var i = 3; i < dt.length; i += 4) {
          var al = dt[i];
          if (al < 160) dt[i] = al <= 100 ? 0 : Math.round((al - 100) * 160 / 60);
        }
        ac.putImageData(px, 0, 0);
      } catch (err) { /* unreadable image: cut it as it is */ }

      var sil = sheet(), sc = sil.getContext('2d');
      (s.cfg.own ? [] : [BORDER, BORDER / 2]).forEach(function (r) {
        var rr = r * d, n = Math.max(16, Math.ceil(2 * Math.PI * rr / 1.2));
        for (var i = 0; i < n; i++) {
          var t = i / n * 2 * Math.PI;
          sc.drawImage(art, Math.cos(t) * rr, Math.sin(t) * rr);
        }
      });
      sc.drawImage(art, 0, 0);
      sc.globalCompositeOperation = 'source-in';
      sc.fillStyle = '#fff';
      sc.fillRect(0, 0, cw, ch);

      // everything but the sticker, to cast the inner shade from
      var outside = sheet(), oc = outside.getContext('2d');
      oc.fillRect(0, 0, cw, ch);
      oc.globalCompositeOperation = 'destination-out';
      oc.drawImage(sil, 0, 0);

      var cv = s.cv;
      cv.width = cw; cv.height = ch;
      cv.style.width = (w + PAD * 2) + 'px';
      cv.style.height = (h + PAD * 2) + 'px';
      cv.style.margin = -PAD + 'px';
      var o = cv.getContext('2d');
      o.drawImage(sil, 0, 0);
      o.drawImage(art, 0, 0);
      // Only the shadow lands: the shape itself is drawn a long way off the
      // canvas and its shadow offset back, so no hard line forms at the cut.
      o.globalCompositeOperation = 'source-atop';
      o.shadowColor = 'rgba(0, 0, 0, 0.12)';
      o.shadowBlur = 2.5 * d;
      o.shadowOffsetX = cw * 2;
      o.shadowOffsetY = 1 * d;
      o.drawImage(outside, -cw * 2, 0);
      s.cutAt = w + 'x' + d;
    }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var content = $('.content');
    var W = 0, H = 0, gutter = 0, small = false, z = SET.length, raf = 0, last = 0;

    var tf = function (x, y, r, sc) {
      return 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' +
             r.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
    };
    var clampN = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };
    // A moved sticker can hang off a side or the bottom, but never so far
    // that there's nothing left to pick it back up by
    var clamp = function (s) {
      s.x = clampN(s.x, -s.w * 0.7, W - s.w * 0.3);
      s.y = clampN(s.y, 0, Math.max(0, H - s.h));
    };

    var stickers = SET.map(function (cfg, i) {
      var el = document.createElement('div');
      el.className = 'sticker';
      el.style.zIndex = i + 1;
      var cv = document.createElement('canvas');
      el.appendChild(cv);
      layer.appendChild(el);
      var img = new Image();
      img.crossOrigin = 'anonymous';       // the host allows it; needed to read pixels
      img.decoding = 'async';
      return { el: el, cv: cv, img: img, cfg: cfg, i: i, w: 0, h: 0, x: 0, y: 0, rot: cfg.r, tilt: 0, sc: 1,
               vx: 0, vy: 0, down: null, held: false, hover: false, moved: false, ready: false, samples: [], tf: '', cutAt: '' };
    });

    function measure() {
      W = layer.clientWidth;
      H = layer.clientHeight;
      gutter = (W - (content ? content.getBoundingClientRect().width : 540)) / 2;
      small = W < 640;
    }

    // How much of an untouched sticker shows: never more than half-ish of
    // it, and never enough to reach the text column. The cut border hangs
    // PAD past the box, so it counts.
    function anchor(s) {
      var show = Math.max(6, Math.min(s.w * s.cfg.p, gutter - PAD - 20));
      s.x = s.cfg.side === 'l' ? show - s.w : W - show;
    }

    // The card row runs past the column to the right edge, so a sticker
    // pinned there would sit on the cards. Find the bands of page height
    // that reach into a margin, per side.
    function bands(side) {
      var col = content ? content.getBoundingClientRect() : { left: gutter, right: W - gutter };
      var out = [];
      $$('.cards').forEach(function (row) {
        var t = Infinity, b = -Infinity, l = Infinity, r = -Infinity;
        $$('.card', row).forEach(function (c) {
          var q = c.getBoundingClientRect();
          t = Math.min(t, q.top); b = Math.max(b, q.bottom);
          l = Math.min(l, q.left); r = Math.max(r, q.right);
        });
        if (t === Infinity) return;
        if (side === 'l' ? l < col.left - 4 : r > col.right + 4) {
          out.push([t + window.scrollY - 24, b + window.scrollY + 24]);
        }
      });
      return out.sort(function (p, q) { return p[0] - q[0]; });
    }

    // Down each side, spread evenly over whatever height is free: the page
    // minus the bands something else already occupies. With this many,
    // neighbours overlap a little, which is how stickers go on anyway.
    function place(side) {
      var list = stickers.filter(function (s) {
        return !s.el.hidden && !s.moved && s.cfg.side === side;
      });
      if (!list.length) return;
      // the right side starts below the fixed toggles
      var spans = [[side === 'r' ? 116 : 56, H - 16]];
      bands(side).forEach(function (b) {
        var next = [];
        spans.forEach(function (sp) {
          if (b[1] <= sp[0] || b[0] >= sp[1]) { next.push(sp); return; }
          if (b[0] > sp[0]) next.push([sp[0], b[0]]);
          if (b[1] < sp[1]) next.push([b[1], sp[1]]);
        });
        spans = next;
      });
      spans = spans.filter(function (sp) { return sp[1] - sp[0] > 60; });
      var total = spans.reduce(function (n, sp) { return n + sp[1] - sp[0]; }, 0);
      list.forEach(function (s, k) {
        var d = (k + 0.5) / list.length * total, j = 0;
        while (j < spans.length - 1 && d > spans[j][1] - spans[j][0]) {
          d -= spans[j][1] - spans[j][0];
          j++;
        }
        var sp = spans[j];
        s.y = Math.round(clampN(sp[0] + d - s.h / 2, sp[0], Math.max(sp[0], sp[1] - s.h)));
      });
    }

    function render(s) {
      var t = tf(s.x, s.y, s.rot + s.tilt, s.sc);
      if (t !== s.tf) { s.el.style.transform = t; s.tf = t; }
    }

    function layout() {
      measure();
      // None on a phone: the margins are a sliver and the page is the work.
      // They aren't even fetched there.
      markMoved();
      stickers.forEach(function (s) {
        s.el.hidden = small;
        if (small) return;
        if (!s.img.src) s.img.src = BASE + s.cfg.f;
        s.w = s.cfg.w;
        s.h = Math.round(s.w * s.cfg.nh / s.cfg.nw);
        s.el.style.width = s.w + 'px';
        s.el.style.height = s.h + 'px';
        if (s.ready && s.cutAt !== s.w + 'x' + Math.min(2, window.devicePixelRatio || 1)) cut(s);
        if (s.moved) clamp(s); else anchor(s);
      });
      if (small) return;
      place('l');
      place('r');
      stickers.forEach(render);
    }

    // Pointer velocity over the last few samples, in px/ms. A pointer that
    // stopped before letting go throws nothing.
    function velocity(s, now) {
      var pts = s.samples, n = pts.length;
      if (n < 2 || now - pts[n - 1].t > 60) return { x: 0, y: 0 };
      var a = pts[0], b = pts[n - 1], dt = Math.max(8, b.t - a.t);
      return { x: clampN((b.x - a.x) / dt, -2, 2), y: clampN((b.y - a.y) / dt, -2, 2) };
    }

    function frame(now) {
      var dt = Math.min(34, now - last || 16);
      last = now;
      var busy = false;
      var ease = function (tau) { return 1 - Math.exp(-dt / tau); };
      stickers.forEach(function (s) {
        if (s.el.hidden || !s.ready) return;
        // picked up it grows a touch; hovered, less so
        var tSc = s.held ? (s.cfg.read ? 1.2 : 1.07) : (s.hover ? 1.03 : 1);
        s.sc += (tSc - s.sc) * ease(70);
        // it swings with the drag, the way a held piece of paper does
        var tTilt = 0;
        if (s.held && !reduce) {
          while (s.samples.length > 2 && now - s.samples[0].t > 90) s.samples.shift();
          tTilt = clampN(velocity(s, now).x * 9, -10, 10);
        }
        s.tilt += (tTilt - s.tilt) * ease(110);
        // let go mid-flick, it carries on and slows to a stop
        if (!s.held && (Math.abs(s.vx) > 0.004 || Math.abs(s.vy) > 0.004)) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          var decay = Math.exp(-dt / 190);
          s.vx *= decay; s.vy *= decay;
          var px = s.x, py = s.y;
          clamp(s);
          if (s.x !== px) s.vx = 0;
          if (s.y !== py) s.vy = 0;
          busy = true;
        }
        if (s.held || Math.abs(tSc - s.sc) > 0.0005 || Math.abs(tTilt - s.tilt) > 0.02) busy = true;
        render(s);
      });
      raf = busy ? requestAnimationFrame(frame) : 0;
    }
    function wake() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    stickers.forEach(function (s) {
      var el = s.el;

      // Picking one up. A mouse lifts it on press. A finger has to pull it
      // first: on a touch screen the stickers let vertical swipes through to
      // the page (touch-action: pan-y), so a scroll that happens to start on
      // one must leave it where it was. It lifts once the finger has gone
      // 8px sideways, and if the page takes the gesture after all, it goes
      // back.
      var lift = function (e) {
        var d = s.down;
        s.held = true;
        s.moved = true;
        s.vx = s.vy = 0;
        s.offX = d.x - d.fromX;              // held by the point first touched
        s.offY = d.y - d.fromY;
        s.samples = [{ t: e.timeStamp, x: e.pageX, y: e.pageY }];
        el.style.zIndex = ++z;
        el.classList.add('is-held');
        markMoved();
        click('press');
        wake();
      };

      el.addEventListener('pointerdown', function (e) {
        if (!s.ready || e.button !== 0 || s.down) return;
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
        s.down = {
          id: e.pointerId, x: e.pageX, y: e.pageY, fromX: s.x, fromY: s.y, moved: s.moved,
          // whether the page still gets vertical swipes that start here
          sideways: getComputedStyle(el).touchAction !== 'none'
        };
        if (e.pointerType === 'mouse') lift(e);
      });
      el.addEventListener('pointermove', function (e) {
        var d = s.down;
        if (!d || e.pointerId !== d.id) return;
        if (!s.held) {
          var dx = Math.abs(e.pageX - d.x), dy = Math.abs(e.pageY - d.y);
          if (d.sideways ? dx < 8 || dx < dy : Math.hypot(dx, dy) < 8) return;
          lift(e);
        }
        s.x = e.pageX - s.offX;
        s.y = e.pageY - s.offY;
        clamp(s);
        s.samples.push({ t: e.timeStamp, x: e.pageX, y: e.pageY });
        if (s.samples.length > 12) s.samples.shift();
        wake();
      });
      var drop = function (e) {
        var d = s.down;
        if (!d || e.pointerId !== d.id) return;
        s.down = null;
        if (!s.held) return;                 // a tap, or a scroll that was never a drag
        s.held = false;
        el.classList.remove('is-held');
        // The browser took the gesture over (a scroll after all, or the
        // system's own): put the sticker back as if it was never touched
        if (e.type === 'pointercancel') {
          s.x = d.fromX;
          s.y = d.fromY;
          s.moved = d.moved;
          s.vx = s.vy = 0;
          markMoved();
          wake();
          return;
        }
        // Only a flick carries on. Setting one down while still drifting a
        // little shouldn't send it anywhere.
        if (!reduce && e.type === 'pointerup') {
          var v = velocity(s, e.timeStamp);
          if (Math.hypot(v.x, v.y) > 0.35) { s.vx = v.x; s.vy = v.y; }
        }
        click('release');
        wake();
      };
      el.addEventListener('pointerup', drop);
      el.addEventListener('pointercancel', drop);
      el.addEventListener('lostpointercapture', drop);   // never left holding one
      el.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'mouse') { s.hover = true; wake(); }
      });
      el.addEventListener('pointerleave', function () { s.hover = false; wake(); });

      var img = s.img;
      img.addEventListener('error', function () { el.remove(); s.el.hidden = true; });
      // Cut it and slide it in from the edge once there is something to see.
      // Only on the first page of a visit: coming back, they're already up.
      img.addEventListener('load', function () {
        if (!img.naturalWidth) return;
        s.ready = true;
        cut(s);
        render(s);
        if (reduce || entered || s.el.hidden) return;
        var out = s.cfg.side === 'l' ? -(s.x + s.w + 24) : (W - s.x + 24);
        var swing = s.cfg.side === 'l' ? -16 : 16;
        el.style.pointerEvents = 'none';
        var done = function () { el.style.pointerEvents = ''; };
        el.animate(
          [{ transform: tf(s.x + out, s.y, s.rot + swing, 1) }, { transform: s.tf }],
          { duration: 900, delay: 300 + s.i * 55, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
        ).finished.then(done, done);
      });
    });

    // Reset lives with the other page controls, and only while there's
    // something to put back: it joins them the first time a sticker moves,
    // and leaves once they're all home again. A control that does nothing
    // until you've played shouldn't sit there greyed out on every visit.
    var chrome = $('.chrome');
    var resetBtn = null, homing = false;
    var markMoved = function () {
      if (homing || !chrome) return;           // reset() hides it once the spin is done
      var any = !small && stickers.some(function (s) { return s.moved; });
      if (!resetBtn) {
        if (!any) return;
        resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'sticker-reset';
        resetBtn.setAttribute('aria-label', 'Put the stickers back');
        resetBtn.title = 'Put the stickers back';
        resetBtn.hidden = true;
        resetBtn.innerHTML =
          '<svg viewBox="0 0 18 18" aria-hidden="true"><g fill="none" stroke="currentColor" ' +
          'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M2.6 9a6.4 6.4 0 1 0 6.4-6.4 6.9 6.9 0 0 0-4.8 1.95L2.6 6.1"/>' +
          '<path d="M2.6 2.6v3.5h3.5"/></g></svg>';
        chrome.insertBefore(resetBtn, chrome.firstChild);
        resetBtn.addEventListener('click', reset);
      }
      if (resetBtn.hidden !== any) return;     // already showing what it should
      // focus that was on it moves to its neighbour rather than to nowhere
      if (!any && document.activeElement === resetBtn && resetBtn.nextElementSibling) {
        resetBtn.nextElementSibling.focus();
      }
      resetBtn.hidden = !any;
      if (any && !reduce) {
        resetBtn.animate([{ opacity: 0, transform: 'scale(0.8)', offset: 0 }],
                         { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
    };

    function reset() {
      var from = stickers.map(function (s) { return s.tf; });
      stickers.forEach(function (s) {
        s.moved = false; s.held = false; s.down = null; s.vx = s.vy = 0; s.tilt = 0; s.sc = 1;
        s.el.classList.remove('is-held');
        s.el.style.zIndex = s.i + 1;
      });
      z = SET.length;
      // The button stays put through its spin, then goes
      homing = true;
      layout();
      var gone = function () { homing = false; markMoved(); };
      if (reduce) return gone();
      var svg = $('svg', resetBtn);
      if (svg) svg.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-360deg)' }],
                           { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
        .finished.then(gone, gone);
      else gone();
      // each one floats home from wherever it was left
      stickers.forEach(function (s, i) {
        if (s.el.hidden || !s.ready || from[i] === s.tf) return;
        s.el.style.pointerEvents = 'none';
        var done = function () { s.el.style.pointerEvents = ''; };
        s.el.animate([{ transform: from[i] }, { transform: s.tf }],
                     { duration: 700, delay: i * 22, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' })
          .finished.then(done, done);
      });
    }

    layout();
    // The page changes height as fonts and images land, and width with the
    // window; re-pin whatever hasn't been moved
    if (window.ResizeObserver) {
      var pending = 0;
      new ResizeObserver(function () {
        if (pending) return;
        pending = requestAnimationFrame(function () { pending = 0; layout(); });
      }).observe(layer);
    } else {
      window.addEventListener('resize', layout);
    }
  })();
})();
