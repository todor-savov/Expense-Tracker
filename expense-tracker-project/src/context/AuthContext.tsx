import { createContext } from "react";

const AuthContext = createContext({  
    isLoggedIn: {status: false, user: ''},
    setLoginState: (value: {status: boolean, user: string}) => {}
});
    
export default AuthContext;