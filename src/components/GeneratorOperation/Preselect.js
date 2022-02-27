
import React, {useEffect, useState ,useContext, useCallback} from 'react';
import AppContext from '../../contextos/AppContext'
import {GetSelectContent} from '../../services/GeneratorOperation'
import { Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box';

export default function Preselect({ setProductoID, setProveedorID, setMetodo, setLoadingController }) {
    const MyContext =  useContext(AppContext);
    const [errorMessage, setErrorMessage ] = useState(null)
    const [loadingSelect, setLoadingSelect] = useState(true)

    const getSelectBancoMetodos = useCallback(async () => {

        const respuesta = await GetSelectContent(MyContext.jwtStrapi)

        if(respuesta?.estatus && MyContext.Preselect?.ProductoId && MyContext.Preselect?.ProveedorId) {
            setProveedorID(MyContext.Preselect?.ProveedorId)
            setProductoID(MyContext.Preselect?.ProductoId)
            for(let pais of respuesta?.data) {
                for(let Proveedor of pais?.Bancos){
                    if(Proveedor.id == MyContext.Preselect?.ProveedorId){
                        for(let producto of Proveedor?.productos){
                            if(producto?.id == MyContext.Preselect?.ProductoId){
                                setMetodo(producto)
                                setLoadingSelect(false)
                                setLoadingController(false)
                            }
                        }
                    }
                }
            }
        } else {
            setLoadingSelect(false)
            setErrorMessage("No se logro obtener el valor de los select bancos")
        }
    },[])


  useEffect(() => {

      getSelectBancoMetodos()
      return () => {
          
      }
  }, [MyContext])


        return (
            <React.Fragment>
            {
                loadingSelect ? 
                    <Box sx={{ display: 'flex', justifyContent: "center",  mt: "20px"}}>
                      <CircularProgress />
                    </Box> : null
            }
            {
                (errorMessage) ?
                    <Alert variant="filled" severity="error">
                            {errorMessage}
                    </Alert>:
                    null  
                
            }
        </React.Fragment>
        )
}

