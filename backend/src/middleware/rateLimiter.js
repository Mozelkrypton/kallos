/* ============================================================
   src/middleware/rateLimiter.js
   KYE Backend — rate limiting to prevent form spam/abuse
   ============================================================ */

'use strict';

const rateLimit = require('express-rate-limit');

const formLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              10,              // max 10 submissions per IP per window
  standardHeaders:  true,
  legacyHeaders:    false,
  message: {
    success: false,
    error:   'Too many submissions from this IP. Please try again in 15 minutes.',
  },
});

module.exports = { formLimiter };