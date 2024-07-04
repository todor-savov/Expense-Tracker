import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faTags, faCalculator, faList, faCreditCard, faReceipt } from '@fortawesome/free-solid-svg-icons';
import './AddTransaction.css';

const AddTransaction = () => {
    const navigate = useNavigate();

    return (
        <>  
            <form onSubmit={() => {}} className='expense-form'>
                <h2>Expense Information</h2>

                <div className='expense-form-row-1'>
                    <FontAwesomeIcon icon={faCalendarDays} beat size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-date" type="date" name="expense-date" required/>

                    <FontAwesomeIcon icon={faTags} fade size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-name" type="text" name="expense-name" placeholder='Expense Name' required/>

                    <FontAwesomeIcon icon={faCalculator} bounce size="xl" style={{color: "#74C0FC",}} />
                    <input id="expense-amount" type="text" name="expense-amount" placeholder='Expense Amount' required/>
                </div>

                <div className='expense-form-row-2'>
                    <FontAwesomeIcon icon={faList} fade size="xl" style={{color: "#74C0FC",}} />
                    <select id="expense-category" name="expense-category" required>
                        <option value="select">Category</option>
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="bills">Bills</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="others">Others</option>
                    </select>

                    <FontAwesomeIcon icon={faCreditCard} bounce size="xl" style={{color: "#74C0FC",}} />
                    <select id="expense-payment" name="expense-payment" required>
                        <option value="select">Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                    </select>

                    <FontAwesomeIcon icon={faReceipt} beat size="xl" style={{color: "#74C0FC",}} />
                    <button id='upload-sales-receipt' onClick={() => navigate('/upload-receipt')}>Receipt</button>
                </div>
                
                <button type="submit" id='add-expense'>Add Expense</button>
            </form>
        </>
    );
}

export default AddTransaction;