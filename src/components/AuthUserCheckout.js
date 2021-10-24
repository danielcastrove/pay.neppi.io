import React, { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ErrorMessage from './ErrorMessage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import genetareConcentID from '../services/genetareConcentID'
import axios from 'axios';

const theme = createTheme();

export class AuthUser extends Component {
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
		  tokenId: this.props.params.id,
		  printMsg: ["Warning: the correct information was not sent to make the payment.", "Please Return to Trade ..."]
		};

	}
	validateParams = () => {
		const { show, showButton, showHeader, values, params } = this.state;
		const printMsg = ["Warning: the correct information was not sent to make the payment.", "Please Return to Trade ..."];
	
					
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
							const objectoConcentID = genetareConcentID()
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
	
	continue = () => {
		this.props.nextStep();
	};
	
	render() {
		const { values, handleChange, params } = this.props;
		const { postId, isLoaded, items, errorMessage  } = this.state;
		if (this.validateParams()) {

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
						Sign in and purchase
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
						{ (!postId)?
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In: postId: {postId} | id: {params.id}
						</Button>
						:
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							onClick={this.continueClick}
						>
							Ir al Dashboard { /*: postId: {postId} | id: {params.id}*/}
						</Button>
						}
						
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
								  Forgot password?
								</Link>
							</Grid>
						  
							<Grid item>
								<Link href="#" variant="body2">
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
}

export default AuthUser;
