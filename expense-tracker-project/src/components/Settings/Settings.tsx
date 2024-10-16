import { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, 
        SelectChangeEvent, Stack, Switch, Typography } from "@mui/material";
import { Save } from "@mui/icons-material";
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
        const activityNotifications: boolean = event.currentTarget['enable-activity-notifications'].checked;
        const budgetNotifications: boolean = event.currentTarget['enable-budget-notifications'].checked;
        setUserSettings({ activityNotifications: activityNotifications ? 'enabled' : 'disabled',
                            budgetNotifications: budgetNotifications ? 'enabled' : 'disabled',
                            currency: currency }); 
        setIsFormSubmitted(true);
    }

    const handleCurrencyChange = (event: SelectChangeEvent<unknown>) => {
        event.preventDefault();
        const currency = event.target.value as string;
        setCurrency(currency);
    }

    return (
        <div>
            <Box component={"form"} onSubmit={handleSubmit} className="settings-container">
                <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>Choose your preferred settings:</Typography>
                <FormGroup className="form-group">
                    <FormControlLabel control={
                        <Switch name="enable-activity-notifications" sx={{ m: 1 }} 
                            defaultChecked={settings?.activityNotifications === 'enabled' ? true : false}
                        />} 
                        label="Enable activity notifications"
                    />

                    <FormControlLabel control={
                        <Switch name="enable-budget-notifications" sx={{ m: 1 }} 
                            defaultChecked={settings?.budgetNotifications === 'enabled' ? true : false}                        
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
                                <button className="update-settings-button" type="submit"><Save /></button>                                    
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
                        : <button className="update-settings-button" type="submit"><Save /></button>                                                   
                        )                    
                }
            </Box>
        </div>
    );
}

export default Settings;