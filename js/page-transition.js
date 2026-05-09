/* =============================================
   PAGE TRANSITIONS — Smooth navigation overlay
   ============================================= */

(function() {
  'use strict';

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const TRANSITION_DURATION = 500;

  // Create overlay if not exists
  let overlay = document.getElementById('page-transition');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-transition';
    overlay.innerHTML = '<div class="pt-inner"></div>';
    document.body.appendChild(overlay);
  }

  // On page load: animate overlay OUT (reveal content)
  function revealPage() {
    overlay.classList.remove('pt-enter');
    overlay.classList.add('pt-exit');
    setTimeout(function() {
      overlay.style.visibility = 'hidden';
    }, TRANSITION_DURATION);
  }

  // On link click: animate overlay IN, then navigate
  function transitionTo(url) {
    overlay.style.visibility = 'visible';
    overlay.classList.remove('pt-exit');
    overlay.classList.add('pt-enter');

    setTimeout(function() {
      window.location.href = url;
    }, TRANSITION_DURATION);
  }

  // Intercept internal link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external, anchor-only, mailto, tel, javascript
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.getAttribute('target') === '_blank'
    ) {
      return;
    }

    // Skip if modifier keys are pressed
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    transitionTo(href);
  });

  // Handle page load / back-forward
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealPage);
  } else {
    revealPage();
  }

  // Also handle bfcache restore (back button)
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      revealPage();
    }
  });
})();
