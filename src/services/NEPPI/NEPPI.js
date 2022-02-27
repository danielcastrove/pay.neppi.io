import axios from 'axios';
const {REACT_APP_SERVER_BACKEND, REACT_APP_MY_DOMINIO} = process.env 

export async function GetCuotasSelect( jwtStrapi, productoID ) {

    if( !jwtStrapi || !productoID ) {
        return { estatus: false, url: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }
        const config = {
        method: 'get',
        url: REACT_APP_SERVER_BACKEND+`/cuotas-de-pagos?producto=${productoID}`,
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        };
        try {

            const response = await axios(config)
            console.log(response)
            if(response.status == 200 && response.data.length > 0) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`

                return { estatus: true, ArrayData: response.data , mensaje: "Solicitud satisfactoria"}
            }
            return { estatus: false, ArrayData: [] , mensaje: "Error en la respuesta de strapi. Data incompleta"}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, ArrayData: [] , mensaje: "error al generar la consulta http hacia " + REACT_APP_SERVER_BACKEND+`/cuotas-de-pagos?producto=${productoID}`}
    
        }

}

export async function ProcesarCuotas( jwtStrapi, cuotaObject, montoPrestamo ) {

    if( !jwtStrapi || !cuotaObject || !montoPrestamo ) {
        return { estatus: false, url: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }
        const data2 = JSON.stringify({
            cuotaObject,
            montoPrestamo
        });

        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+`/cuotas-de-pagos/calcular-cuotas-neppi-bnpl`,
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        data: data2
        };
        try {

            const response = await axios(config)
            console.log(response)
            if(response.status == 200 && response.data.length > 0) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`

                return { estatus: true, ArrayData: response.data , mensaje: "Solicitud satisfactoria"}
            }
            return { estatus: false, ArrayData: [] , mensaje: "Error en la respuesta de strapi. Data incompleta"}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, ArrayData: [] , mensaje: "error al generar la consulta http hacia " + REACT_APP_SERVER_BACKEND+`/cuotas-de-pagos?producto=${cuotaObject}`}
    
        }

}

export async function SaveNeppiBNPL( jwtStrapi, infoComercio, monto, cuotas_de_pago, userInfo, productoid, proveedorid, id_sucursal, id_terminal ) {
    console.log( !jwtStrapi , !infoComercio?.pais?.id , !monto , cuotas_de_pago.length < 1 , !userInfo?.id , !productoid , !proveedorid , !id_sucursal , !id_terminal , !infoComercio?.id)
    if( !jwtStrapi || !infoComercio?.pais?.id || !monto || cuotas_de_pago.length < 1 || !userInfo?.id || !productoid || !proveedorid || !id_sucursal || !id_terminal || !infoComercio?.id) {
        return { estatus: false, data: {}, mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }
        const data2 = JSON.stringify({
              adquiriente_bnpl_id: proveedorid,
              monto_compra_real: monto,
              cuotas_de_pago, 
              user_comprador_id: userInfo?.id, 
              id_terminal, 
              id_sucursal, 
              comercio_id: infoComercio?.id, 
              producto_id: productoid, 
              pais: infoComercio?.pais?.id
        });

        const config = {
        method: 'post',
        url: REACT_APP_SERVER_BACKEND+`/bnpls/NEPPI/SaveNeppiBnpl`,
        headers: { 
            'Authorization': 'Bearer '+ jwtStrapi, 
            'Content-Type': 'application/json'
        },
        data: data2
        };
        try {

            const response = await axios(config)
            console.log(response)
            

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
            return { estatus: false, estado_operacion: "" , mensaje: "error al generar la consulta http hacia "+ REACT_APP_SERVER_BACKEND +'/bnpls/NEPPI/SaveNeppiBnpl'}
    
        }

}