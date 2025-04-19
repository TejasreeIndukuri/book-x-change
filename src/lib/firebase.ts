
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Replace these with your actual Firebase project credentials
// These are placeholder values for development purposes only
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopmentPurposesOnly",
  authDomain: "bookxchange-dev.firebaseapp.com",
  projectId: "bookxchange-dev",
  storageBucket: "bookxchange-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Add a console message to indicate Firebase has been initialized with development config
console.log("Firebase initialized with development configuration");
