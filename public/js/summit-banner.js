/* =========================================================================
   HSE Intelligence Summit 2026 - announcement bar for ehswatch.com
   -------------------------------------------------------------------------
   Two parts:
     1. ehswSummitBanner()  - the method. Paste it into any JS file you
                              already load on the site.
     2. the call at the bottom - run it once, anywhere after the method is
                              defined. It waits for the DOM itself.

   It matches the site UI: DM Sans, #FF6D00 pill, ink bar. It pushes the
   fixed header down by its own height so nothing overlaps, remembers a
   dismissal, and removes itself once the event is over.

   Returns { remove, refresh, el } - e.g. window.summitBar.remove().
   ========================================================================= */

function ehswSummitBanner(options) {
  'use strict';

  var CFG = {
    /* bump to show the bar again to everyone who dismissed it */
    version: 'summit-2026-a',

    /* the event page, or straight to Luma:
       'https://luma.com/event/evt-BtYd2QNahRucQue' */
    href: 'https://ehswatch.com/events/hseintelligencesummit2026/',
    newTab: false,

    title: 'HSE Intelligence Summit 2026',
    detail: 'Thursday 15 October',     /* hidden below 860px */
    cta: 'Register Now',

    startsAt: '2026-10-15T08:30:00+04:00',
    hideAfter: '2026-10-15T14:00:00+04:00',

    countdown: true,        /* '21 days to go', hidden below 560px */
    countdownWithin: 60,    /* only once the event is this close */

    dismissible: true,
    dismissDays: 14,

    /* 'ink' - #0F172A bar, white type, orange pill  (matches the site)
       'light' - white bar, dark type, orange pill
       'spectrum' - summit gradient, dimmed for legibility */
    theme: 'ink',

    /* true  - pinned to the top, the page shifts down
       false - scrolls away with the page */
    sticky: true,

    /* '' auto-detects the site header (ehswatch.com uses <header class="fixed top-0">).
       Set a selector if you ever need to be explicit. */
    headerSelector: '',

    zIndex: 2147483000
  };

  for (var k in (options || {})) {
    if (Object.prototype.hasOwnProperty.call(options, k)) CFG[k] = options[k];
  }

  var ID = 'ehsw-summit-banner';
  var KEY = 'ehsw.summit.banner';
  var SPECTRUM = 'linear-gradient(90deg,#7659E5 0%,#6999D6 14%,#73B1BE 26%,' +
                 '#C7A459 42%,#DA835F 56%,#D26683 70%,#AC4EB6 84%,#9148CD 100%)';

  /* already running? hand back the live instance instead of a second bar */
  if (ehswSummitBanner._live) return ehswSummitBanner._live;

  var bar, basePad = 0, height = 0, shifted = [], timers = [], frame = 0, lastScan = 0;
  var api = { remove: teardown, refresh: refresh, el: null };

  /* ---------------------------------------------------------------- state */

  function past(when) {
    var t = Date.parse(when);
    return !isNaN(t) && Date.now() > t;
  }

  function dismissed() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      return !!saved && saved.v === CFG.version && (!saved.until || Date.now() < saved.until);
    } catch (e) { return false; }
  }

  function remember() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        v: CFG.version, until: Date.now() + CFG.dismissDays * 864e5
      }));
    } catch (e) { /* private mode - it simply comes back next visit */ }
  }

  function countdownText() {
    var start = Date.parse(CFG.startsAt);
    if (!CFG.countdown || isNaN(start)) return '';
    var days = Math.ceil((start - Date.now()) / 864e5);
    if (days < 0 || days > CFG.countdownWithin) return '';
    if (days === 0) return 'today';
    if (days === 1) return 'tomorrow';
    return days + ' days to go';
  }

  /* ------------------------------------------------------------------ CSS */

  function css() {
    var S = '#' + ID;
    return S + ',' + S + ' *{box-sizing:border-box;margin:0;padding:0}' +

      S + '{position:' + (CFG.sticky ? 'fixed' : 'absolute') + ';top:0;left:0;right:0;width:100%;' +
        'z-index:' + CFG.zIndex + ';text-align:center;-webkit-font-smoothing:antialiased;' +
        'font-family:"DM Sans","DM Sans Fallback",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}' +

      S + '.ehsw-ab--ink{background:linear-gradient(187deg, #2e64c5, #173365);color:#fff}' +
      S + '.ehsw-ab--light{background:#fff;color:#1E1E1E;box-shadow:0 1px 0 rgba(15,23,42,.08)}' +
      S + '.ehsw-ab--spectrum{background-image:linear-gradient(rgba(10,20,36,.66),rgba(10,20,36,.66)),' + SPECTRUM + ';color:#fff}' +
      S + '::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:' + SPECTRUM + '}' +

      S + ' .ehsw-ab__link{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px;' +
        'padding:9px 56px;color:inherit;text-decoration:none;font-size:14px;font-weight:500;line-height:1.3}' +
      S + ' .ehsw-ab__dot{flex:none;width:7px;height:7px;border-radius:50%;background:#FF6D00;' +
        'animation:ehsw-ab-pulse 2.6s ease-out infinite}' +
      S + ' .ehsw-ab__title{font-weight:700}' +
      S + ' .ehsw-ab__sep,' + S + ' .ehsw-ab__detail{opacity:.72}' +
      S + ' .ehsw-ab__days{flex:none;border-radius:999px;padding:3px 11px;font-size:13px;white-space:nowrap;' +
        'background:rgba(255,109,0,.14);color:#FF8B33}' +
      S + '.ehsw-ab--light .ehsw-ab__days{background:rgba(255,109,0,.10);color:#D95C00}' +

      S + ' .ehsw-ab__cta{flex:none;display:inline-flex;align-items:center;gap:7px;margin-left:4px;' +
        'background:#FF6D00;color:#fff;border-radius:999px;padding:8px 18px;font-size:14px;font-weight:600;' +
        'white-space:nowrap;transition:background .18s ease}' +
      S + ' .ehsw-ab__link:hover .ehsw-ab__cta{background:#E56200}' +
      S + ' .ehsw-ab__arrow{display:inline-block;transition:transform .18s ease}' +
      S + ' .ehsw-ab__link:hover .ehsw-ab__arrow{transform:translateX(3px)}' +

      S + ' .ehsw-ab__close{position:absolute;top:50%;right:12px;transform:translateY(-50%);width:30px;height:30px;' +
        'border:0;border-radius:999px;background:transparent;color:currentColor;opacity:.55;' +
        'font-size:19px;line-height:1;cursor:pointer;font-family:inherit}' +
      S + ' .ehsw-ab__close:hover{opacity:1;background:rgba(127,127,127,.16)}' +
      S + ' .ehsw-ab__link:focus-visible,' + S + ' .ehsw-ab__close:focus-visible{' +
        'outline:2px solid #FF6D00;outline-offset:2px;border-radius:999px}' +

      '@keyframes ehsw-ab-pulse{0%{box-shadow:0 0 0 0 rgba(255,109,0,.55)}' +
        '70%{box-shadow:0 0 0 8px rgba(255,109,0,0)}100%{box-shadow:0 0 0 0 rgba(255,109,0,0)}}' +
      '@media (prefers-reduced-motion:reduce){' + S + ' .ehsw-ab__dot{animation:none}' +
        S + ' .ehsw-ab__arrow,' + S + ' .ehsw-ab__cta{transition:none}}' +
      '@media (max-width:860px){' + S + ' .ehsw-ab__detail,' + S + ' .ehsw-ab__sep{display:none}}' +
      '@media (max-width:560px){' + S + ' .ehsw-ab__days{display:none}' +
        S + ' .ehsw-ab__link{font-size:13px;padding:8px 44px;gap:8px}' +
        S + ' .ehsw-ab__cta{padding:7px 15px;font-size:13px}}';
  }

  /* ----------------------------------------------------------------- DOM */

  function span(cls, text, decorative) {
    var el = document.createElement('span');
    el.className = cls;
    if (text) el.textContent = text;
    if (decorative) el.setAttribute('aria-hidden', 'true');
    return el;
  }

  function build() {
    var style = document.createElement('style');
    style.id = ID + '-style';
    style.textContent = css();
    document.head.appendChild(style);

    bar = document.createElement('div');
    bar.id = ID;
    bar.className = 'ehsw-ab--' + CFG.theme;
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Event announcement');

    var link = document.createElement('a');
    link.className = 'ehsw-ab__link';
    link.href = CFG.href;
    if (CFG.newTab) { link.target = '_blank'; link.rel = 'noopener'; }

    link.appendChild(span('ehsw-ab__dot', '', true));
    link.appendChild(span('ehsw-ab__title', CFG.title));
    if (CFG.detail) {
      link.appendChild(span('ehsw-ab__sep', '·', true));
      link.appendChild(span('ehsw-ab__detail', CFG.detail));
    }
    var days = countdownText();
    if (days) link.appendChild(span('ehsw-ab__days', days));

    var cta = span('ehsw-ab__cta', CFG.cta);
    cta.appendChild(span('ehsw-ab__arrow', '→', true));
    link.appendChild(cta);
    bar.appendChild(link);

    if (CFG.dismissible) {
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'ehsw-ab__close';
      close.setAttribute('aria-label', 'Dismiss announcement');
      close.textContent = '×';
      close.addEventListener('click', function () { remember(); teardown(); });
      bar.appendChild(close);
    }

    document.body.insertBefore(bar, document.body.firstChild);
    api.el = bar;
  }

  /* ------------------------------------------- keep the site header clear */

  function candidates() {
    if (CFG.headerSelector) return [].slice.call(document.querySelectorAll(CFG.headerSelector));
    var pool = [], kids = [].slice.call(document.body.children), i, j, sub;
    for (i = 0; i < kids.length; i++) {
      pool.push(kids[i]);
      sub = kids[i].children;
      for (j = 0; j < sub.length && j < 12; j++) pool.push(sub[j]);
    }
    return pool.filter(function (node) {
      if (node === bar || node.nodeType !== 1) return false;
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'LINK') return false;
      var cs = getComputedStyle(node);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') return false;
      if (Math.abs(parseFloat(cs.top) || 0) > 0.5) return false;      /* pinned to the very top only */
      var box = node.getBoundingClientRect();
      return box.height > 0 && box.height < 320 && box.width > window.innerWidth * 0.5;
    });
  }

  function detect() {
    candidates().forEach(function (node) {
      if (node.hasAttribute('data-ehsw-top')) return;
      node.setAttribute('data-ehsw-top', String(parseFloat(getComputedStyle(node).top) || 0));
      shifted.push(node);
    });
    moveHeaders();
  }

  function moveHeaders() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
    var offset = CFG.sticky ? height : Math.max(0, height - scrolled);
    for (var i = 0; i < shifted.length; i++) {
      var node = shifted[i];
      if (node.isConnected === false) continue;
      var want = ((parseFloat(node.getAttribute('data-ehsw-top')) || 0) + offset) + 'px';
      if (node.style.top !== want) node.style.top = want;
    }
  }

  function measure() {
    if (!bar) return;
    height = bar.offsetHeight;
    document.documentElement.style.setProperty('--ehsw-banner-height', height + 'px');
    document.body.style.paddingTop = (basePad + height) + 'px';
    if (CFG.sticky) document.documentElement.style.scrollPaddingTop = height + 'px';
    moveHeaders();
  }

  function refresh() { detect(); measure(); }

  function onScroll() {
    if (CFG.sticky) {                       /* headers that only turn fixed on scroll */
      var now = Date.now();
      if (now - lastScan > 400) { lastScan = now; detect(); }
      return;
    }
    if (frame) return;
    frame = requestAnimationFrame(function () { frame = 0; moveHeaders(); });
  }

  function teardown() {
    timers.forEach(clearTimeout);
    window.removeEventListener('resize', measure);
    window.removeEventListener('scroll', onScroll);
    shifted.forEach(function (node) {
      node.style.top = '';
      node.removeAttribute('data-ehsw-top');
    });
    shifted = [];
    document.body.style.paddingTop = basePad ? basePad + 'px' : '';
    document.documentElement.style.scrollPaddingTop = '';
    document.documentElement.style.removeProperty('--ehsw-banner-height');
    if (bar) bar.remove();
    var style = document.getElementById(ID + '-style');
    if (style) style.remove();
    bar = null; api.el = null;
    ehswSummitBanner._live = null;
  }

  /* ----------------------------------------------------------------- run */

  function start() {
    if (!document.body || document.getElementById(ID)) return;
    if (past(CFG.hideAfter) || dismissed()) { ehswSummitBanner._live = null; return; }

    basePad = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
    build();
    refresh();

    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(measure).observe(bar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    [300, 900, 2000, 4000].forEach(function (ms) { timers.push(setTimeout(refresh, ms)); });
  }

  ehswSummitBanner._live = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  return api;
}

/* ------------------------------------------------------------------------
   The call. Everything is optional - drop a line to keep the default.
   ------------------------------------------------------------------------ */

window.summitBar = ehswSummitBanner({
  href: 'https://ehswatch.com/events/hseintelligencesummit2026/',
  title: 'HSE Intelligence Summit 2026',
  detail: 'Thursday 15 October',
  cta: 'Register Now',
  theme: 'ink',
  /* above the site navbar (z-65), below the video lightboxes (2000) and the cursor dot (99999) */
  zIndex: 1000
});
