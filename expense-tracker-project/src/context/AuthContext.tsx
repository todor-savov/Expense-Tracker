import { createContext } from "react";

interface UserSettings { 
    activityNotifications: string;
    budgetNotifications: string;
    currency: string;
}

interface AuthContextType {
    isLoggedIn: { status: boolean; user: string };
    setLoginState: (value: { status: boolean; user: string }) => void;
    settings: UserSettings | null;
    setSettings: (settings: UserSettings | null) => void;
  }

const AuthContext = createContext<AuthContextType>({  
    isLoggedIn: {status: false, user: ''},
    setLoginState: (value: {status: boolean, user: string}) => {console.log(value)},
    settings: null,
    setSettings: () => {},
});
    
export default AuthContext;