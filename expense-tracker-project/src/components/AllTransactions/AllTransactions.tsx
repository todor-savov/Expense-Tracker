import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { deleteTransaction, getTransactions } from "../../service/database-service";
import './AllTransactions.css';

const AllTransactions = () => {
    const { isLoggedIn } = useContext(AuthContext);
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
    const [transactions, setTransactions] = useState<FetchedTransaction[]>([]);
    const [transactionToDelete, setTransactionToDelete] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const navigate = useNavigate();

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
            <h1>All Transactions</h1>
            {transactions.length === 0 ? <p>No transactions found</p>
            : <table className="all-transactions-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Receipt</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.category}</td>
                            <td>{transaction.name}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.payment}</td>
                            <td>{transaction.receipt === 'none' 
                                    ? 'No receipt' 
                                    : <img src={transaction.receipt} alt="receipt" className="receiptImage" />
                                }</td>
                            <td>
                                <button onClick={() => navigate(`/edit-transaction/${transaction.id}`)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={()=> setTransactionToDelete(transaction.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            }
            <br />
            <br />
            <button onClick={() => navigate('/add-transaction')}>Add new transaction</button>
        </>
    );
}

export default AllTransactions;

