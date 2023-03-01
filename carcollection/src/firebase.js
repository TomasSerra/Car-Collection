import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAQMXuCPtcbm7GtKfYIFjPGNPmFKphzJQY",
  authDomain: "hot-collection-96238.firebaseapp.com",
  projectId: "hot-collection-96238",
  storageBucket: "hot-collection-96238.appspot.com",
  messagingSenderId: "165441181640",
  appId: "1:165441181640:web:044db23d31aa6d93b952fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

