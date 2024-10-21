import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import AuthContext from "../../context/AuthContext";
import StickyTable from "./StickyTable";
import { deleteTransaction, getTransactions } from "../../service/database-service";
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

const AllTransactions = () => {
    const { isLoggedIn, settings } = useContext(AuthContext);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [transactionToDelete, setTransactionToDelete] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);

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
            }
        }
        fetchTransactions();
    }, []);

    useEffect(() => {
        const deleteHandler = async () => {
            try {
                setLoading(true);
                await deleteTransaction(transactionToDelete);
                setTransactions(transactions.filter(transaction => transaction.id !== transactionToDelete));
                setTransactionToDelete('');
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (transactionToDelete) deleteHandler();
    }, [transactionToDelete]);

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

            <Typography variant="h6" sx={{ backgroundColor: 'white', marginBottom: '10px', display: 'flex', 
                                    fontSize: '16px', fontStyle: 'italic' }}> 
                The values in the "Amount" column are in {settings?.currency} currency.
            </Typography>

            {transactions.length === 0 ? 
                <div className="message-box">
                    <h2>No Transactions Found</h2>
                    <p>Start by adding your first transaction to keep track of your expenses.</p>
                </div>
             : <StickyTable transactions={transactions} setTransactionToDelete={setTransactionToDelete} />
            }            
                        
            <Button onClick={() => navigate('/add-transaction')} variant="contained" sx={{marginTop: '10px'}}>
                <Add />
            </Button>
        </>
    );
}

export default AllTransactions; 

