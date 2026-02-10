import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
};


if (!firebaseConfig.projectId) {
  console.error("CRITICAL: Firebase Config is missing or empty. Check .env file.");
}

let app;
let db;


if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} else {
  app = getApp();
  
  
  
  db = getFirestore(app);
}

export const auth = getAuth(app);
export { db };
export default app;