/* ============================================================
   src/server.js
   KYE Backend — Express entry point
   ============================================================ */

'use strict';

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const contactRoute = require('./routes/contact');
const applyRoute   = require('./routes/apply');

const app  = express();
const PORT = process.env.PORT || 3000;


/* ── CORS ─────────────────────────────────────────────────── */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods:     ['POST', 'OPTIONS'],
  credentials: false,
}));


/* ── Body Parsing ─────────────────────────────────────────── */

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));


/* ── Trust Proxy (Railway sets X-Forwarded-For) ───────────── */

app.set('trust proxy', 1);


/* ── Health Check ─────────────────────────────────────────── */

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'kye-backend' });
});


/* ── Routes ───────────────────────────────────────────────── */

app.use('/api/contact', contactRoute);
app.use('/api/apply',   applyRoute);


/* ── 404 ──────────────────────────────────────────────────── */

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});


/* ── Global Error Handler ─────────────────────────────────── */

app.use((err, _req, res, _next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});


/* ── Start ────────────────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`[KYE Backend] Running on port ${PORT}`);
  console.log(`[KYE Backend] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[KYE Backend] Frontend: ${process.env.FRONTEND_URL}`);
});
