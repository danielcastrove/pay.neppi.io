import React, { Component } from 'react';
import EnvolturaContextoPrincipal  from './components/EnvolturaContextoPrincipal';
import AppContext from './contextos/AppContext'
import Fade from '@mui/material/Fade';

const AppFragment = (        
  <div className="App">
    <EnvolturaContextoPrincipal />
  </div>)

class App extends Component  {
  

  updateContext = valor => {
    this.setState({ ...this.state.provider, ...valor });
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ opacitiStyle: true });
    }, 500);
  }

  state = {
      email: '',
      password: '',
      occupation: '',
      firstName: '',
      lastName: '',
      city: '',
      bio: '',
      url: '',
      path: '',
      dataEncrytada: "",
      nonce: "",
      userInfo: "",
      infoComercio:"",
      id_sucursal:"",
      id_terminal:"",
      id: '',
      commerce_tk: '',
      amount: '',
      bank_provider: '',
      origin: '',
      redirect_uri: '',
      redirectData: "",
      jwtCIBC: "",		
      jwtStrapi: "",
      urlFinalLogin: "",
      Facturation: "",
      id_factura:"",
      Preselect: "",
      opacitiStyle: false,
      updateContext: this.updateContext
  };

  render(){ 
    return (
      <AppContext.Provider value = {this.state}>
      <Fade in={this.state.opacitiStyle}>{AppFragment}</Fade>
      </AppContext.Provider>
    );
  }
}

export default App;
