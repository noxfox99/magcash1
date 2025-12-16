import requests
from tronpy import Tron
from tronpy.keys import PrivateKey
from .settings import TRONGRID_BASE, TRONGRID_API_KEY, USDT_CONTRACT

def _headers():
    h = {}
    if TRONGRID_API_KEY:
        h["TRON-PRO-API-KEY"] = TRONGRID_API_KEY
    return h

def get_trc20_txs(address: str, limit: int = 50):
    url = f"{TRONGRID_BASE}/v1/accounts/{address}/transactions/trc20"
    params = {"only_confirmed": "false", "limit": str(limit), "contract_address": USDT_CONTRACT}
    r = requests.get(url, headers=_headers(), params=params, timeout=20)
    r.raise_for_status()
    return r.json().get("data", [])

def parse_incoming_usdt(txs, target_address: str):
    incoming = []
    for tx in txs:
        if tx.get("to") != target_address:
            continue
        txid = tx.get("transaction_id") or tx.get("txID") or tx.get("id")
        raw_val = tx.get("value")
        if not txid or raw_val is None:
            continue
        try:
            amount_int = int(raw_val)
        except Exception:
            continue
        ts = tx.get("block_timestamp")
        incoming.append({"txid": txid, "amount": amount_int, "ts": str(ts or ""), "raw": tx})
    return incoming

def tron_client():
    return Tron()

def usdt_balance(address: str) -> int:
    c = tron_client().get_contract(USDT_CONTRACT)
    return int(c.functions.balanceOf(address))

def send_usdt(from_priv_hex: str, from_addr: str, to_addr: str, amount_int: int) -> str:
    client = tron_client()
    contract = client.get_contract(USDT_CONTRACT)
    pk = PrivateKey(bytes.fromhex(from_priv_hex))
    txn = (
        contract.functions.transfer(to_addr, amount_int)
        .with_owner(from_addr)
        .fee_limit(30_000_000)
        .build()
        .sign(pk)
    )
    res = txn.broadcast()
    txid = res.get("txid") or res.get("transaction", {}).get("txID")
    if not txid:
        raise RuntimeError(f"Broadcast failed: {res}")
    return txid
