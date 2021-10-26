import React from 'react';

 const AppContext = React.createContext({

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
        params: {
        id: '',
        commerce_tk: '',
        amount: '',
        bank_provider: '',
        origin: '',
        redirect_uri: '',
        jwtCIBC: "",		
        jwtStrapi: "",
        infoComercio:{}
        },
        updateContext: () => {

        }

});
export default AppContext