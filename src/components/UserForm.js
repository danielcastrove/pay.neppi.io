import React, { Component } from 'react';
import FormUserDetails from './FormUserDetails';
import FormPersonalDetails from './FormPersonalDetails';
import Confirm from './Confirm';
import Success from './Success';

export class UserForm extends Component {
  state = {
    step: 1,
    firstName: '',
    lastName: '',
    email: '',
	pass: '',
    occupation: '',
    city: '',
    bio: '',
	show: false,
    url: '',
    path: '',
    params: ''
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
        params: get_params.get("id")
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
		const { firstName, lastName, email, occupation, city, bio, params } = this.state;
		const values = { firstName, lastName, email, occupation, city, bio, params };

		switch (step) {
			case 1:
				if(show){
					return (
						<FormUserDetails
						  nextStep={this.nextStep}
						  handleChange={this.handleChange}
						  values={values}
						  params={params}
						/>
					);
				}
				else{
				  return (<h1>Advertencia no envio los datos correctos: Retornar al comercio...</h1>);
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
