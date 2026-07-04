/* The Pediment — vanilla JS: the three approved animations, the Apply + Partner
   forms wired to the Supabase Edge Function, cookie-gated Plausible analytics,
   and small per-page helpers. No React, no external animation library.
   Animations ported 1:1 from the approved Design Component source
   (`handoff/The Pediment - Website.dc.html`). */
(function () {
  'use strict';

  /* Public URL of the `apply` Edge Function. This is NOT a secret — the function
     is public (no JWT) and enforces validation, rate-limiting and seat caps
     server-side. No Supabase key is ever placed on the frontend. */
  var API = 'https://kxxoapufmqzgchcaqyqe.supabase.co/functions/v1/apply';

  /* ---------- shared prefs (grain / reduced motion) ---------- */
  function applyPrefs() {
    var b = document.body;
    var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    b.classList.toggle('nomo', rm);
  }

  /* ---------- 1. scroll-reveal (.rv) + header dark/light flip ---------- */
  var _io, _mo;
  function setupObs() {
    _io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('on'); _io.unobserve(e.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });

    function scan() {
      document.querySelectorAll('.folio,.band').forEach(function (f) {
        var rvs = f.querySelectorAll('.rv');
        rvs.forEach(function (el, i) { el.style.transitionDelay = Math.min(i * 70, 560) + 'ms'; });
      });
      document.querySelectorAll('.rv:not([data-obs])').forEach(function (el) {
        el.setAttribute('data-obs', '1');
        _io.observe(el);
      });
    }
    scan();
    [300, 900, 2000].forEach(function (t) { setTimeout(scan, t); });
    _mo = new MutationObserver(scan);
    _mo.observe(document.body, { childList: true, subtree: true });

    function upd() {
      var hdr = document.querySelector('.hdr');
      var secs = document.querySelectorAll('[data-dk]');
      var dk = true;
      for (var i = 0; i < secs.length; i++) {
        var r = secs[i].getBoundingClientRect();
        if (r.top <= 80 && r.bottom > 80) { dk = secs[i].dataset.dk === '1'; break; }
      }
      if (hdr) hdr.classList.toggle('dk', dk);
      updThread();
    }
    addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------- 2. diagonal thread-line SVG draw ---------- */
  var _tp = null, _len = 0;
  function buildThread() {
    var wrap = document.querySelector('.threadwrap');
    var secs = [].slice.call(document.querySelectorAll('[data-th]'));
    if (!wrap || secs.length < 3 || innerWidth <= 1080) return;
    var W = document.body.clientWidth, H = Math.round(document.body.scrollHeight);
    wrap.style.height = H + 'px';
    function top(el) { return el.getBoundingClientRect().top + scrollY; }
    var pts = [];
    secs.forEach(function (s, i) {
      var x = parseFloat(s.dataset.th) * W;
      pts.push(i === 0 ? [x, top(s) + s.offsetHeight * .86] : [x, top(s)]);
    });
    var last = secs[secs.length - 1];
    pts.push([W * .5, top(last) + last.offsetHeight * .7]);
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length; i++) {
      var x0 = pts[i - 1][0], y0 = pts[i - 1][1], x1 = pts[i][0], y1 = pts[i][1], my = (y0 + y1) / 2;
      d += 'C' + x0.toFixed(1) + ' ' + my.toFixed(1) + ',' + x1.toFixed(1) + ' ' + my.toFixed(1) + ',' + x1.toFixed(1) + ' ' + y1.toFixed(1);
    }
    var stops = '';
    secs.forEach(function (s) {
      var y = (top(s) + s.offsetHeight / 2) / H;
      var c = s.dataset.dk === '1' ? 'rgba(233,211,166,.75)' : 'rgba(94,32,41,.6)';
      stops += '<stop offset="' + (y * 100).toFixed(2) + '%" stop-color="' + c + '"/>';
    });
    wrap.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none"><defs><linearGradient id="tgrad" x1="0" y1="0" x2="0" y2="1">' + stops + '</linearGradient></defs><path class="tpath" stroke="url(#tgrad)" d="' + d + '"/></svg>';
    var p = wrap.querySelector('.tpath');
    _len = p.getTotalLength();
    p.setAttribute('stroke-dasharray', _len);
    _tp = p;
    updThread();
  }
  function updThread() {
    if (!_tp || !_len) return;
    var prog = Math.min(1, Math.max(0, (scrollY + innerHeight * .92) / document.body.scrollHeight));
    _tp.style.strokeDashoffset = (_len * (1 - prog)).toFixed(1);
  }
  function setupThread() {
    addEventListener('resize', buildThread);
    addEventListener('load', buildThread);
    [400, 1200, 2500, 5000].forEach(function (t) { setTimeout(buildThread, t); });
    buildThread();
  }

  /* ---------- 3. Folio VI narrative-spine draw + bg parallax ---------- */
  var _evSegs = null, _evIo = null;
  function buildEvLine() {
    var wrap = document.querySelector('#experience .evwrap');
    var svg = document.querySelector('#experience .evline');
    if (!wrap || !svg) return;
    var dots = [].slice.call(wrap.querySelectorAll('.evfield .evdot'));
    if (dots.length < 2) return;
    var wr = wrap.getBoundingClientRect();
    var W = wr.width, H = wrap.scrollHeight;
    svg.setAttribute('viewBox', '0 0 ' + Math.round(W) + ' ' + Math.round(H));
    var head = wrap.querySelector('.evhead');
    var hr = head ? head.getBoundingClientRect() : null;
    var pts = dots.map(function (d) {
      var r = d.getBoundingClientRect();
      return [r.left + r.width / 2 - wr.left, r.top + r.height / 2 - wr.top];
    });
    var entry = hr ? [pts[0][0], hr.bottom - wr.top + 14] : [pts[0][0], pts[0][1] - 70];
    var all = [entry].concat(pts);
    if (!_evSegs) _evSegs = [].slice.call(svg.querySelectorAll('.evseg'));
    _evSegs.forEach(function (seg, i) {
      if (i + 1 >= all.length) { seg.setAttribute('d', ''); return; }
      var x0 = all[i][0], y0 = all[i][1], x1 = all[i + 1][0], y1 = all[i + 1][1], my = (y0 + y1) / 2;
      seg.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'C' + x0.toFixed(1) + ' ' + my.toFixed(1) + ',' + x1.toFixed(1) + ' ' + my.toFixed(1) + ',' + x1.toFixed(1) + ' ' + y1.toFixed(1));
      var len = seg.getTotalLength();
      seg.style.strokeDasharray = len;
      if (!seg.classList.contains('on')) seg.style.strokeDashoffset = len;
    });
  }
  function drawEvSeg(idx) {
    var seg = _evSegs && _evSegs[idx - 1];
    if (!seg) return;
    seg.classList.add('on');
    seg.style.strokeDashoffset = 0;
  }
  function evParallax() {
    var sec = document.getElementById('experience');
    if (!sec) return;
    var bgi = sec.querySelector('.bgi');
    if (!bgi) return;
    if (document.body.classList.contains('nomo')) { bgi.style.transform = ''; return; }
    var r = sec.getBoundingClientRect();
    var prog = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    bgi.style.transform = 'translateY(' + ((prog - .5) * 22).toFixed(1) + 'px)';
  }
  function setupEvLine() {
    if (!document.getElementById('experience')) return;
    addEventListener('resize', buildEvLine);
    addEventListener('load', buildEvLine);
    [400, 1000, 2000, 3500].forEach(function (t) { setTimeout(buildEvLine, t); });
    buildEvLine();
    _evIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          var dot = e.target.querySelector('.evdot');
          if (dot) dot.classList.add('on');
          var idx = parseInt(e.target.dataset.ev || '0', 10);
          if (idx) drawEvSeg(idx);
          _evIo.unobserve(e.target);
          setTimeout(buildEvLine, 320);
        }
      });
    }, { threshold: .3, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('#experience .evrv').forEach(function (el) { _evIo.observe(el); });
    addEventListener('scroll', evParallax, { passive: true });
    evParallax();
  }

  /* ---------- analytics (Plausible, loaded only after cookie consent) ---------- */
  function loadAnalytics() {
    if (window.__pedimentAnalytics) return;
    window.__pedimentAnalytics = true;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', 'thepediment.com');
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
    window.trackEvent = function (name, props) {
      if (window.plausible) window.plausible(name, { props: props || {} });
    };
    window.trackEvent('view', {});
  }
  function track(name, props) { if (window.trackEvent) window.trackEvent(name, props || {}); }

  var COOKIE_KEY = 'pediment_cookie_consent';
  function setupCookies() {
    var choice = null;
    try { choice = localStorage.getItem(COOKIE_KEY); } catch (e) {}
    if (choice === 'accepted') { loadAnalytics(); return; }
    if (choice === 'declined') return;
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.hidden = false;
    var acc = banner.querySelector('[data-cookie="accept"]');
    var dec = banner.querySelector('[data-cookie="decline"]');
    if (acc) acc.addEventListener('click', function () {
      try { localStorage.setItem(COOKIE_KEY, 'accepted'); } catch (e) {}
      banner.hidden = true;
      loadAnalytics();
      setupScrollDepth();
    });
    if (dec) dec.addEventListener('click', function () {
      try { localStorage.setItem(COOKIE_KEY, 'declined'); } catch (e) {}
      banner.hidden = true;
    });
  }

  /* ---------- scroll-depth events (scroll_50 / scroll_90) ---------- */
  var _scrollDepthWired = false;
  function setupScrollDepth() {
    if (_scrollDepthWired) return;
    _scrollDepthWired = true;
    var fired = {};
    function onScroll() {
      var max = document.body.scrollHeight - innerHeight;
      if (max <= 0) return;
      var pct = (scrollY / max) * 100;
      if (pct >= 50 && !fired.s50) { fired.s50 = true; track('scroll_50', {}); }
      if (pct >= 90 && !fired.s90) { fired.s90 = true; track('scroll_90', {}); }
      if (fired.s50 && fired.s90) removeEventListener('scroll', onScroll);
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- helpers ---------- */
  function computeSource() {
    try {
      var p = new URLSearchParams(location.search);
      var utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
        .map(function (k) { return p.get(k); }).filter(Boolean).join(' / ');
      if (utm) return utm.slice(0, 300);
      if (document.referrer) return ('ref: ' + document.referrer).slice(0, 300);
    } catch (e) {}
    return null;
  }

  async function postForm(payload) {
    var res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    var data = null;
    try { data = await res.json(); } catch (e) {}
    return data || { ok: false, error: 'Something went wrong. Please try again.' };
  }

  /* ---------- Apply form (tier toggle, consents, validation, submit) ---------- */
  function setupApplyForm() {
    var form = document.getElementById('apply-form');
    if (!form) return;
    var state = { tier: 'vip', mw: false, pv: false, submitting: false };

    var vipOpt = form.querySelector('[data-tier-opt="vip"]');
    var obsOpt = form.querySelector('[data-tier-opt="obs"]');
    var tierInput = form.querySelector('input[name="tier"]');
    var delegateField = form.querySelector('#delegate-status-field');
    var mwBtn = form.querySelector('[data-consent="mw"]');
    var pvBtn = form.querySelector('[data-consent="pv"]');
    var mwBox = mwBtn.querySelector('.box');
    var pvBox = pvBtn.querySelector('.box');
    var submitBtn = form.querySelector('.sub');
    var errEl = form.querySelector('.ferr');
    var sourceInput = form.querySelector('input[name="source"]');
    if (sourceInput && !sourceInput.value) sourceInput.value = computeSource() || '';

    function renderTier() {
      vipOpt.classList.toggle('sel', state.tier === 'vip');
      obsOpt.classList.toggle('sel', state.tier === 'obs');
      vipOpt.setAttribute('aria-pressed', state.tier === 'vip');
      obsOpt.setAttribute('aria-pressed', state.tier === 'obs');
      tierInput.value = state.tier;
      if (delegateField) delegateField.style.display = state.tier === 'vip' ? '' : 'none';
    }
    function renderConsent() {
      mwBox.classList.toggle('sel', state.mw);
      pvBox.classList.toggle('sel', state.pv);
      mwBtn.setAttribute('aria-checked', state.mw);
      pvBtn.setAttribute('aria-checked', state.pv);
      var ok = state.mw && state.pv;
      submitBtn.disabled = !ok || state.submitting;
      submitBtn.title = ok ? '' : 'Please accept the media waiver and privacy terms to continue.';
    }
    function setErr(msg) {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.style.display = msg ? '' : 'none';
    }

    vipOpt.addEventListener('click', function () { state.tier = 'vip'; renderTier(); });
    obsOpt.addEventListener('click', function () { state.tier = 'obs'; renderTier(); });
    mwBtn.addEventListener('click', function () { state.mw = !state.mw; renderConsent(); });
    pvBtn.addEventListener('click', function () { state.pv = !state.pv; renderConsent(); });

    var started = false;
    form.querySelectorAll('input,select').forEach(function (f) {
      f.addEventListener('focus', function () {
        if (!started) { started = true; track('apply_start', {}); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (state.submitting) return;
      var el = form.elements;
      function v(n) { var f = el.namedItem(n); return f ? f.value.trim() : ''; }

      if (!v('full_name')) return setErr('Please enter your full name.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) return setErr("That doesn't look like a valid email.");
      if (!v('phone')) return setErr('Include your country code, e.g. +91…');
      if (!v('linkedin_url') || v('linkedin_url').toLowerCase().indexOf('linkedin.com/') === -1) return setErr('Please paste your full LinkedIn URL.');
      if (!v('instagram_handle')) return setErr('Please share your Instagram handle.');
      if (!v('affiliation')) return setErr('Please add your university or organisation.');
      if (!v('city')) return setErr('Please add your city.');
      if (state.tier === 'vip' && !v('delegate_status')) return setErr('Please select your delegate status.');
      if (!state.mw || !state.pv) return setErr('This is required to submit.');
      setErr('');

      var payload = {
        form: 'application',
        nickname: v('nickname'),
        tier: state.tier,
        full_name: v('full_name'),
        email: v('email'),
        phone: v('phone'),
        linkedin_url: v('linkedin_url'),
        instagram_handle: v('instagram_handle'),
        affiliation: v('affiliation'),
        domain_sector: v('domain_sector'),
        city: v('city'),
        media_waiver_consent: state.mw,
        privacy_consent: state.pv,
        source: v('source') || null
      };
      if (state.tier === 'vip') payload.delegate_status = v('delegate_status');

      state.submitting = true;
      submitBtn.disabled = true;
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = 'Submitting…';

      postForm(payload).then(function (data) {
        if (data.ok) {
          track('apply_submit', { tier: state.tier === 'vip' ? 'vip_delegate' : 'premium_observer' });
          var dest = (data.redirect || '/thank-you');
          if (dest === '/thank-you') dest += '?tier=' + state.tier;
          window.location.href = dest;
          return;
        }
        state.submitting = false;
        submitBtn.textContent = submitBtn.dataset.label || 'Submit Application';
        renderConsent();
        setErr(data.error || 'Something went wrong. Please try again.');
      }).catch(function () {
        state.submitting = false;
        submitBtn.textContent = submitBtn.dataset.label || 'Submit Application';
        renderConsent();
        setErr('Network error — please check your connection and try again.');
      });
    });

    renderTier();
    renderConsent();
    setErr('');
  }

  /* ---------- Partner inquiry form ---------- */
  function setupPartnerForm() {
    var form = document.getElementById('partner-form');
    if (!form) return;
    var state = { pv: false, submitting: false };
    var pvBtn = form.querySelector('[data-consent="pv"]');
    var pvBox = pvBtn.querySelector('.box');
    var submitBtn = form.querySelector('.sub');
    var errEl = form.querySelector('.ferr');

    function renderConsent() {
      pvBox.classList.toggle('sel', state.pv);
      pvBtn.setAttribute('aria-checked', state.pv);
      submitBtn.disabled = !state.pv || state.submitting;
      submitBtn.title = state.pv ? '' : 'Please accept the privacy terms to continue.';
    }
    function setErr(msg) {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.style.display = msg ? '' : 'none';
    }
    pvBtn.addEventListener('click', function () { state.pv = !state.pv; renderConsent(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (state.submitting) return;
      var el = form.elements;
      function v(n) { var f = el.namedItem(n); return f ? f.value.trim() : ''; }

      if (!v('name')) return setErr('Please enter your name.');
      if (!v('organization')) return setErr('Please enter your organisation.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('work_email'))) return setErr("That doesn't look like a valid work email.");
      if (!v('role')) return setErr('Please enter your role.');
      if (!v('interest')) return setErr('Please choose an area of interest.');
      if (!state.pv) return setErr('This is required to submit.');
      setErr('');

      var payload = {
        form: 'partner_inquiry',
        nickname: v('nickname'),
        name: v('name'),
        organization: v('organization'),
        work_email: v('work_email'),
        role: v('role'),
        interest: v('interest'),
        message: v('message') || null,
        privacy_consent: state.pv
      };

      state.submitting = true;
      submitBtn.disabled = true;
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';

      postForm(payload).then(function (data) {
        if (data.ok) {
          track('partner_submit', {});
          var formWrap = document.getElementById('partner-form-wrap');
          var confWrap = document.getElementById('partner-confirm');
          if (formWrap) formWrap.style.display = 'none';
          if (confWrap) confWrap.style.display = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        state.submitting = false;
        submitBtn.textContent = submitBtn.dataset.label || 'Request the brief';
        renderConsent();
        setErr(data.error || 'Something went wrong. Please try again.');
      }).catch(function () {
        state.submitting = false;
        submitBtn.textContent = submitBtn.dataset.label || 'Request the brief';
        renderConsent();
        setErr('Network error — please check your connection and try again.');
      });
    });

    renderConsent();
    setErr('');
  }

  /* ---------- Thank-you page: tier-specific body copy ---------- */
  function setupThankYou() {
    var body = document.getElementById('ty-body');
    if (!body) return;
    var tier;
    try { tier = new URLSearchParams(location.search).get('tier'); } catch (e) { tier = null; }
    if (tier === 'obs') {
      body.textContent = "Thank you for applying. Our team reviews every application personally. If your place is confirmed, we'll send your reservation details and payment link shortly.";
    } else if (tier === 'vip') {
      body.textContent = "Thank you for applying to The Leadership Prologue. Our team reviews every application personally. If selected, you'll hear from us on WhatsApp with your next steps.";
    }
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    applyPrefs();
    setupObs();
    setupThread();
    setupEvLine();
    setupApplyForm();
    setupPartnerForm();
    setupThankYou();
    setupCookies();
    setupScrollDepth();
    track('view', {});
  });
})();
