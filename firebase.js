// firebase.js - Firebase Configuration (Compatible Version)
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// Get Firestore database
const db = firebase.firestore();

// Make it available globally
window.firebase = firebase;
window.db = db;

console.log("✅ Firebase initialized successfully!");