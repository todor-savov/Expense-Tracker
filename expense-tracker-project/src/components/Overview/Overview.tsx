import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FunctionsIcon from '@mui/icons-material/Functions';
import PieActiveArc from '../PieChart/PieChart';
import { getCategories, getTransactions } from '../../service/database-service';
import { getCategoryIcon } from '../../common/utils';
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
}

interface Data {
    value: number, 
    label: string
}

interface Category {
    imgSrc: string;
    imgAlt: string;
    type: string;
}

const Overview = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [value, setValue] = useState<number>(1);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [view, setView] = useState<string>("monthly");
    const [pieData, setPieData] = useState<Data[]|[]>([]);
    const [totalSum, setTotalSum] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                setTransactions(transactions);
                setLoading(false);
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categories = await getCategories();
                setCategories(categories);
                setLoading(false);
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        event.preventDefault();
        setValue(newValue);
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
      <Box className="overview-container">
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Year" onClick={() => setView("yearly")} />
          <Tab label="Month" onClick={() => setView("monthly")} /> 
        </Tabs>
        <Tabs value={value} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example" onChange={handleChange}>
            {view === 'monthly' ? (
                Array.from(
                    new Set(transactions.map((transaction) => 
                        new Date(transaction.date).toLocaleString('en-US', { month: 'long', year: 'numeric' })
                    ))
                ).map((month, index) => <Tab key={index} label={month} onClick={() => handleTabClick(month)} />)
            ) : (
                Array.from(
                    new Set(transactions.map((transaction) => new Date(transaction.date).toLocaleString('en-US', { year: 'numeric' })))
                ).map((year, index) => <Tab key={index} label={year} onClick={() => handleTabClick(year)} />)
                )
            }
        </Tabs>

        {pieData.length > 0 ? 
            <>          
                <Container className="pie-container">
                    <PieActiveArc data={ pieData.map((category) => {return {...category, value: +((category.value / totalSum)*100).toFixed(2)}}) } />
                </Container>
        
                <List className='list-container'>
                    <ListItem className="custom-list-item">
                        <ListItemAvatar>
                            <Avatar> <FunctionsIcon /> </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                            primary={<strong>Total</strong>}
                            secondary={`${filteredTransactions.length} transaction(s)`}
                        />
                        <ListItemText primary={totalSum.toFixed(2)} secondary={`100%`}/>
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
                            <ListItemText primary={data.value.toFixed(2)} secondary={`${((data.value / totalSum)*100).toFixed(2)}%`}/>
                        </ListItem>
                    )}
                </List>
            </> : 'No data available'}
      </Box>
    );
}

export default Overview;