/* =============================================
   NAV.JS — Nutrition Codes Academy
   Mobile menu + nav enhancements (idempotent)
   ============================================= */

(function() {
  'use strict';

  function initTailwindNav() {
    var btn = document.getElementById('menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu || btn.dataset.navInit) return;
    btn.dataset.navInit = 'true';

    var hamburgerIcon = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
    var closeIcon = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';

    function toggleMenu() {
      var isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        menu.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('svg').innerHTML = closeIcon;
        document.body.style.overflow = 'hidden';
      } else {
        menu.classList.add('hidden');
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('svg').innerHTML = hamburgerIcon;
        document.body.style.overflow = '';
      }
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        toggleMenu();
      }
    });

    document.addEventListener('click', function(e) {
      if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
        toggleMenu();
      }
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (!menu.classList.contains('hidden')) toggleMenu();
      });
    });
  }

  function initBlogNav() {
    var btn = document.getElementById('nc-menu-btn');
    var menu = document.getElementById('nc-mobile-menu');
    if (!btn || !menu || btn.dataset.navInit) return;
    btn.dataset.navInit = 'true';

    var hamburgerIcon = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
    var closeIcon = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = menu.style.display === 'block';
      menu.style.display = isOpen ? 'none' : 'block';
      menu.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      btn.querySelector('svg').innerHTML = isOpen ? hamburgerIcon : closeIcon;
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.style.display === 'block') {
        menu.style.display = 'none';
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('svg').innerHTML = hamburgerIcon;
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('click', function(e) {
      if (menu.style.display === 'block' && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('svg').innerHTML = hamburgerIcon;
        document.body.style.overflow = '';
      }
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.style.display = 'none';
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('svg').innerHTML = hamburgerIcon;
        document.body.style.overflow = '';
      });
    });
  }

  function initActiveNav() {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a[href], #nc-nav a[href]').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function(link) {
      if (!link.getAttribute('rel') || link.getAttribute('rel').indexOf('noopener') === -1) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initTailwindNav();
      initBlogNav();
      initActiveNav();
      initSmoothScroll();
      initExternalLinks();
    });
  } else {
    initTailwindNav();
    initBlogNav();
    initActiveNav();
    initSmoothScroll();
    initExternalLinks();
  }
})();
