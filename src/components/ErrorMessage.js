import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export class ErrorMessage extends Component {

	render() {
		const { printMsg } = this.props;
    
		return (
			<React.Fragment>
				<Typography variant="h5" gutterBottom>
					{printMsg[0]}
				</Typography>
		
				<Typography variant="subtitle1">
				  {printMsg[1]}
				</Typography>
			</React.Fragment>
		);
	}
}

export default ErrorMessage;
