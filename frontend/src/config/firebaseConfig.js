// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore DB
import { getStorage } from "firebase/storage"; // For Storage

const firebaseConfig = {
  apiKey: "AIzaSyAURWgxCZaezxDwV_a61DxUEIYjqvSp1OI",
  authDomain: "hrcloudx-3c6ee.firebaseapp.com",
  databaseURL: "https://hrcloudx-3c6ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hrcloudx-3c6ee",
  storageBucket: "hrcloudx-3c6ee.firebasestorage.app",
  messagingSenderId: "224915632684",
  appId: "1:224915632684:web:8a7eebc20116e3329f5789",
  measurementId: "G-DW3H2S8B6D"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
