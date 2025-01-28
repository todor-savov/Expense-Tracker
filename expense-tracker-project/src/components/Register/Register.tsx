import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfUserExists, createUser } from '../../service/database-service.js';
import { handleUserDelete, registerUser } from '../../service/authentication-service.js';
import AuthContext from '../../context/AuthContext.js';
import { NAME_MIN_CHARS, NAME_MAX_CHARS, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, 
        PASSWORD_MIN_CHARS, PASSWORD_MAX_CHARS, EMAIL_REGEX, PHONE_REGEX, PHONE_DIGITS, 
        DIGIT_REGEX, LETTER_REGEX, ALPHA_NUMERIC_REGEX, SPECIAL_CHARS_REGEX, DEFAULT_IMAGE, 
        } from '../../common/constants.js';
import { Alert, CircularProgress, Snackbar, Stack, TextField } from '@mui/material';
import './Register.css';

interface Form {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    username: string;
    password: string;
    photo: string;
}

const Register = () => {
    const { setLoginState } = useContext(AuthContext);
    const [form, setForm] = useState<Form|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
            const registrationHandler = async () => {
                try {
                    setError(null);
                    setLoading(true);
                    const userCredentials = await registerUser(form?.emailAddress as string, form?.password as string);
                    if (typeof userCredentials === 'string') throw new Error(`Failed to register ${form?.emailAddress} user with authentication service.`);
                    const response = await checkIfUserExists(form?.username as string, form?.phoneNumber as string);
                    if (typeof response === 'string') {
                        const result = handleUserDelete();
                        if (typeof result === 'string') {
                            throw new Error(`Failed to check if user exists in database.
                                            ${result}`);
                        } else {
                            throw new Error(`Failed to check if user exists in database.`);
                        }
                    }

                    const [user, phone] = response;
                    if (user.exists() || phone.exists()) {
                        const result = handleUserDelete();
                        if (typeof result === 'string') {
                            throw new Error(`User with that username/phone number already exists.
                                            ${result}`);
                        } else {
                            throw new Error(`User with that username/phone number already exists.`);
                        }
                    }

                    const status = await createUser({
                        firstName: form?.firstName as string, 
                        lastName: form?.lastName as string, 
                        email: form?.emailAddress as string,
                        phone: form?.phoneNumber as string,
                        username: form?.username as string, 
                        photo: form?.photo as string,
                        role: 'author',
                        isBlocked: false,
                        settings: {
                            activityNotifications: 'enabled',
                            activityNotificationLimit: 100,
                            budgetNotifications: 'enabled',
                            budgetNotificationLimit: 100,
                            currency: 'BGN',
                        }                                                
                    });
                                     
                    if (!status) {
                        setLoading(false);
                        setLoginState({ status: true, user: form?.emailAddress as string });
                        navigate('/home');
                    } else {
                        const result = handleUserDelete();
                        if (typeof result === 'string') {
                            throw new Error(`Failed at registering user in database.
                                            ${result}`);
                        } else {
                            throw new Error(`Failed at registering user in database.`);
                        }
                    }
                } catch (error: any) {
                    setLoading(false);
                    setError(error.message);
                    console.log(error.message);
                    setOpenSnackbar(true);
                }
            }
            if (form) registrationHandler();
     }, [form]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const firstName: string = e.currentTarget.firstName.value;
        const lastName: string = e.currentTarget.lastName.value;
        const emailAddress: string = e.currentTarget.email.value;
        const phoneNumber: string = e.currentTarget.phone.value;
        const username: string = e.currentTarget.username.value;
        const password: string = e.currentTarget.password.value;
        
        if (firstName.length < NAME_MIN_CHARS || firstName.length > NAME_MAX_CHARS 
            || !LETTER_REGEX.test(firstName) || DIGIT_REGEX.test(firstName) || SPECIAL_CHARS_REGEX.test(firstName)) {
            setError(`First name must contain ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters, upper- and/or lowercase letters only.`);
            setOpenSnackbar(true);
            return;
        }

        if (lastName.length < NAME_MIN_CHARS || lastName.length > NAME_MAX_CHARS 
            || !LETTER_REGEX.test(lastName) || DIGIT_REGEX.test(lastName) || SPECIAL_CHARS_REGEX.test(lastName)) {
            setError(`Last name must contain ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters, upper- and/or lowercase letters only.`);
            setOpenSnackbar(true);
            return;
        }

        if (!EMAIL_REGEX.test(emailAddress)) {
            setError(`${emailAddress} is not a valid email address.`);
            setOpenSnackbar(true);
            return;
        }

        if (!PHONE_REGEX.test(phoneNumber)) {
            setError(`Phone number must contain ${PHONE_DIGITS} digits exactly.`);
            setOpenSnackbar(true);
            return;
        }

        if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH || !ALPHA_NUMERIC_REGEX.test(username)) {
            setError(`${username} is not a valid username.`);
            setOpenSnackbar(true);
            return;
        }

        if (password.length < PASSWORD_MIN_CHARS || password.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(password)
            || !DIGIT_REGEX.test(password) || !SPECIAL_CHARS_REGEX.test(password)) {
            setError(`The provided password is invalid.`);
            setOpenSnackbar(true);
            return;
        }

        setForm({ firstName, lastName, emailAddress, phoneNumber, username, password, photo: DEFAULT_IMAGE});
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <div className='registerContainer'>
            <form onSubmit={handleSubmit} className="register-form">                
                <TextField type="text" id="firstName" name="firstName" label={'First Name'} className='input__field' required
                    helperText={<i>{NAME_MIN_CHARS}-{NAME_MAX_CHARS} symbols</i>}
                />

                <TextField type="text" id="lastName" name="lastName" label={'Last Name'} className='input__field' required
                    helperText={<i>{NAME_MIN_CHARS}-{NAME_MAX_CHARS} symbols</i>}
                /> 

                <TextField type="email" id="email" name="email" label={'Email'} className='input__field' required 
                    helperText={<i>Standard email symbols, @ and domain</i>} 
                />

                <TextField type="text" id="phone" name="phone" label={'Phone'} className='input__field' required
                    helperText={<i>{PHONE_DIGITS} digits exactly</i>} 
                /> 

                <TextField type="text" id="username" name="username" label={'Username'} className='input__field' required
                    helperText={<i>{USERNAME_MIN_LENGTH}-{USERNAME_MAX_LENGTH} symbols, letters or digits</i>}
                /> 

                <TextField type="password" id="password" name="password" label={'Password'} className='input__field' required
                    helperText={<i>{PASSWORD_MIN_CHARS}-{PASSWORD_MAX_CHARS} symbols, ONE digit, letter AND a special symbol</i>} 
                /> 

                {loading ?
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                        <CircularProgress color="success" size='3rem' />
                    </Stack>
                    :   
                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 6 }}
                    >
                        <Alert onClose={handleSnackbarClose} severity='error' variant="filled"> {error} </Alert>
                    </Snackbar>
                }

                {!loading && <button className='register-button' type="submit">Register</button>}
            </form>
        </div>
    )
}

export default Register;