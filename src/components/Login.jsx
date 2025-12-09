import { useState } from "react";
import { AUTH_CONFIG } from "../services/authConfig";

export default function Login({ onLoginSuccess }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (user === AUTH_CONFIG.USERNAME && pass === AUTH_CONFIG.PASSWORD) {
      onLoginSuccess();
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      {/* Заголовок "Вход" убран по твоему запросу */}

      <input
        className="input"
        placeholder="Логин"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />

      <input
        className="input"
        placeholder="Пароль"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />

      {error && <div className="alert-error">{error}</div>}

      <button className="btn-primary">Войти</button>
    </form>
  );
}
