import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { deleteTransaction, getTransactions } from "../../service/database-service";
import StickyTable from "./StickyTable";
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
            <h2>My Transactions</h2>
            {transactions.length === 0 ? 
                <p>No transactions found</p> : <StickyTable transactions={transactions} />
            }
            <br />
            <br />
            <button onClick={() => navigate('/add-transaction')}>Add transaction</button>
        </>
    );
}

export default AllTransactions; 

