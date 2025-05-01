import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import AuthContext from "../../context/AuthContext";
import StickyTable from "./StickyTable";
import { deleteTransaction, getCategories, getPayments, getTransactions } from "../../service/database-service";
import { getExchangeRates } from "../../service/exchange-rate-service";
import './AllTransactions.css';

interface FetchedTransaction {
    id: string;
    amount: number;
    category: string;
    date: string;
    name: string;
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

const AllTransactions = () => {
    const { isLoggedIn, settings } = useContext(AuthContext);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [payments, setPayments] = useState<Payment[]|[]>([]);
    const [transactionToDelete, setTransactionToDelete] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [onSaveError, setOnSaveError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const navigate = useNavigate();

    console.log(loading);

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
                if (typeof payments === 'string') throw new Error('Error fetching payment methods.');
                setTransactions(transactions);
                setCategories(categories);
                setPayments(payments);
                setSuccessMessage('Data fetched successfully.');
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

    useEffect(() => {
        const deleteHandler = async () => {
            try {
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await deleteTransaction(transactionToDelete);
                if (typeof response === 'string') throw new Error('Error deleting transaction.');
                setTransactions(transactions.filter(transaction => transaction.id !== transactionToDelete));                     
                setSuccessMessage('Transaction deleted successfully.');
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setTransactionToDelete('');
                setOpenSnackbar(true);
            }
        }

        if (transactionToDelete) deleteHandler();       
    }, [transactionToDelete]);

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box id="all-transactions-container">
            {error ?
                <Box className='message-box error'>
                    <Typography>There was a problem loading your data.</Typography>
                    <Typography sx={{fontStyle: 'italic'}}>Please try again later.</Typography>
                </Box>
                : 
                ((categories.length === 0) ? 
                    <Box className="message-box">
                        <Typography sx={{color: 'red'}}>No categories found.</Typography>
                        <Typography sx={{fontStyle: 'italic'}}>
                            Make sure to add at least one category before adding transactions.
                        </Typography>
                        <Typography>
                            Click <Link to="/categories" style={{textDecoration: 'underline'}}>here</Link> to add a new category.
                        </Typography>
                    </Box>
                    :
                    (transactions.length === 0 ?
                        <Box className="message-box">
                            <Typography sx={{color: 'red'}}>No transactions found.</Typography> 
                            <Typography>Add your first transaction using the button below:</Typography>
                            <Button onClick={() => navigate('/add-transaction')} variant="contained"> <Add /> </Button>
                        </Box>
                        :
                        <StickyTable key={transactions.length} transactions={transactions} categories={categories} payments={payments} 
                            setTransactionToDelete={setTransactionToDelete} />
                    )
                )
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

export default AllTransactions;

