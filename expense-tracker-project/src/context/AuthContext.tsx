import { createContext } from "react";

const AuthContext = createContext({  
    isLoggedIn: {status: false, user: ''},
    setLoginState: (value: {status: boolean, user: string}) => {console.log(value)}
});
    
export default AuthContext;