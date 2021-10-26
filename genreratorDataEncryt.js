const { SodiumPlus, CryptographyKey } = require('sodium-plus');
const { readFileSync } = require("fs");
const { Buffer } = require('buffer');

let sodium;

(async function () {
    if (!sodium) sodium = await SodiumPlus.auto();
    let plaintext = JSON.stringify({id:"ff1ecda1-4eab-4784-bb42-1ac753614dce", amount: "1.00", redirect_uri: encodeURIComponent("https://foodinternationalservices.com/pagina-de-pago/pedido-recibido/5906/?key=wc_order_UcZPess3jMWiu") });

    const LamdabKeys = readFileSync('public/LamdabKeys', "hex");
    //const LamdabDecript = readFileSync('public/DecrytKeys', "hex");
    const eso = Buffer.from("0576d8873469328ef9d4423f8cafc7ccfa8bbdf9ca4daf43ba90df44946cc6fe")

    if (!sodium) sodium = await SodiumPlus.auto();
    const generate = await sodium.sodium_hex2bin( LamdabKeys )
    const generateDecript = await sodium.sodium_hex2bin( eso.toString("hex") )
    
    let LamdabKeysObjectDecript = new CryptographyKey(generateDecript)
    let LamdabKeysObject = new CryptographyKey(generate)


    let SecretDecript = await sodium.crypto_box_secretkey(LamdabKeysObjectDecript);
    let PublicDecript = await sodium.crypto_box_publickey(LamdabKeysObjectDecript);

    let SecretEncript = await sodium.crypto_box_secretkey(LamdabKeysObject);
    let PublicEncript = await sodium.crypto_box_publickey(LamdabKeysObject);
    
    let nonce = await sodium.randombytes_buf(24);

    let ciphertext = await sodium.crypto_box(plaintext, nonce, SecretEncript, PublicEncript);    
    const nonceString = encodeURIComponent(nonce.toString("base64"));
    const info = encodeURIComponent(ciphertext.toString("base64"))
    console.log(nonceString)
    console.log(info)
    console.log({encript: info , nonce: nonceString })



    let decrypted = await sodium.crypto_box_open(Buffer.from(decodeURIComponent(info), 'base64'), Buffer.from(decodeURIComponent(nonceString), 'base64'), SecretDecript, PublicDecript);
    console.log(decrypted.toString("utf-8"));
      
})();