import os
import sqlite3
from typing import List, Optional
from .settings import DB_PATH

def connect():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = connect()
    cur = conn.cursor()

    cur.execute("""CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idx INTEGER NOT NULL UNIQUE,
        address TEXT NOT NULL UNIQUE,
        note TEXT,
        created_at TEXT NOT NULL
    )""")

    cur.execute("""CREATE TABLE IF NOT EXISTS deposits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL,
        txid TEXT NOT NULL UNIQUE,
        amount INTEGER NOT NULL,
        ts TEXT,
        raw_json TEXT
    )""")

    cur.execute("""CREATE TABLE IF NOT EXISTS sweeps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_address TEXT NOT NULL,
        to_address TEXT NOT NULL,
        amount INTEGER NOT NULL,
        deposit_txid TEXT NOT NULL,
        sweep_txid TEXT,
        status TEXT NOT NULL,
        error TEXT,
        ts TEXT NOT NULL
    )""")

    conn.commit()
    conn.close()

def list_wallets() -> List[sqlite3.Row]:
    conn = connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM wallets ORDER BY idx DESC")
    rows = cur.fetchall()
    conn.close()
    return rows

def get_next_wallet_index() -> int:
    conn = connect()
    cur = conn.cursor()
    cur.execute("SELECT MAX(idx) AS m FROM wallets")
    row = cur.fetchone()
    conn.close()
    return 0 if row["m"] is None else int(row["m"]) + 1

def add_wallet(idx: int, address: str, note: str, created_at: str):
    conn = connect()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO wallets(idx,address,note,created_at) VALUES(?,?,?,?)",
        (idx, address, note, created_at),
    )
    conn.commit()
    conn.close()

def deposit_exists(txid: str) -> bool:
    conn = connect()
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM deposits WHERE txid=? LIMIT 1", (txid,))
    row = cur.fetchone()
    conn.close()
    return row is not None

def add_deposit(address: str, txid: str, amount: int, ts: str, raw_json: str):
    conn = connect()
    cur = conn.cursor()
    cur.execute(
        "INSERT OR IGNORE INTO deposits(address,txid,amount,ts,raw_json) VALUES(?,?,?,?,?)",
        (address, txid, amount, ts, raw_json),
    )
    conn.commit()
    conn.close()

def add_sweep(from_addr: str, to_addr: str, amount: int, deposit_txid: str,
              sweep_txid: str | None, status: str, error: str | None, ts: str):
    conn = connect()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO sweeps(from_address,to_address,amount,deposit_txid,sweep_txid,status,error,ts)
           VALUES(?,?,?,?,?,?,?,?)""",
        (from_addr, to_addr, amount, deposit_txid, sweep_txid, status, error, ts),
    )
    conn.commit()
    conn.close()
