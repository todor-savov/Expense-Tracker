import { useContext, useEffect, useState } from "react";
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { getCategories, getTransactions, updateCategory } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import LimitDialog from "../LimitDialog/LimitDialog";
import './BudgetGoals.css';

interface Category {
    id: string;
    type: string;
    imgSrc: string;
    imgAlt: string;
    limit?: number;
    totalCosts?: number;
    costsPercentage?: number;
    user: string;
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

interface BudgetGoalsProps {
    isLimitChanged: boolean;
    setIsLimitChanged: (isLimitChanged: boolean) => void;
}

const BudgetGoals = ({ isLimitChanged, setIsLimitChanged }: BudgetGoalsProps) => {
    const { isLoggedIn, settings } = useContext(AuthContext);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [categoryForLimitUpdate, setCategoryForLimitUpdate] = useState<Category|null>(null);
    const [updateCategoryLimit, setUpdateCategoryLimit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [onSaveError, setOnSaveError] = useState<string|null>(null);
    const [validationError, setValidationError] = useState<string|null>(null);
    const [successMessage, setSuccessMessage] = useState<string|null>(null);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    useEffect(() => {
        const fetchTransactionsAndCategories = async () => {
            try {            
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                if (typeof transactions === 'string') throw new Error('Error fetching transactions.');
                const categories = await getCategories(isLoggedIn.user);
                if (typeof categories === 'string') throw new Error('Error fetching categories.');
                categories.map((category: Category) => {
                    if (category.limit) {
                        const totalCategoryCosts = transactions.reduce((acc: number, transaction: FetchedTransaction) => {
                        if (transaction.category === category.type) return acc + transaction.amount;
                            return acc;
                        }, 0);
                        category.totalCosts = totalCategoryCosts;
                        category.costsPercentage = (totalCategoryCosts / category.limit) * 100;
                    }
                });
                setTransactions(transactions);  
                setCategories(categories);
                setSuccessMessage('Data fetched successfully');
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }

        fetchTransactionsAndCategories();

        return () => {
            setError(null);
            setSuccessMessage(null);
            setCategories([]);
            setTransactions([]);
        }
    }, []);

    useEffect(() => {
        const updateLimit = async () => {
            try {
                setOnSaveError(null);
                setSuccessMessage(null);
                setLoading(true);
                const response = await updateCategory(categoryForLimitUpdate as Category, categoryForLimitUpdate?.id);
                if (response) throw new Error(categoryForLimitUpdate?.limit ? 'Failed to add limit' : 'Failed to remove limit');
                if (categoryForLimitUpdate?.limit) {
                    const totalCategoryCosts = transactions.reduce((acc: number, transaction: FetchedTransaction) => {
                        if (transaction.category === categoryForLimitUpdate?.type) return acc + transaction.amount;
                        return acc;
                    }, 0);
                    categoryForLimitUpdate.totalCosts = totalCategoryCosts;
                    categoryForLimitUpdate.costsPercentage = (totalCategoryCosts / categoryForLimitUpdate.limit) * 100;
                }                
                setCategories((categories as Category[]).map((category: Category) => {
                    if (category.id === categoryForLimitUpdate?.id) return categoryForLimitUpdate as Category;
                    else return category;
                }));                                                
                setSuccessMessage(categoryForLimitUpdate?.limit ? 'Limit added successfully' : 'Limit removed successfully');
                setIsLimitChanged(!isLimitChanged);
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setUpdateCategoryLimit(false);
                setCategoryForLimitUpdate(null);
                setOpenSnackbar(true);
            }
        }
        if (updateCategoryLimit) updateLimit();     
    }, [updateCategoryLimit]);

    const handleAddLimitClick = (category: Category) => {
        setCategoryForLimitUpdate(category);
        setDialogOpen(true);
    }

    const handleRemoveLimitClick = (category: Category) => {
        setCategoryForLimitUpdate({
            id: category.id,
            type: category.type,
            imgSrc: category.imgSrc,
            imgAlt: category.imgAlt,
            user: category.user
        });

        setUpdateCategoryLimit(true);        
    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box className='main-budget-container'>
            {error ? 
                <Box className="message-box">
                    <Typography>There was a problem loading your data. Please try again later.</Typography>
                </Box>
                :
                ((categories.length === 0 || transactions.length === 0) ? 
                    <Box className="message-box">
                        <Typography>No transactions or categories found.</Typography>
                    </Box>
                    :
                    <Box className='budget-items-container'>
                        {categories.map((category: Category) => (
                            <Box key={category.id} className='budget-item-outer-container'>
                                <Box className='budget-item-inner-container'>
                                    <Box id={category.limit ? 'budget-item-with-limit-header' : 'budget-item-without-limit-header'}>
                                        <img src={category.imgSrc} alt={category.imgAlt} id={category.limit ? 'image-with-limit' : 'image-without-limit'} />
                                        <Typography>{category.type}</Typography>
                                    </Box>
                                
                                    {category.limit && 
                                        <Box id='budget-item-with-limit-status'>
                                            <CircularProgressbarWithChildren
                                                value={category.costsPercentage as number}
                                                styles={{              
                                                    root: {
                                                        display: 'flex',
                                                        width: '6rem',
                                                    },
                                                    path: {
                                                        stroke: 
                                                            settings?.budgetNotificationLimit ?
                                                            (category.costsPercentage as number > settings.budgetNotificationLimit ? 'red' : 'green')
                                                            :
                                                            (category.costsPercentage as number >= 100 ? 'red' : 'green')                                                                                                                                                    
                                                    },
                                                    trail: {
                                                        stroke: '#d6d6d6',
                                                    }                                                                                
                                                }}
                                            >
                                                <Typography id='absolute-values'>{category.totalCosts?.toFixed(2)} / {category.limit}</Typography>
                                                <Typography id={settings?.budgetNotificationLimit ?
                                                    (category.costsPercentage as number > settings.budgetNotificationLimit ?
                                                    'percentage-over-threshold' : 'percentage-below-threshold')
                                                    : 
                                                    (category.costsPercentage as number >= 100 ?
                                                        'percentage-over-threshold' : 'percentage-below-threshold'
                                                    )                                                                                        
                                                }
                                                >
                                                    {category.costsPercentage?.toFixed(2)}%
                                                </Typography>
                                            </CircularProgressbarWithChildren>
                                        </Box>
                                    }

                                    {(category.id === categoryForLimitUpdate?.id && loading) ? 
                                        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                                            <CircularProgress color="success" size='3rem' />
                                        </Stack>
                                        :
                                        (category.limit ?
                                            <Button id='remove-limit-button' onClick={() => handleRemoveLimitClick(category)}> Remove Limit </Button>
                                            :
                                            <Button id='add-limit-button' onClick={() => handleAddLimitClick(category)}> Add Limit </Button>
                                        )
                                    }
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )
            }

            {dialogOpen && 
                <LimitDialog dialogOpen={true} setDialogOpen={setDialogOpen} 
                            categoryForLimitUpdate={categoryForLimitUpdate} 
                            setCategoryForLimitUpdate={setCategoryForLimitUpdate}
                            setUpdateCategoryLimit={setUpdateCategoryLimit}
                            setValidationError={setValidationError} setOpenSnackbar={setOpenSnackbar}
                />
            }
            
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ marginBottom: 8 }}
            >
                <Alert onClose={handleSnackbarClose} severity={(error || validationError || onSaveError) ? 'error' : 'success'} variant="filled">
                    {error ? error : (validationError ? validationError : (onSaveError ? onSaveError : successMessage))}
                </Alert>
            </Snackbar>
        </Box>        
    );
}

export default BudgetGoals;