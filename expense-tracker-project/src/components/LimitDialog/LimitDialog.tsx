import { useState } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import './LimitDialog.css';

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

interface LimitDialogProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    categoryForLimitUpdate: Category|null;
    setCategoryForLimitUpdate: (category: Category) => void;
    setUpdateCategoryLimit: (add: boolean) => void;
    setError: (error: string) => void;
    setOpenSnackbar: (open: boolean) => void;
}

const LimitDialog = ({ dialogOpen, setDialogOpen, categoryForLimitUpdate, setCategoryForLimitUpdate, 
                        setUpdateCategoryLimit, setError, setOpenSnackbar }: LimitDialogProps) => {
    const [limit, setLimit] = useState<number>(0);
    
    const handleDialogClose = () => {
        setDialogOpen(false);
    }
    
    const handleDialogConfirmation = () => {
        if (limit < 0 || limit === 0 || isNaN(limit)) {
            setError("Limit must be a positive number");
            setOpenSnackbar(true);
            return;
        };
        setCategoryForLimitUpdate({ ...categoryForLimitUpdate as Category, limit });
        setUpdateCategoryLimit(true);
        handleDialogClose();
    }
 
    return (        
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <Box id="limit-dialog">
                <DialogTitle id="limit-dialog-title"> {"Set category limit"} </DialogTitle>
                <DialogContent id="limit-dialog-description">
                    <DialogContentText>
                        <TextField type="number" label="Limit" id="category-limit-input" onChange={(e) => setLimit(parseInt(e.currentTarget.value))}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button id="add-category-limit-button" onClick={handleDialogConfirmation}> Add </button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default LimitDialog;