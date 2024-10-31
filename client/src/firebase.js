// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "library-management-syste-8608b.firebaseapp.com",
  projectId: "library-management-syste-8608b",
  storageBucket: "library-management-syste-8608b.appspot.com",
  messagingSenderId: "465454072591",
  appId: "1:465454072591:web:90a3ebf7a867feb396f47a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
