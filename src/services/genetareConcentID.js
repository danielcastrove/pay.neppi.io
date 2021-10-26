import axios from 'axios';
import {numberFloatFormater} from '../utils/utilsGeneral'
export default async function genetareConcentID(amount, infoComercio, jwtCIBC, jwtStrapi, dataencriptada, nonce, uriwordpress ) {
    console.log(dataencriptada, " mamalo " ,nonce)
    if(!infoComercio?.account_number || !infoComercio?.bank_sheme || !infoComercio?.name_titular_bank || !jwtCIBC || !jwtStrapi|| !dataencriptada || !nonce || !uriwordpress ) {
        return { estatus: false, url: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }

    const data2 = JSON.stringify({
        "amount": numberFloatFormater(amount), 
        "infoComercio": infoComercio, 
        "jwtCIBC": jwtCIBC
        });

        const config = {
        method: 'post',
        url: 'http://mystrapi.mooo.com:1337/comercios/generateConcentID',
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        data : data2
        };
        try {
            console.log(config)
            const response = await axios(config)
            console.log(response)
            if(response.data?.status == "Success" && response.data?.dataEnvio?.Data?.ConsentId) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${uriwordpress}`

                const urlRedirect = `https://api.cibc.useinfinite.io/authorize?client_id=G8ObsizNsxH4BDbH5xdezSUgCH6y1sOczf-D4rfYJco=&response_type=code id_token&scope=openid payments&redirect_uri=${urlmyredirect}&state=ABC&request=${response.data?.dataEnvio?.Data?.ConsentId}`;
                const urlRedirect2 = `https://api.cibc.useinfinite.io/authorize?client_id=G8ObsizNsxH4BDbH5xdezSUgCH6y1sOczf-D4rfYJco=&response_type=code id_token&scope=openid payments&redirect_uri=${urlmyredirect}&state=ABC&request=${response.data?.dataEnvio?.Data?.ConsentId}`
                return { estatus: true, url: urlRedirect2 , mensaje: "consulta satisfactoria hacia https://api.cibc.useinfinite.io/open-banking/v3.1/pisp/bnpl-payment-consents"}
            }
            return { estatus: false, url: "" , mensaje: "Error en la respuesta de strapi. DAta incompleta"}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, url: "" , mensaje: "error al generar la consulta http hacia https://api.cibc.useinfinite.io/open-banking/v3.1/pisp/bnpl-payment-consents"}
    
        }

}