/* ============================================================
   src/routes/apply.js
   KYE Backend — POST /api/apply
   ============================================================ */

'use strict';

const express               = require('express');
const { body }              = require('express-validator');
const { formLimiter }       = require('../middleware/rateLimiter');
const { submitApplication } = require('../controllers/applyController');

const router = express.Router();

const applyValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ max: 200 }).withMessage('Name must be under 200 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .isLength({ max: 320 }),

  body('phone')
    .optional({ checkFalsy: true })
    .isMobilePhone().withMessage('Please enter a valid phone number.'),

  body('age')
    .optional({ checkFalsy: true })
    .isInt({ min: 16, max: 120 }).withMessage('Please enter a valid age.'),

  body('track')
    .notEmpty().withMessage('Please select a track.')
    .isIn(['member', 'volunteer', 'leadership']).withMessage('Invalid track.'),

  body('commitment')
    .optional()
    .isIn(['few-hours', 'weekly', 'ongoing', 'event-based'])
    .withMessage('Invalid commitment option.'),

  body('message')
    .optional({ checkFalsy: true })
    .isLength({ max: 5000 }).withMessage('Message must be under 5000 characters.'),
];

router.post('/', formLimiter, applyValidation, submitApplication);

module.exports = router;