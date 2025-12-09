import { useState } from "react";
import { generateTronWalletMock } from "../services/walletService";

export default function WalletGenerator(){
  const [addr,setAddr]=useState("");
  const [note,setNote]=useState("");

  const gen=()=>{
    const w=generateTronWalletMock();
    setAddr(w.address);
    setNote("");
  };

  return(
    <div className="card">
      <h1>Генерация кошельков TRON</h1>

      <input className="input" readOnly value={addr} placeholder="Адрес кошелька"/>
      <textarea className="input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Примечание"/>

      <button className="btn-primary" onClick={gen}>
        Сгенерировать кошелёк
      </button>

      {/* TODO:
          - добавить историю сохранений
          - защищенный вывод приватного ключа
      */}
    </div>
  );
}