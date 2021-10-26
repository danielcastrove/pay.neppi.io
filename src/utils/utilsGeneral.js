
import { SodiumPlus, CryptographyKey } from 'sodium-plus';
import { readFileSync } from "fs" ;
import { Buffer } from 'buffer';

export function numberFloatFormater( number ){
    return Math.round((parseFloat(number) + Number.EPSILON) * 100) / 100
}

export async function decrypDataNeppi(DataNeppi, nonce) {
    let sodium;
    try {

    const LamdabDecript = Buffer.from("0576d8873469328ef9d4423f8cafc7ccfa8bbdf9ca4daf43ba90df44946cc6fe");
    if (!sodium) sodium = await SodiumPlus.auto();
    const generateDecript = await sodium.sodium_hex2bin( LamdabDecript.toString("hex") )
    let LamdabKeysObjectDecript = new CryptographyKey(generateDecript)
    let SecretDecript = await sodium.crypto_box_secretkey(LamdabKeysObjectDecript);
    let PublicDecript = await sodium.crypto_box_publickey(LamdabKeysObjectDecript);
    let decrypted = await sodium.crypto_box_open(Buffer.from(decodeURIComponent(DataNeppi), 'base64'), Buffer.from(decodeURIComponent(nonce), 'base64'), SecretDecript, PublicDecript);
    console.log(decrypted.toString("utf-8"));
    return {status:"valido", data: JSON.parse(decrypted.toString("utf-8")) }
    } catch (error) {
        console.log(error)
        return {status:"error", data:{}}
    }
}