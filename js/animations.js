/* ============================================================
   animations.js
   Kallos Youth Empowerment
   Purpose: Scroll-triggered reveal animations and lazy
            image load fade-in.
            Depends on: .reveal, .reveal-delay-* classes
            defined in utilities.css.
   ============================================================ */

'use strict';

(function () {

  /* ── Scroll Reveal ────────────────────────────────────── */
  //
  // Elements marked .reveal start invisible (opacity: 0,
  // translateY: 24px via CSS). IntersectionObserver adds
  // .visible when they enter the viewport, triggering the
  // CSS transition. Observer then disconnects from that
  // element — the animation runs once only.

  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Respect user preference for reduced motion —
    // make everything visible immediately, skip observer.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold:  0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  }


  /* ── Lazy Image Fade-In ───────────────────────────────── */
  //
  // Images with loading="lazy" get .loaded added once
  // they've finished loading, triggering the opacity
  // transition defined in main.css.

  function initLazyImages() {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if (!lazyImgs.length) return;

    lazyImgs.forEach(function (img) {
      if (img.complete) {
        img.classList.add('loaded');
        return;
      }
      img.addEventListener('load', function () {
        img.classList.add('loaded');
      });
    });
  }


  /* ── Staggered Child Animation ────────────────────────── */
  //
  // Optional helper: call staggerChildren(parentEl, delay)
  // to auto-assign reveal-delay-* classes to direct children
  // of a container, up to 6 steps.
  // Usage: staggerChildren(document.querySelector('.pillars__grid'));

  function staggerChildren(parent, baseDelayMs) {
    if (!parent) return;
    const step = baseDelayMs || 100;
    const children = Array.from(parent.children);

    children.forEach(function (child, i) {
      child.classList.add('reveal');
      const delayStep = Math.min(i + 1, 6);
      child.classList.add('reveal-delay-' + delayStep);
    });
  }


  /* ── Hero Scroll Indicator Hide ──────────────────────── */
  //
  // Fades out the scroll indicator once the user scrolls
  // past the hero section.

  function initScrollIndicator() {
    const indicator = document.querySelector('.hero__scroll');
    if (!indicator) return;

    window.addEventListener('scroll', function () {
      const past = window.scrollY > window.innerHeight * 0.4;
      indicator.style.opacity = past ? '0' : '';
    }, { passive: true });
  }


  /* ── Init ─────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initLazyImages();
    initScrollIndicator();
  });

  // Expose staggerChildren for optional use in main.js
  window.KYE = window.KYE || {};
  window.KYE.staggerChildren = staggerChildren;

})();