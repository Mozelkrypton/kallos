/* ============================================================
   src/db/migrate.js
   KYE Backend — creates tables in Supabase if they don't exist.
   Run once: node src/db/migrate.js
   ============================================================ */

'use strict';

require('dotenv').config();
const pool = require('./pool');

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('[Migrate] Running migrations...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(200)  NOT NULL,
        email         VARCHAR(320)  NOT NULL,
        reason        VARCHAR(100)  NOT NULL DEFAULT 'general',
        message       TEXT          NOT NULL,
        ip_address    VARCHAR(45),
        submitted_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id            SERIAL PRIMARY KEY,
        full_name     VARCHAR(200)  NOT NULL,
        email         VARCHAR(320)  NOT NULL,
        phone         VARCHAR(30),
        age           SMALLINT,
        track         VARCHAR(50)   NOT NULL,
        commitment    VARCHAR(50)   NOT NULL DEFAULT 'few-hours',
        message       TEXT,
        status        VARCHAR(30)   NOT NULL DEFAULT 'pending',
        ip_address    VARCHAR(45),
        submitted_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);

    console.log('[Migrate] ✓ contact_submissions table ready');
    console.log('[Migrate] ✓ applications table ready');
    console.log('[Migrate] All migrations complete.');
  } catch (err) {
    console.error('[Migrate] Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();