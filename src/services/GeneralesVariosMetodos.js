import axios from 'axios';
import {numberFloatFormater} from '../utils/utilsGeneral'
const {REACT_APP_SERVER_BACKEND, REACT_APP_MY_DOMINIO} = process.env 

export async function grabarTablaRedirecciones(datos, jwtStrapi, tokenComercio) {

    if(!datos ||  !jwtStrapi || !tokenComercio) {
        return { estatus: false, url: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }

    const data2 = JSON.stringify({
            ...datos
        });

        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+'/redireccion-de-ordenes',
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        data : data2
        };
        try {

            const response = await axios(config)

            if(response?.data?.id && response?.status == 200) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                const DatosJson = JSON.stringify({idredirect: response?.data?.id, producto: response?.data?.producto?.Codigo_de_producto, tokenComercio})
                const base64 = Buffer.from(DatosJson);
                const base64data = base64.toString('base64');
                const DataFinal = encodeURIComponent(base64data)
                return { estatus: true, redirect:DataFinal , mensaje: "Respueta de datos satisfactoria"}
            }
            return { estatus: false, redirect:"" , mensaje: "Error en la respuesta de strapi. "+response?.statusText}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, redirect:"" , mensaje: "error al generar la consulta http hacia " + REACT_APP_SERVER_BACKEND+'/redireccion-de-ordenes'}
    
        }

}
export async function ExtraerRedirectUrl(location) {

    if(!location ) {
        return { estatus: false, datos: {}, mensaje:"datos fastante, no se haya una url para analizar"}
    }
    try {
    let get_params = new URLSearchParams(location.search);

       //segun el caso cambiamos las variables de los estaos

       if(get_params.has("dataredirect") ) {
            const bufferdata =  Buffer.from(get_params.get("dataredirect"),"base64")
            const JsonString =  bufferdata.toString("utf8")
            const datoFinal = await JSON.parse(JsonString)
            return { estatus: true, datos: datoFinal,  mensaje:"Datos extraidos satisfactoriamente"}

        } else {
            return { estatus: false, datos: {}, mensaje:"datos fastante, no se haya el dato dataredirect"}
        }
    } catch (error) {
            console.log(error)
            return { estatus: false, datos:"" , mensaje: "Error al parsear el json encriptado en la url" }
    
    }
}