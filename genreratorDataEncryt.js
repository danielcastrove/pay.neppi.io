const { SodiumPlus, CryptographyKey } = require('sodium-plus');
const { readFileSync } = require("fs");

let sodium;

(async function () {
    if (!sodium) sodium = await SodiumPlus.auto();
    let plaintext = JSON.stringify({id:"ff1ecda1-4eab-4784-bb42-1ac753614dce", amount: "1.00", urlRedirect: encodeURIComponent("https://neppi.io/?dato=true&dato2=2783.00") });

    const LamdabKeys = readFileSync('LamdabKeys', "hex");
    const LamdabDecript = readFileSync('public/DecrytKeys', "hex");
    if (!sodium) sodium = await SodiumPlus.auto();
    const generate = await sodium.sodium_hex2bin( LamdabKeys )
    const generateDecript = await sodium.sodium_hex2bin( LamdabDecript )
    
    let LamdabKeysObjectDecript = new CryptographyKey(generateDecript)
    let LamdabKeysObject = new CryptographyKey(generate)


    let SecretDecript = await sodium.crypto_box_secretkey(LamdabKeysObjectDecript);
    let PublicDecript = await sodium.crypto_box_publickey(LamdabKeysObjectDecript);

    let SecretEncript = await sodium.crypto_box_secretkey(LamdabKeysObject);
    let PublicEncript = await sodium.crypto_box_publickey(LamdabKeysObject);
    
    let nonce = await sodium.randombytes_buf(24);

    let ciphertext = await sodium.crypto_box(plaintext, nonce, SecretEncript, PublicEncript);    

    console.log({encript: ciphertext.toString("base64") , nonce:nonce })

    let decrypted = await sodium.crypto_box_open(ciphertext, nonce, SecretDecript, PublicEncript);
    console.log(decrypted.toString("utf-8"));
      
})();