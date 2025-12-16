import datetime as dt
from functools import wraps
from flask import Flask, request, jsonify

from .settings import BOT_PASSWORD, MASTER_ADDRESS, USDT_CONTRACT
from .db import init_db, list_wallets, get_next_wallet_index, add_wallet
from .wallets import derive_tron_wallet
from .tron_api import usdt_balance
from .watcher import run_once

app = Flask(__name__)
init_db()

def require_password(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        pwd = request.headers.get("X-Admin-Password", "")
        if not BOT_PASSWORD or pwd != BOT_PASSWORD:
            return jsonify({"ok": False, "error": "unauthorized"}), 401
        return fn(*args, **kwargs)
    return wrapper

@app.get("/")
def health():
    return jsonify({
        "ok": True,
        "ts": dt.datetime.utcnow().isoformat(),
        "master": MASTER_ADDRESS,
        "usdt_contract": USDT_CONTRACT
    })

@app.post("/create-wallet")
@require_password
def create_wallet():
    data = request.get_json(silent=True) or {}
    note = (data.get("note") or "").strip()

    from .settings import MNEMONIC
    if not MNEMONIC:
        return jsonify({"ok": False, "error": "MNEMONIC not set on server"}), 500

    idx = get_next_wallet_index()
    w = derive_tron_wallet(MNEMONIC, idx)
    add_wallet(idx=w.index, address=w.address, note=note, created_at=dt.datetime.utcnow().isoformat())

    return jsonify({"ok": True, "idx": w.index, "address": w.address, "note": note})

@app.get("/wallets")
@require_password
def wallets():
    rows = list_wallets()
    out = []
    for r in rows:
        out.append({
            "idx": r["idx"],
            "address": r["address"],
            "note": r["note"] or "",
            "created_at": r["created_at"],
        })
    return jsonify({"ok": True, "count": len(out), "wallets": out})

@app.get("/balances")
@require_password
def balances():
    rows = list_wallets()
    total = 0
    items = []
    for r in rows:
        addr = r["address"]
        try:
            bal = int(usdt_balance(addr))
        except Exception as e:
            items.append({"address": addr, "error": str(e)})
            continue
        total += bal
        items.append({"address": addr, "usdt_int": bal, "usdt": bal/1_000_000})
    return jsonify({"ok": True, "total_usdt": total/1_000_000, "items": items})

@app.post("/run-watcher-once")
@require_password
def run_watcher_once():
    try:
        run_once()
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500
    return jsonify({"ok": True})
