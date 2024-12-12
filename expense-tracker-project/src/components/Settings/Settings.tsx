import { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, 
        SelectChangeEvent, Stack, Switch, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/AuthContext";
import { updateUserSettings } from "../../service/database-service";
import './Settings.css';

interface UserSettings {
    activityNotifications: string;
    budgetNotifications: string;
    currency: string;
}

const Settings = () => {
    const { isLoggedIn, settings, setSettings } = useContext(AuthContext);
    const [currency, setCurrency] = useState<string>(settings?.currency || 'BGN');
    const [activityNotifications, setActivityNotifications] = useState<boolean>(settings?.activityNotifications === 'enabled');
    const [budgetNotifications, setBudgetNotifications] = useState<boolean>(settings?.budgetNotifications === 'enabled');
    const [userSettings, setUserSettings] = useState<UserSettings|null>(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const updateSettings = async () => {
            try {
                setLoading(true);
                const response = await updateUserSettings(isLoggedIn.user, userSettings as UserSettings);
                if (response) throw new Error(response);
                setLoading(false);
                setError(null);
                setSettings(userSettings);
            } catch (error: any) {
                setLoading(false);
                setError(error.message);
                console.log(error.message);                                
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

    return (
            <Box component={"form"} onSubmit={handleSubmit} className="settings-container">
                <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>Choose your preferred settings:</Typography>
                <FormGroup className="form-group">
                    <FormControlLabel control={
                        <Switch 
                            checked={activityNotifications}
                            onChange={(e) => setActivityNotifications(e.target.checked)} 
                            sx={{ m: 1 }} 
                        />} 
                        label="Enable activity notifications"
                    />

                    <FormControlLabel control={
                        <Switch 
                            checked={budgetNotifications}
                            onChange={(e) => setBudgetNotifications(e.target.checked)} 
                            sx={{ m: 1 }}
                        />}
                        label="Enable budget notifications" 
                    />

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" 
                            sx={{ width: '100%', m: 1 }} label="Currency" value={currency}
                            onChange={handleCurrencyChange} 
                        >
                            <MenuItem value={"BGN"}>BGN</MenuItem>
                            <MenuItem value={"EUR"}>EUR</MenuItem>
                            <MenuItem value={"USD"}>USD</MenuItem>
                        </Select>
                    </FormControl>
                </FormGroup>

                {loading ?
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                        <CircularProgress color="success" />
                    </Stack>
                    : (isFormSubmitted ? 
                        (error ? 
                            <>
                                <button className="update-settings-button" type="submit">Update</button>
                                <Typography variant="body2" align="center" className="feedback-message error-message">
                                    <FontAwesomeIcon icon={faCircleXmark} size="2xl" />      
                                    Settings update has failed.                                   
                                </Typography>
                            </> 
                            :
                                <Typography variant="body2" align="center" className="feedback-message success-message">
                                    <FontAwesomeIcon icon={faCircleCheck} size="2xl" />
                                    Settings update has been successful.
                                </Typography>
                        )
                        : <button className="update-settings-button" type="submit">Update</button>
                        )                    
                }
            </Box>
    );
}

export default Settings;