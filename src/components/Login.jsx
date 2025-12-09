import { useState } from "react";
import { AUTH_CONFIG } from "../services/authConfig";

export default function Login({onLoginSuccess}){
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [err,setErr]=useState("");

  const submit=e=>{
    e.preventDefault();
    if(u===AUTH_CONFIG.USERNAME && p===AUTH_CONFIG.PASSWORD){
      onLoginSuccess();
    } else setErr("Неверный логин или пароль");
  };

  return(
    <form className="card" onSubmit={submit}>
      <h1>Вход</h1>
      <input className="input" placeholder="Логин" value={u} onChange={e=>setU(e.target.value)}/>
      <input className="input" type="password" placeholder="Пароль" value={p} onChange={e=>setP(e.target.value)}/>
      {err && <div className="alert-error">{err}</div>}
      <button className="btn-primary">Войти</button>
    </form>
  )
}