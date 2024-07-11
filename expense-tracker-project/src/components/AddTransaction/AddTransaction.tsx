import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faTags, faCalculator, faList, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { addTransaction, getTransaction, updateTransaction } from '../../service/database-service';
import UploadReceipt from '../UploadReceipt/UploadReceipt';
import AuthContext from '../../context/AuthContext';
import './AddTransaction.css';

interface NewTransaction {
    date: string;
    name: string;
    amount: number;
    category: string;
    payment: string;
    receipt: string;
    user: string;
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
}

const AddTransaction = ({ mode }: { mode: string }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [salesReceipt, setSalesReceipt] = useState<string|null>(null);
    const [newTransaction, setNewTransaction] = useState<NewTransaction|null>(null);
    const [fetchedTransaction, setFetchedTransaction] = useState<FetchedTransaction|null>(null);
    const [transactionToEdit, setTransactionToEdit] = useState<FetchedTransaction|null>(null);

    useEffect(() => {
        // This useEffect is used to fetch the transaction details from the database
        // and populate the form with the transaction details when the mode is 'edit'
        const fetchTransaction = async () => {
            try {
                if (!id) return;
                setLoading(true);
                const transactionDetails = await getTransaction(id);
                setFetchedTransaction(transactionDetails);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (mode === 'edit') fetchTransaction();  
    }, [mode]);

    useEffect(() => {
        const addHandler = async () => {
            try {
                if (newTransaction === null) return;
                setLoading(true);
                await addTransaction(newTransaction);
                setLoading(false);
                navigate('/transactions');
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (newTransaction) addHandler();
    }, [newTransaction]);

    useEffect(() => {
        const updateHandler = async () => {
            try {
                if (transactionToEdit === null) return;
                setLoading(true);
                updateTransaction(transactionToEdit, transactionToEdit.id);
                setLoading(false);
                navigate('/transactions');
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (transactionToEdit) updateHandler();
    }, [transactionToEdit]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const receipt = salesReceipt ? salesReceipt : 'none';

        const target = event.target as typeof event.target & {
            'expense-date': { value: string };
            'expense-name': { value: string };
            'expense-amount': { value: number };
            'expense-category': { value: string };
            'expense-payment': { value: string };
        };

        const date = target['expense-date'].value;
        const name = target['expense-name'].value;
        const amount = target['expense-amount'].value;
        const category = target['expense-category'].value;
        const payment = target['expense-payment'].value; 

        const expenseDetails = { date, name, amount, category, payment, receipt, user: isLoggedIn.user };

        if (mode === 'edit') {
            if (id) setTransactionToEdit({ ...expenseDetails, id: id });
        }
        if (mode === 'new') setNewTransaction(expenseDetails);
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
            <form onSubmit={handleSubmit} className='expense-form'>
                <h2>Transaction Details</h2>

                <div className='expense-form-row-1'>
                    <FontAwesomeIcon icon={faCalendarDays} size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-date" type="date" name="expense-date" 
                        defaultValue={fetchedTransaction ? fetchedTransaction?.date : ''} 
                        required/>

                    <FontAwesomeIcon icon={faTags} size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-name" type="text" name="expense-name" 
                        {...fetchedTransaction ? { defaultValue: fetchedTransaction?.name } : { placeholder: 'Expense Name' }} 
                        required/>

                    <FontAwesomeIcon icon={faCalculator} size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-amount" type="text" name="expense-amount" 
                        {...fetchedTransaction ? { defaultValue: fetchedTransaction?.amount } : { placeholder: 'Expense Amount' }} 
                        required/>
                </div>

                <div className='expense-form-row-2'>
                    <FontAwesomeIcon icon={faList} size="xl" style={{color: "#74C0FC",}} />
                    <select id="expense-category" name="expense-category" 
                        defaultValue={fetchedTransaction ? fetchedTransaction?.category : ""}
                        required>
                        <option value="" disabled>Category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Others">Others</option>
                    </select>

                    <FontAwesomeIcon icon={faCreditCard} size="xl" style={{color: "#74C0FC",}} />
                    <select id="expense-payment" name="expense-payment" 
                        defaultValue={fetchedTransaction ? fetchedTransaction?.payment : ""}
                        required>
                        <option value="" disabled>Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                    </select>
                </div>

                <div className='expense-form-row-3'>
                    <UploadReceipt setSalesReceipt={setSalesReceipt} />
                </div>
                
                <button type="submit" id='add-expense'>Add</button>
            </form>
        </>
    );
}

export default AddTransaction;