import React, {useEffect, useState, useContext, useCallback} from 'react';
import AppContext from '../../../contextos/AppContext'
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
 import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material/styles';
import {ProcesarCuotas} from '../../../services/NEPPI/NEPPI'

const MyTableCell = styled(TableCell)(({ theme }) => ({
    wordBreak: "break-word",
	padding: "5px 10px"
  }));

const ViewCuotasResultado = ({cuotaObject, onChangeListCuotas, montoPrestamo, proveedorid}) => {
	const MyContext =  useContext(AppContext);
	const [errorMessage, setErrorMessage] = useState("")
	const [Loading, setLoading] = useState(true)
	const [ResposeArrayData, setResposeArrayData] = useState([])
	const [arrayDataCuotasGuardar, setArrayDataCuotasGuardar] = useState(null)

	//const [spiner, setSpiner] = useState(false)
	//const [redirect_uri, setRedirect_uri] = useState(MyContext?.redirect_uri)


	const getProcesarCuotas = useCallback(async (cuotaObject) => {
        setErrorMessage("")
        const respuesta = await ProcesarCuotas(MyContext.jwtStrapi, cuotaObject, montoPrestamo)

        if(respuesta?.estatus) {

            const ArrayDataCuotasGuardar = []
            for(let DataCuota of respuesta?.ArrayData ){
                let ObjetoCuotaGuardar = {
                  codigo_de_cuota: uuidv4(),
                  monto_a_pagar: DataCuota.monto,
                  estatus: "sin_pagar",
                  fecha_estimada_de_pago: DataCuota.fechaPago,
                  usuario_acreedor: MyContext?.userInfo?.id,
                  comercio_acreditador: MyContext?.infoComercio?.id,
                  proveedor_de_pago: proveedorid,
                  monto_interes: DataCuota.montoInteres,
                  porcentage_interes: DataCuota.montoInteresPorcentaje
                }
                ArrayDataCuotasGuardar.push(ObjetoCuotaGuardar)
            }
            setArrayDataCuotasGuardar(ArrayDataCuotasGuardar)
            setResposeArrayData(respuesta?.ArrayData)
            setLoading(false)
        } else {
            setLoading(false)
            setErrorMessage(respuesta?.mensaje)
        }
    },[cuotaObject])

	useEffect(async() => {
		
		await getProcesarCuotas(cuotaObject)

	},[cuotaObject])

	return(	<React.Fragment>

				{onChangeListCuotas(arrayDataCuotasGuardar)}
				{Loading ? 
						<Box sx={{ display: 'flex', justifyContent: "center",  mt: "20px"}}>
							<CircularProgress />
						</Box>
				  :
				  <Box component="div"  sx={{ mt: 1 }}>
                    { ResposeArrayData.length > 0 ?
                    <React.Fragment>
                        <Box component="div"  sx={{ mt: 3 }}> 
                            <Typography variant="subtitle2" gutterBottom component="p">
                                Tabla de pagos por cuotas al {cuotaObject.cantidad_porcentual_de_interes_por_cuota}% de interes
                            </Typography>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ Width: "100%" }} aria-label="caption table">
                            <TableHead>
                                <TableRow>
                                    <MyTableCell sx={{ fontWeight: 800, fontSize:"16px" }} align="left">Cuota</MyTableCell>
                                    <MyTableCell sx={{ fontWeight: 800, fontSize:"16px" }} align="left">Monto</MyTableCell>
                                    <MyTableCell sx={{ fontWeight: 800, fontSize:"16px" }} align="right">Fecha de pago</MyTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ResposeArrayData.map((row,index) => (
                                <TableRow key={index}>
                                    <MyTableCell align="left">{"Pago de cuota N° " + row.numeroCuota}</MyTableCell>
                                    <MyTableCell sx={{ fontWeight: 800, fontSize:"16px" }} component="th" scope="row">
                                    {new Intl.NumberFormat('en-EN', {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.monto) + " $"}
                                    </MyTableCell>
                                    <MyTableCell align="right">{row.fechaFinalDisplay}</MyTableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </React.Fragment>
                    : 
                    null
                    }	
					
					{
						(errorMessage) ?
							<Alert variant="filled" severity="error">
									{errorMessage}
							</Alert>
							:
							null  
						
					}
		
					
				</Box>}


		  
	</React.Fragment>)
}

export default ViewCuotasResultado;