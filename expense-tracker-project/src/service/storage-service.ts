import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config.ts";

export const uploadFile = async (file: File) => {  
    const storageRef = ref(storage, `sales-receipts/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};



