/* =============================================
   MAIN.JS — Awwwards Style Premium Interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Smooth Scroll (Lenis) ── */
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

  // Sync GSAP ScrollTrigger with Lenis
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* ── 4. SplitText Typography Reveal ── */
  const splitTexts = document.querySelectorAll('.split-text');
  splitTexts.forEach(el => {
    const text = new SplitType(el, { types: 'words, chars' });
    
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.02,
      ease: 'power4.out'
    });
  });

  /* ── 5. Parallax Images ── */
  gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  /* ── 6. Card / Element Stagger Reveals ── */
  const cards = document.querySelectorAll('.glass');
  cards.forEach(card => {
    if (!card.classList.contains('navbar')) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    }
  });

  /* ── 7. Navbar Scroll Behaviour ── */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 7. Global Nav Toggle ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    // Unconditionally reparent the menu so it breaks out of navbar's backdrop-filter
    if (navLinks.parentElement !== document.body) {
      document.body.appendChild(navLinks);
      
      // Inject Close Button into the overlay
      const closeBtn = document.createElement('div');
      closeBtn.className = 'menu-close-btn';
      closeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      navLinks.appendChild(closeBtn);

      const closeMenu = () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      };

      closeBtn.addEventListener('click', closeMenu);
      
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }

    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  /* ── 8. Video Play Button Overlays ── */
  document.querySelectorAll('.vt-video-wrap').forEach(wrap => {
    const btn = document.createElement('div');
    btn.className = 'vt-play-btn';
    wrap.appendChild(btn);

    const video = wrap.querySelector('video');
    if (video) {
      video.addEventListener('play',  () => wrap.classList.add('playing'));
      video.addEventListener('pause', () => wrap.classList.remove('playing'));
      video.addEventListener('ended', () => wrap.classList.remove('playing'));
    }
  });

  /* ── 10. Animated Counters ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        let obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString(); }
        });
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

});
