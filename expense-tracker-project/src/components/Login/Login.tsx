import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInUser } from '../../service/authentication-service.ts';
import AuthContext from '../../context/AuthContext.tsx';
import { getUserDetails } from '../../service/database-service.ts';
import { EMAIL_REGEX } from '../../common/constants.ts';
import './Login.css';

const Login = () => {
    const { setLoginState } = useContext<any>(AuthContext);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [form, setForm] = useState<any>({ emailAddress: '', password: '' });
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        if (isFormSubmitted) {
            const loginHandler = async () => {
                try {
                    setLoading(true);                    
                    const userCredentials = await signInUser(form.emailAddress, form.password);
                    if (!userCredentials) throw new Error(`Incorrect login credentials.`);
                    const userDetails = await getUserDetails(form.emailAddress);
                    if (!userDetails) throw new Error(`User details not found.`);
                    if (userDetails[0].isBlocked) throw new Error(`Your account has been blocked. Please contact the administrator.`);
                    setLoading(false);
                    setLoginState({status: true, user: form.emailAddress});
                    navigate(location.state?.from.pathname || '/home');
                } catch (error: any) {
                    setLoading(false);
                    setError(error.message);
                    console.log(error.message);
                }  
            }
            loginHandler();
        }
    }, [form]);

    const loginUser = (event: React.FormEvent<HTMLFormElement>) => {        
        event.preventDefault();

        const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
        };
        const emailAddress = target.email.value;
        const password = target.password.value;

        if (!EMAIL_REGEX.test(emailAddress)) {
            setError(`${emailAddress} is not a valid email address.`);
            return;
        }
        setForm({ emailAddress, password });
        setIsFormSubmitted(true);
    }

    if (loading) {
        return (<div className='spinnerContainer'>
            <div className='spinner'></div>
            </div>
        )
    }

    return (
        <div className='loginContainer'>
        <form onSubmit={loginUser} className="login-form">
        <p>Welcome back <br/> to <span id='span-name'>Expense Tracker</span></p>

            {error && <div>{error}</div>}<br />
            <span className='login-span'><label htmlFor="email">Email address </label>
            <input className='input__field' type="email" name="email" id="email" required /></span> 
            <br />
            <span className='login-span'><label htmlFor="password">Password </label>
            <input className='input__field' type="password" name="password" id='password' required /></span>
            <br />
            <button className='btn' type="submit">Login</button>
            <h5>Don&apos;t have an account?<span onClick={()=> navigate("/register")} id='span-sign-up'> Sign Up</span></h5>
        </form>
        </div>
    )
}

export default Login;