import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { deleteTransaction, getTransactions } from "../../service/database-service";
import StickyTable from "./StickyTable";
import './AllTransactions.css';
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

interface FetchedTransaction {
    id: string;
    amount: number;
    category: string;
    date: string;
    name: string;
    payment: string;
    receipt: string;
    user: string;
}

const AllTransactions = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<FetchedTransaction[]>([]);
    const [transactionToDelete, setTransactionToDelete] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const transactions = await getTransactions(isLoggedIn.user);
                setTransactions(transactions);
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
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

