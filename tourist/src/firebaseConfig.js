// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || "AIzaSyCc3kxS9Ora3Yx5VCX-xqqP_cPVbceXXbM",
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || "tourist-com-e15b9.firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECT_ID || "tourist-com-e15b9",
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || "tourist-com-e15b9.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || "458146269741",
  appId: process.env.REACT_APP_APP_ID || "1:458146269741:web:ceaa8a4c9f64430b2186a4",
  measurementId: process.env.REACT_APP_MEASUREMENT_ID || "G-RYEEBPCQJZ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export services for use in the project
export { app, auth, db, analytics };
