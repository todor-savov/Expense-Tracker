import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfUserExists, createUser } from '../../service/database-service.js';
import { handleUserDelete, registerUser } from '../../service/authentication-service.js';
import AuthContext from '../../context/AuthContext.js';
import { NAME_MIN_CHARS, NAME_MAX_CHARS, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, 
        PASSWORD_MIN_CHARS, PASSWORD_MAX_CHARS, EMAIL_REGEX, PHONE_REGEX, PHONE_DIGITS, 
        DIGIT_REGEX, LETTER_REGEX, ALPHA_NUMERIC_REGEX, SPECIAL_CHARS_REGEX, DEFAULT_IMAGE, 
        } from '../../common/constants.js';
import { TextField } from '@mui/material';
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
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [form, setForm] = useState<Form>({
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        username: '',
        password: '',
        photo: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
            const registrationHandler = async () => {
                try {
                    setLoading(true);
                    const userCredentials = await registerUser(form.emailAddress, form.password);
                    if (!userCredentials) throw new Error(`User with ${form.emailAddress} email address could not be created.`);
                    const response = await checkIfUserExists(form.username, form.phoneNumber);
                    if (typeof response === 'string') throw new Error(response);
                    const [user, phone] = response;

                    if (user.exists() || phone.exists()) {
                        setLoading(false);
                        handleUserDelete();
                    }

                    if (user.exists()) return setError(`Username already exists.`);
                    if (phone.exists()) return setError(`Phone number already in use.`);

                    const creationStatus = await createUser({
                        firstName: form.firstName, 
                        lastName: form.lastName, 
                        email: form.emailAddress, 
                        phone: form.phoneNumber,
                        username: form.username, 
                        photo: form.photo,
                        role: 'author',
                        isBlocked: false,
                    });
                    
                    if (!creationStatus) {
                        setLoading(false);
                        setLoginState({status: true, user: form.emailAddress});
                        navigate('/home');
                    }
                } catch (error: any) {
                    setLoading(false);
                    setError(error.message);
                }
            }
            if (isFormSubmitted) registrationHandler();
     }, [form]);

    const register = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const firstName: string = event.currentTarget.firstName.value;
        const lastName: string = event.currentTarget.lastName.value;
        const emailAddress: string = event.currentTarget.email.value;
        const phoneNumber: string = event.currentTarget.phone.value;
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        
        if (firstName.length < NAME_MIN_CHARS || firstName.length > NAME_MAX_CHARS 
            || !LETTER_REGEX.test(firstName) || DIGIT_REGEX.test(firstName) || SPECIAL_CHARS_REGEX.test(firstName)) {
            setError(`First name must contain upper- and lowercase letters only and must be between ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters long.`);
            return;
        }

        if (lastName.length < NAME_MIN_CHARS || lastName.length > NAME_MAX_CHARS 
            || !LETTER_REGEX.test(lastName) || DIGIT_REGEX.test(lastName) || SPECIAL_CHARS_REGEX.test(lastName)) {
            setError(`Last name must contain upper- and lowercase letters only and must be between ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters long.`); 
            return;
        }

        if (!EMAIL_REGEX.test(emailAddress)) {
            setError(`${emailAddress} is not a valid email address.`);
            return;
        }

        if (!PHONE_REGEX.test(phoneNumber)) {
            setError(`Phone number must contain ${PHONE_DIGITS} digits exactly.`);
            return;
        }

        if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH || !ALPHA_NUMERIC_REGEX.test(username)) {
            setError(`${username} is not a valid username.`);
            return;
        }

        if (password.length < PASSWORD_MIN_CHARS || password.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(password)
            || !DIGIT_REGEX.test(password) || !SPECIAL_CHARS_REGEX.test(password)) {
            setError(`The provided password is invalid.`);
            return;
        }

        setForm({ firstName, lastName, emailAddress, phoneNumber, username, password, photo: DEFAULT_IMAGE});
        setIsFormSubmitted(true);
    }

    if (loading) {
        return (
            <div className='spinner'></div>
        )
    }

    return (
        <div className='registerContainer'>
            <form onSubmit={register} className="register-form">
            <p>User Registration</p>
                {error && <div className='error-message'>{error}</div>}

                <TextField type="text" id="firstName" name="firstName" label={'First Name'} className='input__field' required
                    helperText={<i>{NAME_MIN_CHARS}-{NAME_MAX_CHARS} characters</i>} 
                />

                <TextField type="text" id="lastName" name="lastName" label={'Last Name'} className='input__field' required
                    helperText={<i>{NAME_MIN_CHARS}-{NAME_MAX_CHARS} characters</i>} 
                /> 

                <TextField type="email" id="email" name="email" label={'Email'} className='input__field' required 
                    helperText={<i>Standard email characters, @ and domain</i>} 
                />
                <br />

                <TextField type="text" id="phone" name="phone" label={'Phone'} className='input__field' required
                    helperText={<i>{PHONE_DIGITS} digits exactly</i>} 
                /> 

                <TextField type="text" id="username" name="username" label={'Username'} className='input__field' required
                    helperText={<i>{USERNAME_MIN_LENGTH}-{USERNAME_MAX_LENGTH} characters, upper-/lowercase OR digits</i>} 
                /> 

                <TextField type="password" id="password" name="password" label={'Password'} className='input__field' required
                    helperText={<i>{PASSWORD_MIN_CHARS}-{PASSWORD_MAX_CHARS} characters, a digit, letter AND a special character as minimum</i>} 
                /> 

                <button className='btn' type="submit">Register</button>
            </form>
        </div>
    )

}

export default Register;