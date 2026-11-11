// CostGraph hero: the chart draws in, the totals count up beside it, and
// hovering a category greys out the rest, as it does in the product.
// Clicking the card plays it again.

const hero = document.querySelector('.cg-hero');
if (hero) {
  const counters = [...hero.querySelectorAll('[data-count]')];
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const easeOut = (t) => 1 - Math.pow(1 - t, 5);
  let frame = 0;

  const count = () => {
    cancelAnimationFrame(frame);
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      for (const el of counters) el.textContent = money(Number(el.dataset.count) * easeOut(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };

  const play = () => {
    hero.classList.remove('cg-play');
    hero.classList.add('cg-armed');
    for (const el of counters) el.textContent = money(0);
    void hero.offsetWidth; // let the held-down state land before releasing it
    hero.classList.add('cg-play');
    count();
  };

  if (hero.classList.contains('cg-armed')) {
    for (const el of counters) el.textContent = money(0);
    // after the page's own entrance, or the card's growth into the hero
    const wait = document.documentElement.classList.contains('vt-in') ? 420 : 260;
    const go = () => setTimeout(play, wait);
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      document.fonts ? document.fonts.ready.then(go) : go();
    }, { threshold: 0.3 });
    io.observe(hero);

    hero.addEventListener('click', play);
  }

  // hover highlight
  hero.addEventListener('pointerover', (e) => {
    const k = e.target.closest('.cg-row, .cg-stack i, .cg-tag[data-k]')?.dataset.k;
    if (k) hero.dataset.hl = k; else delete hero.dataset.hl;
  });
  hero.addEventListener('pointerleave', () => { delete hero.dataset.hl; });
}
