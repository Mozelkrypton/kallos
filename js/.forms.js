/* ============================================================
   js/forms.js
   Kallos Youth Empowerment
   Purpose: Handles contact and get-involved form submission
            via fetch to the KYE Express backend on Railway.
            Add <script src="../js/forms.js"></script> to
            contact.html and get-involved.html before </body>.
   ============================================================ */

'use strict';

(function () {

  /* ── Config ───────────────────────────────────────────── */

 const API_BASE = 'http://localhost:3000'; // update after Railway deploy

  /* ── Helpers ──────────────────────────────────────────── */

  function showMessage(form, type, text) {
    // Remove any existing message
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className  = 'form-message form-message--' + type;
    div.textContent = text;
    div.setAttribute('role', 'alert');
    form.appendChild(div);

    // Scroll into view on mobile
    div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setLoading(btn, loading) {
    btn.disabled    = loading;
    btn.textContent = loading ? 'Sending…' : btn.dataset.label;
  }

  function serializeForm(form) {
    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  async function postJSON(endpoint, payload) {
    const res = await fetch(API_BASE + endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status, data: await res.json() };
  }


  /* ── Contact Form ─────────────────────────────────────── */

  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.dataset.label = btn.textContent;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      setLoading(btn, true);

      try {
        const { ok, data } = await postJSON('/api/contact', serializeForm(form));

        if (ok) {
          showMessage(form, 'success', data.message || 'Message sent. We will be in touch soon.');
          form.reset();
        } else {
          const errorText = data.errors
            ? data.errors.map(err => err.message).join(' ')
            : data.error || 'Something went wrong. Please try again.';
          showMessage(form, 'error', errorText);
        }
      } catch (err) {
        showMessage(form, 'error', 'Could not connect to the server. Please try again later.');
      } finally {
        setLoading(btn, false);
      }
    });
  }


  /* ── Application Form ─────────────────────────────────── */

  function initApplyForm() {
    const form = document.querySelector('.apply-form');
    if (!form) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.dataset.label = btn.textContent;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      setLoading(btn, true);

      try {
        const { ok, data } = await postJSON('/api/apply', serializeForm(form));

        if (ok) {
          showMessage(form, 'success', data.message || 'Application received. We will follow up shortly.');
          form.reset();
        } else {
          const errorText = data.errors
            ? data.errors.map(err => err.message).join(' ')
            : data.error || 'Something went wrong. Please try again.';
          showMessage(form, 'error', errorText);
        }
      } catch (err) {
        showMessage(form, 'error', 'Could not connect to the server. Please try again later.');
      } finally {
        setLoading(btn, false);
      }
    });
  }


  /* ── Init ─────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
    initApplyForm();
  });

})();