import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config.ts";

export const uploadFile = async (file: File): Promise<string> => {  
    const storageRef = ref(storage, `receipts/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const uploadUserPhoto = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `users/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}


