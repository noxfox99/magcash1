import { useEffect, useMemo, useState } from "react";
import { createWallet, fetchWallets, fetchBalances } from "../services/walletService";

export default function WalletGenerator() {
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [wallets, setWallets] = useState([]);
  const [balances, setBalances] = useState({ total_usdt: 0, items: [] });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const history = wallets;

  const balanceMap = useMemo(() => {
    const m = new Map();
    for (const it of balances.items || []) {
      if (it.address) m.set(it.address, it);
    }
    return m;
  }, [balances]);

  async function refreshAll() {
    setError("");
    setLoading(true);
    try {
      const w = await fetchWallets();
      setWallets(w.wallets || []);
      const b = await fetchBalances();
      setBalances(b);
    } catch (e) {
      setError(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshAll(); }, []);

  async function onGenerate() {
    setError("");
    setLoading(true);
    try {
      const res = await createWallet(note);
      setAddress(res.address || "");
      setNote("");
      await refreshAll();
    } catch (e) {
      setError(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Генерация кошельков TRON</h2>

      <input
        className="input"
        readOnly
        value={address}
        placeholder="Адрес кошелька"
      />

      <textarea
        className="input"
        value={note}
        placeholder="Примечание"
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <div className="alert-error">{error}</div>}

      <button className="btn-primary" onClick={onGenerate} disabled={loading}>
        {loading ? "..." : "Сгенерировать кошелек"}
      </button>

      <button className="btn-ghost" onClick={refreshAll} disabled={loading}>
        Обновить историю/балансы
      </button>

      {/* История */}
      {history.length > 0 && (
        <div className="history">
          <div className="history-title">История кошельков</div>
          <ul className="history-list">
            {history.map((w) => {
              const b = balanceMap.get(w.address);
              const balText = b?.usdt !== undefined ? `${b.usdt} USDT` : (b?.error ? `Ошибка: ${b.error}` : "");
              return (
                <li key={w.address} className="history-item">
                  <div className="history-address">{w.address}</div>
                  {w.note ? <div className="history-note">Заметка: {w.note}</div> : null}
                  {w.created_at ? <div className="history-date">{new Date(w.created_at).toLocaleString()}</div> : null}
                  {balText ? <div className="history-note">Баланс: {balText}</div> : null}
                </li>
              );
            })}
          </ul>

          <div className="history-title" style={{ marginTop: 10 }}>
            Итого: {balances.total_usdt ?? 0} USDT
          </div>
        </div>
      )}
    </div>
  );
}
