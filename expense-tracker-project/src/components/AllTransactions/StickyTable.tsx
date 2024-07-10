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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';

interface Column {
  id: 'category' | 'date' | 'name' | 'amount' | 'payment' | 'receipt';
  label: string;
  minWidth?: number;
  align?: 'left';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'category', label: 'Category', minWidth: 100, align: 'left' },
  { id: 'date', label: 'Date', minWidth: 100, align: 'left' },
  { id: 'name', label: 'Name', minWidth: 100, align: 'left' },
  { id: 'amount', label: 'Amount', minWidth: 70, align: 'left',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'payment', label: 'Payment', minWidth: 70, align: 'left' },
  { id: 'receipt', label: 'Receipt', minWidth: 70, align: 'left' },
];

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
}

const StickyTable: React.FC<StickyTableProps> = ({ transactions }) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showReceipt, setShowReceipt] = useState<string>('');

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
    {showReceipt ? 
            <div className="receipt-content" onClick={() => setShowReceipt('')}>
                <img src={showReceipt} alt="receipt" />
            </div>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {columns.map(column => 
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}> 
                                    {column.label}
                                </TableCell>
                            )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((transaction) =>
                                <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id}>
                                    {columns.map((column) => {
                                        const value = transaction[column.id];
                                        if (column.id === 'receipt') {
                                            return <TableCell key={column.id} align={column.align}>
                                                        {value === 'none' ? 'No receipt'
                                                            : <FontAwesomeIcon icon={faReceipt} size="2xl" style={{color: "#74C0FC", cursor: "pointer"}} 
                                                                onClick={() => setShowReceipt(`${value}`)} />                         
                                                        }
                                                    </TableCell>
                                        } else {
                                            return <TableCell key={column.id} align={column.align}>
                                                        { column.format && typeof value === 'number' ? column.format(value) : `${value}` }
                                                    </TableCell>
                                        }
                                        })
                                    }
                                </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={transactions.length}
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