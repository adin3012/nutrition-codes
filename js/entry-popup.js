/* ─────────────────────────────────────────────────────────────────────
   NCA entry popup

   A lead-capture dialog that opens on its own a couple of seconds after
   the page settles, modelled on the one at getfitwithadin.com.

   Rules it follows:
     - dismissed  -> stays gone for the rest of the browser session
     - submitted  -> stays gone on this device for good
     - never opens on contact.html, where the visitor is already
       filling in the same details

   Leads go to the same FormSubmit inbox as the course-guide form, with
   their own _subject and form_type so they are easy to tell apart.
   ───────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var ENDPOINT      = 'https://formsubmit.co/ajax/nutritioncodes0@gmail.com';
  var DELAY_MS      = 2000;
  var DISMISS_KEY   = 'nca_popup_dismissed';   // sessionStorage
  var CAPTURED_KEY  = 'nca_lead_captured';     // localStorage

  // Storage can throw in private mode, so every access is guarded.
  function read(store, key) {
    try { return window[store].getItem(key); } catch (e) { return null; }
  }
  function write(store, key, value) {
    try { window[store].setItem(key, value); } catch (e) { /* no-op */ }
  }

  if (read('localStorage', CAPTURED_KEY) === '1') return;
  if (read('sessionStorage', DISMISS_KEY) === '1') return;
  if (/contact\.html$/i.test(location.pathname)) return;
  if (document.getElementById('nca-entry-popup')) return;

  var css = [
    '#nca-entry-popup{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .25s ease}',
    '#nca-entry-popup.is-open{display:flex;opacity:1}',
    '#nca-entry-popup .nca-ep-backdrop{position:absolute;inset:0;background:rgba(11,27,54,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}',
    '#nca-entry-popup .nca-ep-panel{position:relative;background:#fff;border:1px solid #c4c6d1;border-radius:24px;width:100%;max-width:470px;max-height:90vh;overflow-y:auto;padding:36px 32px;box-shadow:0 24px 70px rgba(11,27,54,.28);animation:ncaEpUp .35s cubic-bezier(.19,1,.22,1)}',
    '@keyframes ncaEpUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}',
    '@media (prefers-reduced-motion:reduce){#nca-entry-popup .nca-ep-panel{animation:none}}',
    '#nca-entry-popup .nca-ep-close{position:absolute;top:16px;right:16px;width:40px;height:40px;border:1px solid #c4c6d1;background:#f1f3ff;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#444650;transition:background .2s ease,color .2s ease;font-size:18px;line-height:1;padding:0}',
    '#nca-entry-popup .nca-ep-close:hover{background:#40F39A;color:#0b1b36}',
    '#nca-entry-popup .nca-ep-eyebrow{font-family:Inter,sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#4173F4;margin:0 0 10px}',
    '#nca-entry-popup h2{font-family:Manrope,sans-serif;font-size:26px;line-height:1.15;font-weight:800;color:#0b1b36;margin:0 0 8px;text-wrap:balance}',
    '#nca-entry-popup .nca-ep-sub{font-family:Inter,sans-serif;font-size:14px;line-height:1.6;color:#444650;margin:0 0 22px}',
    '#nca-entry-popup label{display:block;font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#0b1b36;margin-bottom:6px}',
    '#nca-entry-popup input,#nca-entry-popup select{width:100%;border:1px solid #c4c6d1;border-radius:12px;padding:11px 14px;font-family:Inter,sans-serif;font-size:14px;color:#0b1b36;background:#fff;outline:none;transition:border-color .2s ease,box-shadow .2s ease}',
    '#nca-entry-popup input:focus,#nca-entry-popup select:focus{border-color:#4173F4;box-shadow:0 0 0 3px rgba(65,115,244,.18)}',
    '#nca-entry-popup .nca-ep-field{margin-bottom:14px}',
    '#nca-entry-popup .nca-ep-phone{display:flex;gap:8px}',
    '#nca-entry-popup .nca-ep-phone select{width:104px;flex:0 0 auto;padding-left:10px;padding-right:6px}',
    '#nca-entry-popup .nca-ep-submit{width:100%;background:#40F39A;color:#0b1b36;border:0;border-radius:12px;padding:14px 20px;font-family:Inter,sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s ease;margin-top:4px}',
    '#nca-entry-popup .nca-ep-submit:hover{opacity:.9}',
    '#nca-entry-popup .nca-ep-submit[disabled]{opacity:.6;cursor:default}',
    '#nca-entry-popup .nca-ep-later{display:block;width:100%;background:none;border:0;margin-top:14px;font-family:Inter,sans-serif;font-size:13px;color:#444650;text-decoration:underline;cursor:pointer;padding:4px}',
    '#nca-entry-popup .nca-ep-later:hover{color:#0b1b36}',
    '#nca-entry-popup .nca-ep-status{font-family:Inter,sans-serif;font-size:13px;margin-top:12px;min-height:18px}',
    '#nca-entry-popup .nca-ep-note{font-family:Inter,sans-serif;font-size:11.5px;color:#444650;opacity:.8;margin:14px 0 0;text-align:center}',
    '#nca-entry-popup .nca-ep-done{text-align:center;padding:14px 0 6px}',
    '#nca-entry-popup .nca-ep-done .nca-ep-tick{width:62px;height:62px;border-radius:50%;background:#40F39A;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:30px;color:#0b1b36}',
    '@media (max-width:420px){#nca-entry-popup .nca-ep-panel{padding:30px 22px;border-radius:20px}#nca-entry-popup h2{font-size:22px}}'
  ].join('');

  var CODES = ['+91', '+1', '+44', '+971', '+65', '+60', '+61', '+64', '+27', '+92', '+880', '+94', '+977'];

  var html =
    '<div class="nca-ep-backdrop" data-ep-dismiss></div>' +
    '<div class="nca-ep-panel" role="document">' +
      '<button type="button" class="nca-ep-close" data-ep-dismiss aria-label="Close">&#10005;</button>' +
      '<div id="nca-ep-form-wrap">' +
        '<p class="nca-ep-eyebrow">Free course guide</p>' +
        '<h2 id="nca-ep-title">See the full curriculum before you decide</h2>' +
        '<p class="nca-ep-sub">Leave your details and we will send the complete course guide, then reach out personally within 24 hours. No cost, no obligation.</p>' +
        '<form id="nca-ep-form" novalidate>' +
          '<div class="nca-ep-field">' +
            '<label for="nca-ep-name">Your name</label>' +
            '<input type="text" id="nca-ep-name" name="name" maxlength="80" required placeholder="Your full name" autocomplete="name">' +
          '</div>' +
          '<div class="nca-ep-field">' +
            '<label for="nca-ep-email">Email address</label>' +
            '<input type="email" id="nca-ep-email" name="email" required placeholder="you@email.com" autocomplete="email">' +
          '</div>' +
          '<div class="nca-ep-field">' +
            '<label for="nca-ep-phone">WhatsApp number</label>' +
            '<div class="nca-ep-phone">' +
              '<select id="nca-ep-code" name="country_code" aria-label="Country code">' +
                CODES.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('') +
              '</select>' +
              '<input type="tel" id="nca-ep-phone" name="phone" required placeholder="98765 43210" autocomplete="tel">' +
            '</div>' +
          '</div>' +
          '<button type="submit" class="nca-ep-submit" id="nca-ep-submit">Send my details</button>' +
          '<p class="nca-ep-status" id="nca-ep-status" role="status" aria-live="polite"></p>' +
          '<button type="button" class="nca-ep-later" data-ep-dismiss>Maybe later</button>' +
          '<p class="nca-ep-note">We never share your details. One reply from a real person, not a drip sequence.</p>' +
        '</form>' +
      '</div>' +
      '<div id="nca-ep-done" class="nca-ep-done" hidden>' +
        '<div class="nca-ep-tick">&#10003;</div>' +
        '<h2>Got it, the guide is on its way</h2>' +
        '<p class="nca-ep-sub" style="margin-bottom:0">Check your inbox in the next few minutes. We will follow up personally within 24 hours.</p>' +
      '</div>' +
    '</div>';

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var el = document.createElement('div');
    el.id = 'nca-entry-popup';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'nca-ep-title');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = html;
    document.body.appendChild(el);
    return el;
  }

  var popup = build();
  var form   = popup.querySelector('#nca-ep-form');
  var status = popup.querySelector('#nca-ep-status');
  var submit = popup.querySelector('#nca-ep-submit');
  var lastFocus = null;

  function open() {
    // Never cover another dialog that is already up.
    if (document.querySelector('#guide-modal:not(.hidden), #roadmap-modal:not(.hidden), #yt-modal:not(.hidden)')) return;
    lastFocus = document.activeElement;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = popup.querySelector('#nca-ep-name');
    if (first) first.focus({ preventScroll: true });
  }

  function close(remember) {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (remember !== false) write('sessionStorage', DISMISS_KEY, '1');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  popup.addEventListener('click', function (e) {
    if (e.target.closest('[data-ep-dismiss]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) close();
    if (e.key !== 'Tab' || !popup.classList.contains('is-open')) return;
    // Keep tabbing inside the dialog while it is open.
    var items = popup.querySelectorAll('button, input, select, a[href]');
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name  = popup.querySelector('#nca-ep-name').value.trim();
    var email = popup.querySelector('#nca-ep-email').value.trim();
    var phone = popup.querySelector('#nca-ep-phone').value.trim();
    var code  = popup.querySelector('#nca-ep-code').value;

    if (!name || !email || !phone) {
      status.style.color = '#b00020';
      status.textContent = 'Please fill in all three fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.style.color = '#b00020';
      status.textContent = 'That email address does not look right.';
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending...';
    status.style.color = '#444650';
    status.textContent = '';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New enquiry from the site popup - Nutrition Codes',
        _template: 'table',
        form_type: 'entry_popup_lead',
        name: name,
        email: email,
        country_code: code,
        phone: phone,
        page: location.pathname
      })
    })
    .then(function (r) {
      if (!r.ok) throw new Error('Request failed with ' + r.status);
      write('localStorage', CAPTURED_KEY, '1');
      popup.querySelector('#nca-ep-form-wrap').hidden = true;
      popup.querySelector('#nca-ep-done').hidden = false;
      setTimeout(function () { close(false); }, 3200);
    })
    .catch(function () {
      submit.disabled = false;
      submit.textContent = 'Send my details';
      status.style.color = '#b00020';
      status.textContent = 'That did not send. Please try again, or use the contact page.';
    });
  });

  setTimeout(open, DELAY_MS);
})();
