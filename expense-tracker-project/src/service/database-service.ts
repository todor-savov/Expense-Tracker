import { database } from '../config/firebase-config.js';
import { ref, get, set, push, update, query, equalTo, orderByChild, DataSnapshot } from "firebase/database";

interface UserSettings { 
  activityNotifications: string;
  activityNotificationLimit: number;
  budgetNotifications: string;
  budgetNotificationLimit: number;
  currency: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  photo: string;
  role: string;
  isBlocked: boolean;
  settings: UserSettings
}

export const checkIfUserExists = async (username: string, phone: string): Promise<Array<DataSnapshot>|string> => {
  try {
    const snapshot1 = await get(query(ref(database, "users"), orderByChild("username"), equalTo(username)));
    const snapshot2 = await get(query(ref(database, "users"), orderByChild("phone"), equalTo(phone)));

    return [snapshot1, snapshot2];
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

export const createUser = async (userDetails: UserDetails): Promise<void|string> => {
  try {
    return await set(ref(database, `users/${userDetails.username}`), userDetails);
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

export const getUserDetails = async (email: string): Promise<UserDetails[]|[]> => {
  try {
    const snapshot = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email)));
    if (snapshot.exists()) {
      const userDetails = Object.values(snapshot.val());
      return userDetails as UserDetails[];
    } else {
      throw new Error("User not found!");
    }
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
};

export const updateUserDetails = async (userDetails: UserDetails, username: string): Promise<void|string> => {
  try {
    return await set(ref(database, `users/${username}`), userDetails);
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

interface NewTransaction {
  date: string;
  name: string;
  amount: number;
  category: string;
  payment: string;
  receipt: string;
  user: string;
  currency: string;
}

export const addTransaction = async (transactionDetails: NewTransaction): Promise<void|string> => {
  try {
    const response = await push(ref(database, 'transactions'), transactionDetails);
    return await update(ref(database, `transactions/${response.key}`), { id: response.key });
  } catch (error: any) {
    console.log(error.message);
    return error.message;
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
  currency: string;
}

export const getTransactions = async (user: string): Promise<FetchedTransaction[]|[]> => {
  try {
    const snapshot = await get(query(ref(database, "transactions"), orderByChild("user"), equalTo(user)));
    if (snapshot.exists()) return Object.values(snapshot.val()) as FetchedTransaction[];
    else return [];
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export const getTransaction = async (transactionId: string): Promise<FetchedTransaction|null> => {
  try {
    const snapshot = await get(ref(database, `transactions/${transactionId}`));
    if (snapshot.exists()) return snapshot.val() as FetchedTransaction;
    else return null;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}

export const updateTransaction = async (transactionDetails: FetchedTransaction, transactionId: string): Promise<void|string> => {
  try {
    return await set(ref(database, `transactions/${transactionId}`), transactionDetails);
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

export const deleteTransaction = async (transactionId: string): Promise<void|undefined> => {
  try {
    return await set(ref(database, `transactions/${transactionId}`), null);
  } catch (error: any) {
    console.log(error.message);
  }
}

interface Category {
  id: string;
  type: string;
  imgSrc: string;
  imgAlt: string;
  user: string;
}

interface NewCategory {
  type: string;
  imgSrc: string;
  imgAlt: string;
  user: string;
}

export const getCategories = async (user: string): Promise<Category[]|[]> => {
  try {
    const snapshot = await get(query(ref(database, "categories"), orderByChild("user"), equalTo(user)));
    if (snapshot.exists()) return Object.values(snapshot.val()) as Category[];
    else return [];
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

interface Payment {
  imgSrc: string;
  imgAlt: string;
  type: string;
}

export const getPayments = async (): Promise<Payment[]|[]> => {
  try {
    const snapshot = await get(ref(database, "payments"));
    if (snapshot.exists()) return Object.values(snapshot.val()) as Payment[];
    else return [];
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export const createCategory = async (category: NewCategory): Promise<string|void> => {
  try {
    const response = await push(ref(database, 'categories'), category);
    if (response && response.key) {
      update(ref(database, `categories/${response.key}`), { id: response.key });
      return response.key;
    } else {
      throw new Error('Category not created');
    }
  } catch (error: any) {
    console.log(error.message);
  }
}

export const updateCategory = async (categoryDetails: Category, categoryId: string|undefined): Promise<void|string> => {
  try {
    if (!categoryId) return;
    return await set(ref(database, `categories/${categoryId}`), categoryDetails);
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

export const deleteCategory = async (categoryId: string): Promise<void|string> => {
  try {
    return await set(ref(database, `categories/${categoryId}`), null);
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

interface Feedback {
  user: string;
  rating: number;
  feedback: string;
}

export const addFeedback = async (feedback: Feedback): Promise<void|string> => {
  try {
    const response = await push(ref(database, 'feedbacks'), feedback);
    update(ref(database, `feedbacks/${response.key}`), { id: response.key });
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

export const getFeedbacks = async (email: string): Promise<Feedback[]|[]> => {
  try {
    const snapshot = await get(query(ref(database, "feedbacks"), orderByChild("user"), equalTo(email)));
    if (snapshot.exists()) return Object.values(snapshot.val()) as Feedback[];
    else return [];
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export const getUserSettings = async (email: string): Promise<UserSettings|string> => {
  try {
    const snapshot = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email)));
     if (snapshot.exists()) {
      const user = Object.values(snapshot.val())[0] as UserDetails;
      return user.settings;
     }    
    else throw new Error('User not found');
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}

export const updateUserSettings = async (email: string, settings: UserSettings): Promise<void|string> => {
  try {
    const snapshot = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email)));
    if (snapshot.exists()) {
      const user = Object.keys(snapshot.val())[0];
      return await update(ref(database, `users/${user}`), { settings });
    } else throw new Error('User not found');
  } catch (error: any) {
    console.log(error.message);
    return error.message;
  }
}