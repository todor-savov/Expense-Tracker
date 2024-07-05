// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvcAtWh7L2iqKweGNEJGoFeAPb5I1Wc_s",
  authDomain: "expense-tracking-app-33495.firebaseapp.com",
  projectId: "expense-tracking-app-33495",
  storageBucket: "expense-tracking-app-33495.appspot.com",
  messagingSenderId: "926297351817",
  appId: "1:926297351817:web:40a495cc92295b9ea00858",
  measurementId: "G-FS36V4M2T8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);


