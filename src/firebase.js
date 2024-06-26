import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBK9tegEo_u1YNlQZ6LE0OEs0SUyVLRSCo",
  authDomain: "ai-chat-translate.firebaseapp.com",
  projectId: "ai-chat-translate",
  storageBucket: "ai-chat-translate.appspot.com",
  messagingSenderId: "572476866218",
  appId: "1:572476866218:web:b8096c94117c5a77ad5ad3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);