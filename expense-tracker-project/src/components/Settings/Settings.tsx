import { useContext, useEffect, useState } from "react";
import { Alert, Box, CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, 
        SelectChangeEvent, Snackbar, Stack, Switch, Typography } from "@mui/material";
import AuthContext from "../../context/AuthContext";
import { updateUserSettings } from "../../service/database-service";
import './Settings.css';

interface SettingsProps {
    isLimitChanged: boolean;
    setIsLimitChanged: (isLimitChanged: boolean) => void;
}

interface UserSettings {
    activityNotifications: string;
    budgetNotifications: string;
    currency: string;
}

const Settings = ({ isLimitChanged, setIsLimitChanged }: SettingsProps) => {
    const { isLoggedIn, settings, setSettings } = useContext(AuthContext);
    const [userSettings, setUserSettings] = useState<UserSettings|null>(null);
    const [activityNotifications, setActivityNotifications] = useState<boolean>(settings?.activityNotifications === 'enabled');
    const [budgetNotifications, setBudgetNotifications] = useState<boolean>(settings?.budgetNotifications === 'enabled');
    const [currency, setCurrency] = useState<string>(settings?.currency || 'BGN');
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    useEffect(() => {
        const updateSettings = async () => {
            try {
                setError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await updateUserSettings(isLoggedIn.user, userSettings as UserSettings);
                if (response) throw new Error('Settings update has failed.');
                setSuccessMessage('Settings have been updated successfully.'); 
                setIsLimitChanged(!isLimitChanged); 
                setSettings(userSettings);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);                                
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        if (userSettings) updateSettings();
    }, [userSettings]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUserSettings({ activityNotifications: activityNotifications ? 'enabled' : 'disabled',
                            budgetNotifications: budgetNotifications ? 'enabled' : 'disabled',
                            currency: currency }); 
        setIsFormSubmitted(true);
    }

    const handleCurrencyChange = (event: SelectChangeEvent<unknown>) => {
        const currency = event.target.value as string;
        setCurrency(currency);
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
            <Box component={"form"} onSubmit={handleSubmit} className="settings-container">
                <Typography variant="h5" id='settings-header'>Choose your preferred settings:</Typography>
                <FormGroup className="form-group">
                    <FormControlLabel control={
                        <Switch checked={activityNotifications} onChange={(e) => setActivityNotifications(e.target.checked)} className="switch" />
                        } 
                        label="Enable activity notifications"
                    />

                    <FormControlLabel control={
                        <Switch checked={budgetNotifications} onChange={(e) => setBudgetNotifications(e.target.checked)} className="switch" />
                        }
                        label="Enable budget notifications" 
                    />

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                        <Select labelId="demo-simple-select-label" id="currency-select" label="Currency" 
                            value={currency} onChange={handleCurrencyChange}>
                            <MenuItem value={"BGN"}>BGN</MenuItem>
                            <MenuItem value={"EUR"}>EUR</MenuItem>
                            <MenuItem value={"USD"}>USD</MenuItem>
                        </Select>
                    </FormControl>
                </FormGroup>

                {isFormSubmitted &&
                    (loading ? 
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
                    )
                }
                                                                
                {!loading && <button className="update-settings-button" type="submit">Update</button>}                        
            </Box>
    );
}

export default Settings;