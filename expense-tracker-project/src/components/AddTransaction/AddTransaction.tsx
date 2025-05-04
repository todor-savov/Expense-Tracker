import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faTags, faCalculator, faList, faCreditCard, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, CircularProgress, MenuItem, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { ArrowDropDownIcon, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addTransaction, getCategories, getPayments, getTransaction, updateTransaction } from '../../service/database-service';
import AuthContext from '../../context/AuthContext';
import { getCategoryIcon, getPaymentIcon } from '../../common/utils';
import { ALPHA_NUMERIC_SPACE_REGEX, AMOUNT_MIN_CHARS, AMOUNT_MAX_CHARS, EXPENSE_NAME_MIN_CHARS, EXPENSE_NAME_MAX_CHARS } from '../../common/constants';
import UploadReceipt from '../UploadReceipt/UploadReceipt';
import './AddTransaction.css';

interface NewTransaction {
    date: string;
    name: string;
    amount: number;
    category: string;
    payment: string;
    receipt: string;
    user: string;
    currency: string;
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

const AddTransaction = ({ mode }: { mode: string }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [onSaveError, setOnSaveError] = useState<string|null>(null);
    const [nameError, setNameError] = useState<string|null>(null);
    const [amountError, setAmountError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);    
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [salesReceipt, setSalesReceipt] = useState<string|null>(null);
    const [newTransaction, setNewTransaction] = useState<NewTransaction|null>(null);
    const [fetchedTransaction, setFetchedTransaction] = useState<FetchedTransaction|null>(null);
    const [transactionToEdit, setTransactionToEdit] = useState<FetchedTransaction|null>(null);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [payments, setPayments] = useState<Payment[]|[]>([]);

    useEffect(() => {
        const fetchCategoriesAndPayments = async () => {
            try {                        
                setLoading(true);
                const categories = await getCategories(isLoggedIn.user);
                if (typeof categories === 'string') throw new Error('Error fetching categories.');
                const payments = await getPayments();
                if (typeof payments === 'string') throw new Error('Error fetching payment methods.');
                setCategories(categories);
                setPayments(payments);
                setSuccessMessage('Data fetched successfully');
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);                 
            } finally {
                setLoading(false);    
                setOpenSnackbar(true);            
            }          
        }

        if (mode === 'new') {
            fetchCategoriesAndPayments(); 
            
            return () => {
                setError(null);
                setSuccessMessage(null);
                setCategories([]);
                setPayments([]);
            }                            
        }
    }, [mode]);

    useEffect(() => {
        const addHandler = async () => {
            try {
                setLoading(true);
                const status = await addTransaction(newTransaction as NewTransaction);
                if (status) throw new Error('Failed to add transaction');
                setLoading(false);
                navigate('/transactions');
            } catch (error: any) {
                setLoading(false);
                setOnSaveError(error.message);
                console.log(error.message);
                setOpenSnackbar(true);
            }
        }
        
        if (newTransaction) addHandler();

        return () => setOnSaveError(null);
    }, [newTransaction]);

