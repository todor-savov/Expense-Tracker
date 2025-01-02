import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
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
}

const LimitDialog = ({ dialogOpen, setDialogOpen, categoryForLimitUpdate, setCategoryForLimitUpdate, setUpdateCategoryLimit }: LimitDialogProps) => {
    const [limit, setLimit] = useState<number>(0);
    
    const handleDialogClose = () => {
        setDialogOpen(false);
    }
    
    const handleDialogConfirmation = () => {
        if (limit < 0 || limit === 0 || isNaN(limit)) return;
        setCategoryForLimitUpdate({ ...categoryForLimitUpdate as Category, limit });
        setUpdateCategoryLimit(true);
        handleDialogClose();
    }

    return (        
        <Dialog open={dialogOpen} onClose={handleDialogClose} aria-describedby="limit-dialog-description" id="limit-dialog"
            aria-labelledby="limit-dialog-title">
            <DialogTitle id="limit-dialog-title">
              {"Category limit"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="limit-dialog-description">
                <TextField type="number" label="Limit" id="category-limit-input" onChange={(e) => setLimit(parseInt(e.currentTarget.value))}/>
              </DialogContentText>
            </DialogContent>
            <DialogActions> 
                <Button id="add-category-limit-button" onClick={handleDialogConfirmation}> Add </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LimitDialog;