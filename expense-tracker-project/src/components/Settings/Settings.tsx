import { useContext, useEffect, useState } from "react";
import { Alert, Box, CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, 
        SelectChangeEvent, Snackbar, Stack, Switch, TextField, Typography } from "@mui/material";
import AuthContext from "../../context/AuthContext";
import { updateUserSettings } from "../../service/database-service";
import './Settings.css';

interface SettingsProps {
    isLimitChanged: boolean;
    setIsLimitChanged: (isLimitChanged: boolean) => void;
}

interface UserSettings {
    activityNotifications: string;
    activityNotificationLimit: number;
    budgetNotifications: string;
    budgetNotificationLimit: number;
    currency: string;
}

const Settings = ({ isLimitChanged, setIsLimitChanged }: SettingsProps) => {
    const { isLoggedIn, settings, setSettings } = useContext(AuthContext);
    const [userSettings, setUserSettings] = useState<UserSettings|null>(null);
    const [activityNotifications, setActivityNotifications] = useState<boolean>(settings?.activityNotifications === 'enabled');
    const [budgetNotifications, setBudgetNotifications] = useState<boolean>(settings?.budgetNotifications === 'enabled');
    const [currency, setCurrency] = useState<string>(settings?.currency || 'BGN');
    const [error, setError] = useState<string|null>(null);
    const [onSaveError, setOnSaveError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

   useEffect(() => {    
        if (!settings) setError('Error fetching user settings.');
        else setSuccessMessage('Settings fetched successfully.');
        setOpenSnackbar(true);

        return () => {
            setError(null);
            setSuccessMessage(null);
        }
    }, []);

    useEffect(() => {
        const updateSettings = async () => {
            try {
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await updateUserSettings(isLoggedIn.user, userSettings as UserSettings);
                if (typeof response === 'string') throw new Error('Settings update has failed.');
                setSuccessMessage('Settings updated successfully.'); 
                setIsLimitChanged(!isLimitChanged); 
                setSettings(userSettings);
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);                                
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        if (userSettings) updateSettings();
    }, [userSettings]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const activityNotificationLimit: number = +e.currentTarget['activity-notification-limit']?.value;
        const budgetNotificationLimit: number = +e.currentTarget['budget-notification-limit']?.value;

        if (activityNotifications) {
            if (!Number.isInteger(activityNotificationLimit) || activityNotificationLimit < 1 || activityNotificationLimit > 365) {
                setOnSaveError('Inactivity days must be an integer between 1 and 365.');
                setOpenSnackbar(true);
                return;
            }
        }

        if (budgetNotifications) {
            if (!Number.isInteger(budgetNotificationLimit) || budgetNotificationLimit < 1 || budgetNotificationLimit > 100) {
                setOnSaveError('Budget limit must be an integer between 1 and 100.');
                setOpenSnackbar(true);
                return;
            }            
        }
        
        setUserSettings({ activityNotifications: activityNotifications ? 'enabled' : 'disabled',
                            activityNotificationLimit: activityNotificationLimit ? activityNotificationLimit : 0,
                            budgetNotifications: budgetNotifications ? 'enabled' : 'disabled',
                            budgetNotificationLimit: budgetNotificationLimit ? budgetNotificationLimit : 0,
                            currency: currency });
    }

    const handleCurrencyChange = (event: SelectChangeEvent<unknown>) => {
        const currency = event.target.value as string;
        setCurrency(currency);
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box id='settings-container'>
            {error ? 
                <Box className='message-box error'>
                    <Typography>There was a problem loading your data.</Typography>
                    <Typography sx={{fontStyle: 'italic'}}>Please try again later.</Typography>
                </Box>
                :
                <Box component={"form"} onSubmit={handleSubmit} id="settings-form">
                    <Typography id='settings-header'>Choose your preferred settings:</Typography>
                    
                    <FormGroup className="form-group">
                        <FormControlLabel control={
                            <Switch checked={activityNotifications} onChange={(e) => setActivityNotifications(e.target.checked)} />
                            } 
                            label={<Typography id='notification-label'>Enable activity notifications</Typography>}
                        />

                        {activityNotifications && 
                            <TextField type="number" label="Days" name="activity-notification-limit" required 
                                defaultValue={settings?.activityNotificationLimit ? settings.activityNotificationLimit : ''}
                                helperText="Number of days without activity"
                                className="notification-limit"
                            />
                        } 

                        <FormControlLabel control={
                            <Switch checked={budgetNotifications} onChange={(e) => setBudgetNotifications(e.target.checked)} />
                            }
                            label={<Typography id='notification-label'>Enable budget notifications</Typography>}
                        />

                        {budgetNotifications && 
                            <TextField type="number" label="%" name='budget-notification-limit' required 
                                defaultValue={settings?.budgetNotificationLimit ? settings.budgetNotificationLimit : ''}
                                helperText="Percentage of the category budget"
                                className="notification-limit"
                            />
                        }

                        <FormControl id="currency-select-box">
                            <InputLabel>Currency</InputLabel>
                            <Select id="currency-select-dropdown" label="Currency" value={currency} onChange={handleCurrencyChange}>
                                <MenuItem value={"BGN"}>BGN</MenuItem>
                                <MenuItem value={"EUR"}>EUR</MenuItem>
                                <MenuItem value={"USD"}>USD</MenuItem>
                            </Select>
                        </FormControl>
                    </FormGroup>

                    {loading ? 
                        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                            <CircularProgress color="success" size='3rem' />
                        </Stack>
                        : 
                        <button id="update-settings-button" type="submit">Update</button>                        
                    }                                                                    
                </Box>
            }

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={(error || onSaveError) ? 'error' : 'success'} variant="filled">
                    {error ? error : (onSaveError ? onSaveError : successMessage)}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Settings;