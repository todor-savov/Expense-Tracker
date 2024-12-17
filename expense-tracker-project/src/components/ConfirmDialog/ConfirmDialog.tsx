import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import './ConfirmDialog.css';
 
interface ConfirmDialogProps {
    dialog: {
        open: boolean;
        transactionId: string | null;
    },
    setDialog: (dialog: { open: boolean; transactionId: string | null }) => void;
    setTransactionToDelete: (transactionId: string) => void
}

const ConfirmDialog = ({ setTransactionToDelete, dialog, setDialog }: ConfirmDialogProps) => {

    const handleDialogClose = () => {
        setDialog({ open: false, transactionId: null });
    }
    
    const handleDialogConfirmation = () => {
        setTransactionToDelete(dialog.transactionId as string);
        handleDialogClose();
    }

    return (        
        <Dialog open={dialog.open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete this transaction?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action cannot be undone!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogConfirmation} id="delete-confirm-button"> Yes </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;