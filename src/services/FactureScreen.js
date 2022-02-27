import axios from 'axios';

const {REACT_APP_SERVER_BACKEND, REACT_APP_MY_DOMINIO} = process.env 

export async function getFacturaJson(jwt,id) {

    if(!jwt || !id) {
        return { estatus: false, data: "", mensaje:"datos faltantes para poder realizar la funcion de generacion"}
    }

   /* const data2 = JSON.stringify({
        "amount": numberFloatFormater(amount), 
        "infoComercio": infoComercio, 
        "jwtCIBC": jwtCIBC
        });*/

        const config = {
        method: 'get',
        url: REACT_APP_SERVER_BACKEND+'/registro-de-transacciones/' + id,
        headers: { 
            'Authorization': 'Bearer '+ jwt, 
            'Content-Type': 'application/json'
        },
        };
        try {

            const response = await axios(config)

            if(response.data?.JsonFactura) {
                //const urlmyredirect = `http://mystrapi.mooo.com/redirect?uriworpress=${dataencriptada}&nonce=${nonce}`
                return { estatus: true, data: await JSON.parse(response.data?.JsonFactura) , mensaje: "Datas de factura recuparados satisfactoriamente"}
            }
            return { estatus: false, data: "" , mensaje: "Error de factura en la respuesta de strapi. Data incompleta"}
        } 
        catch (error) {
            console.log(error)
            return { estatus: false, data: "" , mensaje: "error al generar la consulta http hacia " + REACT_APP_SERVER_BACKEND+'registro-de-transacciones/' + id}
    
        }

}