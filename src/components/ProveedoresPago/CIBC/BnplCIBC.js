
import React, {useEffect, useState, useContext, useCallback} from 'react';
import AppContext from '../../../contextos/AppContext'
import { LoadingButton } from '@mui/lab'
import {genetareConcentID, generateJWTCIBC} from '../../../services/CIBC/CIBC'

import { Alert } from '@mui/material';
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'


const BnplIcbc = (props) => {
	const {valuepago, productoid, proveedorid} = props
	const [errorMessage, setErrorMessage] = useState("")
	const [spiner, setSpiner] = useState(false)
	const MyContext =  useContext(AppContext);

	const GenerateIdOperacionICBC = useCallback(async () => {
		setErrorMessage("")
		setSpiner(true)
		
		const jwtCIBCObject = await generateJWTCIBC(MyContext?.jwtStrapi)

		if(jwtCIBCObject?.estatus){
			const objectoConcentID = await genetareConcentID(MyContext?.id, valuepago, MyContext?.infoComercio, MyContext?.userInfo?.id, jwtCIBCObject?.access_token, MyContext?.jwtStrapi,  MyContext?.dataEncrytada, MyContext?.nonce, MyContext?.redirect_uri, productoid, proveedorid, MyContext?.id_sucursal, MyContext?.id_terminal)
			if(objectoConcentID?.estatus){
				console.log(objectoConcentID?.url)
				window.location.href = objectoConcentID?.url;
			} else {
				setSpiner(false)
				setErrorMessage(objectoConcentID?.mensaje);
			}
		} else {
			setSpiner(false)
			setErrorMessage(jwtCIBCObject?.mensaje);
		}
	}, [])

	return(				   
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
				<LoadingButton
				onClick={GenerateIdOperacionICBC}
				type="button"
				loading={spiner}
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
				>
				Generar Order
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

export default BnplIcbc;