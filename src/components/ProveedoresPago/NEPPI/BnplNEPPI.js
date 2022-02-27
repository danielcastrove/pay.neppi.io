
import React, {useEffect, useState, useContext, useCallback,useRef} from 'react';
import AppContext from '../../../contextos/AppContext'
import { LoadingButton } from '@mui/lab'
import SelectAutocomplete from "./SelectAutocomplete"
import ViewCuotasResultado from "./ViewCuotasResultado"
import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';
import Box from '@mui/material/Box'
import {SaveNeppiBNPL} from './../../../services/NEPPI/NEPPI'
import CircularProgress from '@mui/material/CircularProgress'


const BnplNeppi = (props) => {
	let navigate = useNavigate();
	const {valuepago, productoid, proveedorid} = props
    const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null)
	const [errorMessage, setErrorMessage] = useState("")
	const [spiner, setSpiner] = useState(false)
	const arrayCuotasProcesadas = useRef([])
	const MyContext =  useContext(AppContext);

	const GenerateIdOperacionNEPPIBNLP = useCallback( async() => {
		setErrorMessage("")
		setSpiner(true)
		const ObjetoRespuestaSave = await SaveNeppiBNPL(MyContext?.jwtStrapi, MyContext?.infoComercio, valuepago, arrayCuotasProcesadas.current, MyContext?.userInfo,  productoid, proveedorid, MyContext?.id_sucursal, MyContext?.id_terminal)
		console.log(ObjetoRespuestaSave)
		if(ObjetoRespuestaSave.estatus){
			setSpiner(false)
			if(ObjetoRespuestaSave?.data?.id_factura_info){
				navigate(`/facture-screen/${ObjetoRespuestaSave.data.id_factura_info}`);
			} else {

				setErrorMessage("id de factura no encontrado")
			}
		} else {
			setSpiner(false)
			setErrorMessage(ObjetoRespuestaSave.mensaje)
		}
	}, [])
	
	const onChangeListCuotas = useCallback((ArrayCuotasObjetoGuardar)=>{

		arrayCuotasProcesadas.current = ArrayCuotasObjetoGuardar
	}, [])

	const onChangePadre = useCallback((event,value) => {
		setCuotaSeleccionada(value)    
	}, [cuotaSeleccionada])
    
    useEffect(() => {

        return () => {
            
        }
    }, [MyContext])

	return(				   
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>		<SelectAutocomplete
				productID={productoid}
				onChangePadre={onChangePadre}
				/>
				{cuotaSeleccionada ?
					<ViewCuotasResultado
					cuotaObject ={cuotaSeleccionada}
					montoPrestamo={valuepago}
					proveedorid={proveedorid}
					onChangeListCuotas={onChangeListCuotas}
					/>
					:
					null
				}
				<LoadingButton
				onClick={GenerateIdOperacionNEPPIBNLP}
				type="button"
				loading={spiner}
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				>
				Generar Orden
				</LoadingButton>
				{
					(errorMessage) ?
						 <Alert variant="filled" severity="error">
								{errorMessage}
						 </Alert>:
						null  
					
				}
		 </Box>
		   )
}

export default BnplNeppi;