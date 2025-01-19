import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getCategories, getPayments, getTransactions } from "../../service/database-service";
import { getExchangeRates } from "../../service/exchange-rate-service";
import { Alert, Box, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { getCategoryIcon, getPaymentIcon } from "../../common/utils";
import './HomePrivate.css';

interface Column {
    id: 'category' | 'date' | 'name' | 'amount' | 'payment' | 'receipt';
    label: string;
    minWidth: number;
    align?: 'left';
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

    const columns: readonly Column[] = [
        { id: 'category', label: 'Category', minWidth: 50 },
        { id: 'date', label: 'Date', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'amount', label: 'Amount', minWidth: 70 },
        { id: 'payment', label: 'Payment', minWidth: 70 },
        { id: 'receipt', label: 'Receipt', minWidth: 120 }
    ];
    
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
                const payments = await getPayments();
                if (typeof payments === 'string') throw new Error('Error fetching payments.');
                setTransactions(updatedTransactions);
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
        <Box className="home-private-container">
            {error ?                 
                <Box className="message-box">
                    <Typography>There was a problem loading your data. Please try again later.</Typography>
                </Box>
                : 
                ((transactions.length === 0 || categories.length === 0 || payments.length === 0) ?
                    <Box className="message-box">
                        <Typography>No transactions, categories or payment methods found.</Typography>                                       
                    </Box>
                    :
                    <Box className="home-transactions-table">
                        <Box className={showReceipt ? "receipt-content" : 'receipt-content-hide'} onClick={() => setShowReceipt('')}>
                            <img src={showReceipt} alt="receipt" />
                        </Box>

                        <Paper>
                            <TableContainer>
                                <Table aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => 
                                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                    <strong>{column.label}</strong>
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
                                            <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id}>
                                                {columns.map((column) => {
                                                    const value = transaction[column.id];
                                                    if (column.id === 'receipt') {
                                                        return <TableCell key={column.id} align={column.align}>
                                                            {value === 'none' ? 'No receipt'
                                                                : <FontAwesomeIcon icon={faReceipt} size="2xl" className="receipt-icon"
                                                                    onClick={() => setShowReceipt(`${value}`)} />                         
                                                            }
                                                            </TableCell>
                                                    } else if (column.id === 'category') {
                                                        return <TableCell key={column.id} align={column.align}>
                                                                    {getCategoryIcon(`${value}`, categories)}
                                                                </TableCell>
                                                    } else if (column.id === 'date') {
                                                        return <TableCell key={column.id} align={column.align}>
                                                                    {new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                </TableCell>
                                                    } else if (column.id === 'amount') {                                                                                                                                  
                                                        return <TableCell key={column.id} align={column.align}>
                                                                    <span>
                                                                        {`${transaction.currency === 'USD' ? '$' : 
                                                                            (transaction.currency === 'EUR' ? '€' : 'BGN')} ${(value as number).toFixed(2)}
                                                                        `}
                                                                    </span>
                                                                </TableCell>
                                                    } else if (column.id === 'payment') {
                                                        return <TableCell key={column.id} align={column.align}>
                                                                    {getPaymentIcon(`${value}`, payments)}
                                                                </TableCell>  
                                                    } else {
                                                        return <TableCell key={column.id} align={column.align}>
                                                                    {value}
                                                                </TableCell>
                                                    }
                                                })} 
                                            </TableRow>)
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="h6" sx={{ fontSize: '16px', fontStyle: 'italic', padding: '10px' }}> 
                                The values in the "Amount" column are in {settings?.currency} currency.
                            </Typography>
                        </Paper>
                    </Box>                   
                )                                                                
            }

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 8 }}
            >
                <Alert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} variant="filled">
                    {error ? error : successMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default HomePrivate;