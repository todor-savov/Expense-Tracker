import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { Alert, Avatar, CircularProgress, FormControlLabel, FormGroup, List, ListItem, ListItemAvatar, ListItemText, Snackbar, Stack, Switch, Typography } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FunctionsIcon from '@mui/icons-material/Functions';
import AuthContext from '../../context/AuthContext';
import { getCategoryIcon } from '../../common/utils';
import { getCategories, getTransactions } from '../../service/database-service';
import { getExchangeRates } from '../../service/exchange-rate-service';
import PieActiveArc from '../PieChart/PieChart';
import Progress from './Progress';
import './Overview.css';

interface FetchedTransaction {
    id: string;
    date: string;
    name: string; 
    amount: number;
    category: string;
    payment: string;
    receipt: string;
    user: string;
    currency: string;
}

interface Data {
    value: number, 
    label: string
}

interface Category {
    id: string;
    imgSrc: string;
    imgAlt: string;
    type: string;
    user: string;
}

const Overview = () => {
    const { isLoggedIn, settings } = useContext(AuthContext);
    const [switchLabel, setSwitchLabel] = useState<string>('Period Overview');
    const [view, setView] = useState<string>('');
    const [outerValue, setOuterValue] = useState<number>(0);
    const [innerValue, setInnerValue] = useState<number>(0);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [totalSum, setTotalSum] = useState<number>(0);
    const [pieData, setPieData] = useState<Data[]|[]>([]);
    const [categories, setCategories] = useState<Category[]|[]>([]);        
    const [timeSpan, setTimeSpan] = useState<string>('');    
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                if (typeof transactions === 'string') throw new Error('Error fetching transactions.');
                const exchangeRates = await getExchangeRates(settings?.currency as string);
                if (!exchangeRates) throw new Error('Error fetching exchange rates.');
                const updatedTransactions = transactions.map((transaction: FetchedTransaction) => {
                    if (transaction.currency !== settings?.currency) {
                        const exchangeRate = 1 / exchangeRates[transaction.currency];
                        transaction.amount = transaction.amount * exchangeRate;  
                        transaction.currency = settings?.currency as string;                       
                    }
                    return transaction;
                });
                const categories = await getCategories(isLoggedIn.user);
                if (typeof categories === 'string') throw new Error('Error fetching categories.');
                setTransactions(updatedTransactions);
                setCategories(categories);
                setSuccessMessage('Data fetched successfully');
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }

        fetchTransactions();

        return () => {
            setError(null);
            setSuccessMessage(null);
            setTransactions([]);
            setCategories([]);
            setPieData([]);
            setTimeSpan('');
            setView('');
        }
    }, []);

    const handleOuterChange = (event: React.SyntheticEvent, newValue: number) => {
        event.preventDefault();
        setOuterValue(newValue);
        setInnerValue(0);
    };

    const handleInnerChange = (event: React.SyntheticEvent, newValue: number) => {
        event.preventDefault();
        setInnerValue(newValue);
    };

    const handleTabClick = (newValue: string) => {
        const filteredTransactions = (view === 'monthly') ? 
            transactions.filter((transaction) => 
                new Date(transaction.date).toLocaleString('en-US', { month: 'long', year: 'numeric' }) === newValue
            )
            :
            transactions.filter((transaction) => 
                new Date(transaction.date).toLocaleString('en-US', { year: 'numeric' }) === newValue
            );
           
        const totalSum = filteredTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

        const categorySums = filteredTransactions.reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
            return acc;
        }, {} as { [key: string]: number });

        const data = Object.keys(categorySums).map(category => ({
            value: +categorySums[category].toFixed(2),
            label: category
        }));

        setFilteredTransactions(filteredTransactions);
        setTotalSum(totalSum);
        setPieData(data);
    }    

    const handleSwitchClick = () => {
        setSwitchLabel(switchLabel === 'Period Overview' ? 'Progress Over Time' : 'Period Overview');
        setPieData([]);
        setTimeSpan('');
        setView('');
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }
  
    return (
    <> 
        {error ? 
            <Box className="default-message-box">
                <Typography>There was a problem loading your data. Please try again later.</Typography>
            </Box>
            : 
            ((transactions.length === 0 || categories.length === 0) ? 
                <Box className="default-message-box">
                    <Typography>No transactions or categories found.</Typography>
                </Box>
                :
                (switchLabel === 'Period Overview' ? 
                    <Box className="overview-container">     
                        <FormGroup className='switch-button'>
                            <FormControlLabel control={<Switch />} label={switchLabel} onChange={handleSwitchClick} />
                        </FormGroup>
                            
                        <Box className="overview-header">
                            {loading ? 
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                                    <CircularProgress color="success" size='3rem' />
                                </Stack>
                                :
                                <>
                                    <Tabs value={outerValue} onChange={handleOuterChange}>
                                        <Tab key={0} label="Year" onClick={() => setView("yearly")} sx={{ backgroundColor: outerValue === 0 ? 'lightblue' : 'inherit' }} />
                                        <Tab key={1} label="Month" onClick={() => setView("monthly")} sx={{ backgroundColor: outerValue === 1 ? 'lightblue' : 'inherit' }} /> 
                                    </Tabs>

                                    {view && 
                                        <Tabs value={innerValue} variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example" onChange={handleInnerChange}
                                            sx={{ [`& .${tabsClasses.scrollButtons}`]: {'&.Mui-disabled': { opacity: 0.3 },},}} className='scrollable-tabs'>
                                            {view === 'monthly' ? 
                                                Array.from(
                                                    new Set(transactions.map((transaction) => 
                                                        new Date(transaction.date).toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                        ))
                                                    )
                                                    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                                                    .map((month, index) => 
                                                        <Tab key={index} label={month} onClick={() => handleTabClick(month)} 
                                                            sx={{ backgroundColor: innerValue === index ? 'lightblue' : 'inherit' }} />)
                                                : 
                                                Array.from(
                                                    new Set(transactions.map((transaction) => 
                                                        new Date(transaction.date).toLocaleString('en-US', { year: 'numeric' })
                                                        ))
                                                    )
                                                    .sort((a, b) => parseInt(a) - parseInt(b))
                                                    .map((year, index) => 
                                                        <Tab key={index} label={year} onClick={() => handleTabClick(year)} 
                                                            sx={{ backgroundColor: innerValue === index ? 'lightblue' : 'inherit' }} />)
                                            }
                                        </Tabs>
                                    }
                                </>
                            }
                        </Box>

                        {pieData.length > 0 ? 
                            <Box className="overview-content">        
                                <Box className="pie-container">
                                    <PieActiveArc data={ pieData.map((category) => {return {...category, value: +((category.value / totalSum)*100).toFixed(2)}}) } />
                                </Box>
                                        
                                <List className='list-container'>
                                    <Typography variant="h6" id='graph-info-text'>
                                        The provided values are in {settings?.currency} currency.
                                    </Typography>

                                    <ListItem className="custom-list-item">
                                        <ListItemAvatar>
                                            <Avatar> <FunctionsIcon /> </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={<strong>Total</strong>}
                                            secondary={`${filteredTransactions.length} transaction(s)`}
                                        />
                                        <ListItemText 
                                            primary={`${settings?.currency === 'EUR' ? '€' : (settings?.currency === 'USD' ? '$' : 'BGN')} ${totalSum.toFixed(2)}`}        
                                            secondary={`100%`} 
                                        />
                                    </ListItem>
                                    
                                    {pieData.map((data, index) =>                             
                                        <ListItem key={index} className="custom-list-item">
                                            <ListItemAvatar> {getCategoryIcon(data.label, categories)} </ListItemAvatar>
                                            <ListItemText
                                                primary={<strong>{data.label}</strong>}
                                                secondary={`${filteredTransactions.reduce((acc, transaction) => {
                                                            if (transaction.category === data.label) acc++;
                                                                return acc;
                                                            }, 0)} transaction(s)`}
                                            />
                                            <ListItemText 
                                                primary={`${settings?.currency === 'EUR' ? '€' : (settings?.currency === 'USD' ? '$' : 'BGN')} ${data.value.toFixed(2)}`}                                                                                                            
                                                secondary={`${((data.value / totalSum)*100).toFixed(1)}%`}
                                            />
                                        </ListItem>                             
                                    )}
                                </List>
                            </Box> 
                            : 
                            <Box className="default-message-box">
                                <Typography> Select a period to preview graph </Typography>
                            </Box>
                        }
                    </Box>           
                    : 
                    <div className='progress-container'>        
                        <FormGroup className='switch-button'>
                            <FormControlLabel control={<Switch checked={switchLabel === 'Progress Over Time' ? true : false} />} 
                                label={switchLabel} onChange={handleSwitchClick}                         
                            />
                        </FormGroup>

                        <Progress transactions={transactions} timeSpan={timeSpan} setTimeSpan={setTimeSpan} />
                    </div>
                )
            )
        }
               
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 8 }}
        >
            <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} variant="filled">
                {error ? error : successMessage}
            </Alert>
        </Snackbar>        
    </>
    );  
}

export default Overview;