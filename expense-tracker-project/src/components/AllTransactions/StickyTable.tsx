import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { IconButton, InputAdornment } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faReceipt, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { getCategoryIcon, getPaymentIcon } from '../../common/utils';
import { getCategories, getPayments } from '../../service/database-service.ts';
import AuthContext from '../../context/AuthContext';

interface Column {
  id: 'category' | 'date' | 'name' | 'amount' | 'payment' | 'receipt';
  label: string;
  minWidth: number;
  align?: 'left';
}

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

interface StickyTableProps {
    transactions: FetchedTransaction[];
    setTransactionToDelete: (id: string) => void;
}

interface sortParams {
    column: string;
    ascending: boolean;
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

const StickyTable: React.FC<StickyTableProps> = ({ transactions, setTransactionToDelete }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showReceipt, setShowReceipt] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState<FetchedTransaction[]>(transactions);
  const [searchFilters, setSearchFilters] = useState<Map<string, string>>(new Map());
  const [sortParams, setSortParams] = useState<sortParams>({'column': 'date', 'ascending': false});
  const [hoveredColumnTitle, setHoveredColumnTitle] = useState<string>('');
  const [hoveredRow, setHoveredRow] = useState<string>('');
  const [sum, setSum] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]|[]>([]);
  const [payments, setPayments] = useState<Payment[]|[]>([]);
  const navigate = useNavigate();

  const columns: readonly Column[] = [
    { id: 'category', label: 'Category', minWidth: 50 },
    { id: 'date', label: 'Date', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'amount', label: 'Amount', minWidth: 70 },
    { id: 'payment', label: 'Payment', minWidth: 70 },
    { id: 'receipt', label: 'Receipt', minWidth: 120 }
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMouseEnter = (rowId: string) => setHoveredRow(rowId);
  
  const handleMouseLeave = () => setHoveredRow('');

  useEffect(() => {
      let filteredResults: FetchedTransaction[] = [...transactions];
      for (let [key, value] of searchFilters.entries()) {
        if (value.length > 0) {
          filteredResults = filteredResults.filter((transaction) => {
            if (key === 'date') {
              const date = new Date(transaction[key as keyof FetchedTransaction]);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              const year = date.getFullYear();
              const dateString = `${day}/${month}/${year}`;
              
              return dateString.toString().toLowerCase().includes(value);
            }
            return transaction[key as keyof FetchedTransaction].toString().toLowerCase().includes(value)
          });        
        }
      }
      setFilteredTransactions(filteredResults);
      setSum(filteredResults.reduce((acc, transaction) => acc + transaction.amount, 0));
  }, [searchFilters]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories(isLoggedIn.user);
      const payments = await getPayments();
      setCategories(categories);
      setPayments(payments);
    }
    fetchCategories();
  }, []);

  const clearFilter = (key: string) => {
    const newMap = new Map();
    if (key !== "all") {
      for (const [k, v] of searchFilters.entries()) {
        if (k !== key) newMap.set(k, v);
      }
    }
    setSearchFilters(newMap);
  };

  const loadSearchFilters = () => {
    const activeFilters = [...searchFilters].map(([key]) => 
             <TextField fullWidth key={key} label={key} className="search" 
              onChange={(event) => setSearchFilters(new Map(searchFilters.set(key, event.target.value.toString().toLowerCase())))} 
              size="small" 
              InputProps={{endAdornment: (
                          <InputAdornment position="end">
                              <IconButton onClick={() => clearFilter(key)}>
                                  <ClearIcon style={{color: 'red'}}/>
                              </IconButton> 
                          </InputAdornment>
                        )}}
              style={{ margin: '1%'}}
           />         
    );
    
    if (activeFilters.length > 0) {
        return <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '5px' }}>
                  <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '0.3%', padding: '1%', borderRadius: '5px' }}>
                      {activeFilters} 
                  </Box>
                  {activeFilters.length > 1 && 
                    <IconButton style={{justifyContent: "left"}} onClick={() => clearFilter("all")}>
                        <ClearIcon style={{color: 'red'}}/> <span style={{ fontSize: '0.9rem' }}>Clear All Filters</span>
                    </IconButton>
                  }
              </Box>
    }
  };

  return (
    <>
    {showReceipt ? 
            <div className="receipt-content" onClick={() => setShowReceipt('')}>
                <img src={showReceipt} alt="receipt" />
            </div>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{maxWidth: '100%'}}>
                    {loadSearchFilters()}
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                              {columns.map(column => 
                                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}
                                    onMouseEnter={() => setHoveredColumnTitle(column.id)} onMouseLeave={() => setHoveredColumnTitle('')}>
                                      <strong>{column.label}</strong>

                                      <IconButton size='small' onClick={() => setSearchFilters(new Map(searchFilters.set(column.id, "")))}>
                                        <SearchIcon fontSize='small' />
                                      </IconButton>

                                      {column.id === sortParams.column  
                                        ? <IconButton size='small' onClick={() => setSortParams({...sortParams, 'ascending': !sortParams.ascending})}>
                                              {sortParams.ascending ? <ArrowUpward fontSize='small' /> : <ArrowDownward fontSize='small' />}
                                          </IconButton> 
                                        : (column.id === hoveredColumnTitle && 
                                          <IconButton size='small' onClick={() => setSortParams({...sortParams, 'column': column.id})}>
                                              <ArrowUpward fontSize='small' />
                                          </IconButton>)
                                      }
                                  </TableCell>
                              )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredTransactions
                            .sort((transaction1, transaction2) => {
                                const key1 = transaction1[sortParams.column as keyof FetchedTransaction];
                                const key2 = transaction2[sortParams.column as keyof FetchedTransaction];
                                if (sortParams.column === 'date') {
                                  const date1 = new Date(key1 as string);
                                  const date2 = new Date(key2 as string);
                                  if (sortParams.ascending) return date1 >= date2 ? 1 : -1;
                                  else return date1 <= date2 ? 1 : -1;
                                } else {
                                  if (sortParams.ascending) return key1 >= key2 ? 1 : -1;
                                  else return key1 <= key2 ? 1 : -1;
                                }
                            })
                            .map((transaction) =>
                                <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id}
                                  onMouseEnter={() => handleMouseEnter(transaction.id)}
                                  onMouseLeave={handleMouseLeave}
                                >
                                    {columns.map((column) => {
                                        const value = transaction[column.id];
                                        if (column.id === 'receipt') {
                                            return <TableCell key={column.id} align={column.align}>
                                                        {value === 'none' ? 'No receipt'
                                                            : <FontAwesomeIcon icon={faReceipt} size="2xl" className="receipt-icon"
                                                                onClick={() => setShowReceipt(`${value}`)} />                         
                                                        }
                                                        {hoveredRow === transaction.id && 
                                                              <span>
                                                                <button className="edit-button" onClick={() => navigate(`/edit-transaction/${transaction.id}`)}><FontAwesomeIcon icon={faPenToSquare} size="sm" /></button>
                                                                <button className="delete-button" onClick={() => setTransactionToDelete(transaction.id)}><FontAwesomeIcon icon={faTrashCan} size="sm" /></button>
                                                              </span>
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
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          }
                        </TableBody>
                    </Table>
                    <Box sx={{ margin: '2%', padding: '1%' }}> <strong>TOTAL: </strong> {sum.toFixed(2)}</Box>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
    }
    </>
  );
}

export default StickyTable;