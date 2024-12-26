import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInUser } from '../../service/authentication-service.ts';
import { getUserSettings } from '../../service/database-service.ts';
import AuthContext from '../../context/AuthContext.tsx';
import { EMAIL_REGEX } from '../../common/constants.ts';
import { Alert, CircularProgress, Snackbar, Stack, TextField } from '@mui/material';
import './Login.css';

interface Form {
    emailAddress: string;
    password: string;
}

const Login = () => {
    const { setLoginState, setSettings } = useContext(AuthContext);
    const [form, setForm] = useState<Form|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
            const loginHandler = async () => {
                try {
                    setError(null);
                    setLoading(true);
                    const userCredentials = await signInUser(form?.emailAddress as string, form?.password as string);
                    if (!userCredentials) throw new Error(`Incorrect login credentials.`);
                    const settings = await getUserSettings(form?.emailAddress as string);
                    if (typeof settings === "string") throw new Error('Error fetching user settings');
                    setLoginState({ status: true, user: form?.emailAddress as string });
                    setSettings(settings);
                    setLoading(false);
                    navigate(location.state?.from.pathname || '/home');
                } catch (error: any) {                    
                    setError(error.message);
                    console.log(error.message);
                    setLoading(false);
                    setOpenSnackbar(true);
                }  
            }
            if (form) loginHandler();
    }, [form]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {        
        e.preventDefault();

        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        };

        const emailAddress = target.email.value;
        const password = target.password.value;

        if (!EMAIL_REGEX.test(emailAddress)) {
            setError(`${emailAddress} is not a valid email address.`);
            setOpenSnackbar(true);
            return;
        }

        setForm({ emailAddress, password });
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <div className='loginContainer'>
            <form onSubmit={handleSubmit} className="login-form">
                <p><strong>Welcome back to Expense Tracker</strong></p>

                {!loading && <Link to="/forgot-password" className='forgot-password'>Forgot password?</Link>}

                <TextField type="email" id="email" name="email" label={'Email address'} required />

                <TextField type="password" id="password" name="password" label={'Password'} required />

                {loading ?
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                        <CircularProgress color="success" size='3rem' />
                    </Stack>
                    :   
                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 8 }}
                    >
                        <Alert onClose={handleSnackbarClose} severity='error' variant="filled"> {error} </Alert>
                    </Snackbar>
                }

                {!loading && 
                    <div>
                        <button className='btn' type="submit">Login</button>            
                        New user? Register <span onClick={()=> navigate("/register")} id='span-sign-up'>here.</span>
                    </div>
                }
            </form>
        </div>
    )
}

export default Login;