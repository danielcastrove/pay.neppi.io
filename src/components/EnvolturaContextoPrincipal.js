import React, {useCallback, useContext, useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import AuthUserCheckout from './AuthUserCheckout';
import Success from './Success'
import GeneratorOperation from './GeneratorOperation/GeneratorOperation'
import FactureScreen from './FactureScreen'
import ErrorMessage from './ErrorMessage';
import PrivateRoute from './utils/PrivateRoutes'
import {decrypDataNeppi} from '../utils/utilsGeneral'
import {GetRefreshSessionAndInfoComercio, GetRefreshSession} from '../utils/UserJWTmanager'
import {ExtraerRedirectUrl} from "../services/GeneralesVariosMetodos"	
import CircularProgress from '@mui/material/CircularProgress'
import AppContext from '../contextos/AppContext'
import {
	BrowserRouter as Router,
	Routes,
	Route,
    Navigate,
  } from "react-router-dom";

import RegisterUser from './RegisterUser';

//import AddressForm from './AddressForm';
//import PaymentForm from './PaymentForm';
//import Review from './Review';

const steps = ['Shipping address', 'Payment details', 'Review your order'];
const theme = createTheme();

const ToNavigate = ({MyContext}) => {
	if(MyContext?.urlFinalLogin){
		return (
			<Navigate to="/redirect" replace={true}/>
			)
	} else if (MyContext?.Facturation){
		return (
			<Navigate to={MyContext.Facturation} replace={true}/>
			)
	} else {
		return (
			<Navigate to="/generator" replace={true}/>
			)
	}
}

const EnvolturaContextoPrincipal = (props) => {
	const MyContext =  useContext(AppContext);
	const [mystate, setmystate] = useState({
		step: 1,
        loading: null,
        printMsg: ["Warning: the correct information was not sent to make the payment.", "Please Return to Trade ..."],
		container: {
		  component: "main",
		  maxWidth: "sm",
		  sx_mb: 4
		},
		paper: {
		  variant: "outlined",
		  sx_my_xs: 3,
		  sx_my_md: 6,
		  sx_p_xs: 2,
		  sx_p_md: 3
		}
		
	
	} );

    const validateParams = useCallback(async () => {

		if((MyContext.dataEncrytada && MyContext.id  && MyContext.amount &&  MyContext.redirect_uri) || (MyContext.redirectData?.idredirect && MyContext.redirectData?.producto) ) {
			setmystate({
				...mystate,
				loading: true,})
			return true
		} else if( /^\/facture-screen\/[a-z0-9]{24,24}$/.test(window.location?.pathname) || /^facture-screen\/[a-z0-9]{24,24}$/.test(window.location?.pathname) ){
				const datosSession = await GetRefreshSession()
                    if(datosSession?.estatus){
						MyContext.updateContext({
							Facturation: window.location?.pathname,
							userInfo: datosSession.user,
							jwtStrapi: datosSession.JWTneppi,
						})
						setmystate({
							...mystate,
							loading: true,})
					} else {
						MyContext.updateContext({
                            Facturation: window.location?.pathname,	
							})
							setmystate({
								...mystate,
								loading: true,})
					}

					return true
         } else if(window.location?.pathname == "/redirect" || window.location?.pathname == "/redirect/" ){
			const datosExtraidosUrl =  await ExtraerRedirectUrl(window.location);
         	if(datosExtraidosUrl?.estatus){
				const datosSession = await GetRefreshSessionAndInfoComercio(datosExtraidosUrl?.datos?.tokenComercio)

                    if(datosSession?.estatus){
						MyContext.updateContext({
							redirectData: datosExtraidosUrl?.datos,
							userInfo: datosSession.user,
							infoComercio: datosSession.infoComercio,
							id_sucursal: datosSession.id_sucursal,
							id_terminal: datosSession.id_terminal,
							jwtStrapi: datosSession.JWTneppi,
						})
						setmystate({
							...mystate,
							loading: true,})
					} else {
						MyContext.updateContext({
                            urlFinalLogin: window.location.href,
							redirectData: datosExtraidosUrl?.datos,
							id: datosExtraidosUrl?.datos?.tokenComercio,	
							})
							setmystate({
								...mystate,
								loading: true,})
					}

					return true
         } else {
          
			setmystate({
				...mystate,
				printMsg: ["Warning: the correct information was not sent to make the payment.", "Please Return to Trade ..."+"("+datosExtraidosUrl.mensaje+")"],
				loading: false,})
			return false
         }
			//segun el caso cambiamos las variables de los estaos
		}else{

			let get_params = new URLSearchParams(window.location.search);
			//segun el caso cambiamos las variables de los estaos

			if(get_params.has("dataneppi") && get_params.has("nonce")){

				const DatosURL = await decrypDataNeppi(get_params.get("dataneppi"),get_params.get("nonce"))
				if(DatosURL?.status == "valido" && DatosURL?.data?.id ){
                    const datosSession = await GetRefreshSessionAndInfoComercio(DatosURL?.data?.id)
                    if(datosSession?.estatus){
                        MyContext.updateContext({
                            url: window.location.href,
                            path: window.location.pathname,
                            dataEncrytada: get_params.get("dataneppi"),
                            nonce: get_params.get("nonce"),
                            userInfo: datosSession.user,
							infoComercio: datosSession.infoComercio,
							id_sucursal: datosSession.id_sucursal,
							id_terminal: datosSession.id_terminal,
							jwtStrapi: datosSession.JWTneppi,
							Preselect :DatosURL?.data?.Preselect ?DatosURL?.data?.Preselect : null,
                            id: DatosURL?.data?.id,		
                            amount: DatosURL?.data?.amount ? parseFloat(Math.round((parseFloat(DatosURL?.data?.amount) + Number.EPSILON) * 100) / 100) : "",
                            redirect_uri: DatosURL?.data?.redirect_uri,
                        })
	
						setmystate({
							...mystate,
							loading: true,})
							
                    } else {
						MyContext.updateContext({
                            url: window.location.href,
                            path: window.location.pathname,
                            dataEncrytada: get_params.get("dataneppi"),
                            nonce: get_params.get("nonce"),
							Preselect :DatosURL?.data?.Preselect ?DatosURL?.data?.Preselect : null,
							id: DatosURL?.data?.id,		
							amount:  DatosURL?.data?.amount ? parseFloat(Math.round((parseFloat(DatosURL?.data?.amount) + Number.EPSILON) * 100) / 100) : "",
							redirect_uri: DatosURL?.data?.redirect_uri,
							})
							setmystate({
								...mystate,
								loading: true,})
                    }

					return true
				} else {
                    setmystate({
                        ...mystate,
                        loading: false,})
					return false
				}
				
		} else {
            setmystate({
                ...mystate,
                loading: false,})
			return false
		}
	}
					
	}, []) // if userId changes, useEffect will run again
                   // if you want to run only once, just leave array empty []
    
      useEffect(() => {
         validateParams()
       }, [validateParams])
       

	const Copyright = (props_cr) => {
		const get_props = props_cr;
		return (
			<Typography variant="body2" color="text.secondary" align="center" {...get_props}>
			  {'Copyright '} &copy; {' '} {new Date().getFullYear()} {' | '}
			  <Link color="inherit" href="https://neppi.io/" target="blank">
				Neppi - Buy Now, pay Later 
			  </Link>
			</Typography>
		);
	};
	
	const GetStepContent = () => {
	
		const { showHeader, values, params, printMsg, loading} = mystate;

		if (loading == null ) {
			return (
				<Box sx={{ display: 'flex', justifyContent: "center" }}>
				  <CircularProgress />
				</Box>
			  ); 
		} else if (loading == true) {

                return (

                    <Router>
                        <Routes>
						<Route exact  path="/facture-screen/:ID" element={
								<PrivateRoute>
									<FactureScreen/>
								</PrivateRoute>
							} 
								/>
                            <Route exact  path="/generator" element={
								<PrivateRoute>
									<GeneratorOperation/>
								</PrivateRoute>
							} 
								/>
                            <Route exact path="/registro" element={
								<RegisterUser
                                values={values}
                                showHeader={showHeader}
                                params={params}
                                updateContext= {MyContext.updateContext}
                                />
							} 
							/>
							<Route exact path="/redirect" element={
								<Success
                                updateContext= {MyContext.updateContext}
                                />
							} 
							/>
							<Route exact path="/" element={
								MyContext?.userInfo && MyContext?.jwtStrapi ?
								<ToNavigate MyContext={MyContext}/>
                                :
                                <AuthUserCheckout
                                values={values}
                                showHeader={showHeader}
                                params={params}
                                updateContext= {MyContext.updateContext}
                                />
							} 
							/>
                   
                        </Routes>
                    </Router>
                );
            } else {
                return (
                    <React.Fragment>
                        <ErrorMessage
                            printMsg= {printMsg}
                        />
                    </React.Fragment>
                    );    
            }
		}
	


		const { step } = mystate;
		const { email, password, firstName, lastName, occupation, city, bio } = mystate;
		const values = { email, password, firstName, lastName, occupation, city, bio };
		const { show, showButton, showHeader, showTitle, showLabel, showCopy, showPaper, container, paper, url, path, params } = mystate;
		
		//const [activeStep, setActiveStep] = React.useState(0);

		/*const handleNext = () => {
			setActiveStep(activeStep + 1);
		};*/

		/*const handleBack = () => {
			setActiveStep(activeStep - 1);
		};*/
		
		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{showHeader  && (
				<AppBar
					position="absolute"
					color="default"
					elevation={0}
					sx={{
					  position: 'relative',
					  borderBottom: (t) => `1px solid ${t.palette.divider}`,
					}}
				>
				
					<Toolbar>
						<Avatar
							alt="Neppi - Buy Now, pay Later"
							src="/assets/img/logo-neppi-isotipo.png"
							sx={{ width: 56, height: 56, m: 1, bgcolor: 'secondary.main' }}
						/>
						
						<Typography variant="h6" color="inherit" noWrap>
							Neppi - Buy now, Pat later
						</Typography>
					</Toolbar>
				</AppBar>
				)}
				
				<Container component={container.component} maxWidth={container.maxWidth} sx={{ mb: container.sx_mb }}>
					<Paper variant={paper.variant} sx={{ my: { xs: paper.sx_my_xs, md: paper.sx_my_md }, p: { xs: paper.sx_p_xs, md: paper.sx_p_md } }}>
					
						{showTitle  && (
						<Typography component="h1" variant="h4" align="center">
							Purchasing Process
						</Typography>
						)}
						
						{showLabel  && (
						<Stepper activeStep={step} sx={{ pt: 3, pb: 5 }}>
							{steps.map((label) => (
							  <Step key={label}>
								<StepLabel>{label}</StepLabel>
							  </Step>
							))}
						</Stepper>
						)}
                        
						<React.Fragment>
							{step === steps.length ? (
							<React.Fragment>
								<Typography variant="h5" gutterBottom>
									Thank you for your order.
								</Typography>
						
								<Typography variant="subtitle1">
								  Your order number is #2001539. We have emailed your order
								  confirmation, and will send you an update when your order has
								  shipped.
								</Typography>
							</React.Fragment>
							) : (

							<React.Fragment>
								{GetStepContent()}
							</React.Fragment>
							)}
						</React.Fragment>
                        
					</Paper>
					
					{showLabel  && (
					< Copyright />
					)}
					
				</Container>
			</ThemeProvider>
		); //end return
	 //end render
} //end class

export default EnvolturaContextoPrincipal;