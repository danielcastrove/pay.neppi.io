import axios from 'axios';
import {numberFloatFormater} from '../utils/utilsGeneral'
const {REACT_APP_SERVER_BACKEND, REACT_APP_MY_DOMINIO} = process.env 

export async function GetSelectContent(jwt) {

    if(!jwt) {
        return { estatus: false, data: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }

   /* const data2 = JSON.stringify({
        "amount": numberFloatFormater(amount), 
        "infoComercio": infoComercio, 
        "jwtCIBC": jwtCIBC
        });*/

        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+'/bancos/getBancosForCountry',
        headers: { 
            'Authorization': 'Bearer '+ jwt, 
            'Content-Type': 'application/json'
        },
        };
        try {

            const response = await axios(config)

            if(response.data?.status && response.data?.dataEnvio) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                return { estatus: true, data: response.data?.dataEnvio , mensaje: "Datas de proveedores recuparados satisfactoriamente"}
            }
            return { estatus: false, data: "" , mensaje: "Errorde proveedores en la respuesta de strapi. Data incompleta"}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, data: "" , mensaje: "error al generar la consulta http hacia " + REACT_APP_SERVER_BACKEND+'/bancos/getBancosForCountry'}
    
        }

}