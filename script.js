/* ==========================================================================
   STYLED BY GRACE — script.js  (vanilla JS, no dependencies)
   Sections:
   0. Config (edit here)
   1. Helpers
   2. Header: compact-on-scroll, mobile menu, scroll-spy
   3. Reveal-on-scroll
   4. "Learn more" links pre-select the enquiry project type
   5. Portfolio: filter + lightbox + before/after slider
   6. FAQ: one open at a time
   7. Enquiry form: validation + text-message (SMS) enquiry
   8. Mobile sticky bar + footer year
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 0. CONFIG ---------- */
  var CONFIG = {
    // This site is fully static (no server, no form service, no keys). Enquiries are texted to this number.
    PHONE_DISPLAY: '0468 359 978',
    PHONE_TEL: '+61468359978'
  };

  /* ---------- 1. HELPERS ---------- */
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 2. HEADER ---------- */
  var header = $('#siteHeader');
  var menuToggle = $('#menuToggle');
  var nav = $('#primaryNav');

  function onScrollHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.menu-toggle__label').textContent = open ? 'Close menu' : 'Menu';
    updateMobileBar();
  }

  menuToggle.addEventListener('click', function () {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  // Close menu when a link inside it is chosen
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuToggle.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && nav.classList.contains('is-open')) setMenu(false);
  });

  // Scroll-spy: highlight the nav link for the section in the middle of the viewport
  var spyMap = {
    hero: 'top', about: 'about', services: 'services', why: 'about', portfolio: 'portfolio',
    process: 'process', budget: 'process', testimonials: 'process', shop: 'shop', faq: 'faq', contact: 'contact'
  };
  function setActiveLink(key) {
    $$('.nav__list a').forEach(function (a) {
      var on = a.getAttribute('data-spy') === key;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var spyTargets = {
      hero: $('.hero'), about: $('#about'), services: $('#services'), why: $('#why'), portfolio: $('#portfolio'),
      process: $('#process'), budget: $('.budget'), testimonials: $('.testimonials'), shop: $('#shop'), faq: $('#faq'), contact: $('#contact')
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(spyTargets).forEach(function (k) { if (spyTargets[k] === en.target) setActiveLink(spyMap[k]); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(spyTargets).forEach(function (k) { if (spyTargets[k]) spy.observe(spyTargets[k]); });
  }

  /* ---------- 3. REVEAL ON SCROLL ---------- */
  var reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    // Light stagger for siblings that reveal together (cards, steps, principles)
    var seen = new Map();
    reveals.forEach(function (el) {
      var p = el.parentElement;
      var i = seen.get(p) || 0;
      seen.set(p, i + 1);
      if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's');
    });
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- 4. PRE-SELECT PROJECT TYPE ---------- */
  var projectSelect = $('#f-project');
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-project]');
    if (!link || !projectSelect) return;
    var wanted = link.getAttribute('data-project');
    $$('option', projectSelect).forEach(function (o) { if (o.textContent.trim() === wanted) projectSelect.value = o.value || o.textContent; });
    clearError(projectSelect);
  });

  /* ---------- 5. PORTFOLIO ---------- */
  var tiles = $$('#gallery .tile');
  var chips = $$('.chip');
  var emptyMsg = $('#galleryEmpty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      var shown = 0;
      tiles.forEach(function (t) {
        var match = f === 'all' || (t.getAttribute('data-cat') || '').split(/\s+/).indexOf(f) > -1;
        t.hidden = !match;
        t.classList.remove('is-entering');
        if (match) {
          shown++;
          void t.offsetWidth; // restart animation
          t.classList.add('is-entering');
        }
      });
      emptyMsg.hidden = shown > 0;
    });
  });

  // Lightbox
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  var lbList = [], lbIndex = 0, lbOpener = null;

  function lbShow(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    var btn = lbList[lbIndex];
    var img = $('img', btn), cap = $('.tile__cap', btn);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : img.alt;
  }
  function lbOpen(btn) {
    lbList = $$('#gallery .tile:not([hidden]) .tile__btn');
    lbOpener = btn;
    lbShow(lbList.indexOf(btn));
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  function lbClose() {
    if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open');
  }
  $('#gallery').addEventListener('click', function (e) {
    var btn = e.target.closest('.tile__btn');
    if (btn) lbOpen(btn);
  });
  lb.addEventListener('close', function () {
    document.body.style.overflow = '';
    if (lbOpener) lbOpener.focus();
  });
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', function () { lbShow(lbIndex - 1); });
  $('#lbNext').addEventListener('click', function () { lbShow(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); }); // click on backdrop
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });

  // Before / after slider(s)
  $$('[data-ba]').forEach(function (ba) {
    var range = $('.ba__range', ba);
    var update = function () { ba.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', update);
    update();
  });

  /* ---------- 6. FAQ: one open at a time ---------- */
  var qas = $$('.qa');
  qas.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) qas.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- 7. ENQUIRY FORM (static — no backend) ----------
     On submit the form is validated, a plain-text enquiry is built, and the visitor's own messaging app is opened,
     addressed to CONFIG.PHONE_TEL with the text pre-filled. The website sends nothing itself: the visitor has to press
     Send in their messaging app, so the page never claims the enquiry has been sent. */
  var form = $('#enquiryForm');
  var success = $('#formSuccess');
  var DRAFT_KEY = 'styledByGraceEnquiryDraft';

  var rules = {
    name: function (v) {
      if (!v.trim()) return 'Please tell us your name.';
      if (v.trim().length < 2) return 'Your name looks a little short.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'That email doesn’t look quite right — please check it.';
      return '';
    },
    phone: function (v) {
      if (!v.trim()) return '';                                   // optional
      var digits = v.replace(/\D/g, '');
      if (!/^[+()\-\s\d]+$/.test(v) || digits.length < 8 || digits.length > 13) return 'Please enter a valid phone number, e.g. 0468 359 978.';
      return '';
    },
    project: function (v) { return v ? '' : 'Please choose a project type.'; }
  };

  function errorEl(input) { return $('#e-' + input.name); }
  function setError(input, msg) {
    var field = input.closest('.field');
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    errorEl(input).textContent = msg;
  }
  function clearError(input) {
    if (!input) return;
    var field = input.closest('.field');
    if (field) field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    var el = errorEl(input);
    if (el) el.textContent = '';
  }
  function validate(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var msg = rule(input.value);
    if (msg) { setError(input, msg); return false; }
    clearError(input);
    return true;
  }

  // Keep what the visitor typed for this browser tab, in case the page reloads when they come back from their messaging app
  function saveDraft(values) { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values)); } catch (e) { /* storage unavailable — fine */ } }
  function loadDraft() { try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { return null; } }

  // The enquiry text. Plain ASCII punctuation on purpose: curly quotes etc. would switch the SMS to a shorter encoding.
  function buildMessage(v) {
    var lines = ["Hi Styled by Grace, I'd like to make an enquiry.", '', 'Name: ' + v.name, 'Project type: ' + v.project];
    if (v.phone) lines.push('Phone: ' + v.phone);
    if (v.email) lines.push('Email: ' + v.email);
    if (v.message) lines.push('', 'Message: ' + v.message);
    return lines.join('\n');
  }
  // "?&body=" is the form that works on both iOS and Android
  function buildSmsUrl(message) { return 'sms:' + CONFIG.PHONE_TEL + '?&body=' + encodeURIComponent(message); }
  function isPhoneOrTablet() { return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); }

  if (form) {
    var fields = $$('input, select, textarea', form);

    var draft = loadDraft();
    if (draft) fields.forEach(function (f) { if (draft[f.name] && !f.value) f.value = draft[f.name]; });

    fields.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value || input.closest('.field').classList.contains('has-error')) validate(input); });
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('has-error')) validate(input); });
      input.addEventListener('change', function () { if (input.closest('.field').classList.contains('has-error')) validate(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (input) { if (!validate(input) && !firstBad) firstBad = input; });
      if (firstBad) { firstBad.focus(); return; }

      var values = {};
      fields.forEach(function (f) { values[f.name] = f.value.trim(); });
      saveDraft(values);

      var message = buildMessage(values);
      var smsUrl = buildSmsUrl(message);

      $('#successSms').href = smsUrl;
      $('#enquiryText').value = message;
      $('#copyStatus').textContent = '';
      $('#successName').textContent = values.name ? ', ' + values.name.split(/\s+/)[0] : '';
      form.hidden = true;
      success.hidden = false;
      success.focus();

      // Phones and tablets: open the messaging app straight away. On a computer that may do nothing, so it isn't forced —
      // the panel offers the "Open my messaging app" button, a Call button, and the message to copy.
      if (isPhoneOrTablet()) window.location.href = smsUrl;
    });

    // Copy the message (fallback when no messaging app opens)
    var enquiryText = $('#enquiryText'), copyStatus = $('#copyStatus');
    function copyResult(ok) {
      copyStatus.textContent = ok ? 'Copied — now paste it into a text message to ' + CONFIG.PHONE_DISPLAY + '.'
                                  : 'Couldn’t copy automatically — please select the message above and copy it.';
    }
    function legacyCopy() {
      enquiryText.focus(); enquiryText.select(); enquiryText.setSelectionRange(0, enquiryText.value.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      copyResult(ok);
    }
    enquiryText.addEventListener('focus', function () { enquiryText.select(); });
    $('#copyEnquiry').addEventListener('click', function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(enquiryText.value).then(function () { copyResult(true); }, legacyCopy);
      } else { legacyCopy(); }
    });

    // Back to the form — everything they typed is still there
    $('#formReset').addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      $('#f-name').focus();
    });
  }

  /* ---------- 8. MOBILE STICKY BAR + YEAR ---------- */
  var bar = $('#mobileBar');
  var hero = $('.hero');
  var contact = $('#contact');
  var footer = $('.site-footer');
  function updateMobileBar() {
    if (!bar) return;
    var pastHero = window.scrollY > hero.offsetHeight * 0.75;
    var vh = window.innerHeight;
    var cr = contact.getBoundingClientRect(), fr = footer.getBoundingClientRect();
    var overContact = cr.top < vh * 0.6 && cr.bottom > vh * 0.2;   // form is on screen — bar not needed
    var atFooter = fr.top < vh;
    bar.classList.toggle('is-visible', pastHero && !overContact && !atFooter && !document.body.classList.contains('menu-open'));
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScrollHeader(); updateMobileBar(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScrollHeader();
  updateMobileBar();

  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
