import { useContext, useEffect, useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase-config.ts';
import AuthContext from '../context/AuthContext.tsx';
import { getUserSettings } from '../service/database-service.ts';

interface UserSettings { 
    activityNotifications: string;
    activityNotificationLimit: number;
    budgetNotifications: string;
    budgetNotificationLimit: number;
    currency: string;
}

const Authenticated = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, setLoginState, setSettings } = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();

    useEffect(() => {
        auth.onAuthStateChanged(async currentUser => {
            if (currentUser) {                       
                try {                    
                    setLoginState({ status: true, user: currentUser.email || '' });
                    const userSettings = await getUserSettings(currentUser.email as string);
                    if (typeof userSettings === "string") throw new Error('Error fetching user settings');
                    setSettings(userSettings as UserSettings);
                } catch (error) {
                    console.log(error);
                }
            }
            setLoading(false);
        });       
    }, []);

    if (loading) {
        return  <div className='spinnerContainer'>
                    <div className='spinner'></div>
                </div>
    }
    
    if(!isLoggedIn.status) {
        return <Navigate replace to="/login" state={{ from: location }}/>
    }

    return <> {children} </>
}

export default Authenticated;