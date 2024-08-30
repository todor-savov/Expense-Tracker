import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { getCategories, getPayments, getTransactions } from "../../service/database-service";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { getCategoryIcon, getPaymentIcon } from "../../common/utils";

interface Column {
    id: 'category' | 'date' | 'name' | 'amount' | 'payment' | 'receipt';
    label: string;
    minWidth: number;
    align?: 'left';
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
    imgSrc: string;
    imgAlt: string;
    type: string;
}
  
interface Payment {
    imgSrc: string;
    imgAlt: string;
    type: string;
}

const Home = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [payments, setPayments] = useState<Payment[]|[]>([]);
    const [showReceipt, setShowReceipt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);

    const columns: readonly Column[] = [
        { id: 'category', label: 'Category', minWidth: 50 },
        { id: 'date', label: 'Date', minWidth: 100 },
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'amount', label: 'Amount', minWidth: 70 },
        { id: 'payment', label: 'Payment', minWidth: 70 },
        { id: 'receipt', label: 'Receipt', minWidth: 120 }
    ];

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                setTransactions(transactions);
                setLoading(false);
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
            }
        }
        fetchTransactions();
    }, []);

    useEffect(() => {
        const fetchCategoriesAndPayments = async () => {
          const categories = await getCategories();
          const payments = await getPayments();
          setCategories(categories);
          setPayments(payments);
        }
        fetchCategoriesAndPayments();
    }, []);

    if (loading) {
        return (
            <div className='spinnerContainer'>
                <div className='spinner'></div>
            </div>
        )
    }

    return ( showReceipt ? 
                <div className='receipt-content' onClick={() => setShowReceipt('')}>
                    <img src={showReceipt} alt="receipt" />
                </div>
            :
            <>
                {error && <p>{error}</p>}
                 <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{maxWidth: '100%'}}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => 
                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                            <strong>{column.label}</strong>
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.sort((t1, t2) => {
                                    const date1 = new Date(t1['date'] as string);
                                    const date2 = new Date(t2['date'] as string);
                                    return date1 < date2 ? 1 : -1;
                                })
                                .slice(0, 5)
                                .map((transaction) =>
                                    <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id}>
                                        {columns.map((column) => {
                                            const value = transaction[column.id];
                                            if (column.id === 'receipt') {
                                                return <TableCell key={column.id} align={column.align}>
                                                    {value === 'none' ? 'No receipt'
                                                        : <FontAwesomeIcon icon={faReceipt} size="2xl" className="receipt-icon"
                                                            onClick={() => setShowReceipt(`${value}`)} />                         
                                                    }
                                                    </TableCell>
                                            } else if (column.id === 'category') {
                                                return <TableCell key={column.id} align={column.align}>
                                                            {getCategoryIcon(`${value}`, categories)}
                                                        </TableCell>
                                            } else if (column.id === 'date') {
                                                return <TableCell key={column.id} align={column.align}>
                                                            {new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </TableCell>
                                            } else if (column.id === 'amount') {                                      
                                                return <TableCell key={column.id} align={column.align}>
                                                            {(value as number).toFixed(2)}
                                                        </TableCell>  
                                            } else if (column.id === 'payment') {
                                                return <TableCell key={column.id} align={column.align}>
                                                            {getPaymentIcon(`${value}`, payments)}
                                                        </TableCell>  
                                            } else {
                                                return <TableCell key={column.id} align={column.align}>
                                                            {value}
                                                        </TableCell>
                                            }
                                            })} 
                                    </TableRow>)
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </>
    )
}

export default Home;