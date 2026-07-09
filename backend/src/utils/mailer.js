/* ============================================================
   src/utils/mailer.js
   KYE Backend — Nodemailer transporter + notification helpers
   ============================================================ */

'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


/* ── Contact Submission Notification ─────────────────────── */

async function sendContactNotification(data) {
  const { name, email, reason, message } = data;

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.NOTIFY_EMAIL,
    subject: `[KYE Contact] New message from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; color: #0E0E0E;">
        <h2 style="color: #2B2218;">New Contact Submission</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 140px;">Name</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Reason</td>
            <td style="padding: 8px 0;">${reason}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #E9E6DF; margin: 16px 0;" />
        <h3 style="color: #2B2218;">Message</h3>
        <p style="line-height: 1.7; white-space: pre-wrap;">${message}</p>
        <hr style="border: 1px solid #E9E6DF; margin: 16px 0;" />
        <p style="font-size: 12px; color: #7A736A;">
          Submitted via kallokye.netlify.app/pages/contact.html
        </p>
      </div>
    `,
  });
}


/* ── Application Notification ─────────────────────────────── */

async function sendApplicationNotification(data) {
  const { full_name, email, phone, age, track, commitment, message } = data;

  const trackLabels = {
    member:     'General Member (18–30)',
    volunteer:  'Volunteer / Partner',
    leadership: 'Core Team Leadership',
  };

  const commitmentLabels = {
    'few-hours':  'A few hours / month',
    weekly:       'Weekly',
    ongoing:      'Ongoing / regular role',
    'event-based':'Event-based only',
  };

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.NOTIFY_EMAIL,
    subject: `[KYE Application] ${trackLabels[track] || track} — ${full_name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; color: #0E0E0E;">
        <h2 style="color: #2B2218;">New Application Received</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 160px;">Full Name</td>
            <td style="padding: 8px 0;">${full_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Phone</td>
            <td style="padding: 8px 0;">${phone || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Age</td>
            <td style="padding: 8px 0;">${age || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Track</td>
            <td style="padding: 8px 0;"><strong>${trackLabels[track] || track}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Availability</td>
            <td style="padding: 8px 0;">${commitmentLabels[commitment] || commitment}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #E9E6DF; margin: 16px 0;" />
        <h3 style="color: #2B2218;">Additional Info</h3>
        <p style="line-height: 1.7; white-space: pre-wrap;">${message || '—'}</p>
        <hr style="border: 1px solid #E9E6DF; margin: 16px 0;" />
        <p style="font-size: 12px; color: #7A736A;">
          Submitted via kallokye.netlify.app/pages/get-involved.html
        </p>
      </div>
    `,
  });
}


module.exports = { sendContactNotification, sendApplicationNotification };