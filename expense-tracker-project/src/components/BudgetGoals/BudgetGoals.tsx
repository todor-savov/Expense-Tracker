import { useContext, useEffect, useState } from "react";
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { Box, Button, Typography } from "@mui/material";
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

const BudgetGoals = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const [categories, setCategories] = useState<Category[]|[]>([]);
    const [transactions, setTransactions] = useState<FetchedTransaction[]|[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [categoryForLimitUpdate, setCategoryForLimitUpdate] = useState<Category|null>(null);
    const [updateCategoryLimit, setUpdateCategoryLimit] = useState<boolean>(false);

    useEffect(() => {
        const fetchTransactionsAndCategories = async () => {
            try {
                setError(null);
                setLoading(true);
                const transactions = await getTransactions(isLoggedIn.user);
                if (transactions.length > 0) setTransactions(transactions);  
                const categories = await getCategories(isLoggedIn.user);
                if (categories.length > 0) {
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
                    setCategories(categories);
                }                                
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTransactionsAndCategories();
    }, []);

    useEffect(() => {
        const updateLimit = async () => {
            try {
                setError(null);
                setLoading(true);
                const response = await updateCategory(categoryForLimitUpdate as Category, categoryForLimitUpdate?.id);
                if (response) throw new Error('Error adding limit to category');

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
                setUpdateCategoryLimit(false);
                setCategoryForLimitUpdate(null);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
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

    return (
        <Box className='main-budget-container'>
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
                                                stroke: category.costsPercentage as number > 80 ? 'red' : 'green',
                                            },
                                            trail: {
                                                stroke: '#d6d6d6',
                                            }                                                                                
                                        }}
                                    >
                                        <Typography id='absolute-values'>{category.totalCosts?.toFixed(2)} / {category.limit}</Typography>
                                        <Typography id={category.costsPercentage as number > 80 ? 
                                            'percentage-over-threshold' : 'percentage-below-threshold'}
                                        >
                                            {category.costsPercentage?.toFixed(2)}%
                                        </Typography>
                                    </CircularProgressbarWithChildren>
                                </Box>
                            }

                            {category.limit ?
                                <Button id='remove-limit-button' onClick={() => handleRemoveLimitClick(category)}> Remove Limit </Button>
                                :
                                <Button id='add-limit-button' onClick={() => handleAddLimitClick(category)}> Add Limit </Button>
                            }
                        </Box>
                    </Box>
                ))}
            </Box>

            {dialogOpen && 
                <LimitDialog dialogOpen={true} setDialogOpen={setDialogOpen} 
                            categoryForLimitUpdate={categoryForLimitUpdate} 
                            setCategoryForLimitUpdate={setCategoryForLimitUpdate}
                            setUpdateCategoryLimit={setUpdateCategoryLimit}
                />
            }
        </Box>        
    );
}

export default BudgetGoals;