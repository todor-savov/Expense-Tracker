import React from "react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getCategories, getPayments, getTransactions } from "../../service/database-service";
import { getExchangeRates } from "../../service/exchange-rate-service";
import { Alert, Box, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import './HomePrivate.css';

interface Column {
    id: 'category' | 'date' | 'name' | 'amount' | 'payment' | 'receipt';
    label: string;
}

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

interface Category {
    id: string;
    imgSrc: string;
    imgAlt: string;
    type: string;
    user: string;
}
  
interface Payment {
    imgSrc: string;
    imgAlt: string;
    type: string;
}

const HomePrivate = () => {
    const { isLoggedIn, settings } = useContext(AuthContext);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [payments, setPayments] = useState<Payment[]|[]>([]);
    const [showReceipt, setShowReceipt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    console.log(loading);

    const columns: readonly Column[] = [
        { id: 'category', label: 'Category' },
        { id: 'date', label: 'Date' },
        { id: 'name', label: 'Name' },
        { id: 'amount', label: 'Amount' },
        { id: 'payment', label: 'Payment' },
        { id: 'receipt', label: 'Receipt' }
    ];
    
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                if (typeof transactions === 'string') throw new Error('Error fetching transactions.');
                const areExchangeRatesNeeded = transactions.some((transaction: FetchedTransaction) => {
                    if (transaction.currency !== settings?.currency) return true;
                    return false;
                });
                if (areExchangeRatesNeeded) {
                    const exchangeRates = await getExchangeRates(settings?.currency as string);
                    if (typeof exchangeRates === 'string') throw new Error('Error fetching exchange rates.');
                    transactions.map((transaction: FetchedTransaction) => {
                        if (transaction.currency !== settings?.currency) {
                            const exchangeRate = 1 / exchangeRates[transaction.currency];
                            transaction.amount = transaction.amount * exchangeRate;  
                            transaction.currency = settings?.currency as string;                       
                        }
                        return transaction;
                    });
                }       
                
                const categories = await getCategories(isLoggedIn.user);
                if (typeof categories === 'string') throw new Error('Error fetching categories.');
                const payments = await getPayments();
                if (typeof payments === 'string') throw new Error('Error fetching payments.');
                setTransactions(transactions);
                setCategories(categories);
                setPayments(payments);
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
            setPayments([]);
        }
    }, []);

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return ( 
        <Box id="home-private-container">
            {error ?                 
                <Box className='message-box error'>
                    <Typography>There was a problem loading your data.</Typography>
                    <Typography sx={{fontStyle: 'italic'}}>Please try again later.</Typography>
                </Box>
                : 
                (transactions.length === 0 ?
                    <Box className="message-box">
                        <Typography sx={{color: 'red'}}>No transactions found.</Typography>
                    </Box>
                    :
                    <React.Fragment>
                        <Box id={showReceipt ? "receipt-content" : 'receipt-content-hide'} onClick={() => setShowReceipt('')}>
                            <img src={showReceipt} alt="receipt" />
                        </Box>

                        <TableContainer id='sticky-table-container'>
                            <Table id='sticky-table'>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => 
                                            <TableCell key={column.id} align='center'
                                                style={{backgroundColor: '#eeebeb'}} className='table-cell'
                                            >
                                                <Typography id='column-title'> {column.label} </Typography>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.sort((t1, t2) => {
                                        const date1 = new Date(t1['date'] as string);
                                        const date2 = new Date(t2['date'] as string);
                                        return date1 < date2 ? 1 : -1;
                                    })
                                    .slice(0, 10)
                                    .map((transaction) =>
                                        <TableRow key={transaction.id} hover style={{ cursor: 'pointer' }}>
                                            {columns.map((column) => {
                                                const value = transaction[column.id];
                                                if (column.id === 'receipt') {
                                                    return (
                                                        <TableCell key={column.id} align='center' className='table-cell'>
                                                            {value === 'none' ?
                                                                <Typography id='no-receipt-text'> None </Typography>                                                        
                                                                : 
                                                                <FontAwesomeIcon icon={faReceipt} id="receipt-icon"
                                                                    onClick={() => setShowReceipt(`${value}`)} />                         
                                                            }
                                                        </TableCell>)
                                                } else if (column.id === 'category') {
                                                    return (
                                                        <TableCell key={column.id} align='center' className='table-cell'>
                                                            <Tooltip title={value} placement="bottom" classes={{tooltip: 'custom-tooltip-text'}} arrow>
                                                                <img 
                                                                    src={categories.find((cat) => cat.type === value)?.imgSrc}
                                                                    alt={categories.find((cat) => cat.type === value)?.imgAlt}
                                                                    className='cell-with-icon'
                                                                />
                                                            </Tooltip>
                                                        </TableCell>)
                                                } else if (column.id === 'date') {
                                                    return (
                                                        <TableCell key={column.id} align='center' className='table-cell'>
                                                            <Box className='cell-value'>
                                                                {new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </Box>
                                                        </TableCell>)
                                                } else if (column.id === 'amount') {                                                                                                                                
                                                    return (
                                                        <TableCell key={column.id} align='center' className='table-cell'>
                                                            <Box className='cell-value'>
                                                                {`${transaction.currency === 'USD' ? '$' : 
                                                                    (transaction.currency === 'EUR' ? '€' : 'BGN')} ${(value as number).toFixed(2)}
                                                                `}
                                                            </Box>
                                                        </TableCell>)
                                                } else if (column.id === 'payment') {
                                                    return (
                                                        <TableCell key={column.id} align='center' className='table-cell'>
                                                            <Tooltip title={value} placement="bottom" classes={{tooltip: 'custom-tooltip-text'}} arrow>
                                                                <img
                                                                    src={payments.find((pay) => pay.type === value)?.imgSrc}
                                                                    alt={payments.find((pay) => pay.type === value)?.imgAlt}
                                                                    className='cell-with-icon'
                                                                />
                                                            </Tooltip>
                                                        </TableCell>)
                                                } else {
                                                    return (
                                                        <TableCell key={column.id} align='center' className='table-cell'>
                                                            <Box className='cell-value'> {value} </Box>
                                                        </TableCell>)
                                                }
                                            })} 
                                        </TableRow>)
                                    }
                                </TableBody>
                            </Table>                        
                        </TableContainer>

                        <Typography id='currency-disclaimer-text'>
                            The values in the "Amount" column are in {settings?.currency} currency.                            
                        </Typography>
                    </React.Fragment>
                )                                                                
            }

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} variant="filled">
                    {error ? error : successMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default HomePrivate;