import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjX8HTeUula0PTHWieX6HKiLift_jpD_U",
  authDomain: "sensai-d7e65.firebaseapp.com",
  projectId: "sensai-d7e65",
  storageBucket: "sensai-d7e65.firebasestorage.app",
  messagingSenderId: "229173685911",
  appId: "1:229173685911:web:c84dd7625ea27af31503d2",
  measurementId: "G-NYJYWSE212"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);