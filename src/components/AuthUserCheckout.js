import React, { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import { LoadingButton } from '@mui/lab'
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
	BrowserRouter as Router,
	Link,
	Navigate
  } from "react-router-dom";
import AppContext from '../contextos/AppContext'
import axios from 'axios';
const {REACT_APP_SERVER_BACKEND} = process.env 

export class AuthUserCheckout extends Component {
	static contextType = AppContext;
	
	constructor(props) {
		super(props);
		
		this.state = {
		  showButton: true,
		  showHeader: false,
		  redirectEstate: false,
		  postId: '',
		  errorMessage: null,
		  isLoaded: false,
		  infoComercio: {},
		  items: [],
		  spiner: false
		};

	}

	componentDidMount() {
		/*this.validateParams().then((valor) => { 
			this.setState({loading: valor}) 
		})*/
	  }


	signIn = async(event) => {
		event.preventDefault();

		this.setState({ errorMessage: null, spiner: true, })
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

		try {
			const response = await fetch(REACT_APP_SERVER_BACKEND+'/auth/local', requestOptions)
			const isJson = response.headers.get('content-type')?.includes('application/json');
			const data = isJson && await response.json();
			if(!response?.ok && !data?.jwt && data?.error) {
				// get error message from body or default to response status			
				const error = (data && data.message) || response.status;
				//return Promise.reject(error);
				
				this.setState({ errorMessage: "Ususario o contraseña invalidos", spiner: false});
				console.error('There was an error!', data.error);
			} else if (response?.ok && !data?.user?.confirmed ) {
				// get error message from body or default to response status			
				const error = (data && data.message) || response.status;
				//return Promise.reject(error);
				
				this.setState({ errorMessage: "Ususario no confirmado", spiner: false});
				console.error('There was an error!', error);
			}

			if(data?.jwt && data?.user?.confirmed){
				this.setState({ 
					postId: data.jwt,
					isLoaded: true,
					items: data 
				})
				if(this.context.Facturation){
					localStorage.setItem("JWTneppi", data.jwt)
		
					this.context.updateContext({

						userInfo: data?.user,
						jwtStrapi: data.jwt,
					})
				} else {
					const data2 = JSON.stringify({
						"tokenTerminal": this.context.id
						});
		
						const configComercio = {
						method: 'post',
						url: REACT_APP_SERVER_BACKEND+'/comercios/getComercioFromToken',
						headers: { 
							'Authorization': 'Bearer '+data.jwt, 
							'Content-Type': 'application/json'
						},
						data : data2
						};
						try {
							const response2 = await axios(configComercio)
							if(response2?.data?.status == "Success"){
								this.setState({ 
									infoComercio: response2?.data?.dataEnvio ,
									spiner: false
								})
								localStorage.setItem("JWTneppi", data.jwt)
		
									this.context.updateContext({
										infoComercio: response2?.data?.dataEnvio ,
										id_sucursal: response2?.data?.id_sucursal_preticion, 
										id_terminal: response2?.data?.id_terminal_preticion,
										userInfo: data?.user,
										jwtStrapi: data.jwt,
									})
				
								
		
							} else if(response2?.data?.mensaje) {
								this.setState({ errorMessage: response2?.data?.mensaje, spiner: false});
		
							} else {
								this.setState({ errorMessage: "no se logro recuperar la data de la tienda", spiner: false});
		
							}
						} catch (error) {
							this.setState({ errorMessage: error.toString(), spiner: false });
							console.error('There was an error!', error);
						}
				}
				

			}
		} catch (error) {
			this.setState({ errorMessage: error.toString(), spiner: false });
			console.error('There was an error!', error);
		}
		


		
	}
	
	copyright = (props_cr) => {
		const get_props = props_cr;
		return (
			<Typography variant="body2" color="text.secondary" align="center" {...get_props}>
			  {'Copyright '} &copy; {' '} {new Date().getFullYear()} {' | '}
			  <a color="inherit" href="https://neppi.io/" target="blank">
				Neppi - Buy Now, pay Later 
			  </a>
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
		const { postId, isLoaded, items, errorMessage, redirectEstate } = this.state;
		if(redirectEstate){
			return (
				<React.Fragment>
				<Navigate to="/redirect" replace={true} />
			   </React.Fragment>
		   );
		} else {
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
						   <LoadingButton
							   type="submit"
							   fullWidth
							   loading={this.state.spiner}
							   variant="contained"
							   sx={{ mt: 3, mb: 2 }}
						   >
						   Sign In
						   </LoadingButton>

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
		}
		 //end return
	} //end render
} //end class

export default AuthUserCheckout;
