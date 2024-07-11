import * as React from 'react';
import { useState } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faReceipt, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { getCategoryIcon } from '../../common/utils';
import { IconButton } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

interface Column {
  id: 'category' | 'date' | 'name' | 'amount' | 'payment' | 'receipt';
  label: string;
  minWidth: number;
  align?: 'left';
  format?: (value: number) => string;
  render: () => JSX.Element;
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

const StickyTable: React.FC<StickyTableProps> = ({ transactions, setTransactionToDelete }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showReceipt, setShowReceipt] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState<FetchedTransaction[]>(transactions);
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [sum, setSum] = useState<number>(0);
  const [hoveredRow, setHoveredRow] = useState<string>('');

  const columns: readonly Column[] = [
    { id: 'category', label: 'Category', minWidth: 50,
      render: () => <IconButton onClick={() => setSearchCriteria("category")}><GridSearchIcon /></IconButton> 
    },
    { id: 'date', label: 'Date', minWidth: 100, 
      render: () => <IconButton onClick={() => setSearchCriteria("date")}><GridSearchIcon /></IconButton> 
    },
    { id: 'name', label: 'Name', minWidth: 100,
      render: () => <IconButton onClick={() => setSearchCriteria("name")}><GridSearchIcon /></IconButton> 
    },
    { id: 'amount', label: 'Amount', minWidth: 70,
      format: (value: number) => value.toLocaleString('en-US'),
      render: () => <IconButton onClick={() => setSearchCriteria("amount")}><GridSearchIcon /></IconButton>
    },
    { id: 'payment', label: 'Payment', minWidth: 70, 
      render: () => <IconButton onClick={() => setSearchCriteria("payment")}><GridSearchIcon /></IconButton>, 
     },
    { id: 'receipt', label: 'Receipt', minWidth: 120,
      render: () => <IconButton onClick={() => setSearchCriteria("receipt")}><GridSearchIcon /></IconButton>, 
    }
  ];

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMouseEnter = (rowId: string) => setHoveredRow(rowId);
  
  const handleMouseLeave = () => setHoveredRow('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    console.log(event.target.value);
    console.log(searchCriteria);

    // Filter transactions based on search
    const searchString = event.target.value.toString().toLowerCase();
    const filteredTransactions = 
            transactions.filter(transaction => transaction[searchCriteria as keyof FetchedTransaction].toString().toLowerCase().includes(searchString));

    console.log(filteredTransactions);

    const sum = filteredTransactions.reduce((acc, transaction) => {
        console.log(transaction);
        return acc + transaction.amount;
    }, 0);

    setSum(sum);
    // Update the transactions displayed
    setFilteredTransactions(filteredTransactions);
  }

  return (
    <>
    {showReceipt ? 
            <div className="receipt-content" onClick={() => setShowReceipt('')}>
                <img src={showReceipt} alt="receipt" />
            </div>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    {searchCriteria &&
                        <Box sx={{ margin: '2%', padding: '1%' }}>
                            <TextField fullWidth label={searchCriteria} id="search" onChange={(event) => handleSearch(event)}/>
                        </Box>
                    }
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {columns.map(column => 
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}> 
                                    {column.label}
                                    {column.render()}
                                </TableCell>
                            )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTransactions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                         {getCategoryIcon(`${value}`)}
                                                   </TableCell>
                                        } else {
                                            return <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : `${value}`}
                                                    </TableCell>
                                        }
                                    })} 
                                </TableRow>)
                            }
                        </TableBody>
                    </Table>
                    <Box sx={{ margin: '2%', padding: '1%' }}>
                        <p>GROSS: {sum}</p>
                    </Box>
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