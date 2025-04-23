import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";


// Your existing Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDGFIjPYzK8cxEQ0RD4iSI7ih4Gfm4i8IU",
  authDomain: "placement-tracker-4c808.firebaseapp.com",
  projectId: "placement-tracker-4c808",
  storageBucket: "placement-tracker-4c808.firebasestorage.app",
  messagingSenderId: "913692286066",
  appId: "1:913692286066:web:83e9ea8cb2325bc39ff6eb",
  measurementId: "G-KVY6E5Z42R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore functions
export { doc, setDoc, getDoc, updateDoc };
