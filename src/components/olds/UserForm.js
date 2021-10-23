import React, { Component } from 'react';
import AuthUser from './AuthUser';
import FormPersonalDetails from './FormPersonalDetails';
import Confirm from './Confirm';
import Success from './Success';
import ErrorMessage from './ErrorMessage';

export class UserForm extends Component {
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
    }
  };

  componentDidMount() {
    //creado por danielcastrove
    //this.urlParamsF();}
    //const { params } = this.state;;
    //const location = useLocation();
	//const { show } = this.state;
	//obtenemos las variables get
    let get_params = new URLSearchParams(window.location.search);
    //segun el caso cambiamos las variables de los estaos
    if(get_params.has("id")){
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
    } 
  } //end fuction componentDidMount 

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
		const { show, url, path, params } = this.state;
		const printMsg = ["Warning: the correct information was not sent to make the payment.", "Please Return to Trade ..."];
		
		switch (step) {
			case 1:
				if(show){
					return (
						<AuthUser
						  nextStep={this.nextStep}
						  handleChange={this.handleChange}
						  values={values}
						  params={params}
						/>
					);
				}
				else{
					return (
						<ErrorMessage
							printMsg= {printMsg}
							handleChange={this.handleChange}
						/>
					);
				}  
			case 2:
				return (
				  <FormPersonalDetails
					nextStep={this.nextStep}
					prevStep={this.prevStep}
					handleChange={this.handleChange}
					values={values}
				  />
				);
			case 3:
				return (
				  <Confirm
					nextStep={this.nextStep}
					prevStep={this.prevStep}
					values={values}
				  />
			);
			case 4:
				return <Success />;
			default:
				(console.log('This is a multi-step form built with React.'))
		}
	}
}

export default UserForm;
