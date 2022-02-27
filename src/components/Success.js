import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from '../contextos/AppContext'
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import {confirmationoOperation, confirmationFinalOperation} from '../services/CIBC/CIBC'
import {
    Navigate
  } from "react-router-dom"

export class Success extends Component {
  static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
      isValidate: false,
      getParams :false,
      mensajeFinal: "Conformed payment. Redirecting...",
      id_factura: this.context?.id_factura
		};
  }
  continue = e => {
    e.preventDefault();
    // PROCESS FORM //
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  async componentDidMount() {
        if(this.context.redirectData?.idredirect && this.context.redirectData?.producto ){

          if(this.context.redirectData?.producto == "bnpl-cibc"){
            let code = ""
            let urlEnvio = "";
            if(this.context?.urlFinalLogin) {
              urlEnvio = this.context?.urlFinalLogin.split('#');
              const urlParams = new URLSearchParams(this.context?.urlFinalLogin?.replace("#","&"));
              code  = urlParams.get('code');


            } else{
              urlEnvio = window.location.href.split('#');
              const urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
              code  = urlParams.get('code');


            }
            const ConfirmacionObject = await confirmationoOperation(this.context.redirectData?.idredirect, code ,this.context?.jwtStrapi, urlEnvio[0])

            if(ConfirmacionObject.estatus){
              if(ConfirmacionObject.estado_operacion?.dataEnvio?.access_token_CIBC){
                const LinkConsulta = await JSON.parse(ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.generalData)
                if(LinkConsulta?.Links?.Self){

                  const monto = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.monto
                  const proveedor = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.banco?.id
                  const userComprador = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.usuario?.id
                  const id_terminal = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.id_terminal
                  const id_sucursal = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.id_sucursal
                  const id_comercio = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.id_comercio
                  const fecha_realizacion_operacion = LinkConsulta?.Data?.CreationDateTime
                  const producto_id = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.producto?.id
                  const pais = ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.banco?.pais_id

                  const ConfirmacionFinalEstado = await confirmationFinalOperation(pais, producto_id, fecha_realizacion_operacion, id_comercio, id_sucursal, id_terminal, userComprador, monto, proveedor, ConfirmacionObject.estado_operacion?.dataEnvio?.access_token_CIBC, LinkConsulta?.Links?.Self, this.context?.jwtStrapi)
                  console.log(ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.url_rediceccion_comercio)
                  if(ConfirmacionFinalEstado.estatus && ConfirmacionFinalEstado?.data?.id_factura_info){ 
                    this.setState({
                      isValidate: true
                    })
                    this.context.updateContext({
                      redirect_uri: ConfirmacionObject.estado_operacion?.dataEnvio?.DataRedirectUpdate?.url_rediceccion_comercio,
                      id_factura: ConfirmacionFinalEstado?.data?.id_factura_info,
                    })
                    setTimeout(() => {
                      this.setState({
                        id_factura: ConfirmacionFinalEstado?.data?.id_factura_info
                      })
                    }, 1500);
                    console.log(this.context)
                  } else {
                    this.setState({
                      mensajeFinal: "ERROR, " +ConfirmacionFinalEstado.mensaje + " le sugerimos intentar su operacion nuevamente",
                      isValidate: true
                    })
                  }
                }else {
                  this.setState({
                    mensajeFinal: "ERROR, " + "Link de consulta Faltante",
                    isValidate: true
                  })
                }

              } else {
                this.setState({
                  mensajeFinal: "ERROR, " + "access_token_CIBC Faltante",
                  isValidate: true
                })
              }
            } else {
              this.setState({
                mensajeFinal: "ERROR, " +ConfirmacionObject.mensaje + " le sugerimos intentar su operacion nuevamente",
                isValidate: true
              })
            }


          }
        } else {
          this.setState({
            mensajeFinal: "ERROR, imposible determinar idredirect y Producto parametros",
            isValidate: true
          })
         
        } 
         // 
         /*
         url de ejemplo con datos "dataredirect" aprocesar
http://neppi-dev.ignorelist.com/redirect?dataredirect=eyJpZHJlZGlyZWN0IjoiNjFiYTU1YTU0MzY4YjAxNTMxNjM1ZDI1IiwicHJvZHVjdG8iOiJibnBsLWNpYmMiLCJ0b2tlbkNvbWVyY2lvIjoiZmYxZWNkYTEtNGVhYi00Nzg0LWJiNDItMWFjNzUzNjE0ZGNlIn0=#code=171e513f-579d-4c88-948c-f755e5e8a2e2&id_token=eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNJQkMtbm8ta2lkLWNvbmZpZ3VyZWQifQ.eyJzdWIiOiJHOE9ic2l6TnN4SDRCRGJINXhkZXpTVWdDSDZ5MXNPY3pmLUQ0cmZZSmNvPSIsImFjciI6InVybjpvcGVuYmFua2luZzpwc2QyOnNjYSIsImF1ZCI6Ikc4T2JzaXpOc3hINEJEYkg1eGRlelNVZ0NINnkxc09jemYtRDRyZllKY289IiwiY19oYXNoIjoiaDl5Z0ZacUwyUGJNUUQwLS01c2NSdyIsIm9wZW5iYW5raW5nX2ludGVudF9pZCI6ImZkOTJjMDlmLTcyMzgtNGQ0Ni1hOTJjLTY3MzBlN2I5OWZiMSIsInNfaGFzaCI6InRkUUVYRDlHYjZrZjRzeHF2bmtqS2ciLCJpc3MiOiJodHRwczovL2FwaS5jaWJjLnVzZWluZmluaXRlLmlvIiwiZXhwIjoxNjcxMTM3NjAwLCJ0b2tlbl90eXBlIjoiSURfVE9LRU4iLCJpYXQiOjE2Mzk2MDE2MDAsImp0aSI6ImE3MTgxYWQyLTEyMzctNDMzYi05ZTNmLWVlMGM1NzIwZmE5ZCJ9.KHkJ8AmPFMl3AK8ePEqQy_aXQVowRZiK2T9p3fkJ9SwRs6cI3g-6F9vtf9mOq5gutdknGyLE20sVZaceVZDLLJ4FuDtUGrYiGshXgn5NwBqdC_IEOOzQeXAa-c8zBFcQlzAMLOpqhEPzOO0-eqBtZH5lgDUQcpmZUieWryjokVzEGZcUw_zDkjmzTeHaOty3PzmvbrzGQc9LHpZWEgVtghjGWdTBHVCRunIq7DOruXQD-TJ8UPuNPAbzI5_8MH_geLyPezCYMTlopk3qUuNvdk-Z3MG-c-CSpbMtg0XelMO5CH5cElI8yf56d55E7uURLa8fjk4LYcmxKIbAFNfOMA&state=ABC
         */


  }
  componentWillUnmount() {

  }

  render() {
      if(!this.context?.userInfo || !this.context?.infoComercio || !this.context?.id_sucursal || !this.context?.id_terminal || !this.context?.jwtStrapi ) {
        return (  							
          <React.Fragment>
          <Navigate to="/" replace={true}/>
          </React.Fragment>
        );
      } else if (this.state.id_factura){
        return (  							
          <React.Fragment>
            <Navigate to={"/facture-screen/" + this.state.id_factura} replace={true}/>
          </React.Fragment>
        );
      } else {
        return (  
          <React.Fragment>
                <AppBar title="Success" />
                  <Typography variant="h5"  textAlign="center">
                  Thank you for your order.
                  </Typography>
  
                  { (!this.state.isValidate) ? 
                    <React.Fragment>
                        <Box component="div"  sx={{ mt: 1, mb: 1, display: 'flex', justifyContent: "center" }} >
                        <CircularProgress/>
                        </Box>
                        <Typography variant="subtitle1">
                        Your order is being verified.
                        We have sent your order confirmation by email.
                      </Typography>
                  </React.Fragment> :
                  <Fade in={this.state.isValidate}>
                    <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, display: 'flex', justifyContent: "center", textAlign: "center" }}>
                      {this.state.mensajeFinal}
                    </Typography>
  
                  </Fade>
                  }
            </React.Fragment>
      );
      } 
  }
}

export default Success;
