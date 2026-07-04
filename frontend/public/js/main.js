/* The Pediment — vanilla JS port of the three approved animations + Apply form logic.
   No React, no external animation library. Ported 1:1 from the approved
   Design Component source (`The Pediment - Website.dc.html`). */
(function () {
  'use strict';

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

  /* ---------- Apply form (tier toggle, checkboxes, validation) ---------- */
  function setupApplyForm() {
    var form = document.getElementById('apply-form');
    if (!form) return;
    var state = { tier: 'vip', mw: false, pv: false };

    var vipOpt = form.querySelector('[data-tier-opt="vip"]');
    var obsOpt = form.querySelector('[data-tier-opt="obs"]');
    var tierInput = form.querySelector('input[name="tier"]');
    var delegateField = form.querySelector('#delegate-status-field');
    var mwBox = form.querySelector('[data-consent="mw"] .box');
    var pvBox = form.querySelector('[data-consent="pv"] .box');
    var submitBtn = form.querySelector('.sub');
    var errEl = form.querySelector('.ferr');

    function renderTier() {
      vipOpt.classList.toggle('sel', state.tier === 'vip');
      obsOpt.classList.toggle('sel', state.tier === 'obs');
      tierInput.value = state.tier;
      if (delegateField) delegateField.style.display = state.tier === 'vip' ? '' : 'none';
    }
    function renderConsent() {
      mwBox.classList.toggle('sel', state.mw);
      pvBox.classList.toggle('sel', state.pv);
      var ok = state.mw && state.pv;
      submitBtn.disabled = !ok;
      submitBtn.title = ok ? '' : 'Please accept the media waiver and privacy terms to continue.';
    }
    function setErr(msg) {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.style.display = msg ? '' : 'none';
    }

    vipOpt.addEventListener('click', function () { state.tier = 'vip'; renderTier(); });
    obsOpt.addEventListener('click', function () { state.tier = 'obs'; renderTier(); });
    form.querySelector('[data-consent="mw"]').addEventListener('click', function () { state.mw = !state.mw; renderConsent(); });
    form.querySelector('[data-consent="pv"]').addEventListener('click', function () { state.pv = !state.pv; renderConsent(); });

    var started = false;
    form.querySelectorAll('input,select').forEach(function (f) {
      f.addEventListener('focus', function () {
        if (!started) { started = true; if (window.trackEvent) window.trackEvent('apply_start', {}); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = form.elements;
      function v(n) { var f = el.namedItem(n); return f ? f.value.trim() : ''; }
      if (!v('full_name')) return setErr('Please enter your full name.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) return setErr("That doesn't look like a valid email.");
      if (!v('phone')) return setErr('Include your country code, e.g. +91\u2026');
      if (!v('linkedin_url')) return setErr('Please paste your full LinkedIn URL.');
      if (!v('instagram_handle')) return setErr('Please share your Instagram handle.');
      if (state.tier === 'vip' && !v('delegate_status')) return setErr('Please select your delegate status.');
      if (!state.mw || !state.pv) return setErr('This is required to submit.');
      setErr('');

      var formWrap = document.getElementById('apply-form-wrap');
      var confWrap = document.getElementById('apply-confirm');
      var confBody = document.getElementById('apply-confirm-body');
      if (confBody) {
        confBody.textContent = state.tier === 'vip'
          ? "Thank you for applying to The Leadership Prologue. Our team reviews every application personally. If selected, you'll hear from us on WhatsApp with your next steps."
          : "Thank you for applying. Our team reviews every application personally. If your place is confirmed, we'll send your reservation details and payment link shortly.";
      }
      if (formWrap) formWrap.style.display = 'none';
      if (confWrap) confWrap.style.display = '';
    });

    renderTier();
    renderConsent();
    setErr('');
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    applyPrefs();
    setupObs();
    setupThread();
    setupEvLine();
    setupApplyForm();
    if (window.trackEvent) window.trackEvent('view', {});
  });
})();
