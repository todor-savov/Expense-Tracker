import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import { uploadFile } from "../../service/storage-service.ts";
import { VisuallyHiddenInput } from '../../common/utils.ts';
import './UploadReceipt.css';

interface FetchedTransaction {
    id: string;
    date: string;
    name: string;
    amount: number;
    category: string;
    payment: string;
    receipt: string;
    user: string;
    currency: string; 
}

interface UploadReceiptProps {
    setSalesReceipt: (url: string) => void;
    transaction: FetchedTransaction|null;
    setOnSaveError: (error: string|null) => void;
    setOpenSnackbar: (open: boolean) => void;
    setSuccessMessage: (message: string|null) => void;
}

const UploadReceipt: React.FC<UploadReceiptProps> = ({ setSalesReceipt, transaction, setOnSaveError, setOpenSnackbar, setSuccessMessage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileToUpload, setFileToUpload] = useState<File|null>(null);
    const [receiptURL, setReceiptURL] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const uploadHandler = async () => {
            try {                
                setLoading(true);
                const receiptURL = await uploadFile(fileToUpload as File);
                if (!receiptURL) throw new Error('Failed to upload receipt');
                setReceiptURL(receiptURL);
                setSalesReceipt(receiptURL);
                setSuccessMessage('Receipt uploaded successfully');
            } catch (error: any) {
                setOnSaveError(error.message);
                console.log(error.message);
            } finally {
                setLoading(false);
                setOpenSnackbar(true);
            }
        }
        if (fileToUpload) uploadHandler();

        return () => {
            setOnSaveError(null);
            setSuccessMessage(null);
        }
    }, [fileToUpload]);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file: File|null = (fileInputRef.current?.files) ? fileInputRef.current.files[0] : null;

        if (file?.type !== 'image/jpeg' && file?.type !== 'image/png') {            
            setOnSaveError('Please upload a valid image file.');
            setOpenSnackbar(true);
            return;
        }

        if (file) setFileToUpload(file);
    }

    return (
        <Box className='upload-receipt'>
            {loading ?
                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" id='spinning-circle'>
                    <CircularProgress color="success" size='3rem' />
                </Stack>
                :
                <Button component="label" role={undefined} tabIndex={-1}
                    startIcon={
                        <span>
                            <FontAwesomeIcon icon={faReceipt} size="2xl" style={{color: "#74C0FC",}}/> Sales Receipt
                        </span>
                    }
                >
                    <VisuallyHiddenInput type="file" id="file" name="file" accept="image/*" ref={fileInputRef} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleUpload(event)} />
                </Button>
            }            
            {receiptURL ? 
                <Box>        
                    <img src={receiptURL as string} alt="receipt" />
                </Box>
                : transaction && 
                <Box>        
                    <img src={transaction?.receipt as string} alt="receipt" />
                </Box>
            }
        </Box>
    );
}

export default UploadReceipt;