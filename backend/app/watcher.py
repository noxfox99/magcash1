import os
import json
import datetime as dt

from .settings import MASTER_ADDRESS, MNEMONIC
from .db import init_db, list_wallets, deposit_exists, add_deposit, add_sweep
from .wallets import derive_tron_wallet
from .tron_api import get_trc20_txs, parse_incoming_usdt, send_usdt

def run_once():
    init_db()
    if not MASTER_ADDRESS:
        raise RuntimeError("Missing MASTER_ADDRESS")
    if not MNEMONIC:
        raise RuntimeError("Missing MNEMONIC (seed phrase)")

    rows = list_wallets()
    for r in rows:
        address = r["address"]
        idx = int(r["idx"])

        txs = get_trc20_txs(address, limit=50)
        incoming = parse_incoming_usdt(txs, target_address=address)

        for item in incoming:
            txid = item["txid"]
            if deposit_exists(txid):
                continue

            amount = int(item["amount"])
            ts = item.get("ts", "")
            raw = json.dumps(item["raw"], ensure_ascii=False)

            add_deposit(address=address, txid=txid, amount=amount, ts=ts, raw_json=raw)

            w = derive_tron_wallet(MNEMONIC, idx)
            now = dt.datetime.utcnow().isoformat()
            try:
                sweep_txid = send_usdt(w.private_key_hex, w.address, MASTER_ADDRESS, amount)
                add_sweep(w.address, MASTER_ADDRESS, amount, txid, sweep_txid, "sent", None, now)
            except Exception as e:
                add_sweep(w.address, MASTER_ADDRESS, amount, txid, None, "error", str(e), now)
