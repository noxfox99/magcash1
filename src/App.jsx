import { useEffect, useState } from "react";
import Login from "./components/Login";
import WalletGenerator from "./components/WalletGenerator";

const STORAGE_KEY = "tron_panel_is_authenticated";

export default function App(){
  const [isAuthenticated,setAuth]=useState(false);

  useEffect(()=>{
    if(localStorage.getItem(STORAGE_KEY)==="true") setAuth(true);
  },[]);

  const login=()=>{
    localStorage.setItem(STORAGE_KEY,"true");
    setAuth(true);
  };

  const logout=()=>{
    localStorage.removeItem(STORAGE_KEY);
    setAuth(false);
  };

  return(
    <div className="app-root">
      {isAuthenticated ? (
        <>
          <header className="panel-header">
            <span>TRON Wallet Panel</span>
            <button className="btn-ghost" onClick={logout}>Выйти</button>
          </header>
          <WalletGenerator/>
        </>
      ) : <Login onLoginSuccess={login}/>}
    </div>
  );
}