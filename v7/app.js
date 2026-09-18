(function () {
  'use strict';

  var TZ         = 'Africa/Lagos';
  var SPOTIFY    = 'https://spotify-api-lilac.vercel.app/api/now-playing';
  var ASSET_BASE = 'https://www.shatermt.com/assets/';
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };


  /* ---- click sound ----------------------------------------------------- */
  // Cuelume (MIT), https://cuelume.dev. Synthesised Web Audio, no files.
  // Vendored so the sounds don't depend on a CDN staying up.
  var play = null;
  var audioOn = true;
  try { audioOn = localStorage.getItem('audio') !== 'off'; } catch (e) {}

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

  // Every click makes a noise. This is the only place that plays one, so
  // handlers on individual controls never double up. It runs after their own
  // listeners, so switching audio on is itself audible.
  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle, .audio-toggle')) return click('toggle');
    if (e.target.closest('a[href]:not([href^="#"])'))     return click('page');
    if (e.target.closest('button, [role="button"], .gallery-card, .collage-item')) {
      return click('press');
    }
    click('tick');
  }, { passive: true });

  /* ---- theme ----------------------------------------------------------- */
  var root = document.documentElement;
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
  var greetTimer = null;

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

  function cycleGreeting(animate) {
    greetIdx++;
    paintGreeting(animate);
  }

  function scheduleGreeting() {
    clearInterval(greetTimer);
    greetTimer = setInterval(function () { cycleGreeting(true); }, 2000);
  }

  if (greetBtn) {
    greetBtn.addEventListener('click', function () {
      cycleGreeting(true);
      scheduleGreeting();   // clicking restarts the dwell, so it doesn't flip immediately after
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
        scheduleGreeting();
      }
    }
  }
  if (clockEl || greetText) { tick(); setInterval(tick, 1000); }

  /* ---- signature ------------------------------------------------------- */
  var sigPath = $('.sig-path');
  if (sigPath && sigPath.animate) {
    var sigAnim = null;
    var draw = function () {
      if (sigAnim) sigAnim.cancel();
      sigAnim = sigPath.animate(
        [{ strokeDashoffset: 1200 }, { strokeDashoffset: 0 }],
        { duration: 5000, delay: 200, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
      );
    };
    draw();
    $('.sig').addEventListener('mouseenter', draw);
    (function loop() {
      setTimeout(function () { draw(); loop(); }, 8000 + Math.random() * 4000);
    })();
  }

  /* ---- gallery --------------------------------------------------------- */
  // Clicking the avatar opens an inline strip under the nav, pushing the page
  // down. Clicking a photo in the strip opens it larger.
  var PHOTOS = [
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg',
    'IMG_4893.jpg', '_DSC0069-3 2.JPG', '1 2.PNG'
  ].map(function (f) { return ASSET_BASE + encodeURIComponent(f); });

  var avatarBtn = $('.avatar-wrap');
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
      if (d.albumArt) { art.src = d.albumArt; art.hidden = false; }
      if (d.songUrl) {
        tag.dataset.href = d.songUrl;
        tag.setAttribute('aria-label', 'Open "' + (d.title || 'track') + '" on Spotify');
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

    tag.addEventListener('click', function () {
      if (tag.dataset.href) window.open(tag.dataset.href, '_blank', 'noopener');
    });
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

    var drag = null;
    var point = function (e) {
      var t = e.touches && e.touches[0];
      return { x: t ? t.clientX : e.clientX, y: t ? t.clientY : e.clientY };
    };

    var start = function (e) {
      var item = e.currentTarget;
      var p = point(e);
      e.preventDefault();
      drag = {
        item: item, sx: p.x, sy: p.y,
        ox: parseFloat(item.dataset.dx || 0),
        oy: parseFloat(item.dataset.dy || 0)
      };
      item.style.zIndex = ++z;
      item.classList.add('is-dragging');
    };

    var move = function (e) {
      if (!drag) return;
      var p = point(e);
      var dx = drag.ox + (p.x - drag.sx);
      var dy = drag.oy + (p.y - drag.sy);
      drag.item.dataset.dx = dx;
      drag.item.dataset.dy = dy;
      drag.item.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    };

    var end = function () {
      if (!drag) return;
      drag.item.classList.remove('is-dragging');
      drag = null;
    };

    items.forEach(function (item) {
      item.addEventListener('mousedown', start);
      item.addEventListener('touchstart', start, { passive: false });
    });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
  }
})();
