import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { uploadFile } from "../../service/storage-service.ts";
import './UploadReceipt.css';

interface UploadReceiptProps {
    addReceipt: (url: string) => void;
  }

const UploadReceipt: React.FC<UploadReceiptProps> = ({ addReceipt }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [receiptURL, setReceiptURL] = useState<string | null>(null);

    useEffect(() => {
        const uploadHandler = async () => {
            const receiptURL = await uploadFile(fileToUpload as File);
            setReceiptURL(receiptURL);
            addReceipt(receiptURL);
        }
        if (fileToUpload) uploadHandler();
    }, [fileToUpload]);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file: File | null = (fileInputRef.current?.files) ? fileInputRef.current.files[0] : null;
        if (file) setFileToUpload(file);
    }

    return (
        <div className='upload-receipt'>
            <FontAwesomeIcon icon={faReceipt} size="2xl" style={{color: "#74C0FC",}} />

            <input type="file" id="file" name="file" accept="image/*" ref={fileInputRef} onChange={(event) => handleUpload(event)} />
            <label htmlFor="file">Sales Receipt</label>

            {receiptURL && 
                <div>        
                    <img src={receiptURL as string} alt="receipt" />
                </div>
            }
        </div>
    );
}

export default UploadReceipt;