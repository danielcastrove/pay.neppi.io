
import React, {useEffect, useState, useContext, useCallback, Suspense, lazy} from 'react';
import AppContext from '../../contextos/AppContext'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import {GetSelectContent} from '../../services/GeneratorOperation'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import Selectors from './Selectors'
import Avatar from '@mui/material/Avatar';
import Preselect from './Preselect' 


const GeneratorOperation = (props) => {
  const MyContext =  useContext(AppContext);
  const [errorMessage, setErrorMessage ] = useState(null)
  const [productoID, setProductoID] = useState("")
  const [proveedorID, setProveedorID] = useState("")
  const [valuePago, setValuePago] = useState(MyContext?.amount ? MyContext?.amount : null)
  const [Simbolo, setSimbolo] = useState(MyContext?.simbolo ? MyContext?.simbolo : "$")
  const [metodo, setMetodo] = useState("")
  const [loadingController, setLoadingController] = useState(null)
  console.log(MyContext)
  const viewController = (valuePago) => {
    if (loadingController == null || metodo == "" ) {
        return null 
    } else {
      console.log(productoID) //61c31ccfd7f019e1ccbc58fc
      console.log(proveedorID) //61c31db1d7f019e1ccbc58fe
      console.log(metodo) 
      const ComponentController = lazy(() => import('../'+metodo?.name_controller));
        if(valuePago > 0.00 && productoID) {
        return (
              <Box component="div"  sx={{ mt: 5, mb: 5,  width: '100%', display: "flex", justifyContent: 'center' }}>
                  <Suspense fallback={<CircularProgress/>}>
                      <ComponentController valuepago={valuePago} productoid={productoID} proveedorid={proveedorID} />
                  </Suspense>
              </Box>
          )
        } else {
            if(valuePago <= 0.00){
              return (
                <Box component="div"  sx={{ mt: 5, mb: 5,  width: '100%', display: "flex", justifyContent: 'center' }}>
                  <Alert variant="filled" severity="error">
                   Debe ingresar un monto de cobro minimo de {Simbolo} 0.10
                  </Alert>
                </Box>)
            } else if ( !productoID){
              return (
                <Box component="div"  sx={{ mt: 5, mb: 5,  width: '100%', display: "flex", justifyContent: 'center' }}>
                  <Alert variant="filled" severity="error">
                   ID de producto invalido
                  </Alert>
                </Box>)
            }
        }
     
    }
  }
  const signIn = ( event ) => {
     event.preventDefault();
  }

  return (
    <React.Fragment>
    <Box
        sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
    
        <Avatar
          alt="Neppi - Buy Now, pay Later"
          src="/assets/img/logo-neppi-isotipo.png"
          sx={{ width: 56, height: 56, m: 1, bgcolor: 'secondary.main' }}
        />
        { /*<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
        </Avatar>*/}
        
        <Typography component="h1" variant="h5" textAlign="center">
            Proceso de pago del Comercio:
        </Typography>
         <Box  component="span"  sx={{ fontWeight: 'bold', display: "block", fontSize: "18px" }} >{ MyContext.infoComercio.razon_social }
         </Box>
         {
          metodo?.nombre ?
            <React.Fragment>
                <Box  component="span"  sx={{display: "block", fontSize: "17px", width:"80%", mb:3  }} >Método de pago seleccionado: { metodo?.nombre}
                </Box>
           </React.Fragment> : null
          }
          
        <Box component="div"  sx={{ mt: 1,  width: '100%', display: "flex", justifyContent: 'center' }}>
          <CurrencyTextField
          label="Monto"
          variant="outlined"
          value={valuePago}
          readOnly={MyContext?.amount ? true : false}
          currencySymbol={Simbolo}
          //minimumValue="0.10"
          outputFormat="string"
          decimalCharacter="."
          digitGroupSeparator=","
          onChange={(event, value)=> setValuePago(value)}
          />
        </Box>
        { MyContext.Preselect?.ProductoId && MyContext.Preselect?.ProveedorId ?
          <Preselect setProductoID={setProductoID} setProveedorID={setProveedorID} setMetodo={setMetodo} setLoadingController={setLoadingController} /> 
          :
          <Selectors setProductoID={setProductoID} setProveedorID={setProveedorID} setMetodo={setMetodo} setLoadingController={setLoadingController} />
        } 
        {viewController(valuePago, productoID)}
        {
            (errorMessage) ?
                <Alert variant="filled" severity="error">
                        {errorMessage}
                </Alert>:
                null  
            
        }
    </Box>
    
    
    { /*<Copyright sx={{ mt: 8, mb: 4 }} /> this.copyright("sx={{ mt: 8, mb: 4 }}")*/}
      
</React.Fragment>
  );
};
export default GeneratorOperation;