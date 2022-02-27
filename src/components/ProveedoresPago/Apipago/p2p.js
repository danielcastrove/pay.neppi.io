
import React, {useEffect, useState, useContext} from 'react';
import AppContext from '../../../contextos/AppContext'



const BnplIcbc = (props) => {
	const MyContext =  useContext(AppContext);
	console.log("p2p \n",MyContext)
	const singIn = () => {
		
	}

	return(<React.Fragment>
			<h1>aqui BnplIcbc</h1>
		   </React.Fragment>)
}

export default BnplIcbc;