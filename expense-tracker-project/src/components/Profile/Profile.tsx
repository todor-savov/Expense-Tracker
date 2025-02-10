import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, TextField, Typography } from "@mui/material";
import AuthContext from "../../context/AuthContext";
import { changePassword } from "../../service/authentication-service";
import { getUserDetails, updateUserDetails } from "../../service/database-service";
import { uploadUserPhoto } from "../../service/storage-service";
import { VisuallyHiddenInput } from "../../common/utils";
import { NAME_MIN_CHARS, NAME_MAX_CHARS, LETTERS_ONLY_REGEX, PHONE_DIGITS,
    PASSWORD_MIN_CHARS, PASSWORD_MAX_CHARS, LETTER_REGEX, DIGIT_REGEX, SPECIAL_CHARS_REGEX } from '../../common/constants';
import './Profile.css';

interface UserSettings { 
    activityNotifications: string;
    activityNotificationLimit: number;
    budgetNotifications: string;
    budgetNotificationLimit: number;
    currency: string;
}  

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    photo: string;
    role: string;
    isBlocked: boolean;
    settings: UserSettings
}

interface ProfileProps {
    isUserChanged: boolean;
    setIsUserChanged: (isUserChanged: boolean) => void;
}

interface PasswordCredentials {
    oldPassword: string;
    newPassword: string;
}

