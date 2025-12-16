# Backend (Flask) for TRON USDT TRC20 deposits

Endpoints (all admin-protected via X-Admin-Password header):
- GET  /            health
- POST /create-wallet   {note?:string} -> creates next HD address
- GET  /wallets         list all issued addresses
- GET  /balances        USDT balances per address + total
- POST /run-watcher-once scans deposits + sweeps to MASTER_ADDRESS

PythonAnywhere:
- Put this folder somewhere (e.g. /home/<user>/backend)
- In WSGI, set env vars BEFORE importing flask_app, then:
    from app.flask_app import app as application
