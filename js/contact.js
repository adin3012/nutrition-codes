/* =============================================
   CONTACT.JS — Netlify form handling
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const data = new URLSearchParams(new FormData(form));

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });

      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = "✓ Message sent! We'll get back to you within 24 hours.";
        form.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = '✗ Something went wrong. Please email us directly.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
