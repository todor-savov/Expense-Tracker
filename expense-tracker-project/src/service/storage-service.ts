import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config.ts";

export const uploadFile = async (file: File): Promise<string|undefined> => {  
    try {        
        const storageRef = ref(storage, `receipts/${file.name}`);
        if (!storageRef) throw new Error("Storage reference is not found");
        const status = await uploadBytes(storageRef, file);
        if (!status) throw new Error("Upload failed");
        return await getDownloadURL(storageRef);
    } catch (error: any) {
        console.log(error.message);        
    }    
};

export const uploadUserPhoto = async (file: File): Promise<string|undefined> => {
    try {
        const storageRef = ref(storage, `users/${file.name}`);
        if (!storageRef) throw new Error("Storage reference is not found");
        const status = await uploadBytes(storageRef, file);
        if (!status) throw new Error("Upload failed");
        return await getDownloadURL(storageRef);
    } catch (error: any) {
        console.log(error.message);        
    }
}


