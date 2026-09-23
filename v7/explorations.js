/* Playground page only: loading shimmer and the lightbox for the grid.
   The grid itself is plain HTML, so it all still shows without this file.
   Grid videos are left to app.js, which plays video[preload="none"] as
   they scroll into view. */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var grid = $('.explore-grid');
  if (!grid) return;
  var opens = $$('.explore-open', grid);

  /* ---- loading shimmer ------------------------------------------------- */
  // Only switched on once there's script to switch it off again.
  grid.classList.add('is-enhanced');
  opens.forEach(function (btn) {
    var cell = btn.parentNode;
    var done = function () { cell.classList.add('is-loaded'); };
    var img = $('img', btn);
    var vid = $('video', btn);
    if (img) {
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener('load', done); img.addEventListener('error', done); }
    } else if (vid) {
      // With preload="none" the poster is the only thing that loads up front
      var probe = new Image();
      probe.onload = probe.onerror = done;
      probe.src = vid.getAttribute('poster');
    } else {
      done();
    }
  });

  /* ---- lightbox -------------------------------------------------------- */
  // Steps through everything in grid order, images and videos alike.
  var items = opens.map(function (btn) {
    var img = $('img', btn), vid = $('video', btn);
    return img
      ? { kind: 'img', src: img.getAttribute('src'), label: img.getAttribute('alt') }
      : { kind: 'video', src: vid.getAttribute('src'), poster: vid.getAttribute('poster'),
          label: vid.getAttribute('aria-label') };
  });

  function open(startAt) {
    var idx = startAt;
    var lastFocus = document.activeElement;

    var box = document.createElement('div');
    box.className = 'lightbox lightbox--wide';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML =
      '<div class="lb-inner">' +
        '<button class="lb-close" type="button" aria-label="Close">&#10005;</button>' +
        '<div class="lb-stage"></div>' +
        '<button class="lb-nav lb-prev" type="button" aria-label="Previous">&#8249;</button>' +
        '<button class="lb-nav lb-next" type="button" aria-label="Next">&#8250;</button>' +
        '<p class="lb-count" aria-live="polite"></p>' +
      '</div>';
    var stage = $('.lb-stage', box);
    var count = $('.lb-count', box);

    var show = function (i) {
      idx = (i + items.length) % items.length;
      var it = items[idx];
      var old = $('video', stage);
      if (old) old.pause();
      stage.innerHTML = '';
      var el;
      if (it.kind === 'img') {
        el = document.createElement('img');
        el.className = 'lb-img';
        el.alt = it.label || '';
        el.src = it.src;
      } else {
        el = document.createElement('video');
        el.className = 'lb-video';
        el.src = it.src;
        el.poster = it.poster;
        el.controls = true;
        el.loop = true;
        el.muted = true;
        el.playsInline = true;
        el.preload = 'auto';
        if (it.label) el.setAttribute('aria-label', it.label);
      }
      stage.appendChild(el);
      // Opened by a click, so this is a gesture; a refusal just leaves the controls
      if (el.play) { var p = el.play(); if (p && p.catch) p.catch(function () {}); }
      box.setAttribute('aria-label', it.label || 'Exploration');
      count.textContent = (idx + 1) + ' / ' + items.length;
    };

    var onKey = function (e) {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft')  show(idx - 1);
      // Keep Tab inside the dialog
      if (e.key === 'Tab') {
        var f = $$('button, video[controls]', box);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    var close = function () {
      var v = $('video', stage);
      if (v) v.pause();
      box.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      setTimeout(function () { box.remove(); }, 200);
      if (lastFocus) lastFocus.focus();
    };

    document.body.appendChild(box);
    show(startAt);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { box.classList.add('is-open'); });

    // Anywhere but the media and the controls closes it
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-inner') || e.target === stage) close();
    });
    $('.lb-close', box).addEventListener('click', close);
    $('.lb-prev', box).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', box).addEventListener('click', function () { show(idx + 1); });
    document.addEventListener('keydown', onKey);
    $('.lb-close', box).focus();
  }

  opens.forEach(function (btn, i) {
    btn.addEventListener('click', function () { open(i); });
  });
})();
