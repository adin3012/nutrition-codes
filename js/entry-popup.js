/* ─────────────────────────────────────────────────────────────────────
   NCA entry popup

   A short prompt that opens a couple of seconds after the page settles
   and sends the visitor to the NC Enquiry Form (Google Forms).
   It collects nothing itself, so there is no email service behind it.

   Rules it follows:
     - dismissed or clicked -> stays gone for the rest of the browser session
     - never opens on contact.html, where the enquiry form already is
   ───────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var FORM_URL    = 'https://docs.google.com/forms/d/e/1FAIpQLScVo6oWd8Aido-bVVMezAMzX0CQ8NeRJ9uXDavwgrE9rltkFA/viewform';
  var DELAY_MS    = 2000;
  var DISMISS_KEY = 'nca_popup_dismissed';   // sessionStorage

  // Storage can throw in private mode, so every access is guarded.
  function read(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* no-op */ }
  }

  if (read(DISMISS_KEY) === '1') return;
  if (/contact(\.html)?$/i.test(location.pathname)) return;
  if (document.getElementById('nca-entry-popup')) return;

  var css = [
    '#nca-entry-popup{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .25s ease}',
    '#nca-entry-popup.is-open{display:flex;opacity:1}',
    '#nca-entry-popup .nca-ep-backdrop{position:absolute;inset:0;background:rgba(11,27,54,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
    '#nca-entry-popup .nca-ep-panel{position:relative;background:#fff;border:1px solid #c4c6d1;border-radius:24px;width:100%;max-width:470px;max-height:90vh;overflow-y:auto;padding:36px 32px;box-shadow:0 24px 70px rgba(11,27,54,.28);animation:ncaEpUp .35s cubic-bezier(.19,1,.22,1)}',
    '@media (prefers-reduced-motion:reduce){#nca-entry-popup .nca-ep-panel{animation:none}}',
    '#nca-entry-popup .nca-ep-close{position:absolute;top:16px;right:16px;width:40px;height:40px;border:1px solid #c4c6d1;background:#f1f3ff;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#444650;transition:background .2s ease,color .2s ease;font-size:18px;line-height:1;padding:0}',
    '#nca-entry-popup .nca-ep-close:hover{background:#40F39A;color:#0b1b36}',
    '#nca-entry-popup .nca-ep-eyebrow{font-family:Inter,sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#4173F4;margin:0 0 10px}',
    '#nca-entry-popup h2{font-family:Manrope,sans-serif;font-size:26px;line-height:1.15;font-weight:800;color:#0b1b36;margin:0 0 8px;text-wrap:balance}',
    '#nca-entry-popup .nca-ep-sub{font-family:Inter,sans-serif;font-size:14px;line-height:1.6;color:#444650;margin:0 0 22px}',
    '#nca-entry-popup .nca-ep-submit{width:100%;background:#40F39A;color:#0b1b36;border:0;border-radius:12px;padding:14px 20px;font-family:Inter,sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s ease;margin-top:4px}',
    '#nca-entry-popup .nca-ep-submit:hover{opacity:.9}',
    '#nca-entry-popup .nca-ep-submit[disabled]{opacity:.6;cursor:default}',
    '#nca-entry-popup .nca-ep-later{display:block;width:100%;background:none;border:0;margin-top:14px;font-family:Inter,sans-serif;font-size:13px;color:#444650;text-decoration:underline;cursor:pointer;padding:4px}',
    '#nca-entry-popup .nca-ep-later:hover{color:#0b1b36}',
    '#nca-entry-popup .nca-ep-note{font-family:Inter,sans-serif;font-size:11.5px;color:#444650;opacity:.8;margin:14px 0 0;text-align:center}',
    '@media (max-width:420px){#nca-entry-popup .nca-ep-panel{padding:30px 22px;border-radius:20px}#nca-entry-popup h2{font-size:22px}}',
    '#nca-entry-popup a.nca-ep-submit{display:block;text-align:center;text-decoration:none;box-sizing:border-box}',
    '#nca-entry-popup .nca-ep-points{list-style:none;padding:0;margin:0 0 22px;font-family:Inter,sans-serif;font-size:14px;color:#0b1b36}',
    '#nca-entry-popup .nca-ep-points li{display:flex;gap:10px;align-items:flex-start;margin-bottom:8px}',
    '#nca-entry-popup .nca-ep-points li:before{content:"\\2713";color:#0b8a4f;font-weight:800}'
  ].join('');

  var html =
    '<div class="nca-ep-backdrop" data-ep-dismiss></div>' +
    '<div class="nca-ep-panel" role="document">' +
      '<button type="button" class="nca-ep-close" data-ep-dismiss aria-label="Close">&#10005;</button>' +
      '<p class="nca-ep-eyebrow">NCA Mentorship</p>' +
      '<h2 id="nca-ep-title">Thinking of joining the next batch?</h2>' +
      '<p class="nca-ep-sub">Send us a quick enquiry and a real person will reach out within 24 hours to answer your questions.</p>' +
      '<ul class="nca-ep-points">' +
        '<li>Walk through the curriculum and fee</li>' +
        '<li>Find out if NCA fits where you are</li>' +
        '<li>No cost, no obligation</li>' +
      '</ul>' +
      '<a class="nca-ep-submit" id="nca-ep-go" href="' + FORM_URL + '" target="_blank" rel="noopener noreferrer">Enquire now</a>' +
      '<button type="button" class="nca-ep-later" data-ep-dismiss>Maybe later</button>' +
    '</div>';

  var popup = document.createElement('div');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  popup.id = 'nca-entry-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-labelledby', 'nca-ep-title');
  popup.setAttribute('aria-hidden', 'true');
  popup.innerHTML = html;
  document.body.appendChild(popup);

  var lastFocus = null;

  function open() {
    // Never cover another dialog that is already up.
    if (document.querySelector('#roadmap-modal:not(.hidden), #yt-modal:not(.hidden)')) return;
    lastFocus = document.activeElement;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var go = popup.querySelector('#nca-ep-go');
    if (go) go.focus({ preventScroll: true });
  }

  function close() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    write(DISMISS_KEY, '1');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  popup.addEventListener('click', function (e) {
    if (e.target.closest('[data-ep-dismiss]')) close();
    else if (e.target.closest('#nca-ep-go')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) close();
    if (e.key !== 'Tab' || !popup.classList.contains('is-open')) return;
    // Keep tabbing inside the dialog while it is open.
    var items = popup.querySelectorAll('button, a[href]');
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  setTimeout(open, DELAY_MS);
})();
