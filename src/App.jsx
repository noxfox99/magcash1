import { useEffect, useState } from "react";
import Login from "./components/Login";
import WalletGenerator from "./components/WalletGenerator";

const STORAGE_KEY = "tron_is_auth";

export default function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setAuth(true);
    }
  }, []);

  const onLogin = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setAuth(true);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(false);
  };

  return (
    <div className="app-root">
      {auth ? (
        <>
          {/* Хедер только с кнопкой "Выйти" справа */}
          <header className="panel-header">
            <button onClick={logout} className="btn-ghost">
              Выйти
            </button>
          </header>

          <WalletGenerator />
        </>
      ) : (
        <Login onLoginSuccess={onLogin} />
      )}
    </div>
  );
}
