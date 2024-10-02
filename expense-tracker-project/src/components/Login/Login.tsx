import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInUser } from '../../service/authentication-service.ts';
import { getUserDetails } from '../../service/database-service.ts';
import AuthContext from '../../context/AuthContext.tsx';
import { EMAIL_REGEX } from '../../common/constants.ts';
import { TextField } from '@mui/material';
import './Login.css';

interface Form {
    emailAddress: string;
    password: string;
}

const Login = () => {
    const { setLoginState } = useContext(AuthContext);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [form, setForm] = useState<Form>({ emailAddress: '', password: '' });
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
            const loginHandler = async () => {
                try {
                    setLoading(true);
                    const userCredentials = await signInUser(form.emailAddress, form.password);
                    if (!userCredentials) throw new Error(`Incorrect login credentials.`);
                    const userDetails = await getUserDetails(form.emailAddress);
                    if (!userDetails) throw new Error(`User details not found.`);
                    //if (userDetails[0].isBlocked) throw new Error(`Your account has been blocked. Please contact the administrator.`);
                    setLoading(false);
                    setLoginState({status: true, user: form.emailAddress});
                    navigate(location.state?.from.pathname || '/home');
                } catch (error: any) {
                    setLoading(false);
                    setError(error.message);
                    console.log(error.message);
                }  
            }
            if (isFormSubmitted) loginHandler();
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
        return  <div className='spinnerContainer'>
                    <div className='spinner'></div>
                </div>
    }

    return (
        <div className='loginContainer'>
            <form onSubmit={loginUser} className="login-form">
            <p><strong>Welcome back to Expense Tracker</strong></p>
                {error && <div className='error-class'>{error}</div>}
                <Link to="/forgot-password" className='forgot-password'>Forgot password?</Link>
                <TextField type="email" id="email" name="email" label={'Email address'} className='input__field' required 
                    sx={{marginBottom: '10px',  marginTop: '15px'}}
                />
                <TextField type="password" id="password" name="password" label={'Password'} className='input__field' required
                    sx={{marginBottom: '10px'}}
                />
                <button className='btn' type="submit">Login</button>
                New user? Register <span onClick={()=> navigate("/register")} id='span-sign-up'>here.</span>
            </form>
        </div>
    )
}

export default Login;