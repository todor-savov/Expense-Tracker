import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getUserDetails } from "../../service/database-service";
import { Box, Button, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import './Profile.css';

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    photo: string;
    role: string;
    isBlocked: boolean;
}

const Profile = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState<UserDetails|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [firstNameError, setFirstNameError] = useState<string|null>(null);
    const [lastNameError, setLastNameError] = useState<string|null>(null);
    const [phoneError, setPhoneError] = useState<string|null>(null);

    useEffect(() => { 
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const userData = await getUserDetails(isLoggedIn.user);
                setUserDetails(userData[0]);
                setLoading(false);
            } catch (error: any) {
                console.log(error.message); 
                setError(error.message);  
            }
        }
        if (isLoggedIn.status) fetchUserDetails();
    }, [isLoggedIn.status]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted');

        const firstName: string = e.currentTarget['first-name'].value;
        const lastName: string = e.currentTarget['last-name'].value;
        const phone: string = e.currentTarget['phone'].value;

        if (!firstName) {
            setFirstNameError('First Name cannot be empty');
            return;
        } else {
            setFirstNameError(null);
        }

        if (!lastName) {
            setLastNameError('Last Name cannot be empty');
            return;
        } else {
            setLastNameError(null);
        }

        if (!phone) {
            setPhoneError('Phone Number cannot be empty');
            return;
        } else {
            setPhoneError(null);
        }
    }

    if (loading) {
        return (
            <div className='spinnerContainer'>
                <div className='spinner'></div>
            </div>
        )
    }

    return (userDetails && 
        <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} noValidate
            autoComplete="off" onSubmit={handleSubmit} className="profile-container"
        >
            {error && <p>{error}</p>}
            <div id="profile-fields">
                <div id="photo-name-container">                    
                    <img src={userDetails.photo} alt="profile" />

                    <TextField error={!!firstNameError} type="text" id="first-name" label='First Name'
                        defaultValue={userDetails.firstName} helperText={firstNameError || "Editable"} required
                    />

                    <TextField error={!!lastNameError} type="text" id="last-name" label='Last Name'
                        defaultValue={userDetails.lastName} helperText={lastNameError || "Editable"} required
                    />
                </div>

                <TextField type="email" id="email" label="Email Address" disabled
                    defaultValue={userDetails.email} helperText={"Not editable"} required
                />
                    
                <TextField type="text" id="username" label="Username" disabled
                    defaultValue={userDetails.username} helperText={"Not editable"} required
                />

                <TextField error={!!phoneError} type="text" id="phone" label="Phone Number"
                    defaultValue={userDetails.phone} helperText={phoneError || "Editable"} required
                />
            </div>
            <Button id='update-profile-button' type="submit" endIcon={<Save />}>Update</Button>
        </Box>
    )
}

export default Profile;