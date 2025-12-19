## Vercel env vars (Project Settings -> Environment Variables)

Add:
- BACKEND_BASE = https://mauriciomalak.pythonanywhere.com
- BACKEND_PASSWORD = <same as BOT_PASSWORD on backend>

These are used by /api/* proxy functions (server-side), so secrets are not exposed to the browser.
