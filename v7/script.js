(function () {
  'use strict';

  var TZ = 'Africa/Lagos';

  /* ---- theme ---------------------------------------------------------- */
  var root   = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');

  toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---- greeting ------------------------------------------------------- */
  // Read the hour in Shater's timezone, not the visitor's.
  function hourIn(tz) {
    var s = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hour: '2-digit', hour12: false
    }).format(new Date());
    return parseInt(s, 10) % 24;
  }

  function greet(h) {
    if (h >= 5  && h < 12) return 'good morning';
    if (h >= 12 && h < 17) return 'good afternoon';
    if (h >= 17 && h < 22) return 'good evening';
    return 'good night';
  }

  var greetingEl = document.getElementById('greeting');
  var clockEl    = document.getElementById('clock');

  var timeFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
  });

  function tick() {
    var now = new Date();
    clockEl.textContent = timeFmt.format(now).toLowerCase();
    clockEl.setAttribute('datetime', now.toISOString());
    greetingEl.textContent = greet(hourIn(TZ));
  }

  tick();
  setInterval(tick, 1000);
})();
