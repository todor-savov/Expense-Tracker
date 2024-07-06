import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getTransactions } from "../../service/database-service";
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            const transactions = await getTransactions(isLoggedIn.user);
            console.log(transactions);
            setTransactions(transactions);
        }

        fetchTransactions();
    }, []);

    return (
        <>
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
                            <td>{
                                transaction.receipt === 'none' 
                                ? 'No receipt' 
                                : <img src={transaction.receipt} alt="receipt" className="receiptImage" />
                            }</td>
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

