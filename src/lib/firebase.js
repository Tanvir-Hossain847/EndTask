// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: NEXT_PUBLIC_apiKey,
  authDomain: NEXT_PUBLIC_authDomain,
  projectId: NEXT_PUBLIC_projectId,
  storageBucket: NEXT_PUBLIC_storageBucket,
  messagingSenderId: NEXT_PUBLIC_messagingSenderId,
  appId: NEXT_PUBLIC_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);