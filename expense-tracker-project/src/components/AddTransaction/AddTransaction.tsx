import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faTags, faCalculator, faList, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Save } from '@mui/icons-material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addTransaction, getCategories, getPayments, getTransaction, updateTransaction } from '../../service/database-service';
import UploadReceipt from '../UploadReceipt/UploadReceipt';
import AuthContext from '../../context/AuthContext';
import { getCategoryIcon, getPaymentIcon } from '../../common/utils';
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

const AddTransaction = ({ mode }: { mode: string }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [dateError, setDateError] = useState<string|null>(null);
    const [nameError, setNameError] = useState<string|null>(null);
    const [amountError, setAmountError] = useState<string|null>(null);
    const [categoryError, setCategoryError] = useState<string|null>(null);
    const [paymentError, setPaymentError] = useState<string|null>(null);
    const [salesReceipt, setSalesReceipt] = useState<string|null>(null);
    const [newTransaction, setNewTransaction] = useState<NewTransaction|null>(null);
    const [fetchedTransaction, setFetchedTransaction] = useState<FetchedTransaction|null>(null);
    const [transactionToEdit, setTransactionToEdit] = useState<FetchedTransaction|null>(null);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [payments, setPayments] = useState<Payment[]|[]>([]);

    useEffect(() => {
        const fetchCategoriesAndPayments = async () => {
          const categories = await getCategories(isLoggedIn.user);
          const payments = await getPayments();
          setCategories(categories);
          setPayments(payments);
        }
        fetchCategoriesAndPayments();
      }, []);

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

        const receipt = (mode === 'edit') ? 
            (fetchedTransaction ? 
                (salesReceipt ? salesReceipt : fetchedTransaction.receipt) : 'none') 
        : (salesReceipt ? salesReceipt : 'none');
        
        const target = event.target as typeof event.target & {
            'expense-date': { value: string };
            'expense-name': { value: string };
            'expense-amount': { value: number };
            'expense-category': { value: string };
            'expense-payment': { value: string };
        };

        const date = target['expense-date'].value;
        const name = target['expense-name'].value;
        const amount = +target['expense-amount'].value;
        const category = target['expense-category'].value;
        const payment = target['expense-payment'].value; 

        if (name.length > 30) {
            setNameError('Name error');
        }

        if (date.length > 30) {
            setDateError('Date error');
        }

        if (typeof amount !== 'number') {
            setAmountError('Amount error');
        }

        if (typeof category !== 'string') {
            setCategoryError('Category error');
        }

        if (typeof payment !== 'string') {
            setPaymentError('Payment error');
        }

        const expenseDetails = { date, name, amount, category, payment, receipt: receipt || '', user: isLoggedIn.user };

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
            <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} noValidate
                autoComplete="off" onSubmit={handleSubmit} className="expense-form"
            >
                {error && <p>{error}</p>}
                <div className='input-fields'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                                <DatePicker 
                                    value={fetchedTransaction ? dayjs(fetchedTransaction?.date) : null}
                                    label={<FontAwesomeIcon icon={faCalendarDays} size="xl" style={{color: "#74C0FC",}} />}
                                    slotProps={{textField: {
                                            id: "expense-date",
                                            error: !!dateError,
                                            helperText: dateError || "Please select a date", 
                                            required: true
                                    }}}
                                />
                        </DemoContainer>
                    </LocalizationProvider>
                
                    <TextField error={!!nameError} type="text" id="expense-name" label={<FontAwesomeIcon icon={faTags} size="xl" style={{color: "#74C0FC",}} />}
                        {...fetchedTransaction ? { defaultValue: fetchedTransaction?.name } : { placeholder: 'Name' }} 
                        helperText={nameError || "Please select name"} required
                    />
               
                    <TextField error={!!amountError} type="number" id="expense-amount" label={<FontAwesomeIcon icon={faCalculator} size="xl" style={{color: "#74C0FC",}} />}
                        {...fetchedTransaction ? { defaultValue: fetchedTransaction?.amount } : { placeholder: 'Amount' }} 
                        helperText={amountError || "Please select amount"} required
                    />
                
                    {categories.length > 0 && 
                        <TextField error={!!categoryError} select id="expense-category" name="expense-category" label={<FontAwesomeIcon icon={faList} size="xl" style={{color: "#74C0FC",}} />}
                            defaultValue={fetchedTransaction ? fetchedTransaction?.category : ""}
                            helperText={categoryError || "Please select category"} required 
                        >
                            <MenuItem key="Category" value="" disabled>Category</MenuItem>
                            {categories.map((category: Category) => (
                                <MenuItem key={category.type} value={category.type}>
                                    {getCategoryIcon(category.type, categories)}
                                </MenuItem>
                            ))}
                        </TextField>
                    }
                
                    {payments.length > 0 &&
                        <TextField error={!!paymentError} select id="expense-payment" name="expense-payment" label={<FontAwesomeIcon icon={faCreditCard} size="xl" style={{color: "#74C0FC",}} />}
                            defaultValue={fetchedTransaction ? fetchedTransaction?.payment : ""}
                            helperText={paymentError || "Please select payment method"} required 
                        >
                            <MenuItem key="Payment" value="" disabled>Payment Method</MenuItem>
                            {payments.map((payment: Payment) => (
                                <MenuItem key={payment.type} value={payment.type}>
                                    {getPaymentIcon(payment.type, payments)}
                                </MenuItem>
                            ))}
                        </TextField>
                    }
                </div>
                
                <UploadReceipt setSalesReceipt={setSalesReceipt} transaction={fetchedTransaction} />

                <Button id='add-expense' type="submit" endIcon={<Save />}>Save</Button>
            </Box>
        </>
    );
}

export default AddTransaction;