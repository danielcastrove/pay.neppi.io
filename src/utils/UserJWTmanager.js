
import axios from 'axios';
const {REACT_APP_SERVER_BACKEND} = process.env 

export async function GetRefreshSessionAndInfoComercio(idComercio){
    const JWTneppi = localStorage.getItem("JWTneppi")
    if(JWTneppi && idComercio){
        try {
        const requestOptions = {
            method: 'post',
            url: REACT_APP_SERVER_BACKEND+'/auth/refresh-token',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : JSON.stringify({
                "jwt": JWTneppi
            })
        };
            const response =  await axios(requestOptions)
            if( response?.data?.jwt && response?.data?.user){
                const data2 = JSON.stringify({
                    "tokenTerminal": idComercio
                    });
    
                    const configComercio = {
                    method: 'post',
                    url: REACT_APP_SERVER_BACKEND+'/comercios/getComercioFromToken',
                    headers: { 
                        'Authorization': 'Bearer '+response?.data?.jwt, 
                        'Content-Type': 'application/json'
                    },
                    data : data2
                    };
                    try {
                        const response2 = await axios(configComercio)
                        if(response2?.data?.status == "Success"){
                            localStorage.setItem("JWTneppi", response?.data?.jwt );
                            return {estatus: true, JWTneppi: response?.data?.jwt, user:  response?.data?.user, infoComercio: response2?.data?.dataEnvio, id_sucursal: response2?.data?.id_sucursal_preticion, id_terminal: response2?.data?.id_terminal_preticion}
    
                        } else if(response2?.data?.mensaje) {
                            console.log(response2?.data?.mensaje)
                            return {estatus: false, JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
    
                        } else {
                            return {estatus: false, JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
                        }
                    } catch (error) {
                        console.error('There was an error!', error);
                        return {estatus: false, JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
                    }
            } else {
                return {estatus: false, JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
            }

        } catch (error) {
            console.error(error)
            return {estatus: false, JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
        }
    }
    return {estatus: false , JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
}

export async function GetRefreshSession(){
    const JWTneppi = localStorage.getItem("JWTneppi")
    if(JWTneppi ){
        try {
        const requestOptions = {
            method: 'post',
            url: REACT_APP_SERVER_BACKEND+'/auth/refresh-token',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : JSON.stringify({
                "jwt": JWTneppi
            })
        };
            const response =  await axios(requestOptions)
            if( response?.data?.jwt && response?.data?.user){
                
 
            localStorage.setItem("JWTneppi", response?.data?.jwt );
            return {estatus: true, JWTneppi: response?.data?.jwt, user:  response?.data?.user, infoComercio: "", id_sucursal: "", id_terminal: ""}
    
    
                  
            } else {
                return {estatus: false, JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
            }

        } catch (error) {
            console.error(error)
            return {estatus: false, JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
        }
    }
    return {estatus: false , JWTneppi: "", user: "", infoComercio: "", id_sucursal: "", id_terminal: ""}
}