    useEffect(() => {
        // This useEffect is used to fetch the transaction details from the database
        // and populate the form with the transaction details when the mode is 'edit'
        const fetchTransaction = async () => {
            try {           
                setLoading(true);
                const transactionDetails = await getTransaction(id as string);
                if (!transactionDetails) throw new Error('Transaction not found');
                const categories = await getCategories(isLoggedIn.user);
                if (typeof categories === 'string') throw new Error('Error fetching categories');
                const payments = await getPayments();
                if (typeof payments === 'string') throw new Error('Error fetching payment methods');
                setFetchedTransaction(transactionDetails);
                setCategories(categories);
                setPayments(payments);
                setSuccessMessage('Transaction fetched successfully');
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }

        if (mode === 'edit') {            
            fetchTransaction();

            return () => {
                setError(null);
                setSuccessMessage(null);
                setFetchedTransaction(null);
                setCategories([]);
                setPayments([]);
            }
        }
    }, [mode]);

    useEffect(() => {
        const updateHandler = async () => {
            try {                
                setLoading(true);
                const status = await updateTransaction(transactionToEdit as FetchedTransaction, transactionToEdit?.id as string);
                if (status) throw new Error('Failed to update transaction');
                setLoading(false);
                navigate('/transactions');
            } catch (error: any) {
                setLoading(false);
                setOnSaveError(error.message);
                console.log(error.message);
                setOpenSnackbar(true);                
            }
        }
        if (transactionToEdit) updateHandler();

        return () => setOnSaveError(null);
    }, [transactionToEdit]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSaveError(null);
        setNameError(null);
        setAmountError(null);

        const receipt = (mode === 'edit') ? 
            (fetchedTransaction ? 
                (salesReceipt ? salesReceipt : fetchedTransaction.receipt) : 'none') 
        : (salesReceipt ? salesReceipt : 'none');
        
        const target = event.target as typeof event.target & {
            'expense-date': { value: string };
            'expense-name': { value: string };
            'expense-amount': { value: number };
            'expense-currency': { value: string };
            'expense-category': { value: string };
            'expense-payment': { value: string };
        };

        const date = target['expense-date'].value;
        const name = target['expense-name'].value;
        const amount = +target['expense-amount'].value;
        const currency = target['expense-currency'].value;
        const category = target['expense-category'].value;
        const payment = target['expense-payment'].value; 

        if (name.length < EXPENSE_NAME_MIN_CHARS || name.length > EXPENSE_NAME_MAX_CHARS || !ALPHA_NUMERIC_SPACE_REGEX.test(name)) {
            setNameError(`${EXPENSE_NAME_MIN_CHARS}-${EXPENSE_NAME_MAX_CHARS} characters/digits/space allowed`);
            return;
        }

        if (amount.toString().length < AMOUNT_MIN_CHARS || amount.toString().length > AMOUNT_MAX_CHARS || amount <= 0) {
            setAmountError(`${AMOUNT_MIN_CHARS}-${AMOUNT_MAX_CHARS} positive digits allowed`);
            return;
        }       

        if (!date || !currency || !category || !payment) {
            setOnSaveError('Please fill in all the fields');
            setOpenSnackbar(true);
            return;
        }

        const expenseDetails = { date, name, amount, category, payment, receipt: receipt || '', user: isLoggedIn.user, currency };

        if (mode === 'edit') setTransactionToEdit({ ...expenseDetails, id: id as string });         
        if (mode === 'new') setNewTransaction(expenseDetails);
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box className="expense-container">
            {error ? 
                <Box className='message-box error'>
                    <Typography>There was a problem loading your data.</Typography>
                    <Typography sx={{fontStyle: 'italic'}}>Please try again later.</Typography>
                </Box>
                :
                (categories.length === 0 ?
                    <Box className="message-box">
                        <Typography sx={{color: 'red'}}>Categories not found.</Typography>
                    </Box>
                    :
                    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} className="expense-form">
                        <Box className='form-input'>
                            <Box className='input-fields'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            value={fetchedTransaction ? dayjs(fetchedTransaction?.date) : null}
                                            label={<FontAwesomeIcon icon={faCalendarDays} size="xl" style={{color: "#74C0FC",}} />}
                                            slotProps={{
                                                textField: {
                                                    id: "expense-date",
                                                    helperText: "Please select a date", 
                                                    required: true,                                                
                                                },                                                
                                            }}
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
                                        
                                <TextField select id="expense-currency" name="expense-currency" label={<FontAwesomeIcon icon={faDollarSign} size="xl" style={{color: "#74C0FC",}} />}
                                    defaultValue={fetchedTransaction ? fetchedTransaction?.currency : ""}
                                    helperText={"Please select currency"} required 
                                >
                                    <MenuItem key="Currency" value="" disabled>Currency</MenuItem>
                                    <MenuItem key="BGN" value="BGN">BGN</MenuItem>
                                    <MenuItem key="USD" value="USD">USD</MenuItem>
                                    <MenuItem key="EUR" value="EUR">EUR</MenuItem>
                                </TextField>
                                    
                                {categories.length > 0 && 
                                    <TextField select id="expense-category" name="expense-category" label={<FontAwesomeIcon icon={faList} size="xl" style={{color: "#74C0FC",}} />}
                                        defaultValue={fetchedTransaction ? fetchedTransaction?.category : ""}
                                        helperText={"Please select category"} required 
                                    >
                                        <MenuItem key="Category" value="" disabled>Category</MenuItem>
                                        {categories.map((category: Category) => (
                                            <MenuItem key={category.type} value={category.type}>
                                                <Typography>{getCategoryIcon(category.type, categories)} {category.type}</Typography>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }
                                    
                                {payments.length > 0 &&
                                    <TextField select id="expense-payment" name="expense-payment" label={<FontAwesomeIcon icon={faCreditCard} size="xl" style={{color: "#74C0FC",}} />}
                                        defaultValue={fetchedTransaction ? fetchedTransaction?.payment : ""}
                                        helperText={"Please select payment method"} required 
                                    >
                                        <MenuItem key="Payment" value="" disabled>Payment Method</MenuItem>
                                        {payments.map((payment: Payment) => (
                                            <MenuItem key={payment.type} value={payment.type}>
                                                <Typography>{getPaymentIcon(payment.type, payments)} {payment.type}</Typography>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                }                            
                            </Box>                                                    

                            <Accordion id="receipt-accordion">
                                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                                    <Typography variant="h6">{'Sales Receipt'}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <UploadReceipt setSalesReceipt={setSalesReceipt} setOnSaveError={setOnSaveError} transaction={fetchedTransaction}
                                        setOpenSnackbar={setOpenSnackbar} setSuccessMessage={setSuccessMessage} />
                                </AccordionDetails>
                            </Accordion>
                        </Box>

                        {loading ? 
                            <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                                <CircularProgress color="success" size='3rem' />
                            </Stack>
                            :
                            <Box className='action-buttons'>
                                <Button id='add-expense' type="submit">Save</Button>
                                <Button id='cancel-expense' onClick={() => navigate('/transactions')}>Cancel</Button>
                            </Box>
                        }                        
                    </Box>
                )
            }            
                                
            {!loading && 
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={(error || onSaveError) ? 'error' : 'success'} variant="filled">
                        {error ? error : (onSaveError ? onSaveError : successMessage)}
                    </Alert>
                </Snackbar>
            }
        </Box>
    );
}

export default AddTransaction;