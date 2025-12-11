// firebase.js - Firebase Configuration for Myblog
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-RHXlRm0oyihYRP6SukITVYvboKQEPqQ",
  authDomain: "arwa-cf9b4.firebaseapp.com",
  projectId: "arwa-cf9b4",
  storageBucket: "arwa-cf9b4.firebasestorage.app",
  messagingSenderId: "584664513506",
  appId: "1:584664513506:web:8399cf1e62dc8cc7a0d7bb",
  measurementId: "G-HFWGFHEMVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export the database instance
export { db };
