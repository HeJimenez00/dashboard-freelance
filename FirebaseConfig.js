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
  apiKey: "SU_API_KEY",
  authDomain: "SU_AUTH_DOMAIN",
  projectId: "SU_PROJECT_ID",
  storageBucket: "SU_STORAGE_BUCKET",
  messagingSenderId: "SU_MESSAGING_SENDER_ID",
  appId: "SU_APP_ID",
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
