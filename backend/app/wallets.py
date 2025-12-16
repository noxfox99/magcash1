from dataclasses import dataclass
from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes

@dataclass
class DerivedWallet:
    index: int
    address: str
    private_key_hex: str

def derive_tron_wallet(mnemonic: str, index: int) -> DerivedWallet:
    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()
    ctx = Bip44.FromSeed(seed_bytes, Bip44Coins.TRON)
    acct = ctx.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(index)
    return DerivedWallet(
        index=index,
        address=acct.PublicKey().ToAddress(),
        private_key_hex=acct.PrivateKey().Raw().ToHex(),
    )
