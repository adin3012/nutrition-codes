/* =============================================
   SUBTLE POLISH — Micro-interactions
   ============================================= */

// ── Nav blur on scroll ──
(function() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── Image reveal on load ──
(function() {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.classList.add('img-reveal');
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    }
  });
})();

// ── Button press feedback ──
(function() {
  document.querySelectorAll('a, button').forEach(el => {
    el.classList.add('btn-press');
  });
})();
