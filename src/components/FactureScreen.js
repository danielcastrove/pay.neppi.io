import React, {useEffect, useState, useContext, useCallback} from 'react';
import AppContext from '../contextos/AppContext'
import Avatar from '@mui/material/Avatar';
import { LoadingButton } from '@mui/lab'
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'

import {
	useParams, 
	useNavigate
  } from "react-router-dom";
  import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {getFacturaJson} from '../services/FactureScreen'
import { styled } from '@mui/material/styles';
const {REACT_APP_SERVER_BACKEND} = process.env 

const MyTableCell = styled(TableCell)(({ theme }) => ({
    wordBreak: "break-word",
	padding: "5px 10px"
  }));

const FactureScreen = (props) => {
	const MyContext =  useContext(AppContext);
	const [errorMessage, setErrorMessage] = useState("")
	const [Loading, setLoading] = useState(true)
	const [ResposeArrayData, setResposeArrayData] = useState([])
	const [spiner, setSpiner] = useState(false)
	const [redirect_uri, setRedirect_uri] = useState(MyContext?.redirect_uri)
	const navigate = useNavigate();
	const params = useParams();

	const getFacturaJsonMetodo = useCallback(async (ID) => {

        const respuesta = await getFacturaJson(MyContext.jwtStrapi, ID)

        if(respuesta?.estatus) {
            setResposeArrayData(respuesta?.data)
            setLoading(false)
        } else {
            setLoading(false)
            setErrorMessage(respuesta?.mensaje)
        }
    },[params.ID])

	const Ircomercio = useCallback(() => {
		setSpiner(true)
		if(redirect_uri){
			window.location.href = decodeURIComponent(redirect_uri)
		}

	}, [redirect_uri])
	

	useEffect(() => {
		
		getFacturaJsonMetodo(params.ID)

	}, [params.ID])

	return(	<React.Fragment>
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
					Recibo de pago
				</Typography>
				
				{Loading ? 
						<Box sx={{ display: 'flex', justifyContent: "center",  mt: "20px"}}>
							<CircularProgress />
						</Box>
				  :
				  <Box component="div" noValidate sx={{ mt: 1 }}>
				
					<TableContainer component={Paper}>
					<Table sx={{ Width: "100%" }} aria-label="caption table">
					  <TableBody>
						{ResposeArrayData.map((row,index) => (
						  <TableRow key={index}>
							<MyTableCell sx={{ fontWeight: 800, fontSize:"16px" }} component="th" scope="row">
							  {row.valor + " :"}
							</MyTableCell>
							<MyTableCell align="right">{row.campo}</MyTableCell>
						  </TableRow>
						))}
					  </TableBody>
					</Table>
				  </TableContainer>
					
					
					{
						(errorMessage) ?
							<Alert variant="filled" severity="error">
									{errorMessage}
							</Alert>
							:
							null  
						
					}
		
					
				</Box>}
				{redirect_uri ? 				
					<LoadingButton
					onClick={Ircomercio}
					type="button"
					loading={spiner}
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					>
					Ir al comercio
					</LoadingButton>
				:
				null
			}
			</Box>
		  
	</React.Fragment>)
}

export default FactureScreen;