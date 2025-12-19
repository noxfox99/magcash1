export async function proxy(req, res, path) {
  const BASE = process.env.BACKEND_BASE;        // e.g. https://mauriciomalak.pythonanywhere.com
  const PASS = process.env.BACKEND_PASSWORD;   // same as BOT_PASSWORD on backend

  if (!BASE || !PASS) {
    return res.status(500).json({ ok: false, error: "Backend env is not set" });
  }

  const url = `${BASE}${path}`;
  const method = req.method || "GET";

  const headers = {
    "Content-Type": "application/json",
    "X-Admin-Password": PASS,
  };

  let body;
  if (method !== "GET" && method !== "HEAD") {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
  }

  const r = await fetch(url, { method, headers, body });
  const text = await r.text();

  let data;
  try { data = JSON.parse(text); } catch { data = { ok: false, raw: text }; }

  return res.status(r.status).json(data);
}
