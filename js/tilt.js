/* =============================================
   TILT.JS — 3D Card Hover Effect
   Subtle perspective tilt following mouse
   ============================================= */

(function() {
  'use strict';

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.tilt-3d');
  if (!cards.length) return;

  cards.forEach(function(card) {
    // Create glare element
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    glare.style.cssText = [
      'position: absolute',
      'inset: 0',
      'border-radius: inherit',
      'pointer-events: none',
      'z-index: 2',
      'opacity: 0',
      'transition: opacity 0.3s ease',
      'background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
      'mix-blend-mode: overlay'
    ].join('; ');
    card.style.position = 'relative';
    card.style.transformStyle = 'preserve-3d';
    card.appendChild(glare);

    function handleMove(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotation intensity (degrees)
      const maxRotate = 8;
      const rotateX = ((y - centerY) / centerY) * -maxRotate;
      const rotateY = ((x - centerX) / centerX) * maxRotate;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
      card.style.transition = 'transform 0.1s ease-out';

      // Glare position
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = 'radial-gradient(circle at ' + glareX + '% ' + glareY + '%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)';
      glare.style.opacity = '1';
    }

    function handleLeave() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
      glare.style.opacity = '0';
    }

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
  });
})();
