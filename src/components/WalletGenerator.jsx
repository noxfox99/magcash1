import { useState } from "react";
import { generateTronWalletMock } from "../services/walletService";

export default function WalletGenerator() {
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  // История кошельков в текущей сессии
  const [history, setHistory] = useState([]);

  const generate = () => {
    const w = generateTronWalletMock();
    setAddress(w.address);

    // Добавляем в историю текущий адрес + примечание
    setHistory((prev) => [
      {
        address: w.address,
        note,
        createdAt: w.createdAt,
      },
      ...prev,
    ]);

    setNote("");
  };

  return (
    <div className="card">
      {/* Современный заголовок в одну строку */}
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

      <button className="btn-primary" onClick={generate}>
        Сгенерировать кошелек
      </button>

      {/* Блок "История кошельков" */}
      {history.length > 0 && (
        <div className="history">
          <div className="history-title">История кошельков</div>
          <ul className="history-list">
            {history.map((item, index) => (
              <li key={index} className="history-item">
                <div className="history-address">{item.address}</div>
                {item.note && (
                  <div className="history-note">Заметка: {item.note}</div>
                )}
                <div className="history-date">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TODO:
        - Сохранение истории в localStorage
        - Показ приватного ключа в отдельном модальном окне
      */}
    </div>
  );
}
