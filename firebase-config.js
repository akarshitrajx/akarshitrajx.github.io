// firebase-config.js - Firebase Configuration & Initialization
// ============================================
// REAL CONFIG - DO NOT SHARE PUBLICLY
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtoP0gtg3KW7scunVfmA-feCoS8cZIghk",
  authDomain: "akarshit-web.firebaseapp.com",
  projectId: "akarshit-web",
  storageBucket: "akarshit-web.firebasestorage.app",
  messagingSenderId: "559932819732",
  appId: "1:559932819732:web:ff3cae1992d947e59c9a01",
  measurementId: "G-7L9HEK8FEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  app, auth, db, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
  onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile,
  doc, setDoc, getDoc, updateDoc, increment, 
  collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp, where 
};
