import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-91bTU6IihXgzhm0C1Ibty8bzLt_pQxY",
  authDomain: "foodapp-68ee9.firebaseapp.com",
  projectId: "foodapp-68ee9",
  storageBucket: "foodapp-68ee9.firebasestorage.app",
  messagingSenderId: "788281183204",
  appId: "1:788281183204:web:38de36f3f2e9537d0515f1",
  measurementId: "G-K60XFR37GQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
