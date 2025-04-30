import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, IconButton, InputAdornment, Popover, Tooltip, Typography } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { ArrowUpward, ArrowDownward, Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faReceipt, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/AuthContext';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog.tsx';

interface Column {
  id: 'category' | 'date' | 'name' | 'amount' | 'payment' | 'receipt';
  label: string;
  className: string;
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

interface sortParams {
  column: string;
  ascending: boolean;
} 

interface Dialog {
  open: boolean,
  id: string|null
}

interface StickyTableProps {
    transactions: FetchedTransaction[];
    categories: Category[];
    payments: Payment[];
    setTransactionToDelete: (id: string) => void;
}

const StickyTable: React.FC<StickyTableProps> = ({ transactions, categories, payments, setTransactionToDelete }) => {
  const { settings } = useContext(AuthContext);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showReceipt, setShowReceipt] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState<FetchedTransaction[]>(transactions);
  const [searchFilters, setSearchFilters] = useState<Map<string, string>>(new Map());
  const [sortParams, setSortParams] = useState<sortParams>({'column': 'date', 'ascending': false});
  const [selectedRow, setSelectedRow] = useState<string|null>(null);
  const [hoveredColumnTitle, setHoveredColumnTitle] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
  const [sum, setSum] = useState<number>(0); 
  const [dialog, setDialog] = useState<Dialog>({ open: false, id: null });
  const navigate = useNavigate();

  const columns: readonly Column[] = [
    { id: 'category', label: 'Category', className: 'table-cell' },
    { id: 'date', label: 'Date', className: 'table-cell' },
    { id: 'name', label: 'Name', className: 'table-cell' },
    { id: 'amount', label: 'Amount', className: 'table-cell' },
    { id: 'payment', label: 'Payment', className: 'table-cell' },
    { id: 'receipt', label: 'Receipt', className: 'table-cell' }
  ];

  const handleTitleClick = (event: React.MouseEvent<HTMLTableCellElement>, columnId: string) => {
    setAnchorEl(event.currentTarget);  
    setHoveredColumnTitle(columnId);
  }

  const handleTitlePopoverClose = () => {
    setAnchorEl(null);
    setHoveredColumnTitle('');
  }

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, transactionId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(transactionId);
  }
  
  const handleRowPopoverClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  }

  const handleFilterButtonClick = (columnId: string) => {
    setSearchFilters(new Map(searchFilters.set(columnId, "")));
    handleTitlePopoverClose();
  }

  const handleSort = (columnId: string) => {
    setSortParams({...sortParams, 'column': columnId});
    handleTitlePopoverClose();
  }

  const handleSortChange = () => {
    setSortParams({...sortParams, 'ascending': !sortParams.ascending});
    handleTitlePopoverClose();
  }
 
  const handleReceiptIconClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>, receipt: string) => {
    event.stopPropagation();
    setShowReceipt(receipt);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
      setPage(0);
  }, [searchFilters]);

  const clearFilter = (key: string) => {
    const newMap = new Map();
    if (key !== "all") {
      for (const [k, v] of searchFilters.entries()) {
        if (k !== key) newMap.set(k, v);
      }
    }
    setSearchFilters(newMap);
    setPage(0);
  };

  const loadSearchFilters = () => {
    const activeFilters = [...searchFilters].map(([key]) => 
        <TextField key={key} label={key} size="small" id="search-text-field"
          onChange={(event) => setSearchFilters(new Map(searchFilters.set(key, event.target.value.toString().toLowerCase())))}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => clearFilter(key)}>
                  <ClearIcon style={{color: 'red'}} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
    );
    
    if (activeFilters.length > 0) {
      return (
          <Box id='search-filters'>
            {activeFilters}

            {activeFilters.length > 1 &&
              <IconButton onClick={() => clearFilter("all")}>
                <ClearIcon style={{color: 'red'}} /> <span id='clear-all-button'>Clear All Filters</span>
              </IconButton>
            }
          </Box>
      );
    }
  };

  return (
        <>
          <div id={showReceipt ? "receipt-content" : 'receipt-content-hide'} onClick={() => setShowReceipt('')}>
              <img src={showReceipt} alt="receipt" />
          </div>

          { dialog.open && <ConfirmDialog deleteHandler={setTransactionToDelete} dialog={dialog} setDialog={setDialog} /> }
        
          <TableContainer id='sticky-table-container'>
            {loadSearchFilters()}
             
            <Table id='sticky-table'>            
              <TableHead>
                <TableRow>
                  {columns.map(column => 
                  <React.Fragment>
                    <TableCell key={column.id} align='center' className={column.className}
                      onClick={(event) => handleTitleClick(event, column.id)}
                      sx={{ cursor: 'pointer', backgroundColor: '#f1f1f1' }}
                    >
                      <Tooltip title={`Click to sort/filter by ${column.label}`} classes={{tooltip: 'custom-tooltip-text'}} 
                        placement="bottom" arrow>
                        <Typography id='column-title'> {column.label} </Typography>
                      </Tooltip>
                    </TableCell>

                    <Popover 
                      open={hoveredColumnTitle === column.id}
                      anchorEl={anchorEl}
                      onClose={handleTitlePopoverClose}
                      anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'center', horizontal: 'center' }}                     
                    >
                     <IconButton onClick={() => handleFilterButtonClick(column.id)}>
                       <SearchIcon id='column-title-button-icon' />
                     </IconButton>

                     {sortParams.column === column.id ?
                       <IconButton onClick={handleSortChange}>
                         {sortParams.ascending ? <ArrowUpward id='column-title-button-icon' /> : <ArrowDownward id='column-title-button-icon' />}
                       </IconButton>
                       : 
                       (hoveredColumnTitle === column.id && 
                         <IconButton onClick={() => handleSort(column.id)}>
                           <ArrowUpward id='column-title-button-icon' />
                         </IconButton>
                       )
                     }
                    </Popover>
                  </React.Fragment>
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
                      <React.Fragment>
                        <TableRow key={transaction.id} style={{ cursor: 'pointer' }} hover
                          onClick={(event) => handleRowClick(event, transaction.id)}
                        >
                          {columns.map((column) => {
                            const value = transaction[column.id];
                              if (column.id === 'receipt') {                                                              
                                  return (
                                    <TableCell key={column.id} align='center' className={column.className}>
                                      {value === 'none' ?
                                        <Typography id='no-receipt-text'> None </Typography>
                                        :
                                        <FontAwesomeIcon icon={faReceipt} id="receipt-icon"
                                          onClick={(event) => handleReceiptIconClick(event, `${value}`)} />
                                      }                                                                                                                                       
                                    </TableCell>)
                              } else if (column.id === 'category') {
                                  return (
                                    <TableCell key={column.id} align='center' className={column.className}>
                                      <Tooltip title={value} placement="bottom" classes={{tooltip: 'custom-tooltip-text'}} arrow>
                                        <img 
                                          src={categories.find((cat) => cat.type === value)?.imgSrc}
                                          alt={categories.find((cat) => cat.type === value)?.imgAlt}
                                          className='cell-with-icon' 
                                        />
                                      </Tooltip>
                                    </TableCell>)
                              } else if (column.id === 'date') {
                                  return (
                                    <TableCell key={column.id} align='center' className={column.className}>
                                      <Box className='cell-value'>
                                        {new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                      </Box>
                                    </TableCell>)
                              } else if (column.id === 'amount') {                                
                                  return (
                                    <TableCell key={column.id} align='center' className={column.className}>
                                      <Box className='cell-value'>
                                        {`${transaction.currency === 'USD' ? '$' : 
                                          (transaction.currency === 'EUR' ? '€' : 'BGN')} ${(value as number).toFixed(2)}
                                        `}
                                      </Box>                                        
                                    </TableCell>)
                              } else if (column.id === 'payment') {
                                  return (
                                    <TableCell key={column.id} align='center' className={column.className}>  
                                      <Tooltip title={value} placement="bottom" classes={{tooltip: 'custom-tooltip-text'}} arrow>
                                        <img
                                          src={payments.find((pay) => pay.type === value)?.imgSrc}
                                          alt={payments.find((pay) => pay.type === value)?.imgAlt}
                                          className='cell-with-icon'
                                        />
                                      </Tooltip>
                                    </TableCell>)
                              } else {
                                  return (
                                    <TableCell key={column.id} align='center' className={column.className}>
                                      <Box className='cell-value'>
                                        {value}
                                      </Box>
                                    </TableCell>)
                              }
                          })}
                        </TableRow>

                        <Popover 
                          open={selectedRow === transaction.id}
                          anchorEl={anchorEl}
                          onClose={handleRowPopoverClose} 
                          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                          transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                        >
                          <button id="edit-button" onClick={() => navigate(`/edit-transaction/${transaction.id}`)}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                          <button id="delete-button" onClick={() => setDialog({ open: true, id: transaction.id })}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </Popover>
                      </React.Fragment>
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                }
              </TableBody>                                  
            </Table>     

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              classes={{ root: 'pagination', selectLabel: 'pagination-select-label', displayedRows: 'pagination-displayed-rows' }}
            />
          </TableContainer>

          <Typography id='total-sum-text'>
            <strong>TOTAL:</strong>
            {` ${settings?.currency === 'USD' ? '$' : (settings?.currency === 'EUR' ? '€' : 'BGN')} ${sum.toFixed(2)}`}                      
          </Typography>

          <Button id='add-transaction-button' variant="contained" onClick={() => navigate('/add-transaction')}>
            <Add />
          </Button>
        </>
  );
}

export default StickyTable;