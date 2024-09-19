import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getUserDetails, updateUserDetails } from "../../service/database-service";
import { Box, Button, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../../common/utils";
import { uploadUserPhoto } from "../../service/storage-service";
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

interface ProfileProps {
    isUserChanged: boolean;
    setIsUserChanged: (isUserChanged: boolean) => void;
}

const Profile = ( { isUserChanged, setIsUserChanged }: ProfileProps ) => {
    const { isLoggedIn } = useContext(AuthContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userDetails, setUserDetails] = useState<UserDetails|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [firstNameError, setFirstNameError] = useState<string|null>(null);
    const [lastNameError, setLastNameError] = useState<string|null>(null);
    const [phoneError, setPhoneError] = useState<string|null>(null);
    const [fileToUpload, setFileToUpload] = useState<File|null>(null);
    const [newPhotoURL, setNewPhotoURL] = useState<string|null>(null);
    const [userToUpdate, setUserToUpdate] = useState<UserDetails|null>(null);

    useEffect(() => { 
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const userData = await getUserDetails(isLoggedIn.user);
                if (userData.length === 0) throw new Error('User not found');
                setUserDetails(userData[0]);
                setLoading(false);
            } catch (error: any) {
                console.log(error.message); 
                setError(error.message);  
            }
        }
        if (!userDetails) fetchUserDetails();
    }, [userDetails]);

    useEffect(() => {
        const handleUpload = async () => {
            try {
                setLoading(true);
                const photoURL = await uploadUserPhoto(fileToUpload as File);
                setNewPhotoURL(photoURL);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (fileToUpload) handleUpload();
    }, [fileToUpload]);

    useEffect(() => {
        const updateUserData = async () => {
            try {
                setLoading(true);
                updateUserDetails(userToUpdate as UserDetails, userToUpdate?.username as string);
                setUserDetails(null);
                setIsUserChanged(!isUserChanged);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (userToUpdate) updateUserData();
    }, [userToUpdate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const firstName: string = e.currentTarget['first-name'].value;
        const lastName: string = e.currentTarget['last-name'].value;
        const phone: string = e.currentTarget['phone'].value;

        if (!firstName) {
            setFirstNameError('First Name cannot be empty');
            return;
        } else setFirstNameError(null);

        if (!lastName) {
            setLastNameError('Last Name cannot be empty');
            return;
        } else setLastNameError(null);

        if (!phone) {
            setPhoneError('Phone Number cannot be empty');
            return;
        } else setPhoneError(null);

        setUserToUpdate({ firstName, lastName, email: userDetails?.email as string, username: userDetails?.username as string,
                            phone, photo: newPhotoURL as string || userDetails?.photo as string,
                            role: userDetails?.role as string, isBlocked: userDetails?.isBlocked as boolean
        });
    }

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file: File|null = (fileInputRef.current?.files) ? fileInputRef.current.files[0] : null;
        if (file) setFileToUpload(file);
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
                    <div id="image-text-container">
                        {newPhotoURL ?
                            <img src={newPhotoURL} alt="profile" onClick={() => fileInputRef.current?.click()} />
                            :
                            <img src={userDetails.photo} alt="profile" onClick={() => fileInputRef.current?.click()} />
                        }
                        <span className="change-photo-text">Change photo</span>
                    </div>
                        
                    <VisuallyHiddenInput type="file" id="file" name="file" accept="image/*" ref={fileInputRef} onChange={(event) => handleUpload(event)} />

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
            <Button id='update-profile-button' type="submit" endIcon={<Save />}></Button>
        </Box>
    )
}

export default Profile;