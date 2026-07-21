## Environment Variables (backend/.env — never commit)

| Variable | Where |
|---|---|
| DATABASE_URL | Supabase → Settings → Database → URI |
| FRONTEND_URL | https://kalloskye.netlify.app |
| SMTP_HOST | smtp.gmail.com |
| SMTP_PORT | 587 |
| SMTP_USER | your Gmail |
| SMTP_PASS | Gmail App Password |
| NOTIFY_EMAIL | email to receive notifications |
| EMAIL_FROM | display name + email |

## Deployment

| Service | Platform | Repo path |
|---|---|---|
| Frontend | Netlify | kallos/ (root) |
| Backend | Render | kallos/backend/ |
| Database | Supabase | hosted |
| Email | Gmail SMTP | via Nodemailer |

## Local Development

| Service | Command | Port |
|---|---|---|
| Frontend | `npx serve . -p 8080` | 8080 |
| Backend | `node src/server.js` | 3000 |
| forms.js API_BASE (local) | `http://localhost:3000` | — |
| forms.js API_BASE (production) | `https://kallos-nwhk.onrender.com` | — |
