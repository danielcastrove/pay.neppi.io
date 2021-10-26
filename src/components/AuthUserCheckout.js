import React, { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ErrorMessage from './ErrorMessage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import genetareConcentID from '../services/genetareConcentID'
import {decrypDataNeppi} from '../utils/utilsGeneral'
import CircularProgress from '@mui/material/CircularProgress';
import {
	BrowserRouter as Router,
	Link
  } from "react-router-dom";
import AppContext from '../contextos/AppContext'
import axios from 'axios';

const theme = createTheme();

export class AuthUserCheckout extends Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
		  showButton: true,
		  showHeader: false,
		  postId: '',
		  errorMessage: null,
		  isLoaded: false,
		  infoComercio: {},
		  items: [],
		  tokenId: this.context?.params?.id,
		  loading: null,
		  printMsg: ["Warning: the correct information was not sent to make the payment.", "Please Return to Trade ..."]
		};

	}

	componentDidMount() {
		this.validateParams().then((valor) => { 
			this.setState({loading: valor}) 
		})
	  }

	validateParams = async () => {

		if(this.context?.dataEncrytada && this.context?.params?.id  && this.context?.params?.amount &&  this.context?.params?.redirect_uri) {

			return true
		} else {

			let get_params = new URLSearchParams(window.location.search);
			//segun el caso cambiamos las variables de los estaos

			if(get_params.has("dataneppi") && get_params.has("nonce")){

				const DatosURL = await decrypDataNeppi(get_params.get("dataneppi"),get_params.get("nonce"))
				if(DatosURL?.status == "valido" && DatosURL?.data?.id && DatosURL?.data?.amount &&  DatosURL?.data?.redirect_uri ){
					this.context.updateContext({
						url: window.location.href,
						path: window.location.pathname,
						dataEncrytada: get_params.get("dataneppi"),
						nonce: get_params.get("nonce"),
						params: {
							 ...this.context.params,
							 id: DatosURL?.data?.id,		
							 amount: DatosURL?.data?.amount,
							 redirect_uri: DatosURL?.data?.redirect_uri,
		
						}	
					});
					this.setState({tokenId: DatosURL?.data?.id})
					return true
				} else {
					return false
				}
				
		} else {
			return false
		}
	}
					
	};
	requestSend = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// eslint-disable-next-line no-console
		console.log({
		  email: data.get('email'),
		  password: data.get('password')
		});
	}	
	
	signIn = (event) => {
		event.preventDefault();
		this.setState({ errorMessage: null })
		const data_form = new FormData(event.currentTarget);
		
		const requestOptions = {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 
				identifier: data_form.get('email'),
				password: data_form.get('password') 
			})
		};
		fetch('http://mystrapi.mooo.com:1337/auth/local', requestOptions)
			.then(async response => {
				const isJson = response.headers.get('content-type')?.includes('application/json');
				const data = isJson && await response.json();
				
				/*console.log({
					jwt1: data.jwt,
					email1: data_form.get('email'),
					password1: data_form.get('password')
				});*/
				
				// check for error response
				if(!response?.ok && !data?.jwt && data?.error) {
					// get error message from body or default to response status			
					const error = (data && data.message) || response.status;
					//return Promise.reject(error);
					
					this.setState({ errorMessage: "Ususario o contraseña"});
					console.error('There was an error!', data.error);
				} else if(response?.ok && !data?.jwtCIBC ) {
					// get error message from body or default to response status			
					const error = (data && data.message) || response.status;
					//return Promise.reject(error);
					
					this.setState({ errorMessage: "No se logro recuperar el token bancario"});
					console.error('There was an error!', error);
				} else if (response?.ok && !data?.user?.confirmed ) {
					// get error message from body or default to response status			
					const error = (data && data.message) || response.status;
					//return Promise.reject(error);
					
					this.setState({ errorMessage: "Ususario no confirmado"});
					console.error('There was an error!', error);
				}
				
				if(data?.jwt && data?.jwtCIBC  && data?.user?.confirmed){
					this.context.updateContext({
						params: {
							 ...this.context.params,
							 jwtCIBC:  data.jwtCIBC,		
							 jwtStrapi: data.jwt,
		
						}	
					});
					this.setState({ 
						postId: data.jwt,
						jwtCIBC: data.jwtCIBC,
						isLoaded: true,
						items: data 
					})

					const data2 = JSON.stringify({
					"tokenTerminal": this.state.tokenId
					});

					const configComercio = {
					method: 'post',
					url: 'http://mystrapi.mooo.com:1337/comercios/getComercioFromToken',
					headers: { 
						'Authorization': 'Bearer '+data.jwt, 
						'Content-Type': 'application/json'
					},
					data : data2
					};

					axios(configComercio)
					.then(async (response) => {
						if(response?.data?.status == "Success"){
							this.setState({ 
								infoComercio: response?.data?.dataEnvio ,
							})
							this.context.updateContext({
								params: {
									 ...this.context.params,
									 infoComercio:  response?.data?.dataEnvio,		
				
								}
							})	
							const objectoConcentID = await genetareConcentID(this.context?.params?.amount, this.context?.params?.infoComercio , this.context?.params?.jwtCIBC, this.context?.params?.jwtStrapi,  this.context?.dataEncrytada, this.context?.nonce, this.context?.params?.redirect_uri)
							if(objectoConcentID?.estatus){
								console.log(objectoConcentID?.url)
								window.location.href = objectoConcentID?.url;
							} else {
								this.setState({ errorMessage: objectoConcentID?.mensaje});
							}
	
						} else if(response?.data?.mensaje) {
							this.setState({ errorMessage: response?.data?.mensaje});
	
						} else {
							this.setState({ errorMessage: "no se logro recuperar la data de la tienda"});

						}
					})
					.catch(error => {
						this.setState({ errorMessage: error.toString() });
						console.error('There was an error!', error);
					});
					
					//this.continue()
					
					console.log({
						jwt: data.user.confirmed,
						email: data_form.get('email'),
						password: data_form.get('password')
					});
				}
				
			})
			.catch(error => {
				this.setState({ errorMessage: error.toString() });
				console.error('There was an error!', error);
			});
		
	}
	
	copyright = (props_cr) => {
		const get_props = props_cr;
		return (
			<Typography variant="body2" color="text.secondary" align="center" {...get_props}>
			  {'Copyright '} &copy; {' '} {new Date().getFullYear()} {' | '}
			  <Link color="inherit" href="https://neppi.io/" target="blank">
				Neppi - Buy Now, pay Later 
			  </Link>
			</Typography>
		);
	}
	
	continueClick = e => {
		e.preventDefault();
		this.props.nextStep();
	};
	
	linkClick = (get_step_l) => {
		const get_step  = get_step_l;
		
		if(get_step) {
			this.props.linkClick(get_step);
		}
	};
	
	continue = () => {
		this.props.nextStep();
	};
	
	render(){
		const { values, handleChange, params } = this.props;
		const { postId, isLoaded, items, errorMessage  } = this.state;
		if (this.state.loading == null ) {
			return (
				<Box sx={{ display: 'flex', justifyContent: "center" }}>
				  <CircularProgress />
				</Box>
			  ); 
		}else if(this.state.loading == true) {
			
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
						   Sign in and purchase in installments
					   </Typography>
					   
					   <Box component="form" onSubmit={this.signIn} noValidate sx={{ mt: 1 }}>
						   <TextField
							   margin="normal"
							   required
							   fullWidth
							   id="email"
							   label="Email Address"
							   name="email"
							   autoComplete="email"
							   autoFocus
						   />
						   
						   <TextField
							 margin="normal"
							 required
							 fullWidth
							 name="password"
							 label="Password"
							 type="password"
							 id="password"
							 autoComplete="current-password"
						   />
						   
						   <FormControlLabel
							 control={<Checkbox value="remember" color="primary" />}
							 label="Remember me"
						   />
						   {
							   (errorMessage) ?
								   <Alert variant="filled" severity="error">
								   {errorMessage}
									 </Alert>:
								   null  
							   
						   }
						   { 
						   <Button
							   type="submit"
							   fullWidth
							   variant="contained"
							   sx={{ mt: 3, mb: 2 }}
						   >
							   Sign In
						   </Button>

						   /*<Button
							   type="submit"
							   fullWidth
							   variant="contained"
							   sx={{ mt: 3, mb: 2 }}
						   >
							   Ir al Dashboard 
						   </Button>*/
						   }
						   
						   <Grid container>
							   <Grid item xs>
								   <Link to="/" variant="body2">
									 Forgot password?
								   </Link>
							   </Grid>
							 
							   <Grid item>
								   <Link to="/registro" variant="body2" >
									   {"Don't have an account? Sign Up"}
								   </Link>
							   </Grid>
						   </Grid>
					   </Box>
				   </Box>
				   
				   { <this.copyright sx={{ mt: 8, mb: 4 }} />}
				   
				   { /*<Copyright sx={{ mt: 8, mb: 4 }} /> this.copyright("sx={{ mt: 8, mb: 4 }}")*/}
					 
			   </React.Fragment>
		   );
		} else {
			return (
				<React.Fragment>
					<ErrorMessage
						printMsg= {this.state?.printMsg}
						handleChange={this.props?.params?.handleChange}
					/>
				</React.Fragment>
				);

		}
		 //end return
	} //end render
} //end class

export default AuthUserCheckout;
