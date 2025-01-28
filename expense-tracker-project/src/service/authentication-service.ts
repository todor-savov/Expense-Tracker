import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, 
        deleteUser, updatePassword, reauthenticateWithCredential, UserCredential, EmailAuthProvider, 
        verifyPasswordResetCode, confirmPasswordReset} from 'firebase/auth';
import { auth } from '../config/firebase-config.js';

/**
 * Registers a new user with the provided email address and password.
 * @param {string} emailAddress - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<UserCredential|string>} - A promise that resolves to the user credentials if successful, or error string if unsuccessful.
 */
export const registerUser = async (emailAddress: string, password: string): Promise<UserCredential|string> => {
    try {
        if (!emailAddress || !password) throw new Error('Invalid email address or password');
        return await createUserWithEmailAndPassword(auth, emailAddress, password);
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}

/**
 * Handles the deletion of a user.
 * @returns {Promise<void|string>} - A promise that resolves when the user is deleted successfully, or error string if unsuccessful.
 */
export const handleUserDelete = async (): Promise<void|string> => {
    try {
        if (auth.currentUser) return await deleteUser(auth.currentUser);
        else throw new Error('Failed to delete user in auth service. Proceed to delete it manually.');
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}

/**
 * Signs in a user with the provided email address and password.
 * @param {string} emailAddress - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<UserCredential|string>} - A promise that resolves to the user credentials if successful, or error string if unsuccessful.
 */
export const signInUser = async (emailAddress: string, password: string): Promise<UserCredential|string> => {
    try {
        if (!emailAddress || !password) throw new Error('Invalid email address or password');
        return await signInWithEmailAndPassword(auth, emailAddress, password);
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}

/**
 * Signs out the user.
 * @returns {Promise<void|string>} - A promise that resolves when the user is signed out successfully, or error string if unsuccessful.
 */
export const signOutUser = async (): Promise<void|string> => {
    try {
        return await signOut(auth);
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}

/* Handling password resets */
export const changePassword = async (emailAddress: string, oldPassword: string, newPassword: string): Promise<void|string> => {
    try {
        if (!auth.currentUser) throw new Error('No signed in user found.');
        if (!emailAddress || !oldPassword || !newPassword) throw new Error('Missing credentials.');
        const credential = EmailAuthProvider.credential(emailAddress, oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        return await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}

export const sendResetLink = async (email: string): Promise<void|string> => {
    try {
        if (!email) throw new Error('Invalid email address.');
        return await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}

export const verifyPasswordResetToken = async (oobCode: string): Promise<string|undefined> => {
    try {
        if (!oobCode) throw new Error('Invalid oob code.');
        return await verifyPasswordResetCode(auth, oobCode);
    } catch (error: any) {
        console.log(error.message);
    }
}

export const confirmPasswordResetWithToken = async (oobCode: string, newPassword: string): Promise<void|string> => {
    try {
        if (!oobCode || !newPassword) throw new Error('Invalid oob code or new password.');
        return await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}