# KYE Backend — Deployment Guide

## Stack
- Node.js / Express on Railway
- PostgreSQL on Supabase
- Nodemailer (Gmail SMTP)

---

## 1. Supabase Setup

1. Go to https://supabase.com → New Project
2. Note your **Project URL** and **Database Password**
3. Go to **Settings → Database → Connection String (URI)**
4. Copy the URI — this is your `DATABASE_URL`

---

## 2. Run Migrations

```bash
# In the backend folder
cp .env.example .env
# Fill in your .env values

npm install
node src/db/migrate.js
```

This creates two tables in Supabase:
- `contact_submissions`
- `applications`

---

## 3. Gmail App Password

1. Enable 2FA on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Create a password for "Mail"
4. Use that as `SMTP_PASS` in your `.env`

---

## 4. Deploy to Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Point to the `backend/` folder (or push it as its own repo)
3. Add environment variables from your `.env` under Railway → Variables:

```
PORT               (Railway sets this automatically)
NODE_ENV           production
DATABASE_URL       postgresql://...
FRONTEND_URL       https://kallokye.netlify.app
SMTP_HOST          smtp.gmail.com
SMTP_PORT          587
SMTP_USER          your-gmail@gmail.com
SMTP_PASS          your-app-password
NOTIFY_EMAIL       hello@kallosye.org
EMAIL_FROM         Kallos Youth Empowerment <your-gmail@gmail.com>
```

4. Railway will auto-detect Node.js and run `npm start`
5. Copy your Railway public URL (e.g. `https://kye-backend.up.railway.app`)

---

## 5. Update Frontend

In `js/forms.js`, update:

```js
const API_BASE = 'https://kye-backend.up.railway.app';
```

Then redeploy to Netlify.

---

## 6. Test

```bash
# Health check
curl https://kye-backend.up.railway.app/health

# Test contact form
curl -X POST https://kye-backend.up.railway.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","reason":"general","message":"Hello from curl"}'
```

---

## Endpoints

| Method | Path           | Description              |
|--------|----------------|--------------------------|
| GET    | /health        | Health check             |
| POST   | /api/contact   | Contact form submission  |
| POST   | /api/apply     | Get Involved application |

---

## Add forms.js to HTML pages

In `pages/contact.html` — before `</body>`:
```html
<script src="../js/forms.js"></script>
```

In `pages/get-involved.html` — before `</body>`:
```html
<script src="../js/forms.js"></script>
```
