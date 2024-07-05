import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, updatePassword, UserCredential } from 'firebase/auth';
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

/**
 * Changes the password for the current user.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<void|undefined>} - A promise that resolves when the password is changed successfully, or undefined if unsuccessful.
 */
export const changePassword = async (newPassword: string): Promise<void|undefined> => {
    try {
        if (auth.currentUser) return await updatePassword(auth.currentUser, newPassword)
        else throw new Error('No user is currently signed in.');
    } catch (error: any) {
        console.log(error.message);
    }
};