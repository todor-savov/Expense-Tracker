import { useEffect, useState } from "react";
import { sendResetLink } from "../../service/authentication-service";
import Header from "../../components/Header/Header";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer/Footer";
import './ForgotPasswordView.css';

const ForgotPasswordView = () => {
    const [email, setEmail] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string|null>(null);

    useEffect(() => {
        const sendPasswordResetLink = async () => {
            try {
                setLoading(true);
                const response = await sendResetLink(email as string);
                if (response) throw new Error('Failure to send the reset link.');
                setSuccess(`If an account with this email exists, a password reset link has been sent to it.`);
                setError(null);
            } catch (error: any) {
                setError(error.message);
                setSuccess(null);
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
        if (email) sendPasswordResetLink();
    }, [email])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const email = (event.target as HTMLFormElement).email.value;
        setEmail(email);
    }
    
    return (
        <div>
            <Header from={"Forgotten password"} />
     
            <Box component="form" onSubmit={handleSubmit} className="forgot-password-form">
                <TextField id="email" name="email" label="Email address" variant="outlined" required 
                    helperText={"Send a password reset link to the provided email address"} className="text-field" />
                    
                {loading ?
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                        <CircularProgress color="success" />
                    </Stack>
                    :
                    (success ? 
                        <p className="success">
                            <FontAwesomeIcon icon={faCircleCheck} size="2xl" style={{color: "#1daa80", 
                                marginRight: "0.7rem", marginTop: "0.5rem"}} />
                            {success}
                        </p>
                        :                    
                        (error ?
                            <p className="error">                                                                    
                                <FontAwesomeIcon icon={faCircleXmark} size="2xl" style={{color: "#df2b0c",
                                    marginRight: "0.7rem", marginTop: "0.5rem"
                                }} />                                
                                {error}
                            </p>
                            :
                            <Button type="submit" variant="contained" color="primary" className="submit-button"><strong>Send</strong></Button>
                        )
                    )
                }
            </Box>

            <Footer />
        </div>
    );
}

export default ForgotPasswordView;