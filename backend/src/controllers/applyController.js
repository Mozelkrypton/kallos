/* ============================================================
   src/controllers/applyController.js
   KYE Backend — handles POST /api/apply
   ============================================================ */

'use strict';

const { validationResult } = require('express-validator');
const pool                 = require('../db/pool');
const { sendApplicationNotification } = require('../utils/mailer');

const VALID_TRACKS = ['member', 'volunteer', 'leadership'];
const VALID_COMMITMENTS = ['few-hours', 'weekly', 'ongoing', 'event-based'];

async function submitApplication(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors:  errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  const {
    full_name,
    email,
    phone,
    age,
    track,
    commitment,
    message,
  } = req.body;

  const ip = req.ip || req.headers['x-forwarded-for'] || null;

  // Sanitize optional fields
  const safePhone      = phone      ? phone.trim()      : null;
  const safeAge        = age        ? Number(age)        : null;
  const safeMessage    = message    ? message.trim()     : null;
  const safeTrack      = VALID_TRACKS.includes(track)       ? track      : 'member';
  const safeCommitment = VALID_COMMITMENTS.includes(commitment) ? commitment : 'few-hours';

  try {
    await pool.query(
      `INSERT INTO applications
         (full_name, email, phone, age, track, commitment, message, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        full_name.trim(),
        email.trim().toLowerCase(),
        safePhone,
        safeAge,
        safeTrack,
        safeCommitment,
        safeMessage,
        ip,
      ]
    );

    await sendApplicationNotification({
      full_name,
      email,
      phone:      safePhone,
      age:        safeAge,
      track:      safeTrack,
      commitment: safeCommitment,
      message:    safeMessage,
    });

    return res.status(201).json({
      success: true,
      message: 'Application received. A member of our team will follow up with next steps.',
    });

  } catch (err) {
    console.error('[Apply] Error:', err.message);
    return res.status(500).json({
      success: false,
      error:   'Something went wrong. Please try again or contact us directly.',
    });
  }
}

module.exports = { submitApplication };