import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ============================================
// 🔥 FIREBASE CONFIGURATION
// ============================================
// Replace these values with your own Firebase project config.
// Go to: https://console.firebase.google.com
// 1. Create a new project (or use an existing one)
// 2. Add a Web App
// 3. Copy the firebaseConfig object and paste it below
// 4. Enable Firestore Database in the Firebase Console
//    - Go to Firestore Database → Create Database → Start in Test Mode
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyB2NMv7EBo_dtxcPa6byIxgjMPe7QWmYbY",
  authDomain: "client-77f57.firebaseapp.com",
  projectId: "client-77f57",
  storageBucket: "client-77f57.firebasestorage.app",
  messagingSenderId: "357656450298",
  appId: "1:357656450298:web:3d317b264c7eeffc076543",
  measurementId: "G-J1NTMPS8JF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
