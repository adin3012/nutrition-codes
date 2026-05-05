/* =============================================
   MAIN.JS — Blog page interactions (blog.html)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Smooth Scroll (Lenis) ── */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ── 2. SplitText Typography Reveal ── */
  if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(el => {
      try {
        const text = new SplitType(el, { types: 'words, chars' });
        gsap.from(text.chars, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 50, opacity: 0, duration: 1, stagger: 0.02, ease: 'power4.out'
        });
      } catch (e) { /* SplitType or GSAP not available */ }
    });
  }

  /* ── 3. Parallax Images ── */
  if (typeof gsap !== 'undefined') {
    gsap.utils.toArray('.parallax-img').forEach(img => {
      gsap.to(img, {
        yPercent: 20, ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });

    /* ── 4. Card / Element Stagger Reveals ── */
    const cards = document.querySelectorAll('.glass');
    cards.forEach(card => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        y: 60, opacity: 0, duration: 1, ease: 'power3.out'
      });
    });
  }

});
