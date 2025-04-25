import React, { useEffect, useState } from "react";
import { DIGIT_REGEX, LETTER_REGEX, PASSWORD_MAX_CHARS, PASSWORD_MIN_CHARS, SPECIAL_CHARS_REGEX } from "../../common/constants";
import { confirmPasswordResetWithToken, verifyPasswordResetToken } from "../../service/authentication-service";
import { Alert, Box, CircularProgress, Snackbar, Stack, TextField, Typography } from "@mui/material";
import "./ResetPassword.css";

const ResetPassword = () => {
    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');
    const [tokenError, setTokenError] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [newPasswordError, setNewPasswordError] = useState<string|null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string|null>(null);
    const[newPassword, setNewPassword] = useState<string>('');

    useEffect(() => {
        const verifyToken = async () => {
            try {            
                setTokenError(null);
                setLoading(true);
                const response = await verifyPasswordResetToken(oobCode as string);
                if (!response) throw new Error('Invalid or expired reset token.');
                setSuccessMessage('Valid reset token. You can now reset your password.');
            } catch (error: any) {
                setTokenError(error.message);               
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        if (oobCode) verifyToken();            
    }, []);

    useEffect(() => {
        const resetPassword = async () => {
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);                
                const status = await confirmPasswordResetWithToken(oobCode as string, newPassword);
                if (typeof status === 'string') throw new Error('Password reset failed');
                setSuccessMessage('Password reset has been successful. You can log in from upper right corner now.');
            } catch (error: any) {
                setError(error.message);           
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }            
        }
        if (newPassword) resetPassword();
    }, [newPassword]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNewPasswordError(null);
        setConfirmPasswordError(null);

        const newPassword = e.currentTarget.newPassword.value;
        const confirmPassword = e.currentTarget.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return;
        } 
    
        if (newPassword.length < PASSWORD_MIN_CHARS || newPassword.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(newPassword)
            || !DIGIT_REGEX.test(newPassword) || !SPECIAL_CHARS_REGEX.test(newPassword)) {
            setNewPasswordError(`Password must be within ${PASSWORD_MIN_CHARS}-${PASSWORD_MAX_CHARS} characters, 
                                at least one letter, one digit and one special character.`);
            return;
        }

        setNewPassword(newPassword);            
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box id="reset-pass-container">
            <Box id="reset-pass-image"></Box>

            {!tokenError ? 
                <Box component="form" onSubmit={handleSubmit} id="reset-pass-form" >                        
                    <TextField type="password" error={!!newPasswordError} id="newPassword" name="newPassword" label="New Password"
                        helperText={newPasswordError || "Your new password"} className='reset-pass-input-field' required
                    />

                    <TextField type="password" error={!!confirmPasswordError} id="confirmPassword" name="confirmPassword" label="Confirm Password"                                                          
                        helperText={confirmPasswordError || "Confirm your new password"} className='reset-pass-input-field' required
                    />
                        
                    {loading ?
                        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                            <CircularProgress color="success" size='3rem' />
                        </Stack>
                        :         
                        <button type="submit" id="reset-pass-button"> Reset </button>
                    }                                                                                                                  
                </Box>
                : 
                <Box id='token-error-box'>
                    <Typography> {tokenError} </Typography>                   
                    <button type="submit" onClick={() => window.location.href = '/'}> Go to Home </button>            
                </Box>
            }
                        
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={(error || tokenError) ? 'error' : 'success'} variant="filled">
                    {error ? error : (tokenError ? tokenError : successMessage)}
                </Alert>
            </Snackbar>     
        </Box>  
    );
}

export default ResetPassword;

