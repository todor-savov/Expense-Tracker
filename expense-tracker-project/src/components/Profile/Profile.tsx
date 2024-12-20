import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, TextField } from "@mui/material";
import { VisuallyHiddenInput } from "../../common/utils";
import { changePassword } from "../../service/authentication-service";
import { getUserDetails, updateUserDetails } from "../../service/database-service";
import { uploadUserPhoto } from "../../service/storage-service";
import { NAME_MIN_CHARS, NAME_MAX_CHARS, LETTERS_ONLY_REGEX, PHONE_DIGITS,
    PASSWORD_MIN_CHARS, PASSWORD_MAX_CHARS, LETTER_REGEX, DIGIT_REGEX, SPECIAL_CHARS_REGEX } from '../../common/constants';
import './Profile.css';

interface UserSettings { 
    activityNotifications: string;
    budgetNotifications: string;
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

const Profile = ( { isUserChanged, setIsUserChanged }: ProfileProps ) => {
    const { isLoggedIn } = useContext(AuthContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userDetails, setUserDetails] = useState<UserDetails|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [firstNameError, setFirstNameError] = useState<string|null>(null);
    const [lastNameError, setLastNameError] = useState<string|null>(null);
    const [phoneError, setPhoneError] = useState<string|null>(null);
    const [oldPasswordError, setOldPasswordError] = useState<string|null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string|null>(null);
    const [fileToUpload, setFileToUpload] = useState<File|null>(null);
    const [newPhotoURL, setNewPhotoURL] = useState<string|null>(null);
    const [userToUpdate, setUserToUpdate] = useState<UserDetails|null>(null);
    const [passwordCredentials, setPasswordCredentials] = useState<PasswordCredentials|null>(null);

    useEffect(() => { 
        const fetchUserDetails = async () => {
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const userData = await getUserDetails(isLoggedIn.user);
                if (userData.length === 0) throw new Error('User not found');
                setUserDetails(userData[0]);
                setSuccessMessage('User details loaded successfully');
            } catch (error: any) {
                setError('Failed to load user details');
                console.log(error.message);                 
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const handleUpload = async () => {
            try {
                setSuccessMessage(null);
                setLoading(true);
                const photoURL = await uploadUserPhoto(fileToUpload as File);
                if (!photoURL) throw new Error('Failed to upload photo');
                setNewPhotoURL(photoURL);
                setSuccessMessage('Photo uploaded successfully');
            } catch (error: any) {
                setError('Failed to upload photo');
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        if (fileToUpload) handleUpload();
    }, [fileToUpload]);

    useEffect(() => {
        const updateUserData = async () => {
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await updateUserDetails(userToUpdate as UserDetails, userToUpdate?.username as string);
                if (response) throw new Error(response);
                setIsUserChanged(!isUserChanged);
                setSuccessMessage('User details updated successfully');
            } catch (error: any) {
                setError('Failed to update user details');
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        if (userToUpdate) updateUserData();
    }, [userToUpdate]);

    useEffect(() => {
        const handlePasswordUpdate = async () => {
            try {                
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await changePassword(isLoggedIn.user, passwordCredentials?.oldPassword as string, passwordCredentials?.newPassword as string);
                if (response) throw new Error(response);
                setPasswordCredentials(null);
                setSuccessMessage('Password updated successfully');
            } catch (error: any) {
                setError('Failed to update password');
                console.log(error.message);
            } finally {
                setLoading(false);
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
        setError(null);

        const file: File|null = (fileInputRef.current?.files) ? fileInputRef.current.files[0] : null;

        if (file?.type !== 'image/jpeg' && file?.type !== 'image/png') {            
            setError('Invalid file type. Please upload a valid image file.');
            setOpenSnackbar(true);
            return;
        }

        if (file) setFileToUpload(file);
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (userDetails ? 
        <div className="profile-container">
            <Box component="form" noValidate autoComplete="off" onSubmit={handleUserChange}>
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
                            
                        <VisuallyHiddenInput type="file" id="file" name="file" accept="image/*" ref={fileInputRef} onChange={(event) => handleFileUpload(event)} />

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

                    <TextField error={!!phoneError} type="number" id="phone" label="Phone Number"
                        defaultValue={userDetails.phone} helperText={phoneError || "Editable"} required
                    />
                </div>

                {!loading && <Button id='update-user-button' type="submit">Save Profile</Button>}                
            </Box>

            <Box component="form" noValidate autoComplete="off" onSubmit={handlePasswordChange}>
                <div className="password-fields">
                    <TextField error={!!oldPasswordError} type="password" id="old-password" label="Old Password"
                        helperText={oldPasswordError || "Editable"}
                    />

                    <TextField error={!!newPasswordError} type="password" id="new-password" label="New Password"
                        helperText={newPasswordError || `Editable | ${PASSWORD_MIN_CHARS}-${PASSWORD_MAX_CHARS} symbols, ONE digit, letter AND a special symbol`}
                    />
                </div>
                        
                {!loading && <Button id='update-password-button' type="submit">Update password</Button>}
            </Box>

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
        </div>
        :   
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 8 }}
        >
            <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} variant="filled">
                {error ? error : successMessage}
            </Alert>
        </Snackbar>
    )
}

export default Profile;