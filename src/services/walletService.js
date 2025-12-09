function randomHex(len){
  const c = "0123456789abcdef";
  let r="";
  for(let i=0;i<len;i++) r+=c[Math.floor(Math.random()*c.length)];
  return r;
}

export function generateTronWalletMock(){
  return {
    address: "T"+randomHex(33),
    privateKey: randomHex(64),
    createdAt: new Date().toISOString()
  };
}

// TODO: заменить на реальный tronweb генератор.
