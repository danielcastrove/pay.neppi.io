import React, { Component } from 'react';
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
import {
	BrowserRouter as Router,
	Switch,
	Route
  } from "react-router-dom";
//import AddressForm from './AddressForm';
//import PaymentForm from './PaymentForm';
//import Review from './Review';

const steps = ['Shipping address', 'Payment details', 'Review your order'];
const theme = createTheme();

export class CheckoutPaylater extends Component {
	state = {
		step: 1,
		email: '',
		password: '',
		occupation: '',
		firstName: '',
		lastName: '',
		city: '',
		bio: '',
		show: false,
		showHeader: true,
		showTitle: true,
		showLabel: true,
		showButton: true,
		showCopy: true,
		showPaper: true,
		url: '',
		path: '',
		params: {
		  id: '',
		  commerce_tk: '',
		  amount: '',
		  bank_provider: '',
		  origin: '',
		  redirect_uri: '',
		  token_pay: '',
		  token_con_u: ''
		},
		container: {
		  component: "main",
		  maxWidth: "sm",
		  sx_mb: 4
		},
		paper:{
		  variant: "outlined",
		  sx_my_xs: 3,
		  sx_my_md: 6,
		  sx_p_xs: 2,
		  sx_p_md: 3
		}
		
	};

	componentDidMount() {
		//creado por danielcastrove
		//this.urlParamsF();}
		//const { params } = this.state;;
		//const location = useLocation();
		const { show, step } = this.state;
		
		//obtenemos las variables get
		let get_params = new URLSearchParams(window.location.search);
		//segun el caso cambiamos las variables de los estaos
		if(get_params.has("id") && get_params.has("amount")){
			this.setState({
				show: true,
				url: window.location.href,
				path: window.location.pathname,
				params: {
					 id: get_params.get("id"),
					 commerce_tk: get_params.get("commerce_tk"),
					 amount: get_params.get("amount"),
					 bank_provider: get_params.get("bank_provider"),
					 origin: get_params.get("origin"),
					 redirect_uri: get_params.get("redirect_uri"),
					 token_pay: '',
					 token_con_u: ''
				}	
			});
			
			if(step==1){
				this.setState({
					showHeader: false,
					showTitle: false,
					showButton: false,
					showLabel: false,
					showCopy: false,
					showPaper: true,
					container: {
					  component: "main",
					  maxWidth: "xs",
					  sx_mb: 0
					}
				});
			}
		}
		else{
			if(!show){
				this.setState({
					showHeader: true,
					showTitle: false,
					showButton: false,
					showLabel: false,
					showCopy: true
				});
			}
		}	
	} //end fuction componentDidMount 

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
	};
	
	getStepContent = (step) => {
		const { showHeader, values, params } = this.state;
	
					return (

						<Router>
							<Switch>

								<Route path="/redirect">
									<h1>Estoy en la redireccion</h1>
								</Route>
								<Route path="/">
									<AuthUserCheckout
									nextStep={this.nextStep}
									handleChange={this.handleChange}
									values={values}
									showHeader={showHeader}
									params={params}
									/>
								</Route>
							</Switch>
						</Router>
					);
				}

	
	// Proceed to next step
	nextStep = () => {
		const { step } = this.state;
		this.setState({
		  step: step + 1
		});
	};

	// Go back to prev step
	prevStep = () => {
		const { step } = this.state;
		this.setState({
		  step: step - 1
		});
	};

	// Handle fields change
	handleChange = input => e => {
		this.setState({ [input]: e.target.value });
	};

	render() {
		const { step } = this.state;
		const { email, password, firstName, lastName, occupation, city, bio } = this.state;
		const values = { email, password, firstName, lastName, occupation, city, bio };
		const { show, showButton, showHeader, showTitle, showLabel, showCopy, showPaper, container, paper, url, path, params } = this.state;
		
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
								{this.getStepContent(step)}
								{showButton && (
									<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
										{step !== 0 && (
											<Button onClick={this.prevStep} sx={{ mt: 3, ml: 1 }}>
											  Back
											</Button>
										)}
										
										<Button
											variant="contained"
											onClick={this.nextStep}
											sx={{ mt: 3, ml: 1 }}
										>
											{step === steps.length - 1 ? 'Place order' : 'Next'}
										</Button>
									</Box>
								)}	
							</React.Fragment>
							)}
						</React.Fragment>
					</Paper>
					
					{showLabel  && (
					<this.copyright />
					)}
					
				</Container>
			</ThemeProvider>
		);
	}
}

export default CheckoutPaylater;