/* ============================================================
   main.js
   Kallos Youth Empowerment
   Purpose: Site-wide initialisation entry point.
            Runs after nav.js and animations.js.
            Houses shared utilities, page detection,
            and any future feature bootstrapping.
   ============================================================ */

'use strict';

(function () {

  /* ── KYE Namespace ────────────────────────────────────── */
  // Shared namespace initialised here; animations.js may
  // have already attached helpers to it.

  window.KYE = window.KYE || {};


  /* ── Page Detection ───────────────────────────────────── */
  // Adds a data-page attribute to <body> based on the
  // current filename — useful for page-specific JS logic
  // without separate script files per page.
  //
  // e.g. <body data-page="about"> on about.html

  function detectPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '') || 'home';
    document.body.setAttribute('data-page', file);
  }


  /* ── Smooth Anchor Scroll ─────────────────────────────── */
  // Handles in-page anchor links (href="#section") with
  // offset for the fixed nav height.

  function initAnchorScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height') || '72',
        10
      );

      const top = target.getBoundingClientRect().top
        + window.scrollY
        - navHeight
        - 16; // small breathing room

      window.scrollTo({ top, behavior: 'smooth' });
    });
  }


  /* ── External Links ───────────────────────────────────── */
  // Opens external links in a new tab with rel safety attrs.

  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function (link) {
      const isInternal = link.hostname === window.location.hostname;
      if (isInternal) return;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }


  /* ── Current Year ─────────────────────────────────────── */
  // Fills any element with class .js-year with the current
  // year — keeps the footer copyright date current without
  // manual updates.
  // Usage in HTML: <span class="js-year"></span>

  function initCurrentYear() {
    document.querySelectorAll('.js-year').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }


  /* ── Asset Path Helper ────────────────────────────────── */
  // Returns the correct relative path prefix depending on
  // whether we're on the root (index.html) or inside pages/.
  // Usage: KYE.assetPath('images/hero/banner.jpg')

  function assetPath(relativePath) {
    const isInPages = window.location.pathname.includes('/pages/');
    const prefix    = isInPages ? '../' : '';
    return prefix + relativePath;
  }

  window.KYE.assetPath = assetPath;


  /* ── Simple Event Bus ─────────────────────────────────── */
  // Lightweight pub/sub for decoupled communication between
  // modules. Usage:
  //   KYE.events.on('drawer:open', handler)
  //   KYE.events.emit('drawer:open', payload)

  const listeners = {};

  window.KYE.events = {
    on: function (event, fn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
    },
    off: function (event, fn) {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(f => f !== fn);
    },
    emit: function (event, payload) {
      if (!listeners[event]) return;
      listeners[event].forEach(fn => fn(payload));
    },
  };


  /* ── Init ─────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    detectPage();
    initAnchorScroll();
    initExternalLinks();
    initCurrentYear();
  });

})();