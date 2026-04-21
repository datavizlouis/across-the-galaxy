/* Mobile navigation: scroll-lock for sections 1 & 2, free-scroll for sections 3+ */
(function () {
  if (window.innerWidth > 768) return;

  const LOCK = ['follow', 'journeys']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  let locked    = false;
  let snapTimer = null;

  /* ── scroll prevention ─────────────────────────────────────────── */
  function noop(e) { e.preventDefault(); }

  function lock() {
    if (locked) return;
    locked = true;
    window.addEventListener('touchmove', noop, { passive: false });
    window.addEventListener('wheel',     noop, { passive: false });
  }

  function unlock() {
    if (!locked) return;
    locked = false;
    window.removeEventListener('touchmove', noop);
    window.removeEventListener('wheel',     noop);
  }

  /* ── which lock section (if any) occupies the viewport centre ─── */
  function centredLockEl() {
    const mid = window.innerHeight / 2;
    return LOCK.find(el => {
      const r = el.getBoundingClientRect();
      return r.top < mid && r.bottom > mid;
    }) || null;
  }

  /* ── snap section to viewport top if it drifted ──────────────── */
  function snapIfNeeded(el) {
    const top = el.getBoundingClientRect().top;
    if (Math.abs(top) < 4) return;
    unlock();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    setTimeout(lock, 650);
  }

  /* ── monitor scroll to engage / release lock ─────────────────── */
  window.addEventListener('scroll', () => {
    clearTimeout(snapTimer);
    const active = centredLockEl();
    if (active) {
      lock();
      snapTimer = setTimeout(() => snapIfNeeded(active), 180);
    } else {
      unlock();
    }
  }, { passive: true });

  /* initial state (e.g. page refreshed while mid-section) */
  if (centredLockEl()) lock();

  /* ── intercept ALL hash-link clicks ──────────────────────────── */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    unlock();

    const y = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: 'smooth' });

    if (LOCK.includes(target)) {
      /* re-lock once the section top is aligned */
      let settled = false;
      const tid = setInterval(() => {
        if (Math.abs(target.getBoundingClientRect().top) < 4) {
          clearInterval(tid);
          settled = true;
          lock();
        }
      }, 40);
      setTimeout(() => { if (!settled) { clearInterval(tid); lock(); } }, 950);
    }
  });
})();
