import { useEffect, useState } from "react";
import { sendResetLink } from "../../service/authentication-service";
import { Alert, Box, CircularProgress, Snackbar, Stack, TextField } from "@mui/material";
import { EMAIL_REGEX } from '../../common/constants';
import "./ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    useEffect(() => {
        const sendPasswordResetLink = async () => {
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await sendResetLink(email as string);
                if (typeof response === 'string') throw new Error('Failed to send the reset link.');
                setSuccessMessage(`If an account with this email exists, a password reset link has been sent to it.`);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        if (email) sendPasswordResetLink();
    }, [email]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const email = (event.target as HTMLFormElement).email.value;

        if (!EMAIL_REGEX.test(email)) {
            setError(`${email} is not a valid email address.`);
            setOpenSnackbar(true);
            return;
        }

        setEmail(email);
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box id='forgot-password-container'>
            <Box id='forgot-password-image'></Box>

            <Box component="form" onSubmit={handleSubmit} id="forgot-password-form">
                <TextField id="email" name="email" label="Email address" className="forgot-pass-input-field" required
                    helperText={"Send a password reset link to the provided email address"} />
                    
                {loading ?
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                        <CircularProgress color="success" size='3rem' />
                    </Stack>
                    :     
                    <button id='forgot-password-button' type="submit">Send</button> 
                }                                                                                                   
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} variant="filled">
                    {error ? error : successMessage}
                </Alert>
            </Snackbar>    
        </Box>
    );
}

export default ForgotPassword;