/* ============================================================
   nav.js
   Kallos Youth Empowerment
   Purpose: Fixed nav scroll state + mobile drawer toggle.
            Depends on: .nav, .nav__hamburger, .nav__drawer
            classes defined in components.css.
   ============================================================ */

'use strict';

(function () {

  const nav         = document.getElementById('nav');
  const hamburger   = document.querySelector('.nav__hamburger');
  const navLinks    = document.querySelector('.nav__links');
  const navCta      = document.querySelector('.nav__cta');

  if (!nav) return;


  /* ── Scroll State ─────────────────────────────────────── */

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load in case page is already scrolled
  onScroll();


  /* ── Mobile Drawer ────────────────────────────────────── */

  // Build the drawer dynamically from existing nav links
  // so we never duplicate markup in the HTML.

  function buildDrawer() {
    const existing = document.querySelector('.nav__drawer');
    if (existing) return existing;

    const drawer = document.createElement('nav');
    drawer.className  = 'nav__drawer';
    drawer.setAttribute('aria-label', 'Mobile navigation');
    drawer.setAttribute('aria-hidden', 'true');

    // Clone links from desktop nav
    if (navLinks) {
      const links = navLinks.querySelectorAll('a');
      links.forEach(link => {
        const a = document.createElement('a');
        a.href        = link.href;
        a.textContent = link.textContent;
        if (link.getAttribute('aria-current')) {
          a.setAttribute('aria-current', link.getAttribute('aria-current'));
        }
        drawer.appendChild(a);
      });
    }

    // Add CTA link
    if (navCta) {
      const cta = document.createElement('a');
      cta.href        = navCta.href;
      cta.textContent = navCta.textContent;
      cta.className   = 'nav__drawer-cta';
      drawer.appendChild(cta);
    }

    document.body.appendChild(drawer);
    return drawer;
  }

  function openDrawer(drawer) {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Trap focus within drawer
    const focusable = drawer.querySelectorAll('a, button');
    if (focusable.length) focusable[0].focus();
  }

  function closeDrawer(drawer) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  function toggleDrawer() {
    const drawer  = buildDrawer();
    const isOpen  = drawer.classList.contains('open');
    isOpen ? closeDrawer(drawer) : openDrawer(drawer);
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleDrawer);
  }

  // Close drawer on link click
  document.addEventListener('click', function (e) {
    const drawer = document.querySelector('.nav__drawer');
    if (!drawer) return;
    if (e.target.closest('.nav__drawer a')) {
      closeDrawer(drawer);
    }
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    const drawer = document.querySelector('.nav__drawer');
    if (drawer && drawer.classList.contains('open')) {
      closeDrawer(drawer);
    }
  });

  // Close drawer if viewport resizes past mobile breakpoint
  const mq = window.matchMedia('(min-width: 769px)');
  mq.addEventListener('change', function (e) {
    if (!e.matches) return;
    const drawer = document.querySelector('.nav__drawer');
    if (drawer && drawer.classList.contains('open')) {
      closeDrawer(drawer);
    }
  });


  /* ── Active Link Highlight ────────────────────────────── */

  function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__links a, .nav__drawer a').forEach(link => {
      const linkPath = link.getAttribute('href').split('/').pop();
      if (linkPath === currentPath) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  setActiveLink();

})();