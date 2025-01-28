import { useEffect, useState } from "react";
import { sendResetLink } from "../../service/authentication-service";
import Header from "../../components/Header/Header";
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, TextField } from "@mui/material";
import Footer from "../../components/Footer/Footer";
import { EMAIL_REGEX } from '../../common/constants';
import './ForgotPasswordView.css';

const ForgotPasswordView = () => {
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
    }, [email])

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
        <>
            <Header from={"Forgotten password"} />
            <div className="central-container">
                <Box component="form" onSubmit={handleSubmit} className="forgot-password-form">
                    <TextField id="email" name="email" label="Email address" variant="outlined" required 
                        helperText={"Send a password reset link to the provided email address"} />
                        
                    {loading ?
                        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                            <CircularProgress color="success" size='3rem' />
                        </Stack>
                        :                         
                        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 8 }}
                        >
                            <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} variant="filled">
                                {error ? error : successMessage}
                            </Alert>
                        </Snackbar>
                    }

                    {!loading && <Button type="submit" variant="contained" color="primary"><strong>Send</strong></Button>}                        
                </Box>
            </div>
            <Footer />
        </>
    );
}

export default ForgotPasswordView;