const Profile = ({ isUserChanged, setIsUserChanged }: ProfileProps) => {
    const { isLoggedIn } = useContext(AuthContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userDetails, setUserDetails] = useState<UserDetails|null>(null);
    const [userToUpdate, setUserToUpdate] = useState<UserDetails|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [onSaveError, setOnSaveError] = useState<string|null>(null);
    const [firstNameError, setFirstNameError] = useState<string|null>(null);
    const [lastNameError, setLastNameError] = useState<string|null>(null);
    const [phoneError, setPhoneError] = useState<string|null>(null);
    const [oldPasswordError, setOldPasswordError] = useState<string|null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string|null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [fileToUpload, setFileToUpload] = useState<File|null>(null);
    const [newPhotoURL, setNewPhotoURL] = useState<string|null>(null);
    const [passwordCredentials, setPasswordCredentials] = useState<PasswordCredentials|null>(null);

    useEffect(() => { 
        const fetchUserDetails = async () => {
            try {                
                setLoading(true);
                const userData = await getUserDetails(isLoggedIn.user);
                if (typeof userData === 'string') throw new Error('Error fetching user details');
                setUserDetails(userData[0]);
                setSuccessMessage('User details fetched successfully');
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);                 
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        fetchUserDetails();

        return () => {
            setError(null);
            setSuccessMessage(null);
            setUserDetails(null);
        }
    }, []);

    useEffect(() => {
        const handleUpload = async () => {
            try {
                setNewPhotoURL(null);
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const photoURL = await uploadUserPhoto(fileToUpload as File);
                if (!photoURL) throw new Error('Failed to upload user photo.');
                setNewPhotoURL(photoURL);
                setSuccessMessage('User photo uploaded successfully');
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setFileToUpload(null);
                setOpenSnackbar(true);
            }
        }
        if (fileToUpload) handleUpload();
    }, [fileToUpload]);

    useEffect(() => {
        const updateUserData = async () => {
            try {
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await updateUserDetails(userToUpdate as UserDetails, userToUpdate?.username as string);
                if (typeof response === 'string') throw new Error('Failed to update user details');                
                setUserDetails({...userToUpdate as UserDetails});
                setIsUserChanged(!isUserChanged);
                setSuccessMessage('User details updated successfully');
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setUserToUpdate(null);
                setOpenSnackbar(true);
            }
        }
        if (userToUpdate) updateUserData();
    }, [userToUpdate]);

    useEffect(() => {
        const handlePasswordUpdate = async () => {
            try {
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await changePassword(isLoggedIn.user, passwordCredentials?.oldPassword as string, passwordCredentials?.newPassword as string);
                if (typeof response === 'string') throw new Error('Failed to update password');
                setSuccessMessage('Password updated successfully');
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setPasswordCredentials(null);
                setOpenSnackbar(true);
            }
        }
        if (passwordCredentials) handlePasswordUpdate();        
    }, [passwordCredentials]);

    const handleUserChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFirstNameError(null);
        setLastNameError(null);
        setPhoneError(null);

        const firstName: string = e.currentTarget['first-name'].value;
        const lastName: string = e.currentTarget['last-name'].value;
        const phone: string = e.currentTarget['phone'].value;

        let errorState = false;
        
        if (firstName.length < NAME_MIN_CHARS || firstName.length > NAME_MAX_CHARS || !LETTERS_ONLY_REGEX.test(firstName)) {
            setFirstNameError(`${NAME_MIN_CHARS}-${NAME_MAX_CHARS} only characters`);
            errorState = true;
        }

        if (lastName.length < NAME_MIN_CHARS || lastName.length > NAME_MAX_CHARS || !LETTERS_ONLY_REGEX.test(lastName)) {
            setLastNameError(`${NAME_MIN_CHARS}-${NAME_MAX_CHARS} only characters`);
            errorState = true;
        } 

        if (phone.length !== PHONE_DIGITS) {
            setPhoneError(`Phone number must contain ${PHONE_DIGITS} digits exactly.`);
            errorState = true;
        } 

        if (errorState) return;

        setUserToUpdate({ firstName, lastName, email: userDetails?.email as string, username: userDetails?.username as string,
                            phone, photo: newPhotoURL as string || userDetails?.photo as string,
                            role: userDetails?.role as string, isBlocked: userDetails?.isBlocked as boolean,
                            settings: userDetails?.settings as UserSettings
        });
    }

    const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOldPasswordError(null);
        setNewPasswordError(null);

        const oldPassword: string = e.currentTarget['old-password'].value;
        const newPassword: string = e.currentTarget['new-password'].value;

        if (oldPassword && !newPassword) {
            setNewPasswordError('New Password cannot be empty');
            return;
        }

        if (newPassword && !oldPassword) {
            setOldPasswordError('Old Password cannot be empty');
            return;
        }

        if (oldPassword && newPassword && oldPassword === newPassword) {
            setNewPasswordError('New password cannot be the same as the old one');
            return;
        }

        if (oldPassword && newPassword) {
            if (newPassword.length < PASSWORD_MIN_CHARS || newPassword.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(newPassword)
                || !DIGIT_REGEX.test(newPassword) || !SPECIAL_CHARS_REGEX.test(newPassword)) {
                setNewPasswordError(`The new password does not match the requirements.`);
                return;
            }                     
        }

        if (!oldPassword && !newPassword) {
            setOldPasswordError('Old Password cannot be empty');
            setNewPasswordError('New Password cannot be empty');
            return;
        }
    
        setPasswordCredentials({oldPassword, newPassword});
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setOnSaveError(null);

        const file: File|null = (fileInputRef.current?.files) ? fileInputRef.current.files[0] : null;

        if (file?.type !== 'image/jpeg' && file?.type !== 'image/png') {            
            setOnSaveError('Please upload a valid image file.');
            setOpenSnackbar(true);
            return;
        }

        if (file) setFileToUpload(file);
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box className="profile-container">
            {error ? 
                <Box className="message-box">
                    <Typography>There was a problem loading your data. Please try again later.</Typography>
                </Box>
                :
                (userDetails &&
                    <>
                        <Box component="form" noValidate autoComplete="off" onSubmit={handleUserChange}>
                            <div id="profile-fields">
                                <div id="photo-name-container">
                                    <div id="image-text-container">
                                        {(loading && fileToUpload) ?
                                            <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                                                <CircularProgress color="success" size='3rem' />
                                            </Stack>
                                            :
                                            <img src={newPhotoURL ? newPhotoURL : userDetails?.photo} alt="profile" onClick={() => fileInputRef.current?.click()} />
                                        }
                                        <span id="change-photo-text">Change photo</span>
                                    </div>
                                        
                                    <VisuallyHiddenInput type="file" id="file" name="file" accept="image/*" ref={fileInputRef} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(event)} />

                                    <TextField error={!!firstNameError} type="text" id="first-name" label='First Name'
                                        defaultValue={userDetails?.firstName} helperText={firstNameError} required
                                    />

                                    <TextField error={!!lastNameError} type="text" id="last-name" label='Last Name'
                                        defaultValue={userDetails?.lastName} helperText={lastNameError} required
                                    />
                                </div>

                                <TextField type="email" id="email" label="Email Address" disabled
                                    defaultValue={userDetails?.email} helperText={"Not editable"} required
                                />
                                    
                                <TextField type="text" id="username" label="Username" disabled
                                    defaultValue={userDetails?.username} helperText={"Not editable"} required
                                />

                                <TextField error={!!phoneError} type="number" id="phone" label="Phone Number"
                                    defaultValue={userDetails?.phone} helperText={phoneError} required
                                />
                            </div>

                            {(loading && userToUpdate) ?
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                                    <CircularProgress color="success" size='3rem' />
                                </Stack>
                                :
                                <Button id='update-user-button' type="submit">Save Profile</Button>
                            }
                        </Box>

                        <Box component="form" noValidate autoComplete="off" onSubmit={handlePasswordChange}>
                            <div id="password-fields">
                                <TextField error={!!oldPasswordError} type="password" id="old-password" label="Old Password"
                                    helperText={oldPasswordError}
                                />

                                <TextField error={!!newPasswordError} type="password" id="new-password" label="New Password"
                                    helperText={newPasswordError || `${PASSWORD_MIN_CHARS}-${PASSWORD_MAX_CHARS} symbols, ONE digit, letter AND a special symbol`}
                                />
                            </div>
                                    
                            {(loading && passwordCredentials) ? 
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                                    <CircularProgress color="success" size='3rem' />
                                </Stack>
                                :
                                <Button id='update-password-button' type="submit">Update password</Button>
                            }
                        </Box> 
                    </>    
                )   
            }                                            
                        
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={(error || onSaveError) ? 'error' : 'success'} variant="filled">
                    {error ? error : (onSaveError ? onSaveError : successMessage)}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Profile;