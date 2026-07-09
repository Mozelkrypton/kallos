/* ============================================================
   src/routes/contact.js
   KYE Backend — POST /api/contact
   ============================================================ */

'use strict';

const express              = require('express');
const { body }             = require('express-validator');
const { formLimiter }      = require('../middleware/rateLimiter');
const { submitContact }    = require('../controllers/contactController');

const router = express.Router();

const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 200 }).withMessage('Name must be under 200 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .isLength({ max: 320 }),

  body('reason')
    .optional()
    .isIn(['general', 'partnership', 'volunteer', 'media', 'other'])
    .withMessage('Invalid reason.'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters.'),
];

router.post('/', formLimiter, contactValidation, submitContact);

module.exports = router;