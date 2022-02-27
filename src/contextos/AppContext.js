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
        userInfo: {},
        infoComercio:{},
        id_sucursal:"",
        id_terminal:"",
        id: '',
        commerce_tk: '',
        amount: '',
        bank_provider: '',
        origin: '',
        redirect_uri: '',
        redirectData: {},
        jwtCIBC: "",		
        jwtStrapi: "",
        urlFinalLogin: "",
        Facturation: "",
        id_factura:"",
        Preselect:"",
        opacitiStyle: "noOpacity",
        updateContext: () => {

        }

});
export default AppContext