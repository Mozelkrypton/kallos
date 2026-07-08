/* ============================================================
   src/controllers/contactController.js
   KYE Backend — handles POST /api/contact
   ============================================================ */

'use strict';

const { validationResult } = require('express-validator');
const pool                 = require('../db/pool');
const { sendContactNotification } = require('../utils/mailer');

async function submitContact(req, res) {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors:  errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, email, reason, message } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || null;

  try {
    // Save to Supabase
    await pool.query(
      `INSERT INTO contact_submissions (name, email, reason, message, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [name.trim(), email.trim().toLowerCase(), reason, message.trim(), ip]
    );

    // Send email notification
    await sendContactNotification({ name, email, reason, message });

    return res.status(201).json({
      success: true,
      message: 'Message received. We will be in touch soon.',
    });

  } catch (err) {
    console.error('[Contact] Error:', err.message);
    return res.status(500).json({
      success: false,
      error:   'Something went wrong. Please try again or email us directly.',
    });
  }
}

module.exports = { submitContact };