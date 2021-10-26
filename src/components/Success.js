import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from '../contextos/AppContext'
import Box from '@mui/material/Box';

export class Success extends Component {
  static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
      isValidate: false
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

  componentDidMount() {
    setTimeout(() => {
         this.setState({isValidate: true}) 
         setTimeout(() => {
          let get_params = new URLSearchParams(window.location.search);
			//segun el caso cambiamos las variables de los estaos

			if(get_params.has("uriworpress") ) {
        window.location = get_params.get("uriworpress")
      } else {
        console.log("error de parametro uriworpress")
      }
         }, 4000);
      }, 7000);

	}
  render() {
    return (
        <>
          <Dialog
            open
            fullWidth
            maxWidth='sm'
          >
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
                    Your order number Buy now, pay later. Is being verified.
                    We have sent your order confirmation by email.
                  </Typography>
              </React.Fragment> :
              <React.Fragment>
                  <Typography variant="subtitle1">
                  Conformed payment. Redirecting to commerce
                </Typography>
              </React.Fragment>
              }
          </Dialog>
        </>
    );
  }
}

export default Success;
