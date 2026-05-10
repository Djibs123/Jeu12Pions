import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3AVzCplDr-gYiOnch6nwmoCH9ioJGqjI",
  authDomain: "jeu12pions-ca730.firebaseapp.com",
  databaseURL: "https://jeu12pions-ca730-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jeu12pions-ca730",
  storageBucket: "jeu12pions-ca730.firebasestorage.app",
  messagingSenderId: "515456478814",
  appId: "1:515456478814:web:f315ea36d0fb4bb2e00ecf",
  measurementId: "G-79PTQHRV3L"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
