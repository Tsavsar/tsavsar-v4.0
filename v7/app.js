(function () {
  'use strict';

  var TZ         = 'Africa/Lagos';
  var SPOTIFY    = 'https://spotify-api-lilac.vercel.app/api/now-playing';
  var ASSET_BASE = 'https://www.shatermt.com/assets/';
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

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

  function greet(h) {
    if (h >= 5  && h < 12) return 'good morning';
    if (h >= 12 && h < 17) return 'good afternoon';
    if (h >= 17 && h < 22) return 'good evening';
    return 'good night';
  }

  function tick() {
    var now = new Date();
    if (clockEl) {
      clockEl.textContent = timeFmt.format(now).toLowerCase();
      clockEl.setAttribute('datetime', now.toISOString());
    }
    // Only the homepage greeting is time-driven; About has its own line.
    if (greetingEl) greetingEl.textContent = greet(parseInt(hourFmt.format(now), 10) % 24);
  }
  if (clockEl || greetingEl) { tick(); setInterval(tick, 1000); }

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
  var PHOTOS = [
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg',
    'IMG_4893.jpg', '_DSC0069-3 2.JPG', '1 2.PNG'
  ].map(function (f) { return ASSET_BASE + encodeURIComponent(f); });

  var avatarBtn = $('.avatar-wrap');
  if (avatarBtn) {
    var box = null, idx = 0, lastFocus = null;

    var show = function (i) {
      idx = (i + PHOTOS.length) % PHOTOS.length;
      $('.lb-img', box).src = PHOTOS[idx];
      $('.lb-count', box).textContent = (idx + 1) + ' / ' + PHOTOS.length;
    };

    var onKey = function (e) {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft')  show(idx - 1);
    };

    var close = function () {
      if (!box) return;
      box.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      setTimeout(function () { if (box) { box.remove(); box = null; } }, 200);
      if (lastFocus) lastFocus.focus();
    };

    var open = function () {
      lastFocus = document.activeElement;
      box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Photo gallery');
      box.innerHTML =
        '<button class="lb-close" type="button" aria-label="Close">&#10005;</button>' +
        '<button class="lb-nav lb-prev" type="button" aria-label="Previous">&#8249;</button>' +
        '<img class="lb-img" alt="" />' +
        '<button class="lb-nav lb-next" type="button" aria-label="Next">&#8250;</button>' +
        '<span class="lb-count"></span>';
      document.body.appendChild(box);
      show(0);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { box.classList.add('is-open'); });

      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      $('.lb-close', box).addEventListener('click', close);
      $('.lb-prev',  box).addEventListener('click', function () { show(idx - 1); });
      $('.lb-next',  box).addEventListener('click', function () { show(idx + 1); });
      document.addEventListener('keydown', onKey);
      $('.lb-close', box).focus();
    };

    avatarBtn.addEventListener('click', open);
  }

  /* ---- now playing ----------------------------------------------------- */
  var vinyl = $('#vinyl');
  if (vinyl) {
    var art    = $('#vinylArt');
    var state  = $('#playerState');
    var title  = $('#trackTitle');
    var artist = $('#trackArtist');
    var tag    = $('#player');

    function paint(d) {
      state.textContent  = d.isPlaying ? 'Now playing' : 'Last played';
      title.textContent  = d.title  || '—';
      artist.textContent = d.artist || '—';
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
        .catch(function () { /* endpoint down — leave the last good state */ });
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
