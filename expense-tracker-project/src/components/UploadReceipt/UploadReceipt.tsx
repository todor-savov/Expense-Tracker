import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { uploadFile } from "../../service/storage-service.ts";
import { Box, Button } from '@mui/material';
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
    setError: (error: string|null) => void;
}

const UploadReceipt: React.FC<UploadReceiptProps> = ({ setSalesReceipt, transaction, setError }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileToUpload, setFileToUpload] = useState<File|null>(null);
    const [receiptURL, setReceiptURL] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const uploadHandler = async () => {
            try {
                setLoading(true);
                const receiptURL = await uploadFile(fileToUpload as File);
                setReceiptURL(receiptURL);
                setSalesReceipt(receiptURL);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                console.log(error.message);
            }
        }
        if (fileToUpload) uploadHandler();
    }, [fileToUpload]);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file: File|null = (fileInputRef.current?.files) ? fileInputRef.current.files[0] : null;

        if (file?.type !== 'image/jpeg' && file?.type !== 'image/png') {            
            setError('Invalid file type. Please upload a valid image file.');
            return;
        }

        if (file) setFileToUpload(file);
    }

    return (
        <Box className='upload-receipt'>
            <Button component="label" role={undefined} tabIndex={-1}
                startIcon={
                    <span>
                        <FontAwesomeIcon icon={faReceipt} size="2xl" style={{color: "#74C0FC",}}/> Sales Receipt                                
                    </span>
                }
            >
                <VisuallyHiddenInput type="file" id="file" name="file" accept="image/*" ref={fileInputRef} onChange={(event) => handleUpload(event)} />
            </Button>
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