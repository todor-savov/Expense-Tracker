import { useEffect, useState } from "react";
import { DIGIT_REGEX, LETTER_REGEX, PASSWORD_MAX_CHARS, PASSWORD_MIN_CHARS, SPECIAL_CHARS_REGEX } from "../../common/constants";
import { confirmPasswordResetWithToken, verifyPasswordResetToken } from "../../service/authentication-service";
import Header from "../../components/Header/Header";
import { Box, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer/Footer";
import './ResetPasswordView.css';

const ResetPasswordView = () => {   
    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');
    const [isTokenValid, setIsTokenValid] = useState<boolean|null>(null);
    const [tokenError, setTokenError] = useState<string|null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string|null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string|null>(null);
    const[newPassword, setNewPassword] = useState<string>('');
    const [resetStatus, setResetStatus] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {            
                const response = await verifyPasswordResetToken(oobCode as string);
                if (!response) throw new Error('Invalid reset token');
                setIsTokenValid(true);
            } catch (error: any) {
                console.log(error.message);
                setIsTokenValid(false);
                setTokenError(`Invalid or expired reset token.`);
            }
        }
        if (oobCode) verifyToken();            
    }, []);

    useEffect(() => {
        const resetPassword = async () => {
            try {
                setLoading(true);                
                const status = await confirmPasswordResetWithToken(oobCode as string, newPassword);
                if (!status) setResetStatus('success');
                else setResetStatus('failure');
            } catch (error: any) {
                console.log(error.message);
                setResetStatus('failure');                
            } finally {
                setLoading(false);
            }            
        }
        if (newPassword) resetPassword();
    }, [newPassword]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const newPassword = form.newPassword.value;
        const confirmPassword = form.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError(null);

            if (newPassword.length < PASSWORD_MIN_CHARS || newPassword.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(newPassword)
                || !DIGIT_REGEX.test(newPassword) || !SPECIAL_CHARS_REGEX.test(newPassword)) {
                setNewPasswordError(`Password must be between ${PASSWORD_MIN_CHARS} and ${PASSWORD_MAX_CHARS} characters long, 
                                    and contain at least one letter, one digit, and one special character.`);
                return;
            }

            setNewPasswordError(null);
            setNewPassword(newPassword);            
        }        
    }
    
    return (             
        <>  
            <Header from={"Reset Password"} />
            <div className="central-container">
                {isTokenValid === true ? 
                    <div className="reset-container">
                        <Box component="form" className="reset-form" onSubmit={handleSubmit}>
                            <Typography variant="h5" sx={{'marginBottom': '1.5rem'}}>Reset Password</Typography>
                            
                            <TextField type="password" required id="newPassword" name="newPassword" label="New Password"                            
                                sx={{'marginBottom': '1.2rem', 'marginLeft': '0.5rem', 'marginRight': '0.5rem'}} error={!!newPasswordError} 
                                helperText={newPasswordError || "Your new password"} className="reset-input"
                            />

                            <TextField type="password" required id="confirmPassword" name="confirmPassword" label="Confirm Password" 
                                sx={{'marginBottom': '0.8rem', 'marginLeft': '0.5rem', 'marginRight': '0.5rem'}} error={!!confirmPasswordError}                         
                                helperText={confirmPasswordError || "Confirm your new password"} className="reset-input"
                            />
                            
                            {loading ?
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                                    <CircularProgress color="success" />
                                </Stack>
                                :                                                
                                (!resetStatus ? <button type="submit" className="reset-button">Reset Password</button>
                                    : (resetStatus === 'success' ? 
                                        <p className="success">
                                            <FontAwesomeIcon icon={faCircleCheck} size="2xl" style={{color: "#1daa80", 
                                                marginRight: "0.7rem", marginTop: "0.5rem"}} />
                                            Password reset has been successful.
                                            <br />
                                            You can log in from upper right corner now.
                                        </p>
                                        : 
                                        <p className="error">                                                                    
                                            <FontAwesomeIcon icon={faCircleXmark} size="2xl" style={{color: "#df2b0c",
                                                marginRight: "0.7rem", marginTop: "0.5rem"}} />      
                                            Password reset has failed.
                                        </p>                                                            
                                    )
                                )
                            }                                                                
                        </Box>
                    </div>
                : 
                    (isTokenValid === false &&
                    <Typography variant="h6" component="p" sx={{'marginLeft': '1.5rem', 'marginRight': '1.5rem', 'fontSize': '1.0rem'}} className="invalid-token">                
                        <FontAwesomeIcon icon={faCircleXmark} size="lg" style={{ marginRight: "0.5rem" }} />
                        {tokenError}
                    </Typography>)
                }
            </div>
            <Footer />
        </>
     );
}
export default ResetPasswordView;