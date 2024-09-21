import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
        deleteUser, updatePassword, reauthenticateWithCredential, UserCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase-config.js';

/**
 * Registers a new user with the provided email address and password.
 * @param {string} emailAddress - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<UserCredential|undefined>} - A promise that resolves to the user credentials if successful, or undefined if unsuccessful.
 */
export const registerUser = async (emailAddress: string, password: string): Promise<UserCredential|undefined> => {
    try {
        return await createUserWithEmailAndPassword(auth, emailAddress, password);
    } catch (error: any) {
        console.log(error.message);
    }
}

/**
 * Handles the deletion of a user.
 * @returns {Promise<void|undefined>} - A promise that resolves when the user is deleted successfully, or undefined if unsuccessful.
 */
export const handleUserDelete = async (): Promise<void|undefined> => {
    try {
        if (auth.currentUser) return await deleteUser(auth.currentUser);
        else throw new Error('No user is currently signed in.');
    } catch (error: any) {
        console.log(error.message);
    }
}

/**
 * Signs in a user with the provided email address and password.
 * @param {string} emailAddress - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<UserCredential|undefined>} - A promise that resolves to the user credentials if successful, or undefined if unsuccessful.
 */
export const signInUser = async (emailAddress: string, password: string): Promise<UserCredential|undefined> => {
    try {
        return await signInWithEmailAndPassword(auth, emailAddress, password);
    } catch (error: any) {
        console.log(error.message);
    }
}

/**
 * Signs out the user.
 * @returns {Promise<void|undefined>} - A promise that resolves when the user is signed out successfully, or undefined if unsuccessful.
 */
export const signOutUser = async (): Promise<void|undefined> => {
    try {
        return await signOut(auth);
    } catch (error: any) {
        console.log(error.message);
    }
}

export const changePassword = async (emailAddress: string, oldPassword: string, newPassword: string): Promise<void|undefined> => {
    try {
        if (!auth.currentUser) throw new Error('User not found');
        const credential = EmailAuthProvider.credential(emailAddress, oldPassword);
        if (!credential) throw new Error('Invalid credentials');
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
        console.log(error.message);
    }
}