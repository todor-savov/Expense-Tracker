import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import './ConfirmDialog.css';
 
interface ConfirmDialogProps {
    dialog: {
        open: boolean;
        id: string | null;
    },
    setDialog: (dialog: { open: boolean; id: string | null }) => void;
    deleteHandler: (id: string) => void
}

const ConfirmDialog = ({ deleteHandler, dialog, setDialog }: ConfirmDialogProps) => {

    const handleDialogClose = () => {
        setDialog({ open: false, id: null });
    }
    
    const handleDialogConfirmation = () => {
        deleteHandler(dialog.id as string);
        handleDialogClose();
    }

    return (        
        <Dialog open={dialog.open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete this item?"}
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