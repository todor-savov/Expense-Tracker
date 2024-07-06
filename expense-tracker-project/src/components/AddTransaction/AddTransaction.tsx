import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faTags, faCalculator, faList, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { addTransaction } from '../../service/database-service';
import UploadReceipt from '../UploadReceipt/UploadReceipt';
import AuthContext from '../../context/AuthContext';
import './AddTransaction.css';

const AddTransaction = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [salesReceipt, setSalesReceipt] = useState<string | null>(null);
    interface NewTransaction {
        date: string;
        name: string;
        amount: number;
        category: string;
        payment: string;
        receipt: string;
        user: string;
    }
    const [transaction, setTransaction] = useState<NewTransaction | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const addHandler = async () => {
            if (transaction === null) {
                return;
            }
            setLoading(true);
            await addTransaction(transaction);
            setLoading(false);
            navigate('/transactions');
        }

        if (transaction) addHandler();
    }, [transaction]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const receiptURL = salesReceipt ? salesReceipt : 'none';

        const target = event.target as typeof event.target & {
            'expense-date': { value: string };
            'expense-name': { value: string };
            'expense-amount': { value: number };
            'expense-category': { value: string };
            'expense-payment': { value: string };
        };

        const expenseDate = target['expense-date'].value;
        const expenseName = target['expense-name'].value;
        const expenseAmount = target['expense-amount'].value;
        const expenseCategory = target['expense-category'].value;
        const expensePayment = target['expense-payment'].value; 

        const expenseDetails = { 
            date: expenseDate,
            name: expenseName,
            amount: expenseAmount,
            category: expenseCategory,
            payment: expensePayment,
            receipt: receiptURL,
            user: isLoggedIn.user
        };

        setTransaction(expenseDetails);
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
            <form onSubmit={handleSubmit} className='expense-form'>
                <h2>Expense Information</h2>

                <div className='expense-form-row-1'>
                    <FontAwesomeIcon icon={faCalendarDays} size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-date" type="date" name="expense-date" required/>

                    <FontAwesomeIcon icon={faTags} size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-name" type="text" name="expense-name" placeholder='Expense Name' required/>

                    <FontAwesomeIcon icon={faCalculator} size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-amount" type="text" name="expense-amount" placeholder='Expense Amount' required/>
                </div>

                <div className='expense-form-row-2'>
                    <FontAwesomeIcon icon={faList} size="xl" style={{color: "#74C0FC",}} />
                    <select id="expense-category" name="expense-category" required>
                        <option value="select">Category</option>
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="bills">Bills</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="others">Others</option>
                    </select>

                    <FontAwesomeIcon icon={faCreditCard} size="xl" style={{color: "#74C0FC",}} />
                    <select id="expense-payment" name="expense-payment" required>
                        <option value="select">Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                    </select>
                </div>

                <div className='expense-form-row-3'>
                    <UploadReceipt addReceipt={setSalesReceipt}/>
                </div>
                
                <button type="submit" id='add-expense'>Add Expense</button>
            </form>
        </>
    );
}

export default AddTransaction;