import React, {useEffect, useCallback, useContext, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {GetCuotasSelect} from '../../../services/NEPPI/NEPPI'
import AppContext from '../../../contextos/AppContext'
import { Alert } from '@mui/material';

export default function SelectAutocomplete({productID,onChangePadre}) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
	const MyContext =  useContext(AppContext);

  const TraerCuotas = useCallback(async () => {
		setErrorMessage("")     
    let ArrayDevolucion = []

    const objetoSelectFunction = await GetCuotasSelect(MyContext?.jwtStrapi, productID )

    if(objetoSelectFunction?.estatus){

      ArrayDevolucion = objetoSelectFunction?.ArrayData

    } else {
      setErrorMessage(objetoSelectFunction?.mensaje);
    }

      return ArrayDevolucion
    
    }, [])


  useEffect(() => {
		setErrorMessage("")     

    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const ArrayCuotas = await TraerCuotas(); // For demo purposes.

      if (active) {
        setOptions(ArrayCuotas);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <React.Fragment>
    {
      (errorMessage) ?
         <Alert  sx={{ width: "100%", mb:4 }} variant="filled" severity="error">
            {errorMessage}
         </Alert>:
        null  
      
    }
    <Autocomplete
      id="asynchronousCuotasSelect"
      sx={{ width: "100%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={onChangePadre}
      isOptionEqualToValue={(option, value) => option.codigo_de_cuota === value.codigo_de_cuota}
      getOptionLabel={(option) => option.codigo_de_cuota}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cuotas de pago"
          InputProps={{
            ...params.InputProps,
            readOnly:true,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
    </React.Fragment>
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
