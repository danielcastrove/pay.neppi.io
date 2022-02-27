import React, {useContext} from 'react';
import { Navigate, useLocation } from "react-router-dom";
import AppContext from '../../contextos/AppContext'
/* const PrivateRoute = (props) => {
  return (
    <Route exact={props.exact} path={props.path} component={props.component} />
  );
}; */

/* const PrivateRoute = (props) => {
  return <Route {...props} />;
}; */

//Simular Autenticación
let auth;
auth = null;
auth = true;

const PrivateRoute = ({ children }) => {
  const MyContext =  useContext(AppContext);
  let location = useLocation();
  console.log(MyContext?.userInfo)
  if (!MyContext?.jwtStrapi  && !MyContext?.userInfo ) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};
export default PrivateRoute;
