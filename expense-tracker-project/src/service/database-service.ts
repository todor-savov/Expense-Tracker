import { database } from '../config/firebase-config.js';
import { ref, get, set, push, update, query, equalTo, orderByChild, DataSnapshot } from "firebase/database";

/**
 * Checks if a user exists in the database.
 * @param {string} username - The username of the user to check.
 * @param {string} email - The email of the user to check.
 * @param {string} phone - The phone number of the user to check.
 * @returns {Promise<Array<DataSnapshot>|string>} - A promise that resolves to an array of snapshots if the user exists, or a string if an error occurs.
 */
export const checkIfUserExists = async (username: string, email: string, phone: string): Promise<Array<DataSnapshot>|string> => {
  try {
    const snapshot1 = await get(query(ref(database, "users"), orderByChild("username"), equalTo(username)));
    const snapshot2 = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email)));
    const snapshot3 = await get(query(ref(database, "users"), orderByChild("phone"), equalTo(phone)));

    return [snapshot1, snapshot2, snapshot3];
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

/**
 * Creates a new user in the database.
 * @param {UserDetails} userDetails - The details of the user to be created.
 * @returns {Promise<void|undefined>} - A promise that resolves to void if the user is created successfully, or undefined if an error occurs.
 */

interface UserDetails {
  username: string;
  // Include other properties of userDetails as needed
}

export const createUser = async (userDetails: UserDetails): Promise<void|undefined> => {
  try {
    return await set(ref(database, `users/${userDetails.username}`), userDetails);
  } catch (error: any) {
    console.log(error.message);
  }
}

/**
 * Retrieves user details from the database based on the provided email.
 * @param {string} email - The email of the user to retrieve details for.
 * @returns {Promise<Array<any>>} - A promise that resolves to an array of user details.
 * @throws {Error} - If the user is not found in the database.
 */
export const getUserDetails = async (email: string): Promise<Array<any>> => {
  try {
    const snapshot = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email)));
    if (snapshot.exists()) {
      const userDetails = Object.values(snapshot.val());
      return userDetails;
    } else {
      throw new Error("User not found!");
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

interface NewTransaction {
  date: string;
  name: string;
  amount: number;
  category: string;
  payment: string;
  receipt: string;
  user: string;
}

export const addTransaction = async (transactionDetails: NewTransaction): Promise<void|undefined> => {
  try {
    const response = await push(ref(database, 'transactions'), transactionDetails);
    const transactionId = response.key;
    update(ref(database, `transactions/${transactionId}`), { id: transactionId });
  } catch (error: any) {
    console.log(error.message);
  }
}

interface FetchedTransaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  name: string;
  payment: string;
  receipt: string;
  user: string;
}

export const getTransactions = async (user: string): Promise<FetchedTransaction[]|[]> => {
  try {
    const snapshot = await get(query(ref(database, "transactions"), orderByChild("user"), equalTo(user)));
    if (snapshot.exists()) {
      const transactions = Object.values(snapshot.val()) as FetchedTransaction[];
      return transactions;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export const deleteTransaction = async (transactionId: string): Promise<void|undefined> => {
  try {
    return await set(ref(database, `transactions/${transactionId}`), null);
  } catch (error: any) {
    console.log(error.message);
  }
}
