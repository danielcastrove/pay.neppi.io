import axios from 'axios';
import {numberFloatFormater} from '../../utils/utilsGeneral'
import {grabarTablaRedirecciones} from "../GeneralesVariosMetodos"
const {REACT_APP_SERVER_BACKEND, REACT_APP_MY_DOMINIO} = process.env 

export async function genetareConcentID(tokenComercio, amount, infoComercio, userID, jwtCIBC, jwtStrapi, dataencriptada, nonce, uriwordpress, productoID, proveedorID, id_sucursal, id_terminal ) {

    if(!tokenComercio || !infoComercio?.account_number || !infoComercio?.bank_sheme || !infoComercio?.name_titular_bank || !jwtCIBC || !jwtStrapi|| !dataencriptada || !nonce || !uriwordpress || !productoID || !userID || !id_terminal || !id_sucursal || !proveedorID ) {
        return { estatus: false, url: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }

    const data2 = JSON.stringify({
        "amount": numberFloatFormater(amount), 
        "infoComercio": infoComercio, 
        "jwtCIBC": jwtCIBC
        });

        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+'/bnpls/CIBC/generateConcentID',
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        data : data2
        };
        try {

            const response = await axios(config)

            if(response.data?.status == "Success" && response.data?.dataEnvio?.Data?.ConsentId) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                const DatosGuardarTabla = {
                    monto: numberFloatFormater(amount),
                    producto: productoID,
                    banco: proveedorID,
                    utilizada: false,
                    generalData: JSON.stringify(response.data?.dataEnvio),
                    url_rediceccion_comercio: uriwordpress,
                    data_original_encriptada: JSON.stringify(dataencriptada),
                    usuario: userID,
                    id_comercio: infoComercio?.id,
                    id_sucursal: id_sucursal,
                    id_terminal: id_terminal
                }
                const datosGuardadoRespuesta = await grabarTablaRedirecciones( DatosGuardarTabla, jwtStrapi, tokenComercio )
                if(datosGuardadoRespuesta.estatus){
                    const urlmyredirect = REACT_APP_MY_DOMINIO+`/redirect?dataredirect=${datosGuardadoRespuesta.redirect}`
                    /*const urlRedirect = `https://api.cibc.useinfinite.io/authorize?client_id=G8ObsizNsxH4BDbH5xdezSUgCH6y1sOczf-D4rfYJco=&response_type=code id_token&scope=openid payments&redirect_uri=${urlmyredirect}&state=ABC&request=${response.data?.dataEnvio?.Data?.ConsentId}`;*/
                    const urlRedirect2 = `https://api.cibc.useinfinite.io/authorize?client_id=G8ObsizNsxH4BDbH5xdezSUgCH6y1sOczf-D4rfYJco=&response_type=code id_token&scope=openid payments&redirect_uri=${urlmyredirect}&state=ABC&request=${response.data.dataEnvio.Data.ConsentId}`
    
                    return { estatus: true, url: urlRedirect2 , mensaje: "consulta satisfactoria hacia https://api.cibc.useinfinite.io/open-banking/v3.1/pisp/bnpl-payment-consents"}
                }
                return { estatus: false, url: "" , mensaje: "Error al guardar en la tabla de redirecciones."}
            }
            return { estatus: false, url: "" , mensaje: "Error en la respuesta de strapi. Data incompleta"}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, url: "" , mensaje: "error al generar la consulta http hacia https://api.cibc.useinfinite.io/open-banking/v3.1/pisp/bnpl-payment-consents"}
    
        }

}

export async function generateJWTCIBC( jwtStrapi ) {

    if(!jwtStrapi) {
        return { estatus: false, access_token: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }

        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+'/auth/getJWTCIBC',
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        }
        };
        try {

            const response = await axios(config)

            if(response.data?.status == "Success" && response.data?.access_token) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                return { estatus: true, access_token: response.data?.access_token}
            }
            return { estatus: false, access_token: "" , mensaje: "Error en la respuesta de strapi. Data incompleta"}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, access_token: "" , mensaje: "error al generar la consulta http hacia "+ REACT_APP_SERVER_BACKEND +'/auth/getJWTCIBC'}
    
        }

}

export async function confirmationoOperation( idoperation, idconcentimiento, jwtStrapi, urlenvio) {

    if(!idoperation || !idconcentimiento || !jwtStrapi || !urlenvio) {
        return { estatus: false, estado_operacion: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }
        const data2 = JSON.stringify({
            idoperation, 
            idconcentimiento,
            urlenvio 
        });
        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+'/bnpls/CIBC/confirmacionOperation',
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        data: data2
        };
        try {

            const response = await axios(config)

            if(response.data?.status == "Success" && response.data) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                return { estatus: true, estado_operacion: response.data}
            }
            if(response.data?.dataError){
                return { estatus: false, estado_operacion: "" , mensaje: "Error en la respuesta de strapi: " + response.data?.dataError}
            } else {
                return { estatus: false, estado_operacion: "" , mensaje: "Error en la respuesta de strapi: " + response.data?.mensaje }
            }
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, estado_operacion: "" , mensaje: "error al generar la consulta http hacia "+ REACT_APP_SERVER_BACKEND +'/bnpls/CIBC/confirmacionOperation'}
    
        }

}
export async function confirmationFinalOperation(pais, producto_id, fecha_realizacion_operacion, id_comercio, id_sucursal, id_terminal, userComprador, monto, proveedor, access_token_CIBC, referenceUrl, jwtStrapi) {

    if(!access_token_CIBC || !referenceUrl || !jwtStrapi || !proveedor || !monto ||  !userComprador || !id_terminal || !id_comercio || !id_sucursal || !fecha_realizacion_operacion || !producto_id || !pais) {
        return { estatus: false, estado_operacion: "", mensaje:"datos faltantes para poder realizar la funcion de confirmacion de estado"}
    }

        const data = JSON.stringify({
            access_token_CIBC, 
            referenceUrl,
            proveedor,
            monto,
            userComprador,
            id_terminal,
            id_comercio,
            id_sucursal,
            fecha_realizacion_operacion,
            producto_id,
            pais
        });
        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+'/bnpls/CIBC/verificarEstado',
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        data: data
        };
        try {

            const response = await axios(config)

            if(response.data?.status == "Success" && response.data) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                return { estatus: true, data: response.data?.dataEnvio}
            }
            if(response.data?.dataError){
                return { estatus: false, estado_operacion: "" , mensaje: "Error en la respuesta de strapi: " + response.data?.dataError}
            } else {
                return { estatus: false, estado_operacion: "" , mensaje: "Error en la respuesta de strapi: " + response.data?.mensaje }
            }
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, estado_operacion: "" , mensaje: "error al generar la consulta http hacia "+ REACT_APP_SERVER_BACKEND +'/bnpls/CIBC/verificarEstado'}
    
        }

}