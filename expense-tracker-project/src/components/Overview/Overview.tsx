import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Avatar, FormControlLabel, FormGroup, List, ListItem, ListItemAvatar, ListItemText, Switch, Typography } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FunctionsIcon from '@mui/icons-material/Functions';
import { getCategoryIcon } from '../../common/utils';
import PieActiveArc from '../PieChart/PieChart';
import Progress from './Progress';
import { getCategories, getTransactions } from '../../service/database-service';
import { getExchangeRates } from '../../service/exchange-rate-service';
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
    const [outerValue, setOuterValue] = useState<number>(0);
    const [innerValue, setInnerValue] = useState<number>(0);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [view, setView] = useState<string>('');
    const [pieData, setPieData] = useState<Data[]|[]>([]);
    const [totalSum, setTotalSum] = useState<number>(0);
    const [switchLabel, setSwitchLabel] = useState<string>('Period Overview');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                const exchangeRates = await getExchangeRates(settings?.currency as string);

                const updatedTransactions = transactions.map((transaction: FetchedTransaction) => {
                    if (transaction.currency !== settings?.currency) {
                        const exchangeRate = 1 / exchangeRates[transaction.currency];
                        transaction.amount = transaction.amount * exchangeRate;  
                        transaction.currency = settings?.currency as string;                       
                    }
                    return transaction;
                });

                setTransactions(updatedTransactions);
                setError(null);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
                setLoading(false);
            }
        }
        fetchTransactions();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categories = await getCategories(isLoggedIn.user);
                setCategories(categories);
                setLoading(false);
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
            }
        }
        fetchCategories();
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
     
    if (loading) {
        return (
            <div className='spinnerContainer'>
                <div className='spinner'></div>
            </div>
        )
    }
  
    return (
      <>
      {error && <p>{error}</p>}
        <FormGroup className='switch-button'>
            <FormControlLabel control={<Switch />} label={switchLabel} 
                onChange={() => setSwitchLabel(switchLabel === 'Period Overview' ? 'Progress Over Time' : 'Period Overview')} />
        </FormGroup>

      {switchLabel === 'Period Overview' ? 
        (transactions.length > 0 ?
        <Box className="overview-container">            
            <Box className="overview-header">
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
            </Box>            

            {pieData.length > 0 ? 
                <>          
                    <Box className="pie-container">
                        <PieActiveArc data={ pieData.map((category) => {return {...category, value: +((category.value / totalSum)*100).toFixed(2)}}) } />
                    </Box>
                               
                    <List className='list-container'>
                        <Typography variant="h6" sx={{ display: 'flex', marginBottom: '10px', fontSize: '16px', fontStyle: 'italic' }}>
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
                                <ListItemAvatar>
                                    {getCategoryIcon(data.label, categories)}
                                </ListItemAvatar>
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
                </> : 'Select a period to view transactions'
            }
        </Box>
        :   <div className="message-box">
                <h2>No Transactions Found</h2>
            </div>)
        : <Progress />
      }
    </>
  );  
}

export default Overview;