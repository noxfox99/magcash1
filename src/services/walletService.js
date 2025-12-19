async function parseJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { ok: false, raw: text }; }
}

export async function createWallet(note = "") {
  const res = await fetch("/api/create-wallet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  const data = await parseJson(res);
  if (!res.ok || data.ok === false) throw new Error(data.error || "Create wallet failed");
  return data;
}

export async function fetchWallets() {
  const res = await fetch("/api/wallets");
  const data = await parseJson(res);
  if (!res.ok || data.ok === false) throw new Error(data.error || "Fetch wallets failed");
  return data;
}

export async function fetchBalances() {
  const res = await fetch("/api/balances");
  const data = await parseJson(res);
  if (!res.ok || data.ok === false) throw new Error(data.error || "Fetch balances failed");
  return data;
}

export async function runWatcherOnce() {
  const res = await fetch("/api/run-watcher-once", { method: "POST" });
  const data = await parseJson(res);
  if (!res.ok || data.ok === false) throw new Error(data.error || "Watcher failed");
  return data;
}
