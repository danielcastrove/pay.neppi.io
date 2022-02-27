
import React, {useEffect, useState, useContext, useCallback, Suspense, lazy} from 'react';
import AppContext from '../../contextos/AppContext'
import AssignmentIcon from '@mui/icons-material/Assignment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Alert } from '@mui/material';
import {GetSelectContent} from '../../services/GeneratorOperation'
import Avatar from '@mui/material/Avatar';


const MyAvatar = styled(Avatar)(({ theme }) => ({
  
    marginRight: "8px"

}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
      transform:  "none !important"
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }));
export default function Selectors({ setProductoID, setProveedorID, setMetodo, setLoadingController }) {
    const MyContext =  useContext(AppContext);
    const [proovedor, setProovedor] = useState("")
    const [errorMessage, setErrorMessage ] = useState(null)
    const [loadingSelect, setLoadingSelect] = useState(true)
    const [loadingSelect2, setLoadingSelect2] = useState(null)
    const [resposeArraySelect, setResposeArraySelect] = useState([])



    const getSelectBancoMetodos = useCallback(async () => {

        const respuesta = await GetSelectContent(MyContext.jwtStrapi)

        if(respuesta?.estatus) {
            setResposeArraySelect(respuesta?.data)
            setLoadingSelect(false)
        } else {
            setLoadingSelect(false)
            setErrorMessage("No se logro obtener el valor de los select bancos")
        }
    },[])
    const selectHandleChange = useCallback((event) => {
        setLoadingController(null)
        setMetodo("")
        setProductoID("")
        setLoadingSelect2(false)
        setProveedorID(event.target.value?.id)
        setProovedor(event.target.value?.productos);
        setLoadingSelect2(true)

    },[])
    const selectHandleChangeMetodo = useCallback((event) => {

        setMetodo(event.target.value);
        setProductoID(event.target.value?.id)
        setLoadingController(true)

    },[])

  useEffect(() => {

      getSelectBancoMetodos()
      return () => {
          
      }
  }, [MyContext])



  const makeItems =  (data) => {
    const items = [];
    for (let pais of data) {
      items.push(<ListSubheader key={pais.id}>{pais.nombre_del_pais}</ListSubheader>);
      for (let banco of pais.Bancos) {
        items.push(
          <MenuItem key={banco.id} value={banco}>
            <MyAvatar sx={{ bgcolor: 'transparent'}} alt="Remy Sharp"
            src={banco?.imagenlogo?.formats?.thumbnail?.url} variant="rounded">
                <AssignmentIcon />
            </MyAvatar>   {banco?.nombre}
          </MenuItem>
        );
      }
    }
    return items;
  }
  const makeItemsMetodos =  (data) => {
    const items = [];

      for (let metodo of data) {
        items.push(
          <MenuItem key={metodo.id} value={metodo}>
              {metodo.nombre}
          </MenuItem>)
    }
    return items;
  }

    const GetSelectRender = () => {

        if (loadingSelect == true ) {
            return (
                <Box sx={{ display: 'flex', justifyContent: "center",  mt: "20px"}}>
                  <CircularProgress />
                </Box>
              ); 
        } else  {
    
                return (
                <Box component="div"  sx={{ mt: 1,  width: '100%', display: "flex", justifyContent: 'center' }}>
                    <FormControl sx={{ m: 1, minWidth: 80, width: '80%' }}>
                    <InputLabel sx={{ transform:'none !important' }}  htmlFor="grouped-select">Seleccione un Proveerdor de pago</InputLabel>
                    <Select defaultValue="" id="grouped-select" label="Grouping"
                    labelId="grouped-select"
                    defaultValue={""}
                    onChange={selectHandleChange}
                    input={<BootstrapInput/>}
                    autoWidth >
                    <MenuItem value="">
                        <em>Ninguno</em>
                    </MenuItem>
                    {makeItems(resposeArraySelect)}
                    </Select>
                    </FormControl>
                </Box>
     
                );
         
            }
        }
        const GetSelectRenderMetodos = () => {
            
            if (loadingSelect2 == null ) {
                return (
                    null
                  ); 
            } else if(loadingSelect2 == false){
                return (
                    <Box sx={{ display: 'flex', justifyContent: "center", mt: "20px"}}>
                      <CircularProgress />
                    </Box>
                  ); 
            } else {
        
                    return (
                    <Box component="div"  sx={{ mt: 1,  width: '100%', display: "flex", justifyContent: 'center' }}>
                        <FormControl sx={{ m: 1, minWidth: 80, width: '80%' }}>
                        <InputLabel sx={{ transform:'none !important' }}  htmlFor="grouped-select2">Seleccione el Método de Pago o Banco</InputLabel>
                        <Select defaultValue="" id="grouped-select2" label="Grouping"
                        labelId="grouped-select2"
                        defaultValue={""}
                        onChange={selectHandleChangeMetodo}
                        input={<BootstrapInput/>}
                        autoWidth >
                        <MenuItem value="">
                            <em>Ninguno</em>
                        </MenuItem>
                        {makeItemsMetodos(proovedor)}
                        </Select>
                        </FormControl>
                    </Box>
         
                    );
             
            }
        }

        return (
            <React.Fragment>
                {GetSelectRender()}
                {GetSelectRenderMetodos()}
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

