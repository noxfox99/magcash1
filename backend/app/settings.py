import os

BOT_PASSWORD = os.environ.get("BOT_PASSWORD","")
DB_PATH = os.environ.get("DB_PATH","/home/mauriciomalak/mysite/data/app.sqlite3")

MASTER_ADDRESS = os.environ.get("MASTER_ADDRESS","")
MNEMONIC = os.environ.get("MNEMONIC","")

TRONGRID_BASE = os.environ.get("TRONGRID_BASE","https://api.trongrid.io")
TRONGRID_API_KEY = os.environ.get("TRONGRID_API_KEY","")
USDT_CONTRACT = os.environ.get("USDT_CONTRACT","TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")

USDT_DECIMALS = 6
