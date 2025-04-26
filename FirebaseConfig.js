// FirebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Tu configuración de Firebase
// NOTA: Debes reemplazar estos valores con tus propias credenciales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5lFSZzcDLdbVzyvaEZiEyoggNIahgdSs",
  authDomain: "freelance-c33d8.firebaseapp.com",
  projectId: "freelance-c33d8",
  storageBucket: "freelance-c33d8.firebasestorage.app",
  messagingSenderId: "404709743668",
  appId: "1:404709743668:web:e5feeb7d6a40611065be61",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar funcionalidades de Firebase Auth
export const auth = getAuth(app);
export const db = getFirestore(app);

// Exportar funciones de autenticación y Firestore para uso directo
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
};

export default app;
