import React, { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppContext from '../contextos/AppContext'
import {
	BrowserRouter as Router,
	Link
  } from "react-router-dom";

const theme = createTheme();

export class RegisterUser extends Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
		  showButton: true,
		  showHeader: false,
		  postId: '',
		  errorMessage: null,
		  isLoaded: false,
		  items: []
		};
	}
	
	requestSend = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		// eslint-disable-next-line no-console
		console.log({
		  email: data.get('email'),
		  password: data.get('password')
		});
	}	
	
	signUp = (event) => {
		event.preventDefault();
		const data_form = new FormData(event.currentTarget);
		
		const { typeCustomer, isCommerce } = '';
		
		if(data_form.get('typeCustomer')=="commerce"){
			const typeCustomer = "J";
			const isCommerce = true;
		}else{
			const typeCustomer = "V";
			const isCommerce = false;
		}
		
		const requestOptions = {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 
				nombre: data_form.get('firstName'),
				apellido: data_form.get('lastName'),
				telefono: data_form.get('phone'),
				email: data_form.get('email'),
				documento_de_identidad: "V" + data_form.get('identificationCard'),
				crear_user_comercio: isCommerce,
				persona: typeCustomer,
				rif_empresa: data_form.get('identificationCard'),
				nombre_empresa: data_form.get('firstName') + " " + data_form.get('lastName'),
				procedencia_de_registro: "Sitio_web",
				asunto: "Registro de Usuario y Comercio desde pay.nepi.io",
				proyecto: "Neppi",
				provider: "local",
				tipo_de_usuario: "empresa",
				id_user_creador:"6172d57f0455de001a1eae34"
			})
		};
		fetch('https://qa.neppi.io/auth/local/register', requestOptions)
			.then(async response => {
				const isJson = response.headers.get('content-type')?.includes('application/json');
				const data = isJson && await response.json();
				
				/*console.log({
					jwt1: data.jwt,
					email1: data_form.get('email'),
					password1: data_form.get('password')
				});*/

				// check for error response
				if(!response.ok || !data.user._id || data.error) {
					// get error message from body or default to response status			
					const error = (data && data.message) || response.status;
					//return Promise.reject(error);
					
					this.setState({ errorMessage: data.error });
					console.error('There was an error!', data.error);
				}
				
				if(data.user._id && data.user.createdAt){
					this.setState({ 
						postId: data.user._id,
						isLoaded: true,
						items: data 
					})
					
					this.continue()
					
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
	
	
	continue = () => {
		this.props.nextStep();
	};

	render() {
		const { values, handleChange, params } = this.props;
		const { postId, isLoaded, items } = this.state;
		console.log(this.context)
			
		return (
			<React.Fragment>
				<Box
				  sx={{
					marginTop: 8,
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
				  
				  <Typography component="h1" variant="h5">
					Sign up and purchase in installments
				  </Typography>
				  
				  <Box component="form" noValidate onSubmit={this.signUp} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
					  <Grid item xs={12} sm={6}>
						<TextField
						  autoComplete="given-name"
						  name="firstName"
						  required
						  fullWidth
						  id="firstName"
						  label="First Name"
						  autoFocus
						/>
					  </Grid>
					  
					  <Grid item xs={12} sm={6}>
						<TextField
						  required
						  fullWidth
						  id="lastName"
						  label="Last Name"
						  name="lastName"
						  autoComplete="family-name"
						/>
					  </Grid>
					  
					  <Grid item xs={12} sm={6}>
						<TextField
						  required
						  fullWidth
						  id="identificationCard"
						  label="Identification Id"
						  name="identificationCard"
						  autoComplete="identification-card"
						/>
					  </Grid>
					  
					  <Grid item xs={12} sm={6}>
						<TextField
						  required
						  fullWidth
						  id="phone"
						  label="Mobile Phone"
						  name="phone"
						  autoComplete="phone"
						/>
					  </Grid>
					  
					  <Grid item xs={12}>
						<TextField
						  required
						  fullWidth
						  id="email"
						  label="Email Address"
						  name="email"
						  autoComplete="email"
						/>
					  </Grid>
					 
					 {/*
					  <Grid item xs={12}>
						<TextField
						  required
						  fullWidth
						  name="password"
						  label="Password"
						  type="password"
						  id="password"
						  autoComplete="new-password"
						/>
					  </Grid>
					  */}
					  
					  <Grid item xs={12}>
						<FormControl component="fieldset">
						  <FormLabel component="legend">I want:</FormLabel>
						  <RadioGroup row aria-label="typeCustomerid" name="typeCustomer" defaultValue="buyer" label="I want:">
							<FormControlLabel value="buyer" control={<Radio />} label="to buy" />
							<FormControlLabel value="commerce" control={<Radio />} label="to sell" />
						  </RadioGroup>
					    </FormControl>
					  </Grid>
					   
					  <Grid item xs={12}>
						<FormControlLabel
						  control={<Checkbox value="aceptterms" color="primary" />}
						   label={
							   <div>
								  <span>I accept the </span>
								  <Link to={'https://neppi.io/#about'} target="blank">terms and conditions of the service</Link>
								  <span> and </span>
								  <Link to={'https://neppi.io/#faq'} target="blank">privacy policy</Link>
							   </div>
						   }
						/>
					  </Grid>
					</Grid>
					
					<Button
					  type="submit"
					  fullWidth
					  variant="contained"
					  sx={{ mt: 3, mb: 2 }}
					>
					  Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
					  <Grid item>
						<Link to="/" variant="body2">
						  Already have an account? Sign in
						</Link>
					  </Grid>
					</Grid>
				  </Box>
				</Box>

				{ <this.copyright sx={{ mt: 5 }} />}
				
			  </React.Fragment>
		); //end return
	} //end render
} //end class

export default RegisterUser;