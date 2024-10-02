import { useEffect, useState } from "react";
import { sendResetLink } from "../../service/authentication-service";
import Header from "../../components/Header/Header";

const ForgotPasswordView = () => {
    const [email, setEmail] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [success, setSuccess] = useState<string|null>(null);

    useEffect(() => {
        const sendPasswordResetLink = async () => {
            try {
                const response = await sendResetLink(email as string);
                if (response) throw new Error('Failure to send the reset link.');
                setSuccess(`If an account with this email exists, a password reset link has been sent to it.`);
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
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
            <div className="header-container">
                <Header from={"Forgotten password"} />
            </div>

            <div className="forgot-password-container">
                <div className="forgot-password-form">
                    {success ? 
                        <p className="success">{success}</p>
                    :
                        <form onSubmit={handleSubmit}>
                            <div className="forgot-password-input">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" placeholder="Enter your email" />
                            </div>
                            {error && <p className="error">{error}</p>}
                            <button type="submit">Send Link</button>
                        </form>
                    }                
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordView;