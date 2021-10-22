import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

export class ErrorMessage extends Component {

  render() {
	const { printMsg } = this.props;
    
	return (
      <MuiThemeProvider>
        <>
          <Dialog
            open
            fullWidth
            maxWidth='sm'
          >
            <AppBar title="Success" />
            <h1>{printMsg[0]}</h1>
            <p>{printMsg[1]}</p>
          </Dialog>
        </>
      </MuiThemeProvider>
    );
  }
}

export default ErrorMessage;
